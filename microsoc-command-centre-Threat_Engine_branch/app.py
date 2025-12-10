from fastapi import FastAPI
import asyncio, time, json, os, requests
from classifier import classify_request
from blocklist import add_block
from dotenv import load_dotenv
from pymongo import MongoClient, UpdateOne
import redis

load_dotenv()
app = FastAPI(title="P3 Threat Detection Engine (Decision API)")

REDIS_HOST = os.getenv("REDIS_HOST", "localhost")
REDIS_PORT = int(os.getenv("REDIS_PORT", 6379))
LOG_QUEUE = "attack_logs_queue"

# Backend API URL - Next.js ingest endpoint
BACKEND_URL = os.getenv("BACKEND_URL") or os.getenv("BACKEND_INGEST_URI") or "http://localhost:3000/api/logs/ingest"

MONGO_URI = os.getenv("MONGO_URI", "mongodb://localhost:27017")
try:
    client = MongoClient(MONGO_URI, serverSelectionTimeoutMS=5000)
    client.server_info()
    db = client["threat_engine"]
    attack_logs = db["attack_logs"]
    print("✅ MongoDB connected successfully")
except Exception as e:
    print(f"⚠️ MongoDB connection failed: {e}")
    client = None
    db = None
    attack_logs = None

try:
    r = redis.Redis(host=REDIS_HOST, port=REDIS_PORT, decode_responses=True)
    r.ping()
    print("✅ Redis connected successfully")
except Exception as e:
    print(f"Redis connection failed: {e}")
    r = None

BLOCK_DURATION = int(os.getenv("BLOCK_DURATION", "600"))

def make_response(ip, path, method, status, result):
    """Create standardized response matching Next.js schema"""
    return {
        "ip": ip,
        "path": path,
        "method": method,
        "status": status,
        "attack_type": result.get("attack_type", None),  # Changed from "normal" to None
        "severity": result.get("severity", "MEDIUM"),
        "timestamp": int(time.time()),
        "reason": result.get("reason", "No rule matched"),
        "suggestion": result.get("suggestion", ""),
        "is_blocked_now": result.get("is_blocked_now", False)
    }

@app.get("/")
def home():
    return {"message": "P3 Threat Detection Engine Running", "backend_url": BACKEND_URL}

@app.post("/security/decision")
async def security_decision(data: dict):
    ip = data.get("ip")
    path = data.get("path", "/")
    method = data.get("method", "GET")
    ua = data.get("user_agent", "")
    payload = data.get("payload", None)

    if not ip:
        return make_response("", path, method, "WARN", result={"reason": "Missing ip"})

    # Classify request
    result = classify_request(ip, path, method, ua, payload=payload)
    status = result.get("status", "ALLOW")

    # Block IP if needed
    if status == "BLOCK":
        add_block(ip, duration=BLOCK_DURATION)

    resp = make_response(ip, path, method, status, result)

    # Push to Redis queue
    try:
        if r:
            r.lpush(LOG_QUEUE, json.dumps(resp))
            print(f"🔥 [Queue] Pushed log: {resp.get('attack_type', 'normal')} from {ip}")
        else:
            print("⚠️ [Queue] Redis not connected")
    except Exception as e:
        print(f"❌ [Queue] Failed to push log: {e}")

    # Save to local MongoDB
    if status == "ALLOW":
        try:
            if attack_logs:
                doc_id = f"{resp['ip']}_{resp.get('attack_type','normal')}_{int(resp['timestamp']/60)}"
                attack_logs.update_one({"_id": doc_id}, {"$set": resp}, upsert=True)
        except Exception as e:
            print("MongoDB write failed:", e)

    return resp

async def mongo_writer_worker():
    """Background worker that sends logs to Next.js backend"""
    print("🔥 Mongo Writer Worker started")
    print(f"   Redis: {'✅ Connected' if r else '❌ Not connected'}")
    print(f"   MongoDB: {'✅ Connected' if attack_logs else '❌ Not connected'}")
    print(f"   Backend URL: {BACKEND_URL}")
    
    iteration = 0
    while True:
        iteration += 1
        batch = []
        backend_batch = []

        if r:
            try:
                queue_length = r.llen(LOG_QUEUE)
                if queue_length > 0:
                    print(f"📊 [Worker] Queue has {queue_length} items, processing...")
                
                # Process up to 100 logs
                for _ in range(100):
                    try:
                        log_json = r.rpop(LOG_QUEUE)
                        if not log_json:
                            break
                        log = json.loads(log_json)
                        log["_id"] = f"{log['ip']}_{log.get('attack_type','normal')}_{int(log['timestamp']/60)}"

                        batch.append(UpdateOne({"_id": log["_id"]}, {"$set": log}, upsert=True))
                        
                        # Remove _id for backend (MongoDB ObjectId not needed)
                        backend_log = {k: v for k, v in log.items() if k != "_id"}
                        backend_batch.append(backend_log)
                        
                    except json.JSONDecodeError as e:
                        print(f"❌ [Worker] JSON decode error: {e}")
                    except Exception as e:
                        print(f"❌ [Worker] Error processing log: {e}")
            except Exception as e:
                print(f"❌ [Worker] Error accessing Redis: {e}")

        # Save to local MongoDB
        if batch and attack_logs:
            try:
                attack_logs.bulk_write(batch)
                print(f"💾 [Mongo] Batch saved: {len(batch)}")
            except Exception as e:
                print("MongoDB bulk write failed:", e)

        # Send to Next.js backend
        if backend_batch:
            print(f"📤 [Backend] Sending {len(backend_batch)} logs to Next.js...")
            
            # ✅ FIXED: Send in correct format
            payload = {
                "type": "logs",  # Use "logs" for array
                "data": backend_batch
            }
            
            max_retries = 3
            success = False
            
            for attempt in range(max_retries):
                try:
                    print(f"   Attempt {attempt + 1}/{max_retries}: POST {BACKEND_URL}")
                    response = requests.post(
                        BACKEND_URL,
                        json=payload,  # ✅ Send wrapped payload
                        timeout=10,
                        headers={"Content-Type": "application/json"}
                    )
                    
                    if response.status_code in [200, 201]:
                        print(f"✅ [Backend] Successfully sent {len(backend_batch)} logs")
                        try:
                            result = response.json()
                            print(f"   Response: {result.get('message', 'OK')}")
                        except:
                            print(f"   Response: {response.text[:200]}")
                        success = True
                        break
                    else:
                        print(f"⚠️ [Backend] HTTP {response.status_code}: {response.text[:200]}")
                        if attempt < max_retries - 1:
                            await asyncio.sleep(1 * (attempt + 1))
                        
                except requests.exceptions.ConnectionError as e:
                    print(f"❌ [Backend] Connection error (attempt {attempt + 1}): {str(e)[:100]}")
                    if attempt < max_retries - 1:
                        print(f"   Retrying in {1 * (attempt + 1)} seconds...")
                        await asyncio.sleep(1 * (attempt + 1))
                    else:
                        print(f"   ❌ Cannot reach {BACKEND_URL}")
                        print(f"   Check: 1) Backend running  2) Correct URL  3) Firewall")
                        
                except requests.exceptions.Timeout:
                    print(f"⏱️ [Backend] Timeout (attempt {attempt + 1})")
                    if attempt < max_retries - 1:
                        await asyncio.sleep(1 * (attempt + 1))
                        
                except Exception as e:
                    print(f"❌ [Backend] Error: {str(e)[:100]}")
                    if attempt < max_retries - 1:
                        await asyncio.sleep(1 * (attempt + 1))
                    break
            
            if not success:
                print(f"⚠️ [Backend] Failed to send {len(backend_batch)} logs after {max_retries} attempts")
        elif iteration % 60 == 0:
            print(f"💤 [Worker] Idle (iteration {iteration})")

        await asyncio.sleep(1)  # Check queue every second

@app.on_event("startup")
async def startup_event():
    print("🔥 Starting Mongo Writer Worker...")
    print(f"📡 Backend URL: {BACKEND_URL}")
    print(f"📊 Will send logs in format: {{type: 'logs', data: [...]}}")
    asyncio.create_task(mongo_writer_worker())

@app.get("/health")
def health_check():
    """Health check endpoint"""
    return {
        "status": "healthy",
        "redis": "connected" if r else "disconnected",
        "mongodb": "connected" if attack_logs else "disconnected",
        "backend_url": BACKEND_URL,
        "queue_length": r.llen(LOG_QUEUE) if r else 0
    }


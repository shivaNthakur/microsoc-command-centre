# app.py
from fastapi import FastAPI
import asyncio, time, json, os, requests
from classifier import classify_request
from blocklist import add_block
from dotenv import load_dotenv
from pymongo import MongoClient, UpdateOne
import redis

load_dotenv()
app = FastAPI(title="P3 Threat Detection Engine (Decision API)")

# ---------------- CONFIG ----------------
REDIS_HOST = os.getenv("REDIS_HOST", "localhost")
REDIS_PORT = int(os.getenv("REDIS_PORT", 6379))
LOG_QUEUE = "attack_logs_queue"

# Backend API URL - configurable via environment variable
# Supports both BACKEND_URL and BACKEND_INGEST_URI for compatibility
BACKEND_URL = os.getenv("BACKEND_URL") or os.getenv("BACKEND_INGEST_URI") or "http://10.255.32.169:3000/api/logs/ingest"

MONGO_URI = os.getenv("MONGO_URI", "mongodb://localhost:27017")
try:
    client = MongoClient(MONGO_URI, serverSelectionTimeoutMS=5000)
    client.server_info()  # Test connection
    db = client["threat_engine"]
    attack_logs = db["attack_logs"]
    print("✓ MongoDB connected successfully")
except Exception as e:
    print(f"⚠️  MongoDB connection failed: {e}")
    client = None
    db = None
    attack_logs = None

try:
    r = redis.Redis(host=REDIS_HOST, port=REDIS_PORT, decode_responses=True)
    r.ping()
    print("✓ Redis connected successfully")
except Exception as e:
    print(f"⚠️  Redis connection failed: {e}")
    r = None
BLOCK_DURATION = int(os.getenv("BLOCK_DURATION", "600"))

# ---------------- RESPONSE MAKER ----------------
def make_response(ip, path, method, status, result):
    return {
        "ip": ip,
        "path": path,
        "method": method,
        "status": status,
        "attack_type": result.get("attack_type", "normal"),
        "severity": result.get("severity"),
        "timestamp": int(time.time()),
        "reason": result.get("reason"),
        "suggestion": result.get("suggestion", ""),
        "is_blocked_now": result.get("is_blocked_now", False)
    }

# ---------------- API ROUTES ----------------
@app.get("/")
def home():
    return {"message": "P3 Threat Detection Engine Running"}

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

    # ---------------- LOG HANDLING ----------------
    try:
        if r:
            r.lpush(LOG_QUEUE, json.dumps(resp))
            print(f"📥 [Queue] Pushed log to Redis queue: {resp.get('attack_type', 'normal')} from {ip}")
        else:
            print("⚠️  [Queue] Redis not connected, cannot queue log")
    except Exception as e:
        print(f"❌ [Queue] Failed to push log to Redis: {e}")
        import traceback
        traceback.print_exc()

    # ALLOW requests can also be written immediately
    if status == "ALLOW":
        try:
            if attack_logs:
                doc_id = f"{resp['ip']}_{resp.get('attack_type','normal')}_{int(resp['timestamp']/60)}"
            attack_logs.update_one({"_id": doc_id}, {"$set": resp}, upsert=True)
        except Exception as e:
            print("MongoDB write failed:", e)

    return resp

# ---------------- BACKGROUND WORKER ----------------
async def mongo_writer_worker():
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
                
                for _ in range(100):
                    try:
                        log_json = r.rpop(LOG_QUEUE)
                        if not log_json:
                            break
                        log = json.loads(log_json)
                        # Use .get() to avoid KeyError
                        log["_id"] = f"{log['ip']}_{log.get('attack_type','normal')}_{int(log['timestamp']/60)}"

                        batch.append(UpdateOne({"_id": log["_id"]}, {"$set": log}, upsert=True))
                        backend_batch.append(log)
                    except json.JSONDecodeError as e:
                        print(f"❌ [Worker] JSON decode error: {e}")
                        print(f"   Log data: {log_json[:200]}")
                    except Exception as e:
                        print(f"❌ [Worker] Error processing log: {e}")
                        import traceback
                        traceback.print_exc()
            except Exception as e:
                print(f"❌ [Worker] Error accessing Redis queue: {e}")
                import traceback
                traceback.print_exc()
        else:
            if iteration % 60 == 0:  # Print every 60 seconds
                print("⚠️  [Worker] Redis not connected, cannot process queue")

        if batch and attack_logs:
            # Save to MongoDB
            try:
                attack_logs.bulk_write(batch)
                print(f"[Mongo] Batch saved: {len(batch)}")
            except Exception as e:
                print("MongoDB bulk write failed:", e)

        if backend_batch:
            print(f"📤 [Backend] Preparing to send {len(backend_batch)} logs to backend...")
            # Send to backend API with retry logic
            max_retries = 3
            retry_delay = 1
            success = False
            
            for attempt in range(max_retries):
                try:
                    print(f"   Attempt {attempt + 1}/{max_retries}: Sending to {BACKEND_URL}")
                    response = requests.post(
                        BACKEND_URL,
                        json=backend_batch,
                        timeout=10,
                        headers={"Content-Type": "application/json"}
                    )
                    
                    if response.status_code in [200, 201]:
                        print(f"✅ [Backend] Successfully sent {len(backend_batch)} logs to {BACKEND_URL}")
                        try:
                            result = response.json()
                            print(f"   Response: {result.get('message', 'OK')}")
                        except:
                            print(f"   Response: {response.text[:200]}")
                        success = True
                        break
                    else:
                        print(f"⚠️  [Backend] HTTP {response.status_code}: {response.text[:200]}")
                        if attempt < max_retries - 1:
                            await asyncio.sleep(retry_delay * (attempt + 1))
                        
                except requests.exceptions.ConnectionError as e:
                    print(f"❌ [Backend] Connection error (attempt {attempt + 1}/{max_retries}): {e}")
                    if attempt < max_retries - 1:
                        print(f"   Retrying in {retry_delay * (attempt + 1)} seconds...")
                        await asyncio.sleep(retry_delay * (attempt + 1))
                    else:
                        print(f"   ❌ Failed to connect to {BACKEND_URL} after {max_retries} attempts")
                        print(f"   Check if backend is running at {BACKEND_URL}")
                        
                except requests.exceptions.Timeout as e:
                    print(f"⏱️  [Backend] Timeout (attempt {attempt + 1}/{max_retries}): {e}")
                    if attempt < max_retries - 1:
                        await asyncio.sleep(retry_delay * (attempt + 1))
                        
                except Exception as e:
                    print(f"❌ [Backend] Error sending logs: {e}")
                    import traceback
                    traceback.print_exc()
                    if attempt < max_retries - 1:
                        await asyncio.sleep(retry_delay * (attempt + 1))
                    break
            
            if not success:
                print(f"⚠️  [Backend] Failed to send {len(backend_batch)} logs after {max_retries} attempts")
        elif iteration % 60 == 0:  # Print status every 60 seconds
            print(f"💤 [Worker] No logs to process (iteration {iteration})")

        await asyncio.sleep(1)

@app.on_event("startup")
async def startup_event():
    print("🔥 Starting Mongo Writer Worker...")
    print(f"📡 Backend URL configured: {BACKEND_URL}")
    asyncio.create_task(mongo_writer_worker())

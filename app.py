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

MONGO_URI = os.getenv("MONGO_URI", "mongodb://localhost:27017")
client = MongoClient(MONGO_URI)
db = client["threat_engine"]
attack_logs = db["attack_logs"]

r = redis.Redis(host=REDIS_HOST, port=REDIS_PORT, decode_responses=True)
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
        r.lpush(LOG_QUEUE, json.dumps(resp))
    except Exception as e:
        print("Failed to push log to Redis:", e)

    # ALLOW requests can also be written immediately
    if status == "ALLOW":
        try:
            doc_id = f"{resp['ip']}_{resp.get('attack_type','normal')}_{int(resp['timestamp']/60)}"
            attack_logs.update_one({"_id": doc_id}, {"$set": resp}, upsert=True)
        except Exception as e:
            print("MongoDB write failed:", e)

    return resp

# ---------------- BACKGROUND WORKER ----------------
async def mongo_writer_worker():
    print("🔥 Mongo Writer Worker started")
    while True:
        batch = []
        backend_batch = []

        for _ in range(100):
            log_json = r.rpop(LOG_QUEUE)
            if not log_json:
                break
            log = json.loads(log_json)
            # Use .get() to avoid KeyError
            log["_id"] = f"{log['ip']}_{log.get('attack_type','normal')}_{int(log['timestamp']/60)}"

            batch.append(UpdateOne({"_id": log["_id"]}, {"$set": log}, upsert=True))
            backend_batch.append(log)

        if batch:
            # Save to MongoDB
            try:
                attack_logs.bulk_write(batch)
                print(f"[Mongo] Batch saved: {len(batch)}")
            except Exception as e:
                print("MongoDB bulk write failed:", e)

            # Send to backend API
            try:
                requests.post(
                    "http://localhost:3000/api/logs/ingest",
                    json=backend_batch,
                    timeout=3
                )
                print(f"[Backend] Sent: {len(backend_batch)} logs")
            except Exception as e:
                print("Backend send failed:", e)

        await asyncio.sleep(1)

@app.on_event("startup")
async def startup_event():
    print("🔥 Starting Mongo Writer Worker...")
    asyncio.create_task(mongo_writer_worker())

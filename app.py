from fastapi import FastAPI
import time, json, os, requests
from classifier import classify_request
from blocklist import is_blocked, add_block
from dotenv import load_dotenv

load_dotenv()
app = FastAPI(title="P3 Threat Detection Engine (Decision API)")
LOG_BACKEND = "http://localhost:8001/log-attack"

def make_response(ip, path, method, status, attack_type=None, severity=None, reason=None, suggestion=None):
    return {
        "ip": ip,
        "path": path,
        "method": method,
        "status": status,
        "attack_type": attack_type,
        "severity": severity,
        "timestamp": int(time.time()),
        "reason": reason,
        "suggestion": suggestion,
        "is_blocked_now": True if status == "BLOCK" else False
    }

@app.get("/")
def home():
    return {"message":"P3 Threat Detection Engine Running"}

@app.post("/security/decision")
async def security_decision(data: dict):
    ip = data.get("ip")
    path = data.get("path", "/")
    method = data.get("method", "GET")
    ua = data.get("user_agent", "")
    payload = data.get("payload", None)
    timestamp = data.get("timestamp", int(time.time()))

    if not ip:
        return make_response("", path, method, "WARN", reason="Missing ip in request")

    if is_blocked(ip):
        return make_response(ip, path, method, "BLOCK", attack_type="already_blocked",
                             severity="HIGH", reason="IP currently in blocklist",
                             suggestion="Maintain block or investigate")

    result = classify_request(ip, path, method, ua, timestamp, payload)

    status = result.get("status", "ALLOW")
    if status == "BLOCK":
        add_block(ip, duration=int(os.getenv("BLOCK_DURATION", "600")))

    resp = make_response(ip, path, method, status,
                         attack_type=result.get("attack_type"),
                         severity=result.get("severity"),
                         reason=result.get("reason"),
                         suggestion=result.get("suggestion"))

    # Forward to backend
    try:
        requests.post(LOG_BACKEND, json=resp)
    except Exception as e:
        print("⚠ Backend log server unreachable:", e)

    # Log locally
    try:
        with open("decisions.log", "a") as f:
            f.write(json.dumps(resp) + "\n")
    except Exception:
        pass

    return resp

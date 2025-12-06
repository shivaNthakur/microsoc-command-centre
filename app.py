# app.py
from fastapi import FastAPI, Request
import time, json
from classifier import classify_request
from blocklist import is_blocked, add_block
from dotenv import load_dotenv
import os
import requests

load_dotenv()

app = FastAPI(title="P3 Threat Detection Engine (Decision API)")
LOG_BACKEND = "http://localhost:8001/log-attack"


# helper function
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

    #  parameter validation
    if not ip:
        return make_response("", path, method, "WARN", reason="Missing ip in request")

    # if already blocked
    if is_blocked(ip):
        resp = make_response(ip, path, method, "BLOCK", attack_type="already_blocked",
                             severity="HIGH", reason="IP currently in blocklist",
                             suggestion="Maintain block or investigate")
        return resp

    # classify using classifier
    result = classify_request(ip=ip, path=path, method=method, ua=ua, timestamp=timestamp, payload=payload)

    status = result.get("status", "ALLOW")
    if status == "BLOCK":
        # block for a default duration (configurable)
        add_block(ip, duration=int(os.getenv("BLOCK_DURATION", "600")))
    # unify response format
    resp = make_response(ip, path, method, status,
                         attack_type=result.get("attack_type"),
                         severity=result.get("severity"),
                         reason=result.get("reason"),
                         suggestion=result.get("suggestion"))
    def forward_to_backend(attack_json):
        try:
            requests.post(LOG_BACKEND, json=attack_json)
        except Exception as e:
            print("⚠ Backend log server unreachable:", e)

    forward_to_backend(resp)
    try:
        with open("decisions.log", "a") as f:
            f.write(json.dumps(resp) + "\n")
    except Exception:
        pass



    return resp

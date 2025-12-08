from fastapi import FastAPI, WebSocket
from backend.models.log import Log
from backend.rules_engine.apply_rules import process_log, ALL_LOGS, WS_CLIENTS

app = FastAPI()

@app.post("/logs/ingest")
def ingest(log: Log):
    incident = process_log(log)
    return {
        "status": "ok",
        "incident_created": incident.title if incident else None
    }

@app.get("/logs")
def get_logs():
    return [l.dict() for l in ALL_LOGS]

@app.get("/incidents")
def get_incidents():
    from backend.rules_engine.apply_rules import INCIDENTS
    return [i.dict() for i in INCIDENTS]

@app.websocket("/ws/incidents")
async def websocket_endpoint(websocket: WebSocket):
    await websocket.accept()
    WS_CLIENTS.append(websocket)
    print("🔌 WebSocket connected")

    try:
        while True:
            await websocket.receive_text()
    except:
        WS_CLIENTS.remove(websocket)
        print("❌ WebSocket disconnected")
        
@app.get("/test-broadcast")
def test_broadcast():
    from backend.rules_engine.apply_rules import broadcast
    print("Sending test broadcast...")
    broadcast({
        "event": "new_incident",
        "data": {
            "title": "Test Attack",
            "severity": "high",
            "source_ip": "1.2.3.4"
        }
    })
    return {"ok": True}
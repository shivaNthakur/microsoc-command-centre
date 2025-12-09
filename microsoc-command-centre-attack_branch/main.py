
from fastapi import FastAPI, WebSocket
from backend.models.log import Log
from backend.rules_engine.apply_rules import process_log, ALL_LOGS, WS_CLIENTS

app = FastAPI()

# -----------------------------
# LOG INGESTION
# -----------------------------
@app.post("/logs/ingest")
def ingest(log: Log):
    ALL_LOGS.append(log)
    incident = process_log(log)

    return {
        "status": "ok",
        "incident_created": incident.title if incident else None
    }

# -----------------------------
# GET ALL LOGS (for frontend initial load)
# -----------------------------
@app.get("/logs")
def get_logs():
    return [l.dict() for l in ALL_LOGS]

# -----------------------------
# GET ALL INCIDENTS (initial load)
# -----------------------------
@app.get("/incidents")
def get_incidents():
    from backend.rules_engine.apply_rules import INCIDENTS
    return [i.dict() for i in INCIDENTS]

# -----------------------------
# REAL-TIME WEBSOCKET for INCIDENTS
# -----------------------------
@app.websocket("/ws/incidents")
async def websocket_endpoint(websocket: WebSocket):
    await websocket.accept()
    WS_CLIENTS.append(websocket)
    print(" WebSocket connected")

    try:
        while True:
            await websocket.receive_text()  # keep connection open
    except:
        WS_CLIENTS.remove(websocket)
        print("WebSocket disconnected")


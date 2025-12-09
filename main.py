# main.py
import asyncio
from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware

from backend.models.log import Log
from backend.rules_engine.apply_rules import process_log, ALL_LOGS
import backend.ws as ws_helper

app = FastAPI()

# Allow your frontend dev server (adjust origin if needed)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.on_event("startup")
async def startup_event():
    # register the running event loop into ws helper so broadcast is safe
    loop = asyncio.get_event_loop()
    ws_helper.set_event_loop(loop)


# LOG INGESTION
@app.post("/logs/ingest")
def ingest(log: Log):
    ALL_LOGS.append(log)
    incident = process_log(log)
    return {"status": "ok", "incident_created": incident.title if incident else None}


# GET ALL LOGS
@app.get("/logs")
def get_logs():
    return [l.dict() for l in ALL_LOGS]


# GET ALL INCIDENTS (initial seed for front-end)
@app.get("/incidents")
def get_incidents():
    from backend.rules_engine.apply_rules import INCIDENTS
    return [i.dict() for i in INCIDENTS]


# REAL-TIME WEBSOCKET for INCIDENTS
@app.websocket("/ws/incidents")
async def websocket_endpoint(websocket: WebSocket):
    await websocket.accept()
    ws_helper.WS_CLIENTS.append(websocket)
    print("🔌 WebSocket connected")

    try:
        while True:
            # keep connection alive; client can send pings/hello
            await websocket.receive_text()
    except WebSocketDisconnect:
        try:
            ws_helper.WS_CLIENTS.remove(websocket)
        except ValueError:
            pass
        print("❌ WebSocket disconnected")
    except Exception:
        try:
            ws_helper.WS_CLIENTS.remove(websocket)
        except Exception:
            pass
        print("❌ WebSocket error / disconnected")

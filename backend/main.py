from fastapi import FastAPI
from models.Log import Log
from rules_engine.apply_rules import process_log

app = FastAPI()
ALL_LOGS = []

@app.post("/logs/ingest")
def ingest(log: Log):
    ALL_LOGS.append(log)

    print("\n📥 LOG RECEIVED:")
    print(log.dict())

    # run classification engine
    incident = process_log(log)

    return {
        "status": "ok",
        "incident": incident.title if incident else None
    }

@app.get("/logs")
def get_logs():
    return [l.dict() for l in ALL_LOGS]

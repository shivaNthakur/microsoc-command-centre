# backend/main.py
from fastapi import FastAPI
from pydantic import BaseModel

app = FastAPI()

class Log(BaseModel):
    tool: str
    source_ip: str
    open_ports: list | None = None
    severity: str

@app.post("/logs/ingest")
def ingest_logs(log: Log):
    print("Received log:", log)
    return {"status": "ok", "received": log}

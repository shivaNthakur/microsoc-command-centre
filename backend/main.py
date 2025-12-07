from fastapi import FastAPI
from pydantic import BaseModel
from typing import Optional, List

app = FastAPI()

class Log(BaseModel):
    tool: str
    source_ip: Optional[str] = None
    target: Optional[str] = None
    open_ports: Optional[List[int]] = None
    path: Optional[str] = None
    payload: Optional[str] = None
    severity: str

logs = []   # temporary storage

@app.post("/logs/ingest")
def ingest(log: Log):
    logs.append(log.dict())
    print("\n📥 LOG RECEIVED:")
    print(log.dict())
    return {"status": "ok"}

@app.get("/logs")
def get_all_logs():
    return logs

from pydantic import BaseModel
from datetime import datetime

class Incident(BaseModel):
    title: str
    severity: str
    related_logs: list
    source_ip: str
    status: str = "open"
    timestamp: datetime = datetime.utcnow()

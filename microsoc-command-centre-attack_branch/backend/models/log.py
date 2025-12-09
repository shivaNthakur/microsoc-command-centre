from pydantic import BaseModel
from datetime import datetime

class Log(BaseModel):
    tool: str
    source_ip: str
    severity: str
    endpoint: str | None = None
    details: dict | None = None
    timestamp: datetime = datetime.utcnow()

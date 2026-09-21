from pydantic import BaseModel


class TelemetryEvent(BaseModel):
    session_id: str
    timestamp: str
    src_ip: str
    source: str
    event_type: str
    summary: str
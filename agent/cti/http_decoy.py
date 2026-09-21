import json

from agent.cti.session import SessionManager
from agent.cti.telemetry import TelemetryEvent


session_manager = SessionManager()


def parse_http_line(line: str) -> TelemetryEvent | None:
    try:
        data = json.loads(line)
    except json.JSONDecodeError:
        return None

    timestamp = data.get("timestamp")
    src_ip = data.get("src_ip")
    method = data.get("method")
    path = data.get("path")

    if not timestamp or not src_ip or not method or not path:
        return None

    session_id = session_manager.get_session_id(
        src_ip,
        timestamp,
    )

    return TelemetryEvent(
        session_id=session_id,
        timestamp=timestamp,
        src_ip=src_ip,
        source="http-decoy",
        event_type="http_request",
        summary=f"{method} {path}",
    )
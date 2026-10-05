import json

from agent.cti.telemetry import TelemetryEvent


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

    return TelemetryEvent(
        session_id="",
        timestamp=timestamp,
        src_ip=src_ip,
        source="http-decoy",
        event_type="http_request",
        summary=f"{method} {path}",
    )
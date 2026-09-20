import json
from pathlib import Path

from agent.cti.models import CTIEvent
from agent.cti.service import enrich_event

from agent.cti.session import SessionManager

session_manager = SessionManager()


def ingest_alert_line(line: str) -> dict | None:
    """
    Convert one Suricata eve.json alert into a CTI event.
    """

    try:
        data = json.loads(line)
    except json.JSONDecodeError:
        return None

    if data.get("event_type") != "alert":
        return None

    alert = data.get("alert")

    if not isinstance(alert, dict):
        return None

    signature_id = alert.get("signature_id")
    signature = alert.get("signature")

    if signature_id is None or signature is None:
        return None

    src_ip = data.get("src_ip")

    if not src_ip:
        return None

    timestamp = data.get("timestamp", "")

    session_id=session_manager.get_session_id(
    src_ip,
    data.get("timestamp", ""),
),

    event = CTIEvent(
        session_id=src_ip,
        timestamp=data.get("timestamp", ""),
        src_ip=src_ip,
        signature_id=signature_id,
        signature=signature,
        evidence=f"{signature} detected from {src_ip}",
    )

    return enrich_event(event)


def ingest_file(path: str) -> int:
    """
    Process existing Suricata alert events from eve.json.
    """

    count = 0

    with Path(path).open("r", encoding="utf-8") as file:
        for line in file:
            result = ingest_alert_line(line)

            if result is not None:
                count += 1

    return count
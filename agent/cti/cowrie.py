import json

from agent.cti.telemetry import TelemetryEvent


def parse_cowrie_line(line: str) -> TelemetryEvent | None:
    try:
        data = json.loads(line)
    except json.JSONDecodeError:
        return None

    timestamp = data.get("timestamp")
    src_ip = data.get("src_ip")
    cowrie_session = data.get("session")
    event_id = data.get("eventid")

    if not timestamp or not src_ip or not cowrie_session:
        return None

    session_id = f"{src_ip}:{cowrie_session}"

    if event_id == "cowrie.login.success":
        username = data.get("username")

        if not username:
            return None

        return TelemetryEvent(
            session_id=session_id,
            timestamp=timestamp,
            src_ip=src_ip,
            source="cowrie",
            event_type="login",
            summary=f"Successful login for user: {username}",
        )

    if event_id == "cowrie.command.input":
        command = data.get("input")

        if not command:
            return None

        return TelemetryEvent(
            session_id=session_id,
            timestamp=timestamp,
            src_ip=src_ip,
            source="cowrie",
            event_type="command",
            summary=f"Executed command: {command}",
        )

    return None
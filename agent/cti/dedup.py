import hashlib

def event_fingerprint(
        session_id: str,
        flow_id: str,
        signature_id: int,
) -> str:
    value =f"{session_id} | {flow_id} |{signature_id}"

    return hashlib.sha256(
        value.encode("utf-8")
    ).hexdigest()
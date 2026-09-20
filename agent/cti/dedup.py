import hashlib

def event_fingerprint(
        session_id: str,
        signature_id: int,
        timestamp:str,
        src_ip:str,
) -> str:
    value =f"{session_id} | {signature_id} | {timestamp} |{src_ip}"

    return hashlib.sha256(
        value.encode("utf-8")
    ).hexdigest()
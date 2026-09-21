def classify_event(signature: str) -> str:
    signature_lower = signature.lower()

    if "nmap" in signature_lower or "scan" in signature_lower:
        return "discovery"

    if "ssh" in signature_lower:
        return "ssh_activity"

    if "http" in signature_lower:
        return "http_activity"

    return "unknown"
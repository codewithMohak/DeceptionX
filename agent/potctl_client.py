import requests

from config import POTCTL_API_KEY
from config import POTCTL_TIMEOUT
from config import POTCTL_URL

def toggle(target: str, action: str, reason: str) -> dict:
    """
    Ask potctl to change the state of an allowed honeypot.
    """

    url = f"{POTCTL_URL}/toggle"

    headers ={
        "X-API-Key": POTCTL_API_KEY,
    }

    payload ={
        "target": target,
        "action": action,
        "reason": reason,
    }

    response = requests.post(
        url,
        json= payload,
        headers=headers,
        timeout=POTCTL_TIMEOUT,
    )

    response.raise_for_status()

    return response.json()
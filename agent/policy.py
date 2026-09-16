from agent.models import Decision

ALLOWED_ACTION ={
    "expose",
    "hide",
    "no_change",
}

ALLOWED_TARGETS={
    "cowrie",
    "http-decoy",
}

def apply_policy(decision: Decision) -> dict | None:
    if decision.action not in ALLOWED_ACTION:
        raise ValueError("policy rejected unspported action")

    if decision.target not in ALLOWED_TARGETS:
        raise ValueError("policy rejected unsupported target")

    if decision.action == "no_change":
        return None

    if decision.action == "expose":
        potctl_action = "start"

    elif decision.action == "hide":
        potctl_action = "stop"

    else :
        raise ValueError("policy rejected unknown action")

    return {
        "target": decision.target,
        "action": potctl_action,
        "reason": decision.reason,
    }
import logging

from agent.llm_client import generate_decision
from agent.policy import apply_policy
from agent.potctl_client import toggle
from agent.prompt import build_prompt

logger = logging.getLogger(__name__)

def process_event(event: dict)-> dict | None:
    logger.info("Processing security event")

    response = generate_decision(
    build_prompt(event)
)

    action = apply_policy(response.decision)

    if action is None:
        logger.info("Policy decision: no_change")
        return None

    logger.info(
        "Policy approved action = %s target=%s",
        action["action"],
        action["target"],
    )

    result = toggle(
        target=action["target"],
        action=action["action"],
        reason=action["reason"],
    )

    logger.info(
        "potctl action completed target =%s action= %s",
        action["target"],
        action["action"],
    )
    return result
from typing import Literal

from pydantic import BaseModel, Field


class Decision(BaseModel):
    action: Literal["expose", "hide", "no_change"]
    target: Literal["cowrie", "http-decoy"]
    reason: str = Field(max_length=200)


class AgentResponse(BaseModel):
    graph_nodes: list[str]
    graph_edges: list[str]
    decision: Decision

class NormalizedEvent(BaseModel):
    timestamp: str
    src_ip: str
    service: str
    summary: str



def validate_decision(decision: Decision) -> Decision:
    """
    Apply explicit validation to a model-validated decision.

    This provides a second defensive check before a decision
    reaches the policy gate.
    """

    if decision.action not in {
        "expose",
        "hide",
        "no_change",
    }:
        raise ValueError("unsupported action")

    if decision.target not in {
        "cowrie",
        "http-decoy",
    }:
        raise ValueError("unsupported target")

    if len(decision.reason) > 200:
        raise ValueError("reason exceeds 200 characters")

    return decision

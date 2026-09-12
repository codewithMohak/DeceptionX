from typing import Literal

from pydantic import BaseModel, Field

class Decision(BaseModel):
    action: Literal["expose", "hide", "no_change"]
    target : Literal["cowrie", "http-decoy"]
    reason: str = Field(max_length=200)


class AgentResponse(BaseModel):
    graph_nodes: list[str]
    graph_edges: list[str]
    decision: Decision


def validate_decision(decision: Decision) -> Decision:
    if decision.action not in {"expose", "hide","no_changes"}:
        raise ValueError("Unsupported action")

    if len(decision.reason) > 200:
        raise ValueError("reason exceeds 200 characters")

    return decision
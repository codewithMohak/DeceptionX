from pydantic import BaseModel


class AttackGraphNode(BaseModel):
    id: str
    label: str
    type: str
    technique_id: str | None = None
    technique_name: str | None = None
    tactic: str | None = None
    signature: str | None = None


class AttackGraphEdge(BaseModel):
    id: str
    source: str
    target: str


class AttackGraph(BaseModel):
    session_id: str
    nodes: list[AttackGraphNode]
    edges: list[AttackGraphEdge]
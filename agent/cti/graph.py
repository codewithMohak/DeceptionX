from pydantic import BaseModel


class AttackGraphNode(BaseModel):
    id: str
    label: str
    type: str


class AttackGraphEdge(BaseModel):
    id: str
    source: str
    target: str


class AttackGraph(BaseModel):
    session_id: str
    nodes: list[AttackGraphNode]
    edges: list[AttackGraphEdge]
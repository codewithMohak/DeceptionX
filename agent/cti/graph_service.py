from agent.cti.store import CTIStore
from agent.cti.graph import (
    AttackGraph,
    AttackGraphEdge,
    AttackGraphNode,
)
from agent.cti.stages import classify_event


store = CTIStore()


def build_attack_graph(session_id: str) -> AttackGraph:
    events = store.get_by_session(session_id)

    nodes: list[AttackGraphNode] = []
    edges: list[AttackGraphEdge] = []

    previous_node_id: str | None = None

    for index, event in enumerate(events, start=1):
        stage = classify_event(event["signature"])

        node_id = f"event-{index}"

        node = AttackGraphNode(
        id=node_id,
        label=(
            event["technique_name"]
            if event.get("technique_name")
            else f"{stage}: {event['signature']}"
        ),
        type=stage,
        technique_id=event.get("technique_id"),
        technique_name=event.get("technique_name"),
        tactic=event.get("tactic"),
        signature=event.get("signature"),
    )

        nodes.append(node)

        if previous_node_id is not None:
            edges.append(
                AttackGraphEdge(
                    id=f"edge-{index - 1}-{index}",
                    source=previous_node_id,
                    target=node_id,
                )
            )

        previous_node_id = node_id

    return AttackGraph(
        session_id=session_id,
        nodes=nodes,
        edges=edges,
    )
from unittest.mock import patch

from agent.models import AgentResponse
from agent.models import Decision
from agent.runner import process_event


def test_process_event_sends_approved_action_to_potctl():
    fake_response = AgentResponse(
        graph_nodes=["192.168.56.20", "ssh"],
        graph_edges=["192.168.56.20 connects to ssh"],
        decision=Decision(
            action="expose",
            target="cowrie",
            reason="Repeated SSH activity observed",
        ),
    )

    event = {
        "timestamp": "2026-09-16T12:00:00Z",
        "src_ip": "192.168.56.20",
        "service": "ssh",
        "summary": "Repeated SSH activity observed",
    }

    with patch(
        "agent.runner.generate_decision",
        return_value=fake_response,
    ), patch(
        "agent.runner.toggle",
        return_value={
            "status": "success",
            "target": "cowrie",
            "action": "start",
        },
    ) as mock_toggle:

        result = process_event(event)

    mock_toggle.assert_called_once_with(
        target="cowrie",
        action="start",
        reason="Repeated SSH activity observed",
    )

    assert result["status"] == "success"


def test_process_event_does_not_call_potctl_for_no_change():
    fake_response = AgentResponse(
        graph_nodes=["192.168.56.20", "ssh"],
        graph_edges=["192.168.56.20 connects to ssh"],
        decision=Decision(
            action="no_change",
            target="cowrie",
            reason="No safe reconfiguration required",
        ),
    )

    event = {
        "timestamp": "2026-09-16T12:00:00Z",
        "src_ip": "192.168.56.20",
        "service": "ssh",
        "summary": "SSH activity observed",
    }

    with patch(
        "agent.runner.generate_decision",
        return_value=fake_response,
    ), patch(
        "agent.runner.toggle",
    ) as mock_toggle:

        result = process_event(event)

    mock_toggle.assert_not_called()
    assert result is None
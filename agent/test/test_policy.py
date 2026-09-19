import pytest

from agent.models import Decision
from agent.policy import apply_policy


def test_expose_maps_to_start():
    decision = Decision(
        action="expose",
        target="cowrie",
        reason="SSH activity observed",
    )

    result = apply_policy(decision)

    assert result == {
        "target": "cowrie",
        "action": "start",
        "reason": "SSH activity observed",
    }


def test_hide_maps_to_stop():
    decision = Decision(
        action="hide",
        target="http-decoy",
        reason="Suspicious HTTP activity observed",
    )

    result = apply_policy(decision)

    assert result == {
        "target": "http-decoy",
        "action": "stop",
        "reason": "Suspicious HTTP activity observed",
    }


def test_no_change_returns_none():
    decision = Decision(
        action="no_change",
        target="cowrie",
        reason="No safe reconfiguration required",
    )

    result = apply_policy(decision)

    assert result is None


def test_policy_rejects_invalid_action():
    decision = Decision.model_construct(
        action="delete_all",
        target="cowrie",
        reason="malicious request",
    )

    with pytest.raises(ValueError):
        apply_policy(decision)


def test_policy_rejects_invalid_target():
    decision = Decision.model_construct(
        action="expose",
        target="docker",
        reason="malicious request",
    )

    with pytest.raises(ValueError):
        apply_policy(decision)

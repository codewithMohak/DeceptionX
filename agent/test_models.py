import pytest
from pydantic import ValidationError

from agent.models import Decision
from agent.models import validate_decision


def test_valid_decision():
    decision = Decision(
        action="hide",
        target="cowrie",
        reason="Repeated SSH activity",
    )

    result = validate_decision(decision)

    assert result == decision


def test_invalid_action():
    with pytest.raises(ValidationError):
        Decision(
            action="delete_all",
            target="cowrie",
            reason="Malicious request",
        )


def test_invalid_target():
    with pytest.raises(ValidationError):
        Decision(
            action="hide",
            target="docker",
            reason="Malicious request",
        )


def test_reason_too_long():
    with pytest.raises(ValidationError):
        Decision(
            action="hide",
            target="cowrie",
            reason="A" * 201,
        )
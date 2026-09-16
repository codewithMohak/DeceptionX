from fastapi.testclient import TestClient

from agent.main import app


client = TestClient(app)


def test_health():
    response = client.get("/health")

    assert response.status_code == 200
    assert response.json() == {
        "status": "ok",
        "service": "deception-agent",
    }


def test_process_returns_success():
    fake_result = {
        "status": "success",
        "target": "cowrie",
        "action": "start",
    }

    from unittest.mock import patch

    with patch(
        "agent.main.process_event",
        return_value=fake_result,
    ):
        response = client.post(
            "/process",
            json={
                "timestamp": "2026-09-16T12:00:00Z",
                "src_ip": "192.168.56.20",
                "service": "ssh",
                "summary": "Repeated SSH activity observed",
            },
        )

    assert response.status_code == 200
    assert response.json() == {
        "status": "success",
        "potctl": fake_result,
    }


def test_process_rejects_invalid_event():
    response = client.post(
        "/process",
        json={
            "timestamp": "2026-09-16T12:00:00Z",
            "src_ip": "192.168.56.20",
            "service": "ssh",
        },
    )

    assert response.status_code == 422


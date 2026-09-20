import pytest
import agent.cti.ingest as ingest
from agent.cti.ingest import ingest_alert_line


@pytest.fixture(autouse=True)
def reset_ingest_state():
    ingest.seen_events.clear()
    ingest.session_manager = ingest.SessionManager()


def test_same_attacker_uses_same_session(monkeypatch):
    captured = []

    def fake_enrich_event(event):
        captured.append(event)
        return event.model_dump()

    monkeypatch.setattr(
        "agent.cti.ingest.enrich_event",
        fake_enrich_event,
    )

    line_one = (
    '{"event_type":"alert",'
    '"timestamp":"2026-09-20T04:00:00+00:00",'
    '"src_ip":"192.168.242.1",'
    '"flow_id":1747442319655752,'
    '"alert":{"signature_id":2024364,'
    '"signature":"ET SCAN Possible Nmap User-Agent Observed"}}'
)

    line_two = (
    '{"event_type":"alert",'
    '"timestamp":"2026-09-20T04:10:00+00:00",'
    '"src_ip":"192.168.242.1",'
    '"flow_id":290176570932404,'
    '"alert":{"signature_id":2228000,'
    '"signature":"SURICATA SSH invalid banner"}}'
)

    ingest_alert_line(line_one)
    ingest_alert_line(line_two)

    assert captured[0].session_id == captured[1].session_id
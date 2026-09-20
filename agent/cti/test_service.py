from agent.cti.models import CTIEvent
from agent.cti.service import enrich_event


def test_unmapped_event():
    event = CTIEvent(
        session_id="192.168.242.1",
        timestamp="2026-09-19T07:43:46",
        src_ip="192.168.242.1",
        flow_id=1747442319655752,
        signature_id=2228000,
        signature="SURICATA SSH invalid banner",
        evidence="SSH invalid banner detected",
    )

    result = enrich_event(event)

    assert result["session_id"] == "192.168.242.1"
    assert result["signature_id"] == 2228000
    assert result["technique"] is None
from agent.cti.ingest import ingest_alert_line


def test_ingest_alert_line(monkeypatch):
    captured = {}

    def fake_enrich_event(event):
        captured["event"] = event
        return {
            "signature_id": event.signature_id,
            "signature": event.signature,
        }

    monkeypatch.setattr(
        "agent.cti.ingest.enrich_event",
        fake_enrich_event,
    )

    line = (
        '{"event_type":"alert",'
        '"timestamp":"2026-09-19T07:43:46",'
        '"src_ip":"192.168.242.1",'
        '"alert":{'
        '"signature_id":2228000,'
        '"signature":"SURICATA SSH invalid banner"'
        '}}'
    )

    result = ingest_alert_line(line)

    assert result["signature_id"] == 2228000
    assert result["signature"] == "SURICATA SSH invalid banner"

    event = captured["event"]

    assert event.session_id == "192.168.242.1"
    assert event.src_ip == "192.168.242.1"
    assert event.signature_id == 2228000
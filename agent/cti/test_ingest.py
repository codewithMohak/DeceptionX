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
    assert event.session_id.startswith("192.168.242.1:")
    assert event.src_ip == "192.168.242.1"
    assert event.signature_id == 2228000

def test_duplicate_alert_is_ignored(monkeypatch):
    captured = []

    def fake_enrich_event(event):
        captured.append(event)
        return event.model_dump()

    monkeypatch.setattr(
        "agent.cti.ingest.enrich_event",
        fake_enrich_event,
    )

    line = (
        '{"event_type":"alert",'
        '"timestamp":"2026-09-20T06:30:00+00:00",'
        '"src_ip":"192.168.242.1",'
        '"alert":{"signature_id":2024364,'
        '"signature":"ET SCAN Possible Nmap User-Agent Observed"}}'
    )

    first = ingest_alert_line(line)
    second = ingest_alert_line(line)

    assert first is not None
    assert second is None
    assert len(captured) == 1
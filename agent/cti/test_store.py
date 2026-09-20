from agent.cti.store import CTIStore


def test_store_and_retrieve_by_session(tmp_path):
    store = CTIStore(str(tmp_path / "test_cti.db"))

    event_one = {
    "session_id": "192.168.242.1",
    "timestamp": "2026-09-19T20:00:00",
    "src_ip": "192.168.242.1",
    "flow_id": 1747442319655752,
    "signature_id": 2228000,
    "signature": "SURICATA SSH invalid banner",
    "evidence": "SSH invalid banner detected",
    "technique": None,
}

    event_two = {
    "session_id": "192.168.242.1",
    "timestamp": "2026-09-19T20:01:00",
    "src_ip": "192.168.242.1",
    "flow_id": 290176570932404,
    "signature_id": 2260002,
    "signature": "SURICATA Applayer Detect protocol only one direction",
    "evidence": "SSH application-layer anomaly detected",
    "technique": None,
}
    event_three = {
    "session_id": "10.0.0.5",
    "timestamp": "2026-09-19T20:02:00",
    "src_ip": "10.0.0.5",
    "flow_id": 460098750669711,
    "signature_id": 9999999,
    "signature": "Unknown signature",
    "evidence": "Unknown event",
    "technique": None,
}

    store.add(event_one)
    store.add(event_two)
    store.add(event_three)

    results = store.get_by_session("192.168.242.1")

    assert len(results) == 2
    assert results[0]["flow_id"] == 1747442319655752
    assert results[1]["flow_id"] == 290176570932404
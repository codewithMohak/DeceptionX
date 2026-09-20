from agent.cti.dedup import event_fingerprint


def test_same_event_has_same_fingerprint():
    first = event_fingerprint(
        "192.168.242.1:session1",
        1747442319655752,
        2024364,
    )

    second = event_fingerprint(
        "192.168.242.1:session1",
        1747442319655752,
        2024364,
    )

    assert first == second


def test_different_flow_has_different_fingerprint():
    first = event_fingerprint(
        "192.168.242.1:session1",
        1747442319655752,
        2024364,
    )

    second = event_fingerprint(
        "192.168.242.1:session1",
        290176570932404,
        2024364,
    )

    assert first != second
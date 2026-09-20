from agent.cti.dedup import event_fingerprint


def test_same_event_has_same_fingerprint():
    first = event_fingerprint(
        "192.168.242.1:session1",
        2024364,
        "2026-09-20T06:23:07.697402-0400",
        "192.168.242.1",
    )

    second = event_fingerprint(
        "192.168.242.1:session1",
        2024364,
        "2026-09-20T06:23:07.697402-0400",
        "192.168.242.1",
    )

    assert first == second


def test_different_event_has_different_fingerprint():
    first = event_fingerprint(
        "192.168.242.1:session1",
        2024364,
        "2026-09-20T06:23:07.697402-0400",
        "192.168.242.1",
    )

    second = event_fingerprint(
        "192.168.242.1:session1",
        2228000,
        "2026-09-20T06:23:08.697402-0400",
        "192.168.242.1",
    )

    assert first != second
from agent.cti.session import SessionManager


def test_same_attacker_stays_in_same_session():
    manager = SessionManager()

    first = manager.get_session_id(
        "192.168.242.1",
        "2026-09-20T04:00:00+00:00",
    )

    second = manager.get_session_id(
        "192.168.242.1",
        "2026-09-20T04:10:00+00:00",
    )

    assert first == second


def test_new_session_after_30_minutes():
    manager = SessionManager()

    first = manager.get_session_id(
        "192.168.242.1",
        "2026-09-20T04:00:00+00:00",
    )

    second = manager.get_session_id(
        "192.168.242.1",
        "2026-09-20T04:31:00+00:00",
    )

    assert first != second
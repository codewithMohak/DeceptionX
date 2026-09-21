from pathlib import Path

from agent.cti.cowrie import parse_cowrie_line


LOG_PATH = Path(__file__).parent.parent.parent / "honeypots" / "ssh-cowrie" / "cowrie-logs" / "cowrie.json"


def test_cowrie_log():
    events = []

    with LOG_PATH.open("r", encoding="utf-8") as file:
        for line in file:
            event = parse_cowrie_line(line)

            if event is not None:
                events.append(event)

    assert len(events) > 0

    for event in events:
        print(event)
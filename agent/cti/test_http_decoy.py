from pathlib import Path

from agent.cti.http_decoy import parse_http_line


LOG_PATH = Path(
    "honeypots/http-decoy/http-logs/requests.json"
)


def test_http_log():
    events = []

    with LOG_PATH.open("r", encoding="utf-8") as file:
        for line in file:
            event = parse_http_line(line)

            if event is not None:
                events.append(event)

    assert len(events) > 0

    for event in events:
        print(event)
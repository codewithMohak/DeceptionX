import time
from pathlib import Path

from agent.cti.ingest import ingest_alert_line


def watch_file(path: str, poll_interval: float = 1.0) -> None:
    file_path = Path(path)

    print("Watching Suricata eve.json...")

    with file_path.open("r", encoding="utf-8") as file:
        file.seek(0, 2)

        while True:
            line = file.readline()

            if not line:
                time.sleep(poll_interval)
                continue

            result = ingest_alert_line(line)

            if result is not None:
                print("CTI event ingested:", result)


if __name__ == "__main__":
    watch_file("/var/log/suricata/eve.json")
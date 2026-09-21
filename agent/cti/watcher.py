import time
from pathlib import Path

from agent.cti.ingest import ingest_alert_line


def watch_file(path: str, poll_interval: float = 1.0, state_file: str = "offset.state") -> None:
    file_path = Path(path)
    state_path = Path(state_file)

    print("Watching Suricata eve.json...")

    with file_path.open("r", encoding="utf-8") as file:
        if state_path.exists():
            try:
                file.seek(int(state_path.read_text().strip()))
            except ValueError:
                file.seek(0, 2)
        else:
            file.seek(0, 2)

        while True:
            line = file.readline()

            if not line:
                state_path.write_text(str(file.tell()))
                time.sleep(poll_interval)
                continue

            result = ingest_alert_line(line)

            if result is not None:
                print("CTI event ingested:", result)


if __name__ == "__main__":
    watch_file("/var/log/suricata/eve.json")
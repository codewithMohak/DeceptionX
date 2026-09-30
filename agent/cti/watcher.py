import time
from pathlib import Path
from typing import Callable

from agent.cti.ingest import (
    ingest_alert_line,
    ingest_cowrie_line,
    ingest_http_line,
)


def watch_file(
    path: str,
    ingest_line: Callable[[str], object | None] | None = None,
    source: str = "Suricata",
    poll_interval: float = 1.0,
    state_file: str = "offset.state",
) -> None:
    if ingest_line is None:
        ingest_line = ingest_alert_line

    file_path = Path(path)
    state_path = Path(state_file)

    print(f"Watching {source}: {file_path}")

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

            result = ingest_line(line)

            if result is not None:
                print(f"{source} event ingested:", result)


def watch_suricata(
    path: str,
    state_file: str = "offsets/suricata.offset",
) -> None:
    watch_file(
        path=path,
        ingest_line=ingest_alert_line,
        source="Suricata",
        state_file=state_file,
    )


def watch_cowrie(
    path: str,
    state_file: str = "offsets/cowrie.offset",
) -> None:
    watch_file(
        path=path,
        ingest_line=ingest_cowrie_line,
        source="Cowrie",
        state_file=state_file,
    )


def watch_http(
    path: str,
    state_file: str = "offsets/http.offset",
) -> None:
    watch_file(
        path=path,
        ingest_line=ingest_http_line,
        source="HTTP",
        state_file=state_file,
    )
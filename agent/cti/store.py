import sqlite3
from typing import Any

from agent.cti.telemetry import TelemetryEvent


class CTIStore:
    def __init__(self, db_path: str = "cti.db"):
        self.db_path = db_path
        self._create_tables()

    def _create_tables(self) -> None:
        with sqlite3.connect(self.db_path) as connection:
            connection.execute(
                """
                CREATE TABLE IF NOT EXISTS cti_events (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    session_id TEXT NOT NULL,
                    timestamp TEXT NOT NULL,
                    src_ip TEXT NOT NULL,
                    flow_id INTEGER NOT NULL,
                    signature_id INTEGER NOT NULL,
                    signature TEXT NOT NULL,
                    evidence TEXT NOT NULL,
                    technique_id TEXT,
                    technique_name TEXT,
                    tactic TEXT
                )
                """
            )

            connection.execute(
                """
                CREATE TABLE IF NOT EXISTS telemetry_events (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    session_id TEXT NOT NULL,
                    timestamp TEXT NOT NULL,
                    src_ip TEXT NOT NULL,
                    source TEXT NOT NULL,
                    event_type TEXT NOT NULL,
                    summary TEXT NOT NULL
                )
                """
            )

    def add(self, event: dict[str, Any]) -> None:
        technique = event.get("technique")

        with sqlite3.connect(self.db_path) as connection:
            connection.execute(
                """
                INSERT INTO cti_events (
                    session_id,
                    timestamp,
                    src_ip,
                    flow_id,
                    signature_id,
                    signature,
                    evidence,
                    technique_id,
                    technique_name,
                    tactic
                )
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                """,
                (
                    event["session_id"],
                    event["timestamp"],
                    event["src_ip"],
                    event["flow_id"],
                    event["signature_id"],
                    event["signature"],
                    event["evidence"],
                    technique["technique_id"] if technique else None,
                    technique["technique_name"] if technique else None,
                    technique["tactic"] if technique else None,
                ),
            )

    def add_telemetry(self, event: TelemetryEvent) -> None:
        with sqlite3.connect(self.db_path) as connection:
            connection.execute(
                """
                INSERT INTO telemetry_events (
                    session_id,
                    timestamp,
                    src_ip,
                    source,
                    event_type,
                    summary
                )
                VALUES (?, ?, ?, ?, ?, ?)
                """,
                (
                    event.session_id,
                    event.timestamp,
                    event.src_ip,
                    event.source,
                    event.event_type,
                    event.summary,
                ),
            )

    def get_telemetry_by_session(
        self,
        session_id: str,
    ) -> list[dict[str, Any]]:
        with sqlite3.connect(self.db_path) as connection:
            connection.row_factory = sqlite3.Row

            rows = connection.execute(
                """
                SELECT
                    session_id,
                    timestamp,
                    src_ip,
                    source,
                    event_type,
                    summary
                FROM telemetry_events
                WHERE session_id = ?
                ORDER BY id ASC
                """,
                (session_id,),
            ).fetchall()

        return [dict(row) for row in rows]

    def get_recent_telemetry(
        self,
        limit: int = 50,
    ) -> list[dict[str, Any]]:
        with sqlite3.connect(self.db_path) as connection:
            connection.row_factory = sqlite3.Row

            rows = connection.execute(
                """
                SELECT
                    session_id,
                    timestamp,
                    src_ip,
                    source,
                    event_type,
                    summary
                FROM telemetry_events
                ORDER BY id DESC
                LIMIT ?
                """,
                (limit,),
            ).fetchall()

        return [dict(row) for row in rows]

    def get_by_session(self, session_id: str) -> list[dict[str, Any]]:
        with sqlite3.connect(self.db_path) as connection:
            connection.row_factory = sqlite3.Row

            rows = connection.execute(
                """
                SELECT
                    session_id,
                    timestamp,
                    src_ip,
                    flow_id,
                    signature_id,
                    signature,
                    evidence,
                    technique_id,
                    technique_name,
                    tactic
                FROM cti_events
                WHERE session_id = ?
                ORDER BY id ASC
                """,
                (session_id,),
            ).fetchall()

        events = []

        for row in rows:
            technique = None

            if row["technique_id"] is not None:
                technique = {
                    "technique_id": row["technique_id"],
                    "technique_name": row["technique_name"],
                    "tactic": row["tactic"],
                }

            events.append(
                {
                    "session_id": row["session_id"],
                    "timestamp": row["timestamp"],
                    "src_ip": row["src_ip"],
                    "flow_id": row["flow_id"],
                    "signature_id": row["signature_id"],
                    "signature": row["signature"],
                    "evidence": row["evidence"],
                    "technique": technique,
                }
            )

        return events

    def get_latest_session(self, src_ip: str) -> str | None:
        with sqlite3.connect(self.db_path) as connection:
            row = connection.execute(
                """
                SELECT session_id
                FROM cti_events
                WHERE src_ip = ?
                ORDER BY timestamp DESC
                LIMIT 1
                """,
                (src_ip,),
            ).fetchone()

        if row is None:
            return None

        return row[0]
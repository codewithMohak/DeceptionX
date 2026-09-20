import sqlite3
from typing import Any


class CTIStore:
    def __init__(self, db_path: str = "cti.db"):
        self.db_path = db_path
        self._create_table()

    def _create_table(self) -> None:
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
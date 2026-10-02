import sqlite3
from typing import Any

from agent.cti.dedup import event_fingerprint
from agent.cti.telemetry import TelemetryEvent


class CTIStore:
    def __init__(self, db_path: str = "cti.db"):
        self.db_path = db_path
        self._create_tables()

    def _create_tables(self) -> None:
        with sqlite3.connect(self.db_path) as connection:
            # ---------------------------------------------------------
            # CTI events table
            # ---------------------------------------------------------
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
                    fingerprint TEXT,
                    technique_id TEXT,
                    technique_name TEXT,
                    tactic TEXT
                )
                """
            )

            # ---------------------------------------------------------
            # Migration:
            # Add fingerprint column to existing databases
            # ---------------------------------------------------------
            columns = {
                row[1]
                for row in connection.execute(
                    "PRAGMA table_info(cti_events)"
                ).fetchall()
            }

            if "fingerprint" not in columns:
                connection.execute(
                    """
                    ALTER TABLE cti_events
                    ADD COLUMN fingerprint TEXT
                    """
                )

            # ---------------------------------------------------------
            # Backfill fingerprints for existing CTI events
            # ---------------------------------------------------------
            rows = connection.execute(
                """
                SELECT id, session_id, flow_id, signature_id
                FROM cti_events
                WHERE fingerprint IS NULL
                """
            ).fetchall()

            for row_id, session_id, flow_id, signature_id in rows:
                fingerprint = event_fingerprint(
                    session_id,
                    flow_id,
                    signature_id,
                )

                connection.execute(
                    """
                    UPDATE cti_events
                    SET fingerprint = ?
                    WHERE id = ?
                    """,
                    (
                        fingerprint,
                        row_id,
                    ),
                )

            # ---------------------------------------------------------
            # Remove existing duplicate fingerprints
            #
            # Keep the oldest row (lowest id) and remove newer
            # duplicates before creating the UNIQUE index.
            # ---------------------------------------------------------
            connection.execute(
                """
                DELETE FROM cti_events
                WHERE fingerprint IS NOT NULL
                  AND id NOT IN (
                      SELECT MIN(id)
                      FROM cti_events
                      WHERE fingerprint IS NOT NULL
                      GROUP BY fingerprint
                  )
                """
            )

            # ---------------------------------------------------------
            # Persistent deduplication
            #
            # This prevents the same event from being inserted again
            # even after the application restarts.
            # ---------------------------------------------------------
            connection.execute(
                """
                CREATE UNIQUE INDEX IF NOT EXISTS
                idx_cti_events_fingerprint
                ON cti_events(fingerprint)
                """
            )

            # ---------------------------------------------------------
            # Telemetry events table
            # ---------------------------------------------------------
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

    # ================================================================
    # CTI EVENTS
    # ================================================================

    def add(self, event: dict[str, Any]) -> None:
        """
        Store an enriched CTI event.

        The fingerprint is generated from:

            session_id + flow_id + signature_id

        SQLite enforces uniqueness using the unique fingerprint index.
        Therefore duplicate events are ignored even after a restart.
        """

        technique = event.get("technique")

        fingerprint = event_fingerprint(
            event["session_id"],
            event["flow_id"],
            event["signature_id"],
        )

        with sqlite3.connect(self.db_path) as connection:
            connection.execute(
                """
                INSERT OR IGNORE INTO cti_events (
                    session_id,
                    timestamp,
                    src_ip,
                    flow_id,
                    signature_id,
                    signature,
                    evidence,
                    fingerprint,
                    technique_id,
                    technique_name,
                    tactic
                )
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                """,
                (
                    event["session_id"],
                    event["timestamp"],
                    event["src_ip"],
                    event["flow_id"],
                    event["signature_id"],
                    event["signature"],
                    event["evidence"],
                    fingerprint,
                    (
                        technique["technique_id"]
                        if technique
                        else None
                    ),
                    (
                        technique["technique_name"]
                        if technique
                        else None
                    ),
                    (
                        technique["tactic"]
                        if technique
                        else None
                    ),
                ),
            )

    def get_by_session(self, session_id: str) -> list[dict[str, Any]]:
        """
        Return all CTI events belonging to a session.
        """

        with sqlite3.connect(self.db_path) as connection:
            connection.row_factory = sqlite3.Row

            rows = connection.execute(
                """
                SELECT
                    id,
                    session_id,
                    timestamp,
                    src_ip,
                    flow_id,
                    signature_id,
                    signature,
                    evidence,
                    fingerprint,
                    technique_id,
                    technique_name,
                    tactic
                FROM cti_events
                WHERE session_id = ?
                ORDER BY timestamp ASC, id ASC
                """,
                (session_id,),
            ).fetchall()

        return [dict(row) for row in rows]

    def get_latest_by_src_ip(
        self,
        src_ip: str,
    ) -> list[dict[str, Any]]:
        """
        Return the latest CTI events for an attacker IP.
        """

        with sqlite3.connect(self.db_path) as connection:
            connection.row_factory = sqlite3.Row

            rows = connection.execute(
                """
                SELECT
                    id,
                    session_id,
                    timestamp,
                    src_ip,
                    flow_id,
                    signature_id,
                    signature,
                    evidence,
                    fingerprint,
                    technique_id,
                    technique_name,
                    tactic
                FROM cti_events
                WHERE src_ip = ?
                ORDER BY timestamp DESC, id DESC
                """,
                (src_ip,),
            ).fetchall()

        return [dict(row) for row in rows]

    # ================================================================
    # TELEMETRY EVENTS
    # ================================================================

    def add_telemetry(
        self,
        event: TelemetryEvent,
    ) -> None:
        """
        Store normalized honeypot telemetry.
        """

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
        """
        Return telemetry events for a session.
        """

        with sqlite3.connect(self.db_path) as connection:
            connection.row_factory = sqlite3.Row

            rows = connection.execute(
                """
                SELECT
                    id,
                    session_id,
                    timestamp,
                    src_ip,
                    source,
                    event_type,
                    summary
                FROM telemetry_events
                WHERE session_id = ?
                ORDER BY timestamp ASC, id ASC
                """,
                (session_id,),
            ).fetchall()

        return [dict(row) for row in rows]

    def get_recent_telemetry(
        self,
        limit: int = 10,
    ) -> list[dict[str, Any]]:
        """
        Return the most recent telemetry events.
        """

        with sqlite3.connect(self.db_path) as connection:
            connection.row_factory = sqlite3.Row

            rows = connection.execute(
                """
                SELECT
                    id,
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
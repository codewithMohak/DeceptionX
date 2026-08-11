CREATE TABLE IF NOT EXISTS state (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    container_name TEXT NOT NULL,
    status TEXT NOT NULL,
    recorded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS decision (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    context TEXT NOT NULL,
    decision TEXT NOT NULL,
    reason TEXT,
    made_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS action(
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    action_type TEXT NOT NULL,
    target TEXT NOT NULL,
    actor TEXT NOT NULL,
    reason TEXT,
    result TEXT,
    executed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Action records are audit events.
-- They are append-only: UPDATE and DELETE are prohibited.

CREATE TRIGGER IF NOT EXISTS prevent_action_update
BEFORE UPDATE ON action
BEGIN
    SELECT RAISE(ABORT, 'audit log is append-only: UPDATE is not allowed');
END;

CREATE TRIGGER IF NOT EXISTS prevent_action_delete
BEFORE DELETE ON action
BEGIN
    SELECT RAISE(ABORT, 'audit log is append-only: DELETE is not permitted');
END;
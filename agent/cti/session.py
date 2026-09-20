from datetime import datetime , timedelta, timezone

SESSION_TIMEOUT = timedelta(minutes=30)

class SessionManager:
    def __init__(self) -> None:
        self.sessions: dict[str,dict]={}

    def get_session_id(self, src_ip: str, timestamp: str) -> str:
        current_time = datetime.fromisoformat(timestamp)

        session = self.sessions.get(src_ip)

        if session is None:
            session_id = f"{src_ip}:{current_time.isoformat()}"

            self.sessions[src_ip] = {
                "session_id": session_id,
                "last_seen": current_time,
            }

            return session_id

        if current_time -session["last_seen"] > SESSION_TIMEOUT:
            session_id =f"{src_ip}:{current_time.isoformat()}"

            self.sessions[src_ip] = {
                 "session_id": session_id,
                "last_seen": current_time,
            }

            return session_id

        session["last_seen"] = current_time

        return session["session_id"]
        
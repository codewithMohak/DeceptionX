import logging
import threading
import os

from contextlib import asynccontextmanager

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware

from agent.models import NormalizedEvent
from agent.runner import process_event

from agent.cti.models import CTIEvent
from agent.cti.service import enrich_event, store
from agent.cti.watcher import (
    watch_suricata,
    watch_cowrie,
    watch_http,
)

from agent.cti.graph_service import build_attack_graph


@asynccontextmanager
async def lifespan(app: FastAPI):
    suricata_path = os.getenv(
        "SURICATA_LOG_PATH",
        "/var/log/suricata/eve.json",
    )

    cowrie_path = os.getenv(
        "COWRIE_LOG_PATH",
        "honeypots/ssh-cowrie/cowrie-logs/cowrie.json",
    )

    http_path = os.getenv(
        "HTTP_DECOY_LOG_PATH",
        "honeypots/http-decoy/logs/requests.json",
    )

    watchers = [
        threading.Thread(
            target=watch_suricata,
            args=(suricata_path,),
            daemon=True,
        ),
        threading.Thread(
            target=watch_cowrie,
            args=(cowrie_path,),
            daemon=True,
        ),
        threading.Thread(
            target=watch_http,
            args=(http_path,),
            daemon=True,
        ),
    ]

    for watcher in watchers:
        watcher.start()

    yield

app = FastAPI(
    title="DeceptionX Agent",
    docs_url=None,
    redoc_url=None,
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["GET"],
    allow_headers=["*"],
)


logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s %(levelname)s %(message)s"
)

logger = logging.getLogger(__name__)


@app.get("/health")
def health() -> dict:
    return {
        "status": "ok",
        "service": "deception-agent",
    }


@app.post("/process")
def process(event: NormalizedEvent) -> dict:
    try:
        result = process_event(event.model_dump())

    except Exception:
        logger.exception("Security event processing failed")
        raise HTTPException(
            status_code=500,
            detail="event processing failed",
        )

    if result is None:
        return {
            "status": "no_change",
        }

    return {
        "status": "success",
        "potctl": result,
    }


@app.get("/cti/{session_id}")
def get_cti(session_id: str) -> dict:
    events = store.get_by_session(session_id)

    return {
        "session_id": session_id,
        "events": events,
    }

@app.get("/telemetry/recent")
def get_recent_telemetry(limit: int = 50) -> dict:
    events = store.get_recent_telemetry(limit=limit)

    return {
        "events": events,
    }


@app.get("/telemetry/{session_id}")
def get_telemetry(session_id: str) -> dict:
    events = store.get_telemetry_by_session(session_id)

    return {
        "session_id": session_id,
        "events": events,
    }


@app.get("/graph/{session_id}")
def get_attack_graph(session_id: str) -> dict:
    graph = build_attack_graph(session_id)

    return graph.model_dump()

@app.post("/cti/test")
def add_test_cti_event(event: CTIEvent) -> dict:
    result = enrich_event(event)

    return {
        "status": "stored",
        "event": result,
    }

@app.get("/sessions/latest/{src_ip}")
def get_latest_session(src_ip: str) -> dict:
    session_id = store.get_latest_session(src_ip)

    if session_id is None:
        return {
            "src_ip": src_ip,
            "session_id": None,
        }

    return {
        "src_ip": src_ip,
        "session_id": session_id,
    }




if __name__ == "__main__":
    import uvicorn

    uvicorn.run(
        app,
        host="0.0.0.0",
        port=8090,
    )
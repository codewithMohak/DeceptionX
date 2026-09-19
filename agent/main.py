import logging
from fastapi import FastAPI

from fastapi import HTTPException
from agent.models import NormalizedEvent
from agent.runner import process_event

from agent.cti.models import CTIEvent
from agent.cti.service import enrich_event,store


logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s %(levelname)s %(message)s"
)

logger = logging.getLogger(__name__)

app = FastAPI(
    title =" DeceptionX Agent",
    docs_url=None,
    redoc_url=None,
)

@app.get("/health")
def health() -> dict:
    return{
        "status":"ok",
        "service":"deception-agent",
    }

@app.post("/process")
def process(event: NormalizedEvent)-> dict:
    try:
        result= process_event(event.model_dump())

    except Exception:
        logger.exception("Security event processing failed")
        raise HTTPException(
            status_code=500,
            detail="event processing failed",
        )
    if result is None:
        return{
            "status": "no_change",
        }
    return{
        "status":"success",
        "potctl": result,
    }

@app.get("/cti/{session_id}")
def get_cti(session_id: str) -> dict:
    events = store.get_by_session(session_id)

    return {
        "session_id": session_id,
        "events": events,
    }

@app.post("/cti/test")
def add_test_cti_event(event: CTIEvent) -> dict:
    result = enrich_event(event)

    return {
        "status": "stored",
        "event": result,
    }


if __name__ == "__main__":
    import uvicorn

    uvicorn.run(
        app,
        host="127.0.0.1",
        port= 8090,
    )


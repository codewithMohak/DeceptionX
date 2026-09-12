import logging
from fastapi import FastAPI

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


if __name__ == "__main__":
    import uvicorn

    uvicorn.run(
        app,
        host="127.0.0.1",
        port= 8090,
    )


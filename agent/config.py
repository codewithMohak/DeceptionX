import os

POTCTL_URL = os.getenv(
    "POTCTL_URL",
    "http://127.0.0.1:8081",
)

POTCTL_API_KEY =os.getenv("POTCTL_API_KEY", "")

POTCTL_TIMEOUT = float(
    os.getenv("POTCTL_TIMEOUT", "5")
)

LLM_API_KEY = os.getenv("LLM_API_KEY","")

LLM_MODEL =os.getenv(
    "LLM MODEL",
    "",
)
from google import genai
from google.genai import types

from agent.config import LLM_API_KEY
from agent.config import LLM_MODEL
from agent.models import AgentResponse


def create_client() -> genai.Client:
    """
    Create a Gemini API client using the environment API key.
    """
    if not LLM_API_KEY:
        raise RuntimeError("LLM_API_KEY is not configured")

    return genai.Client(api_key=LLM_API_KEY)


def generate_decision(prompt: str) -> AgentResponse:
    """
    Send a security prompt to Gemini and validate the structured response.
    """
    client = create_client()

    response = client.models.generate_content(
        model=LLM_MODEL,
        contents=prompt,
        config=types.GenerateContentConfig(
            response_mime_type="application/json",
            response_schema=AgentResponse,
        ),
    )

    if not response.text:
        raise RuntimeError("LLM returned an empty response")

    return AgentResponse.model_validate_json(response.text)
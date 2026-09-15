import json

from agent.models import AgentResponse
from agent.models import validate_decision

def parse_llm_response(raw_response: str) -> AgentResponse:
    data= json.loads(raw_response)

    response = AgentResponse.model_validate(data)

    validate_decision(response.decision)

    return response
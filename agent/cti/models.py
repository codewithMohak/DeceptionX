from pydantic  import BaseModel

class CTIEvent(BaseModel):
    session_id:str
    timestamp:str
    src_ip:str
    flow_id:int
    signature_id:int
    signature:str
    evidence:str
    
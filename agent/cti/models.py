from pydantic  import BaseModel

class CTIEvent(BaseModel):
    session_id:str
    timestamp:str
    src_ip:str
    signature_id:int
    signature:str
    evidence:str
    
from pydantic import BaseModel

class MessageResponse(BaseModel):
    message: str

class TokenSchema(BaseModel):
    access_token: str
    token_type: str

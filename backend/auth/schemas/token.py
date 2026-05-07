# auth/schemas/token.py

from pydantic import BaseModel
from uuid import UUID
from datetime import datetime

class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"

class TokenData(BaseModel):
    user_id: str

class LoginResponse(Token):
    user_id: UUID
    full_name: str
    email: str

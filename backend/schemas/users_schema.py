# schemas/users_schema.py

from pydantic import BaseModel, ConfigDict
from uuid import UUID
from datetime import datetime

class UserBase(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    full_name: str
    email: str

class UserRegister(UserBase):
    password: str

class UserLogin(BaseModel):
    email: str
    password: str

class UserResponse(UserBase):
    user_id: UUID
    created_at: datetime
    
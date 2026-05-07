# schemas/users_schema.py

from sqlmodel import SQLModel
from uuid import UUID
from datetime import datetime

class UserRegister(SQLModel):
    full_name: str
    email: str
    password: str

class UserLogin(SQLModel):
    email: str
    password: str

class UserResponse(SQLModel):
    user_id: UUID
    full_name: str
    email: str
    created_at: datetime
    
# models/users.py

from sqlmodel import SQLModel, Field
from sqlalchemy import Column
from sqlalchemy.dialects.postgresql import UUID as PG_UUID
from datetime import datetime, timezone
from uuid import uuid4, UUID
from typing import Optional

class User(SQLModel, table=True):
    __tablename__="users"

    user_id: UUID = Field(
        default_factory=uuid4,
        sa_column=Column(PG_UUID(as_uuid=True), primary_key=True)
    )
    full_name: str = Field(max_length=255)
    email: str = Field(max_length=255, unique=True)
    hashed_password: str = Field(max_length=255)
    created_at: datetime = Field(default_factory=datetime.now(timezone.utc))

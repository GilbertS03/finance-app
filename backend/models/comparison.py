# models/comparison.py

from sqlmodel import SQLModel, Field
from sqlalchemy import Column
from sqlalchemy.dialects.postgresql import UUID as PG_UUID
from datetime import datetime, timezone
from uuid import uuid4, UUID

class Comparison(SQLModel, table=True):
    __tablename__="comparisons"

    comparison_id: UUID = Field(
        default_factory=uuid4,
        sa_column=Column(PG_UUID(as_uuid=True), primary_key=True)
    )
    user_id: UUID = Field(foreign_key="users.user_id")
    comparison_title: str = Field(max_length=255)
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

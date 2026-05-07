# models/saved_scenarios.py

from sqlmodel import SQLModel, Field
from sqlalchemy import Column
from sqlalchemy.dialects.postgresql import UUID as PG_UUID, JSONB
from datetime import datetime, timezone
from uuid import uuid4, UUID
from typing import Optional

class SavedScenario(SQLModel, table=True):
    __tablename__ = "saved_scenarios"

    scenario_id: UUID = Field(
        default_factory=uuid4,
        sa_column=Column(PG_UUID(as_uuid=True), primary_key=True)
    )
    user_id: UUID = Field(foreign_key="users.user_id")
    scenario_name: Optional[str] = Field(default=None, max_length=255)
    calculator_type: str = Field(max_length=50)
    input_values: dict = Field(sa_column=Column(JSONB, nullable=False))
    calculated_result: dict = Field(sa_column=Column(JSONB, nullable=False))
    saved_at: datetime = Field(default_factory=datetime.now(timezone.utc))
    
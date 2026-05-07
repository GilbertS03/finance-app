# models/comparison_item.py

from sqlmodel import SQLModel, Field
from sqlalchemy import Column
from sqlalchemy.dialects.postgresql import UUID as PG_UUID
from uuid import uuid4, UUID

class ComparisonItem(SQLModel, table=True):
    __tablename__ = "comparison_items"

    item_id: UUID = Field(
        default_factory=uuid4,
        sa_column=Column(PG_UUID(as_uuid=True), primary_key=True)
    )
    comparison_id: UUID = Field(foreign_key="comparisons.comparison_id")
    scenario_id: UUID = Field(foreign_key="saved_scenarios.scenario_id") 
    display_position: int

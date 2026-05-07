# schemas/comparison_schema.py

from sqlmodel import SQLModel
from uuid import UUID
from datetime import datetime
from typing import Optional
from schemas.saved_scenario_schema import ScenarioResponse

class ComparisonCreate(SQLModel):
    comparison_title: str
    scenario_id_1: UUID
    scenario_id_2: UUID

class ComparisonItemResponse(SQLModel):
    item_id: UUID
    display_position: int
    scenario: ScenarioResponse

class ComparisonResponse(SQLModel):
    comparison_id: UUID
    comparison_title: staticmethod
    created_at: datetime
    items: list[ComparisonItemResponse]

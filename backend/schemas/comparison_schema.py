# schemas/comparison_schema.py

from pydantic import BaseModel, ConfigDict
from uuid import UUID
from datetime import datetime
from schemas.saved_scenario_schema import ScenarioResponse

class ComparisonBase(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    comparison_title: str

class ComparisonCreate(ComparisonBase):
    scenario_id_1: UUID
    scenario_id_2: UUID

class ComparisonItemResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    item_id: UUID
    display_position: int
    scenario: ScenarioResponse

class ComparisonResponse(ComparisonBase):
    comparison_id: UUID
    comparison_title: str
    created_at: datetime
    items: list[ComparisonItemResponse]

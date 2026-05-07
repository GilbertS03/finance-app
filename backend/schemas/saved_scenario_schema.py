# schemas/saved_scenario_schema.py

from sqlmodel import SQLModel
from uuid import UUID
from datetime import datetime
from typing import Optional

class ScenarioSave(SQLModel):
    scenario_name: Optional[str] = None
    calculator_type: str
    input_values: dict
    calculated_result: dict

class ScenarioResponse(SQLModel):
    scenario_id: UUID
    scenario_name: str
    calculator_type: str
    input_values: dict
    calculated_result: dict
    saved_at: datetime

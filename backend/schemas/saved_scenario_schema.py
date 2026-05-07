# schemas/saved_scenario_schema.py

from pydantic import BaseModel, ConfigDict
from uuid import UUID
from datetime import datetime
from typing import Optional

class ScenarioBase(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    calculator_type: str
    input_values: dict
    calculated_result: dict

class ScenarioSave(ScenarioBase):
    scenario_name: Optional[str] = None

class ScenarioResponse(ScenarioBase):
    scenario_id: UUID
    scenario_name: str
    saved_at: datetime

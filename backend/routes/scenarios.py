# routes/scenarios.py

from fastapi import APIRouter, Depends
from sqlmodel import Session
from uuid import UUID
from typing import Annotated

from db.database import get_db
from auth.utils.jwt import get_current_user
from auth.schemas.token import TokenData
from services.scenario_service import(
    save_scenario, get_all_scenarios,
    get_scenario, delete_scenario
)
from schemas.saved_scenario_schema import ScenarioSave, ScenarioResponse

router = APIRouter(prefix="/scenarios", tags=["scenarios"])

router.get("", response_model=list[ScenarioResponse])
def list_scenarios(
        current_user: Annotated[TokenData, Depends(get_current_user)],
        db: Session= Depends(get_db)
):
    return get_all_scenarios(db, current_user.user_id)

@router.post("", response_model=ScenarioResponse, status_code=201)
def create_scenario(
    data: ScenarioSave,
    current_user: Annotated[TokenData, Depends(get_current_user)],
    db: Session = Depends(get_db)
):
    return save_scenario(db, current_user.user_id, data)

@router.get("/{scenario_id}", response_model=ScenarioResponse)
def read_scenario(
    scenario_id: UUID,
    current_user: Annotated[TokenData, Depends(get_current_user)],
    db: Session = Depends(get_db)
):
    return get_scenario(db, current_user.user_id, scenario_id)

@router.delete("/{scenario_id}", status_code=204)
def remove_scenario(
    scenario_id: UUID,
    current_user: Annotated[TokenData, Depends(get_current_user)],
    db: Session = Depends(get_db)
):
    delete_scenario(db, current_user.user_id, scenario_id)
    
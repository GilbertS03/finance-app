# services/scenario_service.py

from sqlmodel import Session, select
from fastapi import HTTPException, status
from uuid import UUID

from models.saved_scenario import SavedScenario
from schemas.saved_scenario_schema import ScenarioSave, ScenarioResponse

def save_scenario(db: Session, user_id: UUID, data: ScenarioSave) -> ScenarioResponse:
    scenario = SavedScenario(
        user_id=user_id,
        scenario_name=data.scenario_name,
        calculator_type=data.calculator_type,
        input_values=data.input_values,
        calculated_result=data.calculated_result
    )
    db.add(scenario)
    db.commit()
    db.refresh(scenario)
    return ScenarioResponse.model_validate(scenario)

def get_all_scenarios(db: Session, user_id: UUID) -> list[ScenarioResponse]:
    scenarios = db.exec(
        select(SavedScenario).where(SavedScenario.user_id == user_id)
    ).all()
    return [ScenarioResponse.model_validate(s) for s in scenarios]

def get_scenario(db: Session, user_id: UUID, scenario_id: UUID) -> ScenarioResponse:
    scenario = db.exec(
        select(SavedScenario)
        .where(SavedScenario.scenario_id == scenario_id)
        .where(SavedScenario.user_id == user_id)
    ).first()
    if not scenario:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Scenario not found"
        )
    return ScenarioResponse.model_validate(scenario)

def delete_scenario(db: Session, user_id: UUID, scenario_id: UUID) -> None:
    scenario = db.exec(
        select(SavedScenario)
        .where(SavedScenario.scenario_id == scenario_id)
        .where(SavedScenario.user_id == user_id)
    ).first()
    if not scenario:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Scenario not found"
        )
    db.delete(scenario)
    db.commit()
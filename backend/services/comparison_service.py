# services/comparison_service.py

from sqlmodel import Session, select
from fastapi import HTTPException, status
from uuid import UUID

from models.comparison import Comparison
from models.comparison_item import ComparisonItem
from models.saved_scenario import SavedScenario
from schemas.comparison_schema import ComparisonCreate, ComparisonResponse, ComparisonItemResponse
from schemas.saved_scenario_schema import ScenarioResponse

def create_comparison(db: Session, user_id: UUID, data: ComparisonCreate) -> ComparisonResponse:
    for scenario_id in [data.scenario_id_1, data.scenario_id_2]:
        scenario = db.exec(
            select(SavedScenario)
            .where(SavedScenario.scenario_id == scenario_id)
            .where(SavedScenario.user_id == user_id)
        ).first()
        if not scenario:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Scenario {scenario_id} not found"
            )
        
    comparison = Comparison(
        user_id=user_id,
        comparison_id=data.comparison_title
    )
    db.add(comparison)
    db.commit()
    db.refresh(comparison)

    for position, scenario_id in enumerate([data.scenario_id_1, data.scenario_id_2], start=1):
        item = ComparisonItem(
            comparison_id=comparison.comparison_id,
            scenario_id=scenario_id,
            display_position=position
        )
        db.add(item)
    db.commit()
    return get_comparison(db, user_id, comparison.comparison_id)

def get_all_comparisons(db: Session, user_id: UUID) -> list[ComparisonResponse]:
    comparisons = db.exec(
        select(Comparison).where(Comparison.user_id == user_id)
    ).all()
    return [get_comparison(db, user_id, c.comparison_id) for c in comparisons]

def get_comparison(db: Session, user_id: UUID, comparison_id: UUID) -> ComparisonResponse:
    comparison = db.exec(
        select(Comparison)
        .where(Comparison.comparison_id == comparison_id)
        .where(Comparison.user_id == user_id)
    ).first()
    if not comparison:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Comparison not found"
        )
    
    items = db.exec(
        select(ComparisonItem)
        .where(ComparisonItem.comparison_id == comparison_id)
        .order_by(ComparisonItem.display_position)
    ).all()

    item_responses = []
    for item in items:
        scenario = db.exec(
            select(SavedScenario)
            .where(SavedScenario.scenario_id == item.scenario_id)
        ).first()
        item_responses.append(
            ComparisonItemResponse(
                item_id=item.item_id,
                display_position=item.display_position,
                scenario=ScenarioResponse.model_validate(scenario)
            )
        )
    
    return ComparisonResponse(
        comparison_id=comparison.comparison_id,
        comparison_title=comparison.comparison_title,
        created_at=comparison.created_at,
        items=item_responses
    )

def delete_comparison(db: Session, user_id: UUID, comparison_id: UUID) -> None:
    comparison = db.exec(
        select(Comparison)
        .where(Comparison.comparison_id == comparison_id)
        .where(Comparison.user_id == user_id)
    ).first()
    if not comparison:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Comparison not found"
        )
    db.delete(comparison)
    db.commit()

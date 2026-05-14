# routes/comparisons.py

from fastapi import APIRouter, Depends
from sqlmodel import Session
from uuid import UUID
from typing import Annotated

from db.database import get_db
from auth.utils.jwt import get_current_user
from auth.schemas.token import TokenData
from services.comparison_service import(
    create_comparison, get_all_comparisons,
    get_comparison, delete_comparison
)
from schemas.comparison_schema import ComparisonCreate, ComparisonResponse

router = APIRouter(prefix="/comparisons", tags=["comparisons"])

@router.get("", response_model=list[ComparisonResponse])
def list_comparisons(
    current_user: Annotated[TokenData, Depends(get_current_user)],
    db: Session = Depends(get_db)
):
    return get_all_comparisons(db, current_user.user_id)

@router.post("", response_model=ComparisonResponse, status_code=201)
def add_comparison(
    data: ComparisonCreate,
    current_user: Annotated[TokenData, Depends(get_current_user)],
    db: Session = Depends(get_db)
):
    return create_comparison(db, current_user.user_id, data)

@router.get("/{comparison_id}", response_model=ComparisonResponse)
def read_comparison(
    comparison_id: UUID,
    current_user: Annotated[TokenData, Depends(get_current_user)],
    db: Session = Depends(get_db)
):
    return get_comparison(db, current_user.user_id, comparison_id)

@router.delete("/{comparison_id}", status_code=204)
def remove_comparison(
    comparison_id: UUID,
    current_user: Annotated[TokenData, Depends(get_current_user)],
    db: Session = Depends(get_db)
):
    delete_comparison(db, current_user.user_id, comparison_id)
    
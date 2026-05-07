# auth/routes/auth_routes.py

from fastapi import APIRouter, status, Depends
from fastapi.security import OAuth2PasswordRequestForm
from sqlmodel import Session, select
from typing import Annotated

from db.database import get_db
from auth.services.auth_service import register_user, login_user
from auth.schemas.token import Token, LoginResponse
from schemas.users_schema import UserRegister, UserResponse

router = APIRouter(prefix="/auth", tags=["auth"])

@router.post("/register", response_model=LoginResponse, status_code=status.HTTP_201_CREATED)
def register(user_data: UserRegister, db: Session = Depends(get_db)):
    return register_user(db, user_data)

@router.post("/login", response_model=LoginResponse)
def login(form_data: Annotated[OAuth2PasswordRequestForm, Depends()], db: Session = Depends(get_db)):
    return login_user(db, form_data.username, form_data.password)


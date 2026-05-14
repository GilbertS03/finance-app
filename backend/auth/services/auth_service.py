# auth/services/auth_service.py

from sqlmodel import Session, select
from fastapi import HTTPException, status

from models.users import User
from auth.utils.hashing import hash_password, verify_password
from auth.utils.jwt import create_access_token
from auth.schemas.token import LoginResponse
from schemas.users_schema import UserRegister, UserResponse

def register_user(db: Session, user_data: UserRegister) -> LoginResponse:
    existing_user = db.exec(select(User).where(User.email == user_data.email)).first()
    if(existing_user):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered"
        )
    new_user = User(
        full_name=user_data.full_name,
        email=user_data.email,
        hashed_password=hash_password(user_data.password)
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    access_token = create_access_token(new_user.user_id)
    return LoginResponse(
        access_token=access_token,
        user_id=new_user.user_id,
        full_name=new_user.full_name,
        email=new_user.email
    )

def login_user(db: Session, email: str, password: str) -> LoginResponse:
    user = db.exec(select(User).where(User.email == email)).first()
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password"
        )
    if not verify_password(password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password"
        )
    access_token = create_access_token(user.user_id)
    return LoginResponse(
        access_token=access_token,
        user_id=user.user_id,
        full_name=user.full_name,
        email=user.email
    )

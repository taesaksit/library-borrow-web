from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from config.database import get_db

from schemas.response_custom import ResponseSchema
from schemas.user import UserLogin, UserLoginResponse, UserRegister, UserResponse
from services import auth as services


router = APIRouter(prefix="/auth")


@router.post("/register", response_model=ResponseSchema[UserResponse], tags=["auth"])
def register(user: UserRegister, db: Session = Depends(get_db)):
    return services.register(user, db)


@router.post("/login", response_model=ResponseSchema[UserLoginResponse], tags=["auth"])
def login(user: UserLogin, db: Session = Depends(get_db)):
    return services.login(user, db)

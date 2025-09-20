from os import name
from fastapi import HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy.exc import SQLAlchemyError

from core.jwt import hash_password, verify_password, create_access_token
from models.user import User
from schemas.user import UserRegister, UserLogin
from schemas.response_custom import ResponseSchema


def register(user: UserRegister, db: Session) -> ResponseSchema:

    existing_user = db.query(User).filter(User.email == user.email).first()

    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered",
        )

    new_user = User(
        name=user.name,
        email=user.email,
        password=hash_password(user.password),
    )

    try:

        db.add(new_user)
        db.commit()
        db.refresh(new_user)

    except SQLAlchemyError as e:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Database error: {str(e._message())}",
        )

    return ResponseSchema(
        status="success", message="User registered successfully", data=new_user
    )


def login(user: UserLogin, db: Session) -> ResponseSchema:
    try:
        db_user = db.query(User).filter(User.email == user.email).first()

        if not db_user:
            return ResponseSchema(
                status="error",
                message="Email is incorrect",
            )
     
        if not verify_password(user.password, db_user.password):
            return ResponseSchema(
                status="error",
                message="Password is incorrect",
            )

        access_token = create_access_token(data={
            "sub": db_user.email,
            "name": db_user.name,
            "role": db_user.role,
            })

    except SQLAlchemyError as e:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Database error: {str(e._message())}",
        )

    return ResponseSchema(
        status="success",
        message="Login successful",
        data={
            "access_token": access_token,
            "token_type": "Bearer",
        },
    )

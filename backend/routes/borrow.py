from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import List

from config.database import get_db
from schemas.response_custom import ResponseSchema
from schemas.borrow import (
    ApproveReturnBookResponse,
    BorrowCreate,
    BorrowBookResponse,
    CurrentBorrowResponse,
    ReturnBookResponse,
    HistoryResponse,
    ActiveBorrowResponse,
)
from services import borrow as services
from models.user import User
from core.oauth2 import allow_roles, get_current_user

router = APIRouter(prefix="/borrow")


@router.post(
    "/",
    response_model=ResponseSchema[BorrowBookResponse],
    tags=["borrow"],
)
def create_borrow(
    borrow: BorrowCreate,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    return services.create_borrow(borrow, user, db)


@router.put(
    "/return/{borrow_id}",
    response_model=ResponseSchema[ReturnBookResponse],
    tags=["borrow"],
)
def return_borrow(
    borrow_id: int,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    return services.return_borrow(borrow_id, user, db)


@router.put(
    "/approve_return/{borrow_id}",
    response_model=ResponseSchema[ApproveReturnBookResponse],
    tags=["borrow"],
)
def approve_return_borrow(
    borrow_id: int,
    db: Session = Depends(get_db),
    user: User = Depends(allow_roles("admin")),
):
    return services.approve_return_borrow(borrow_id, db)


@router.get(
    "/history",
    response_model=ResponseSchema[List[HistoryResponse]],
    tags=["borrow"],
)
def history_borrow(
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    return services.history_borrow(user, db)


@router.get(
    "/current_borrow",
    response_model=ResponseSchema[List[ActiveBorrowResponse]],
    tags=["borrow"],
)
def current_borrow(
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    return services.current_borrow(user, db)


@router.get(
    "/all_borrowed",
    response_model=ResponseSchema[List[ActiveBorrowResponse]],
    tags=["borrow"],
)
def get_all_borrowed_books(
    db: Session = Depends(get_db),
    user: User = Depends(allow_roles("admin",'borrower')),
):
    return services.get_borrow(user, db)

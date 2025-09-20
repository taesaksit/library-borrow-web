from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import List

from config.database import get_db
from schemas.response_custom import ResponseSchema
from schemas.book import BookCreate, BookUpdate, BookResponse
from models.user import User
from services import book as services
from core.oauth2 import allow_roles

router = APIRouter(prefix="/book")


@router.post(
    "/",
    response_model=ResponseSchema[BookResponse],
    tags=["book"],
)
def create_book(
    category: BookCreate,
    db: Session = Depends(get_db),
    user: User = Depends(allow_roles("admin")),
):
    return services.create_book(category, db)


@router.put(
    "/{book_id}",
    response_model=ResponseSchema[BookResponse],
    tags=["book"],
)
def update_book(
    book_id: int,
    book: BookUpdate,
    db: Session = Depends(get_db),
    user: User = Depends(allow_roles("admin")),
):
    return services.update_book(book_id, book, db)


@router.get(
    "/",
    response_model=ResponseSchema[List[BookResponse]],
    tags=["book"],
)
def get_all_books(db: Session = Depends(get_db)):
    return services.get_all_books(db)


@router.get(
    "/search",
    response_model=ResponseSchema[List[BookResponse]],
    tags=["book"],
)
def get_books_by_query(
    category_name: str = None,
    book_name: str = None,
    db: Session = Depends(get_db),
):
    return services.get_books_by_query(db, category_name, book_name)

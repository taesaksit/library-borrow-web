from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import List

from config.database import get_db
from schemas.response_custom import ResponseSchema
from schemas.category import CategoryCreate, CategoryResponse
from models.user import User
from services import category as services
from core.oauth2 import allow_roles

router = APIRouter(prefix="/category")


@router.post(
    "/",
    response_model=ResponseSchema[CategoryResponse],
    tags=["category"],
)
def create_category(
    category: CategoryCreate,
    db: Session = Depends(get_db),
    user: User = Depends(allow_roles("admin")),
):
    return services.create_category(category, db)


@router.get(
    "/",
    response_model=ResponseSchema[List[CategoryResponse]],
    tags=["category"],
)
def get_all_categories(db: Session = Depends(get_db)):
    return services.get_all_categories(db)


@router.put(
    "/{category_id}",
    response_model=ResponseSchema[CategoryResponse],
    tags=["category"],
)
def update_category(
    category_id: int,
    category: CategoryCreate,
    db: Session = Depends(get_db),
    user: User = Depends(allow_roles("admin")),
):
    return services.update_category(category_id, category, db)

from fastapi import HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy.exc import SQLAlchemyError


from models.categories import Category
from schemas.category import CategoryCreate
from schemas.response_custom import ResponseSchema


def create_category(category: CategoryCreate, db: Session) -> ResponseSchema:

    try:
        new_category = Category(name=category.name)
        db.add(new_category)
        db.commit()
        db.refresh(new_category)

    except SQLAlchemyError as e:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Database error: {str(e._message())}",
        )

    return ResponseSchema(
        status="success",
        message="Category created successfully",
        data=new_category,
    )


def get_all_categories(db: Session) -> ResponseSchema:

    try:
        categories_db = db.query(Category).all()

    except SQLAlchemyError as e:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Database error: {str(e._message())}",
        )

    return ResponseSchema(
        status="success",
        message="Categories fetched successfully",
        data=categories_db,
    )


def update_category(
    category_id: int,
    category: CategoryCreate,
    db: Session,
) -> ResponseSchema:

    try:
        category_db = db.query(Category).filter(Category.id == category_id).first()
        if not category_db:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Category not found",
            )
        category_db.name = category.name
        db.commit()
        db.refresh(category_db)

    except SQLAlchemyError as e:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Database error: {str(e._message())}",
        )

    return ResponseSchema(
        status="success",
        message="Category updated successfully",
        data=category_db,
    )

from fastapi import HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy.exc import SQLAlchemyError
from datetime import date

from models.borrow import Borrows
from models.borrow import BorrowStatus
from models.user import User
from models.book import Book
from schemas.borrow import (
    ApproveReturnBookResponse,
    BorrowCreate,
    BorrowBookResponse,
    HistoryResponse,
    ReturnBookResponse,
    ActiveBorrowResponse,
)
from schemas.response_custom import ResponseSchema


def increment_available_quantity(book_id: int, db: Session):
    try:
        book = db.query(Book).filter(Book.id == book_id).first()
        book.available_quantity += 1
        db.commit()
        db.refresh(book)

        return ResponseSchema(
            status="success",
            message="Available quantity incremented successfully",
            data=book,
        )

    except SQLAlchemyError as e:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Database error: {str(e._message())}",
        )


def decrement_available_quantity(book_id: int, db: Session):
    try:
        book = db.query(Book).filter(Book.id == book_id).first()
        book.available_quantity -= 1
        db.commit()
        db.refresh(book)

        return ResponseSchema(
            status="success",
            message="Available quantity decremented successfully",
            data=book,
        )

    except SQLAlchemyError as e:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Database error: {str(e._message())}",
        )


def get_borrow(user: User, db: Session) -> ResponseSchema:
    try:
        # Query borrows with status "borrowed" and join with book and user
        borrows = db.query(Borrows).all()

        # Create response list with book title, user name, borrow date, and due date
        responses = [
            ActiveBorrowResponse(
                borrow_id=borrow.id,
                book=borrow.book.title,
                user=borrow.user.name,
                borrow_date=borrow.borrow_date,
                due_date=borrow.due_date,
                return_date=borrow.return_date,
                status=borrow.status,
            )
            for borrow in borrows
        ]

        return ResponseSchema(
            status="success",
            message="All borrowed books retrieved successfully",
            data=responses,
        )

    except SQLAlchemyError as e:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Database error: {str(e._message())}",
        )


def create_borrow(borrow: BorrowCreate, user: User, db: Session) -> ResponseSchema:
    try:
        existing_borrow = (
            db.query(Borrows)
            .filter(
                Borrows.user_id == user.id,
                Borrows.book_id == borrow.book_id,
                Borrows.status != BorrowStatus.returned,
            )
            .first()
        )

        if existing_borrow:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="You have already borrowed this book and not returned it yet.",
            )

        decrement_available_quantity(borrow.book_id, db)
        new_borrow = Borrows(**borrow.model_dump())
        new_borrow.user_id = user.id
        db.add(new_borrow)
        db.commit()
        db.refresh(new_borrow)

        response = BorrowBookResponse(
            book=new_borrow.book.title,
            borrow_date=new_borrow.borrow_date,
            due_date=new_borrow.due_date,
            borrower=new_borrow.user.name,
        )

        return ResponseSchema(
            status="success",
            message="Borrow created successfully",
            data=response,
        )

    except SQLAlchemyError as e:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Database error: {str(e._message())}",
        )


def return_borrow(borrow_id: int, user: User, db: Session) -> ResponseSchema:
    try:
        # 1. Get & Validate
        borrow = (
            db.query(Borrows)
            .filter(Borrows.id == borrow_id)
            .filter(Borrows.user_id == user.id)
            .first()
        )

        if not borrow:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Borrow not found",
            )
        if borrow.status == BorrowStatus.waiting_approve:
            return ResponseSchema(
                status="success",
                message="waiting for approve",
            )
        if borrow.status == BorrowStatus.returned:
            return ResponseSchema(
                status="success",
                message="Borrow already returned",
                data=None,
            )

        # 2. Business Logic
        return_date = date.today()

        # 3. Perform Update
        borrow.return_date = return_date
        borrow.status = BorrowStatus.waiting_approve

        # 4. Commit & Refresh
        db.commit()
        db.refresh(borrow)

        # 5. Prepare Response
        response = ReturnBookResponse(
            borrow_id=borrow.id,
            book=borrow.book.title,
            return_date=borrow.return_date,
            status=borrow.status,
        )

        # 6. Return
        return ResponseSchema(
            status="success",
            message="Borrow returned successfully",
            data=response,
        )

    except SQLAlchemyError as e:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Database error: {str(e._message())}",
        )


def approve_return_borrow(borrow_id: int, db: Session) -> ResponseSchema:
    try:
        borrow = (
            db.query(Borrows)
            .filter(Borrows.id == borrow_id)
            .filter(Borrows.status == BorrowStatus.waiting_approve)
            .first()
        )
        if not borrow:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Borrow not found",
            )
        if borrow.status == BorrowStatus.returned:
            return ResponseSchema(
                status="success",
                message="Borrow already returned",
                data=None,
            )
        increment_available_quantity(borrow.book_id, db)
        borrow.status = BorrowStatus.returned
        db.commit()
        db.refresh(borrow)

        response = ApproveReturnBookResponse(
            borrow_id=borrow.id,
            book=borrow.book.title,
            return_date=borrow.return_date,
            status=borrow.status,
        )
        return ResponseSchema(
            status="success",
            message="Approve return book successfully",
            data=response,
        )

    except SQLAlchemyError as e:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Database error: {str(e._message())}",
        )


def history_borrow(user: User, db: Session) -> ResponseSchema:
    try:
        borrows = (
            db.query(Borrows)
            .filter(Borrows.user_id == user.id)
            .filter(Borrows.status == BorrowStatus.returned)
            .all()
        )

        # ใช้ list comprehension แทน for loop
        responses = [
            HistoryResponse(
                book=borrow.book.title,
                user=borrow.user.name,
                borrow_date=borrow.borrow_date,
                due_date=borrow.due_date,
                return_date=borrow.return_date,
                status=borrow.status,
            )
            for borrow in borrows
        ]

        return ResponseSchema(
            status="success",
            message="History borrow",
            data=responses,
        )
    except SQLAlchemyError as e:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Database error: {str(e._message())}",
        )


def current_borrow(user: User, db: Session) -> ResponseSchema:
    try:
        borrows = (
            db.query(Borrows)
            .filter(Borrows.user_id == user.id)
            .all()
        )

        # ใช้ list comprehension
        responses = [
            ActiveBorrowResponse(
                borrow_id=borrow.id,
                book=borrow.book.title,
                user=borrow.user.name,
                borrow_date=borrow.borrow_date,
                due_date=borrow.due_date,
                return_date=borrow.return_date,
                status=borrow.status,
            )
            for borrow in borrows
        ]

        return ResponseSchema(
            status="success",
            message="Current borrow",
            data=responses,
        )

    except SQLAlchemyError as e:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Database error: {str(e._message())}",
        )

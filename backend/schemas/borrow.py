from pydantic import BaseModel, Field
from typing import Optional
from datetime import date
from models import book
from models.borrow import BorrowStatus


class BorrowBase(BaseModel):
    book_id: int
    user_id: Optional[int] = None
    borrow_date: Optional[date] = Field(default_factory=date.today)
    due_date: date = None
    return_date: Optional[date] = None
    status: Optional[BorrowStatus] = BorrowStatus.borrowed


class BorrowCreate(BorrowBase):
    pass

# Custom
class BorrowBookResponse(BaseModel):
    borrower: str
    book: str
    borrow_date: date
    due_date: date

class ReturnBookResponse(BaseModel):
    borrow_id: int
    book: str
    return_date: date
    status: BorrowStatus

class ApproveReturnBookResponse(ReturnBookResponse):
    pass

class HistoryResponse(BaseModel):
    book: str
    user: str
    borrow_date: date
    due_date: date
    return_date: date
    status: BorrowStatus
    
class CurrentBorrowResponse(HistoryResponse):
    pass

class ActiveBorrowResponse(BaseModel):
    borrow_id: int
    book: str
    user: str
    borrow_date: date
    due_date: date
    return_date: Optional[date] = None
    status: BorrowStatus
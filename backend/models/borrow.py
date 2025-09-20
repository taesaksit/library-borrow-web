from sqlalchemy import Integer, Date, ForeignKey, Enum as SQLEnum
from sqlalchemy.orm import Mapped, mapped_column, relationship
from datetime import date
from config.database import Base
import enum
from typing import Optional, TYPE_CHECKING

if TYPE_CHECKING:
    from .book import Book
    from .user import User


class BorrowStatus(str, enum.Enum):
    returned = "returned"
    borrowed = "borrowed"
    waiting_approve = "waiting_approve"


class Borrows(Base):
    __tablename__ = "borrows"
    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    book_id: Mapped[int] = mapped_column(
        ForeignKey("books.id", onupdate="CASCADE", ondelete="CASCADE"),
        nullable=False,
    )
    user_id: Mapped[int] = mapped_column(
        ForeignKey("users.id", onupdate="CASCADE", ondelete="CASCADE"),
        nullable=False,
    )
    borrow_date: Mapped[date] = mapped_column(Date, nullable=False, default=date.today)
    due_date: Mapped[date] = mapped_column(Date, nullable=False)
    return_date: Mapped[Optional[date]] = mapped_column(Date, nullable=True)
    status: Mapped[BorrowStatus] = mapped_column(
        SQLEnum(BorrowStatus), nullable=False, default=BorrowStatus.borrowed
    )

    book: Mapped["Book"] = relationship("Book", back_populates="borrows")
    user: Mapped["User"] = relationship("User", back_populates="borrows")

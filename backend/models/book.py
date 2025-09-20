from sqlalchemy import  ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship
from config.database import Base
from typing import TYPE_CHECKING, List

if TYPE_CHECKING:
    from categories import Category
    from borrow import Borrows


class Book(Base):
    __tablename__ = "books"
    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    category_id: Mapped[int] = mapped_column(
        ForeignKey("categories.id", onupdate="CASCADE", ondelete="CASCADE")
    )
    title: Mapped[str] = mapped_column(nullable=False)
    author: Mapped[str] = mapped_column(nullable=False)
    year: Mapped[int] = mapped_column(nullable=False)
    quantity: Mapped[int] = mapped_column(nullable=False)
    available_quantity: Mapped[int] = mapped_column(nullable=False)

    category: Mapped["Category"] = relationship("Category", back_populates="books")
    borrows: Mapped[List["Borrows"]] = relationship("Borrows", back_populates="book")

from sqlalchemy import Integer, String
from sqlalchemy.orm import Mapped, mapped_column, relationship
from config.database import Base
from typing import List, TYPE_CHECKING

if TYPE_CHECKING:
    from .book import Book


class Category(Base):
    __tablename__ = "categories"
    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    name: Mapped[str] = mapped_column(unique=True, nullable=False)

    books: Mapped[List["Book"]] = relationship("Book", back_populates="category")

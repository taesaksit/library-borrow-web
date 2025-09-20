from sqlalchemy import Integer, String
from sqlalchemy.orm import Mapped, mapped_column, relationship
from config.database import Base
from typing import List, TYPE_CHECKING

if TYPE_CHECKING:
    from borrow import Borrows  


class User(Base):
    __tablename__ = "users"
    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    name: Mapped[str] = mapped_column(nullable=False)
    email: Mapped[str] = mapped_column(unique=True, nullable=False)
    password: Mapped[str] = mapped_column(nullable=False)
    role: Mapped[str] = mapped_column(default="borrower")

    borrows: Mapped[List["Borrows"]] = relationship("Borrows", back_populates="user")

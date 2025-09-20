from pydantic import BaseModel, constr, conint
from typing import Optional, List

from schemas.category import CategoryResponse



class BookBase(BaseModel):

    title: constr(min_length=1)
    author: Optional[constr(min_length=1)] = None
    year: Optional[conint(ge=1000, le=9999)] = None
    quantity: int
    available_quantity: Optional[int] = None


class BookCreate(BookBase):
    category_id: int


class BookUpdate(BookBase):
    category_id : int
    quantity: Optional[int] = None
    pass


class BookResponse(BookBase):
    id: int
    category: CategoryResponse
  
    class Config:
        from_attributes = True

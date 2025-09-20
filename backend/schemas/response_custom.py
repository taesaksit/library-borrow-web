from pydantic import BaseModel
from typing import Generic, TypeVar, Optional

T = TypeVar("T")


class ResponseSchema(BaseModel, Generic[T]):
    status: str
    message: str
    data: Optional[T] = None

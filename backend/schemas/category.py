from pydantic import BaseModel, constr


class CategoryCreate(BaseModel):
    name: constr(min_length=1)


class CategoryResponse(BaseModel):
    id: int
    name: constr(min_length=1)

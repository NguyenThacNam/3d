from pydantic import BaseModel


class SchoolBase(BaseModel):
    name: str
    address: str | None = None
    email: str | None = None


class SchoolCreate(SchoolBase):
    pass


class SchoolUpdate(SchoolBase):
    pass


class SchoolOut(BaseModel):
    """Khớp SchoolRow ở frontend."""

    id: int
    name: str
    address: str
    email: str
    classes: int
    students: int

from pydantic import BaseModel, EmailStr


class ProfileOut(BaseModel):
    """Khớp interface ProfileData ở frontend."""

    id: int
    roleCode: str          # admin | school | teacher | student
    name: str
    email: str
    role: str              # nhãn hiển thị tiếng Việt
    org: str
    phone: str
    joined: str            # MM/YYYY
    initials: str


class ProfileUpdate(BaseModel):
    name: str | None = None
    email: EmailStr | None = None
    phone: str | None = None

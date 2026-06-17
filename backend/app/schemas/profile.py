from pydantic import BaseModel, EmailStr, Field


class ProfileOut(BaseModel):
    """Khớp interface ProfileData ở frontend."""

    id: int
    roleCode: str          # admin | school | teacher | student
    name: str
    email: str
    username: str
    role: str              # nhãn hiển thị tiếng Việt
    org: str
    phone: str
    joined: str            # MM/YYYY
    initials: str


class ProfileUpdate(BaseModel):
    name: str | None = None
    email: EmailStr | None = None
    phone: str | None = None


class PasswordChange(BaseModel):
    current_password: str
    new_password: str = Field(min_length=6, description="Mật khẩu mới tối thiểu 6 ký tự")

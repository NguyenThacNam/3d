from pydantic import BaseModel, EmailStr

from app.models.enums import StudentStatus


# ----- Giáo viên -----
class TeacherCreate(BaseModel):
    name: str
    email: EmailStr | None = None
    username: str | None = None  # để trống sẽ tự sinh từ họ tên
    subject: str | None = None
    password: str | None = None  # mặc định nếu để trống


class TeacherUpdate(BaseModel):
    name: str | None = None
    email: EmailStr | None = None
    username: str | None = None
    subject: str | None = None


class TeacherOut(BaseModel):
    id: int
    name: str
    email: str
    username: str
    subject: str
    classes: int


# ----- Học sinh -----
class StudentCreate(BaseModel):
    name: str
    email: EmailStr | None = None
    username: str | None = None  # để trống sẽ tự sinh từ họ tên
    class_id: int | None = None
    status: StudentStatus = StudentStatus.active
    password: str | None = None


class StudentUpdate(BaseModel):
    name: str | None = None
    email: EmailStr | None = None
    username: str | None = None
    class_id: int | None = None
    status: StudentStatus | None = None


class StudentOut(BaseModel):
    id: int
    name: str
    email: str
    username: str
    className: str
    class_id: int | None
    status: str


# Một dòng trong file Excel nhập học sinh
class StudentImportRow(BaseModel):
    name: str
    email: str | None = None
    username: str | None = None
    className: str | None = None
    status: str | None = None


class StudentImportResult(BaseModel):
    created: int
    skipped: int
    students: list[StudentOut]


class PasswordResetOut(BaseModel):
    password: str  # mật khẩu mới để trường thông báo cho học sinh

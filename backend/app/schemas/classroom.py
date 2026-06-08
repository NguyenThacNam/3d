from pydantic import BaseModel


class ClassCreate(BaseModel):
    name: str
    grade: str | None = None
    teacher_profile_id: int | None = None


class ClassUpdate(ClassCreate):
    pass


class ClassOut(BaseModel):
    """Khớp ClassRow ở frontend."""

    id: int
    name: str
    grade: str
    teacher: str               # tên GV chủ nhiệm (rỗng nếu chưa gán)
    teacher_profile_id: int | None
    students: int

from pydantic import BaseModel


# ----- Quản trị: bảng khóa học (khớp CourseRow) -----
class CourseCreate(BaseModel):
    title: str
    subject: str | None = None
    level: str | None = None
    description: str | None = None
    gradient: str | None = None
    published: bool = False


class CourseUpdate(CourseCreate):
    pass


class CourseAdminOut(BaseModel):
    id: int
    title: str
    subject: str
    level: str
    description: str
    lessons: int
    published: bool
    coverUrl: str | None


# ----- Quản trị bài học -----
class LessonCreate(BaseModel):
    title: str
    description: str | None = None
    order: int | None = None
    durationMin: int = 10


class LessonUpdate(BaseModel):
    title: str | None = None
    description: str | None = None
    order: int | None = None
    durationMin: int | None = None


# ----- Học tập: chi tiết khóa học / bài học / thí nghiệm -----
class ExperimentOut(BaseModel):
    id: int
    name: str
    htmlPath: str
    description: str


class LessonOut(BaseModel):
    id: int
    title: str
    description: str
    order: int
    durationMin: int
    experiment: ExperimentOut | None


class CourseSummaryOut(BaseModel):
    """Thẻ khóa học trên trang chủ."""

    id: int
    title: str
    subject: str
    level: str
    gradient: str
    coverUrl: str | None
    description: str
    lessons: int


class CourseDetailOut(BaseModel):
    id: int
    title: str
    subject: str
    level: str
    gradient: str
    coverUrl: str | None
    description: str
    lessons: list[LessonOut]

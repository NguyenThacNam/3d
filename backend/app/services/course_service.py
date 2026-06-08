import uuid
from pathlib import Path

from sqlalchemy import or_, select
from sqlalchemy.orm import Session, selectinload

from app.core.config import settings
from app.core.exceptions import AppError, ForbiddenError, NotFoundError
from app.models.course import Course
from app.models.enums import Role
from app.models.user import User
from app.repositories.course_repo import CourseRepository
from app.schemas.common import Page
from app.schemas.course import (
    CourseAdminOut,
    CourseCreate,
    CourseDetailOut,
    CourseSummaryOut,
    CourseUpdate,
)
from app.services.pagination import page_count, paginate
from app.services.serializers import course_admin_out, course_detail_out, course_summary_out


class CourseService:
    def __init__(self, db: Session):
        self.db = db
        self.courses = CourseRepository(db)

    def _get(self, course_id: int) -> Course:
        c = self.courses.get(course_id)
        if not c:
            raise NotFoundError("Không tìm thấy khóa học.")
        return c

    # ----- Quản trị -----
    def list_admin(self, q: str | None = None, page: int = 1, page_size: int = 10) -> Page[CourseAdminOut]:
        stmt = select(Course).options(selectinload(Course.lessons))
        if q:
            like = f"%{q}%"
            stmt = stmt.where(or_(Course.title.ilike(like), Course.subject.ilike(like), Course.level.ilike(like)))
        stmt = stmt.order_by(Course.id)
        rows, total = paginate(self.db, stmt, page, page_size)
        items = [course_admin_out(c) for c in rows]
        return Page[CourseAdminOut](items=items, total=total, page=page, pageSize=page_size, pages=page_count(total, page_size))

    def create(self, data: CourseCreate) -> CourseAdminOut:
        c = Course(
            title=data.title,
            subject=data.subject,
            level=data.level,
            description=data.description,
            gradient=data.gradient,
            is_published=data.published,
        )
        self.courses.add(c)
        self.courses.commit()
        return course_admin_out(c)

    def update(self, course_id: int, data: CourseUpdate) -> CourseAdminOut:
        c = self._get(course_id)
        c.title = data.title
        c.subject = data.subject
        c.level = data.level
        c.description = data.description
        if data.gradient is not None:
            c.gradient = data.gradient
        c.is_published = data.published
        self.courses.commit()
        return course_admin_out(c)

    def delete(self, course_id: int) -> None:
        self.courses.delete(self._get(course_id))
        self.courses.commit()

    def upload_cover(self, course_id: int, filename: str, content: bytes) -> CourseAdminOut:
        """Lưu ảnh nền và gắn vào khóa học."""
        c = self._get(course_id)
        ext = Path(filename).suffix.lower()
        if ext not in {".png", ".jpg", ".jpeg", ".webp", ".gif"}:
            raise AppError("Chỉ chấp nhận ảnh .png, .jpg, .jpeg, .webp, .gif.")
        dest_dir = Path(settings.UPLOAD_DIR) / "covers"
        dest_dir.mkdir(parents=True, exist_ok=True)
        stored_name = f"{uuid.uuid4().hex}{ext}"
        (dest_dir / stored_name).write_bytes(content)
        c.cover_path = f"covers/{stored_name}"
        self.courses.commit()
        return course_admin_out(c)

    # ----- Học tập (theo phân quyền) -----
    def _visible_courses(self, user: User) -> list[Course]:
        """Khóa học người dùng được phép xem."""
        if user.role == Role.admin:
            return self.courses.list()
        if user.role == Role.school and user.school:
            return list(user.school.courses)
        if user.role == Role.teacher and user.teacher_profile:
            seen: dict[int, Course] = {}
            for cls in user.teacher_profile.classes:
                for c in cls.courses:
                    seen[c.id] = c
            return list(seen.values())
        if user.role == Role.student and user.student_profile and user.student_profile.classroom:
            return list(user.student_profile.classroom.courses)
        return []

    def home(self, user: User) -> list[CourseSummaryOut]:
        return [course_summary_out(c) for c in self._visible_courses(user)]

    def detail(self, user: User, course_id: int) -> CourseDetailOut:
        allowed = {c.id for c in self._visible_courses(user)}
        if course_id not in allowed:
            raise ForbiddenError("Khóa học chưa được gán cho lớp/trường của bạn.")
        return course_detail_out(self._get(course_id))

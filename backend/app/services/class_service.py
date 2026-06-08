from __future__ import annotations

from sqlalchemy import or_, select
from sqlalchemy.orm import Session, joinedload, selectinload

from app.core.exceptions import NotFoundError
from app.models.classroom import Classroom
from app.repositories.class_repo import ClassRepository
from app.repositories.course_repo import CourseRepository
from app.repositories.school_repo import SchoolRepository
from app.schemas.assignment import AssignmentsMap
from app.schemas.classroom import ClassCreate, ClassOut, ClassUpdate
from app.schemas.common import Page
from app.schemas.course import CourseSummaryOut
from app.services.pagination import page_count, paginate
from app.services.serializers import class_out, course_summary_out


class ClassService:
    def __init__(self, db: Session):
        self.db = db
        self.classes = ClassRepository(db)
        self.courses = CourseRepository(db)
        self.schools = SchoolRepository(db)

    def _get(self, class_id: int) -> Classroom:
        c = self.classes.get(class_id)
        if not c:
            raise NotFoundError("Không tìm thấy lớp học.")
        return c

    def list(self, school_id: int, q: str | None = None, page: int = 1, page_size: int = 10) -> Page[ClassOut]:
        stmt = (
            select(Classroom)
            .where(Classroom.school_id == school_id)
            .options(joinedload(Classroom.teacher), selectinload(Classroom.students))
        )
        if q:
            like = f"%{q}%"
            stmt = stmt.where(or_(Classroom.name.ilike(like), Classroom.grade.ilike(like)))
        stmt = stmt.order_by(Classroom.id)
        rows, total = paginate(self.db, stmt, page, page_size)
        items = [class_out(c) for c in rows]
        return Page[ClassOut](items=items, total=total, page=page, pageSize=page_size, pages=page_count(total, page_size))

    def create(self, school_id: int, data: ClassCreate) -> ClassOut:
        c = Classroom(
            name=data.name,
            grade=data.grade,
            school_id=school_id,
            teacher_profile_id=data.teacher_profile_id,
        )
        self.classes.add(c)
        self.classes.commit()
        return class_out(c)

    def update(self, class_id: int, data: ClassUpdate) -> ClassOut:
        c = self._get(class_id)
        c.name = data.name
        c.grade = data.grade
        c.teacher_profile_id = data.teacher_profile_id
        self.classes.commit()
        return class_out(c)

    def delete(self, class_id: int) -> None:
        self.classes.delete(self._get(class_id))
        self.classes.commit()

    # ----- Khóa học khả dụng của trường (đã được hệ thống phân bổ) -----
    def school_available_courses(self, school_id: int) -> list[CourseSummaryOut]:
        s = self.schools.get(school_id)
        if not s:
            raise NotFoundError("Không tìm thấy trường học.")
        return [course_summary_out(c) for c in s.courses]

    # ----- Gán khóa học cho lớp -----
    def assignments(self, school_id: int) -> AssignmentsMap:
        return {str(c.id): [course.id for course in c.courses] for c in self.classes.list_by_school(school_id)}

    def set_courses(self, class_id: int, course_ids: list[int]) -> list[int]:
        c = self._get(class_id)
        # Chỉ cho phép gán khóa học đã được phân bổ cho trường của lớp
        allowed = {course.id for course in c.school.courses}
        c.courses = [course for cid in course_ids if cid in allowed and (course := self.courses.get(cid))]
        self.classes.commit()
        return [course.id for course in c.courses]

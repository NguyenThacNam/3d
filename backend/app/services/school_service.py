from __future__ import annotations

from sqlalchemy import func, or_, select
from sqlalchemy.orm import Session, selectinload

from app.core.exceptions import NotFoundError
from app.models.profiles import StudentProfile
from app.models.school import School
from app.repositories.course_repo import CourseRepository
from app.repositories.school_repo import SchoolRepository
from app.schemas.assignment import AssignmentsMap
from app.schemas.common import Page
from app.schemas.school import SchoolCreate, SchoolOut, SchoolUpdate
from app.services.pagination import page_count, paginate
from app.services.serializers import school_out


class SchoolService:
    def __init__(self, db: Session):
        self.db = db
        self.schools = SchoolRepository(db)
        self.courses = CourseRepository(db)

    def _get(self, school_id: int) -> School:
        s = self.schools.get(school_id)
        if not s:
            raise NotFoundError("Không tìm thấy trường học.")
        return s

    def _student_count(self, school_id: int) -> int:
        return self.db.scalar(
            select(func.count(StudentProfile.id)).where(StudentProfile.school_id == school_id)
        ) or 0

    def list(self, q: str | None = None, page: int = 1, page_size: int = 10) -> Page[SchoolOut]:
        stmt = select(School).options(selectinload(School.classes))
        if q:
            like = f"%{q}%"
            stmt = stmt.where(or_(School.name.ilike(like), School.address.ilike(like), School.email.ilike(like)))
        stmt = stmt.order_by(School.id)
        rows, total = paginate(self.db, stmt, page, page_size)
        # Đếm học sinh theo trường bằng MỘT truy vấn group-by (thay vì N query)
        counts = dict(
            self.db.execute(
                select(StudentProfile.school_id, func.count(StudentProfile.id)).group_by(
                    StudentProfile.school_id
                )
            ).all()
        )
        items = [school_out(s, counts.get(s.id, 0)) for s in rows]
        return Page[SchoolOut](items=items, total=total, page=page, pageSize=page_size, pages=page_count(total, page_size))

    def create(self, data: SchoolCreate) -> SchoolOut:
        s = School(name=data.name, address=data.address, email=data.email)
        self.schools.add(s)
        self.schools.commit()
        return school_out(s, self._student_count(s.id))

    def update(self, school_id: int, data: SchoolUpdate) -> SchoolOut:
        s = self._get(school_id)
        s.name, s.address, s.email = data.name, data.address, data.email
        self.schools.commit()
        return school_out(s, self._student_count(s.id))

    def delete(self, school_id: int) -> None:
        self.schools.delete(self._get(school_id))
        self.schools.commit()

    # ----- Gán khóa học cho trường -----
    def assignments(self) -> AssignmentsMap:
        return {str(s.id): [c.id for c in s.courses] for s in self.schools.list()}

    def set_courses(self, school_id: int, course_ids: list[int]) -> list[int]:
        s = self._get(school_id)
        s.courses = [c for cid in course_ids if (c := self.courses.get(cid))]
        self.schools.commit()
        return [c.id for c in s.courses]

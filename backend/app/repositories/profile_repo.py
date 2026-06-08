from sqlalchemy import select
from sqlalchemy.orm import joinedload, selectinload

from app.models.profiles import StudentProfile, TeacherProfile
from app.repositories.base import BaseRepository


class StudentRepository(BaseRepository[StudentProfile]):
    model = StudentProfile

    def list_by_school(self, school_id: int) -> list[StudentProfile]:
        # Nạp sẵn user + lớp để tránh N+1
        return list(
            self.db.scalars(
                select(StudentProfile)
                .where(StudentProfile.school_id == school_id)
                .options(joinedload(StudentProfile.user), joinedload(StudentProfile.classroom))
                .order_by(StudentProfile.id)
            ).all()
        )


class TeacherRepository(BaseRepository[TeacherProfile]):
    model = TeacherProfile

    def list_by_school(self, school_id: int) -> list[TeacherProfile]:
        # Nạp sẵn user + các lớp phụ trách để tránh N+1
        return list(
            self.db.scalars(
                select(TeacherProfile)
                .where(TeacherProfile.school_id == school_id)
                .options(joinedload(TeacherProfile.user), selectinload(TeacherProfile.classes))
                .order_by(TeacherProfile.id)
            ).all()
        )

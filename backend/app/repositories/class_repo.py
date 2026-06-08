from sqlalchemy import select
from sqlalchemy.orm import joinedload, selectinload

from app.models.classroom import Classroom
from app.repositories.base import BaseRepository


class ClassRepository(BaseRepository[Classroom]):
    model = Classroom

    def list_by_school(self, school_id: int) -> list[Classroom]:
        # Nạp sẵn GV chủ nhiệm + danh sách HS để tránh N+1
        return list(
            self.db.scalars(
                select(Classroom)
                .where(Classroom.school_id == school_id)
                .options(joinedload(Classroom.teacher), selectinload(Classroom.students))
                .order_by(Classroom.id)
            ).all()
        )

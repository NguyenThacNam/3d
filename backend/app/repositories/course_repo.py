from __future__ import annotations

from sqlalchemy import select
from sqlalchemy.orm import selectinload

from app.models.course import Course
from app.repositories.base import BaseRepository


class CourseRepository(BaseRepository[Course]):
    model = Course

    def list(self) -> list[Course]:
        # Nạp sẵn bài học để đếm số bài không gây N+1
        return list(
            self.db.scalars(
                select(Course).options(selectinload(Course.lessons)).order_by(Course.id)
            ).all()
        )

    def list_published(self) -> list[Course]:
        return list(
            self.db.scalars(
                select(Course)
                .where(Course.is_published.is_(True))
                .options(selectinload(Course.lessons))
                .order_by(Course.id)
            ).all()
        )

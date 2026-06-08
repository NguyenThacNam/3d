from __future__ import annotations

from sqlalchemy import select
from sqlalchemy.orm import selectinload

from app.models.school import School
from app.repositories.base import BaseRepository


class SchoolRepository(BaseRepository[School]):
    model = School

    def list(self) -> list[School]:
        # Nạp sẵn danh sách lớp để tránh N+1 khi đếm số lớp mỗi trường
        return list(
            self.db.scalars(
                select(School).options(selectinload(School.classes)).order_by(School.id)
            ).all()
        )

from __future__ import annotations

from typing import TYPE_CHECKING

from sqlalchemy import String
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.core.database import Base
from app.models._mixins import TimestampMixin
from app.models.associations import school_courses

if TYPE_CHECKING:
    from app.models.classroom import Classroom
    from app.models.course import Course
    from app.models.user import User


class School(TimestampMixin, Base):
    __tablename__ = "schools"

    id: Mapped[int] = mapped_column(primary_key=True)
    name: Mapped[str] = mapped_column(String(255), nullable=False)
    address: Mapped[str | None] = mapped_column(String(255))
    email: Mapped[str | None] = mapped_column(String(255))

    classes: Mapped[list["Classroom"]] = relationship(
        back_populates="school", cascade="all, delete-orphan"
    )
    users: Mapped[list["User"]] = relationship(back_populates="school")
    courses: Mapped[list["Course"]] = relationship(
        secondary=school_courses, back_populates="schools"
    )

from __future__ import annotations

from typing import TYPE_CHECKING

from sqlalchemy import Boolean, String, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.core.database import Base
from app.models._mixins import TimestampMixin
from app.models.associations import class_courses, school_courses

if TYPE_CHECKING:
    from app.models.classroom import Classroom
    from app.models.lesson import Lesson
    from app.models.school import School


class Course(TimestampMixin, Base):
    __tablename__ = "courses"

    id: Mapped[int] = mapped_column(primary_key=True)
    title: Mapped[str] = mapped_column(String(255), nullable=False)
    description: Mapped[str | None] = mapped_column(Text)
    subject: Mapped[str | None] = mapped_column(String(100))
    level: Mapped[str | None] = mapped_column(String(50))
    gradient: Mapped[str | None] = mapped_column(String(100))  # phục vụ hiển thị frontend
    cover_path: Mapped[str | None] = mapped_column(String(500))  # ảnh nền khóa học (upload)
    is_published: Mapped[bool] = mapped_column(Boolean, default=False, nullable=False)

    lessons: Mapped[list["Lesson"]] = relationship(
        back_populates="course",
        cascade="all, delete-orphan",
        order_by="Lesson.lesson_order",
    )
    schools: Mapped[list["School"]] = relationship(secondary=school_courses, back_populates="courses")
    classes: Mapped[list["Classroom"]] = relationship(secondary=class_courses, back_populates="courses")

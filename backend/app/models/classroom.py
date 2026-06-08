from __future__ import annotations

from typing import TYPE_CHECKING

from sqlalchemy import ForeignKey, String
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.core.database import Base
from app.models._mixins import TimestampMixin
from app.models.associations import class_courses

if TYPE_CHECKING:
    from app.models.course import Course
    from app.models.profiles import StudentProfile, TeacherProfile
    from app.models.school import School


class Classroom(TimestampMixin, Base):
    __tablename__ = "classes"

    id: Mapped[int] = mapped_column(primary_key=True)
    name: Mapped[str] = mapped_column(String(100), nullable=False)
    grade: Mapped[str | None] = mapped_column(String(20))

    school_id: Mapped[int] = mapped_column(ForeignKey("schools.id", ondelete="CASCADE"), nullable=False, index=True)
    school: Mapped["School"] = relationship(back_populates="classes")

    teacher_profile_id: Mapped[int | None] = mapped_column(
        ForeignKey("teacher_profiles.id", ondelete="SET NULL"), index=True
    )
    teacher: Mapped["TeacherProfile | None"] = relationship(back_populates="classes")

    students: Mapped[list["StudentProfile"]] = relationship(back_populates="classroom")
    courses: Mapped[list["Course"]] = relationship(
        secondary=class_courses, back_populates="classes"
    )

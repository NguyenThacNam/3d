from __future__ import annotations

from typing import TYPE_CHECKING

from sqlalchemy import ForeignKey, Integer, String, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.core.database import Base
from app.models._mixins import TimestampMixin

if TYPE_CHECKING:
    from app.models.course import Course
    from app.models.experiment import Experiment


class Lesson(TimestampMixin, Base):
    __tablename__ = "lessons"

    id: Mapped[int] = mapped_column(primary_key=True)
    course_id: Mapped[int] = mapped_column(ForeignKey("courses.id", ondelete="CASCADE"), nullable=False, index=True)
    title: Mapped[str] = mapped_column(String(255), nullable=False)
    description: Mapped[str | None] = mapped_column(Text)
    lesson_order: Mapped[int] = mapped_column(Integer, default=1, nullable=False)
    duration_min: Mapped[int] = mapped_column(Integer, default=10, nullable=False)

    experiment_id: Mapped[int | None] = mapped_column(ForeignKey("experiments.id", ondelete="SET NULL"))

    course: Mapped["Course"] = relationship(back_populates="lessons")
    experiment: Mapped["Experiment | None"] = relationship(back_populates="lessons")

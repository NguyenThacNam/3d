from __future__ import annotations

import uuid
from pathlib import Path

from sqlalchemy import select
from sqlalchemy.orm import Session

from app.core.config import settings
from app.core.exceptions import AppError, NotFoundError
from app.models.course import Course
from app.models.experiment import Experiment
from app.models.lesson import Lesson
from app.repositories.course_repo import CourseRepository
from app.repositories.lesson_repo import ExperimentRepository, LessonRepository
from app.schemas.course import LessonCreate, LessonOut, LessonUpdate
from app.services.serializers import lesson_out

ALLOWED_EXT = {".htm", ".html"}


class LessonService:
    def __init__(self, db: Session):
        self.db = db
        self.courses = CourseRepository(db)
        self.lessons = LessonRepository(db)
        self.experiments = ExperimentRepository(db)

    def _course(self, course_id: int) -> Course:
        c = self.courses.get(course_id)
        if not c:
            raise NotFoundError("Không tìm thấy khóa học.")
        return c

    def _lesson(self, lesson_id: int) -> Lesson:
        lsn = self.lessons.get(lesson_id)
        if not lsn:
            raise NotFoundError("Không tìm thấy bài học.")
        return lsn

    def list_by_course(self, course_id: int) -> list[LessonOut]:
        self._course(course_id)
        rows = self.db.scalars(
            select(Lesson).where(Lesson.course_id == course_id).order_by(Lesson.lesson_order)
        ).all()
        return [lesson_out(lsn) for lsn in rows]

    def create(self, course_id: int, data: LessonCreate) -> LessonOut:
        self._course(course_id)
        order = data.order
        if order is None:
            existing = self.db.scalars(select(Lesson.lesson_order).where(Lesson.course_id == course_id)).all()
            order = (max(existing) + 1) if existing else 1
        lsn = Lesson(
            course_id=course_id,
            title=data.title,
            description=data.description,
            lesson_order=order,
            duration_min=data.durationMin,
        )
        self.lessons.add(lsn)
        self.lessons.commit()
        return lesson_out(lsn)

    def update(self, lesson_id: int, data: LessonUpdate) -> LessonOut:
        lsn = self._lesson(lesson_id)
        if data.title is not None:
            lsn.title = data.title
        if data.description is not None:
            lsn.description = data.description
        if data.order is not None:
            lsn.lesson_order = data.order
        if data.durationMin is not None:
            lsn.duration_min = data.durationMin
        self.lessons.commit()
        return lesson_out(lsn)

    def delete(self, lesson_id: int) -> None:
        self.lessons.delete(self._lesson(lesson_id))
        self.lessons.commit()

    def attach_experiment(self, lesson_id: int, filename: str, content: bytes) -> LessonOut:
        """Lưu file HTML thí nghiệm và gắn vào bài học."""
        lsn = self._lesson(lesson_id)
        ext = Path(filename).suffix.lower()
        if ext not in ALLOWED_EXT:
            raise AppError("Chỉ chấp nhận file .htm hoặc .html.")

        dest_dir = Path(settings.UPLOAD_DIR) / "experiments"
        dest_dir.mkdir(parents=True, exist_ok=True)
        stored_name = f"{uuid.uuid4().hex}{ext}"
        (dest_dir / stored_name).write_bytes(content)

        rel_path = f"experiments/{stored_name}"
        display_name = Path(filename).name

        if lsn.experiment:
            lsn.experiment.name = display_name
            lsn.experiment.html_path = rel_path
        else:
            exp = Experiment(name=display_name, html_path=rel_path, description="")
            self.experiments.add(exp)
            self.db.flush()
            lsn.experiment_id = exp.id
        self.lessons.commit()
        self.db.refresh(lsn)
        return lesson_out(lsn)

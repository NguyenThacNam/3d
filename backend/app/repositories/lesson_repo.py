from app.models.experiment import Experiment
from app.models.lesson import Lesson
from app.repositories.base import BaseRepository


class LessonRepository(BaseRepository[Lesson]):
    model = Lesson


class ExperimentRepository(BaseRepository[Experiment]):
    model = Experiment

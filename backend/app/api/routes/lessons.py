from fastapi import APIRouter, Depends, File, UploadFile
from sqlalchemy.orm import Session

from app.api.deps import require_roles
from app.core.database import get_db
from app.models.enums import Role
from app.schemas.course import LessonCreate, LessonOut, LessonUpdate
from app.services.lesson_service import LessonService

router = APIRouter(tags=["lessons"], dependencies=[Depends(require_roles(Role.admin))])


@router.get("/courses/{course_id}/lessons", response_model=list[LessonOut])
def list_lessons(course_id: int, db: Session = Depends(get_db)):
    return LessonService(db).list_by_course(course_id)


@router.post("/courses/{course_id}/lessons", response_model=LessonOut, status_code=201)
def create_lesson(course_id: int, data: LessonCreate, db: Session = Depends(get_db)):
    return LessonService(db).create(course_id, data)


@router.put("/lessons/{lesson_id}", response_model=LessonOut)
def update_lesson(lesson_id: int, data: LessonUpdate, db: Session = Depends(get_db)):
    return LessonService(db).update(lesson_id, data)


@router.delete("/lessons/{lesson_id}", status_code=204)
def delete_lesson(lesson_id: int, db: Session = Depends(get_db)):
    LessonService(db).delete(lesson_id)


@router.post("/lessons/{lesson_id}/experiment", response_model=LessonOut)
async def upload_experiment(lesson_id: int, file: UploadFile = File(...), db: Session = Depends(get_db)):
    """Upload file HTML thí nghiệm 3D và gắn vào bài học."""
    content = await file.read()
    return LessonService(db).attach_experiment(lesson_id, file.filename or "experiment.htm", content)

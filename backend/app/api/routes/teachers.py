from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session

from app.api.deps import get_scope_school_id, require_roles
from app.core.database import get_db
from app.models.enums import Role
from app.models.user import User
from app.schemas.common import Page
from app.schemas.people import TeacherCreate, TeacherOut, TeacherUpdate
from app.services.people_service import TeacherService

router = APIRouter(prefix="/teachers", tags=["teachers"])
school_user = Depends(require_roles(Role.school))


@router.get("", response_model=Page[TeacherOut])
def list_teachers(
    page: int = Query(1, ge=1),
    page_size: int = Query(10, ge=1, le=1000),
    q: str | None = None,
    user: User = school_user,
    db: Session = Depends(get_db),
):
    return TeacherService(db).list(get_scope_school_id(user), q=q, page=page, page_size=page_size)


@router.post("", response_model=TeacherOut, status_code=201)
def create_teacher(data: TeacherCreate, user: User = school_user, db: Session = Depends(get_db)):
    return TeacherService(db).create(get_scope_school_id(user), data)


@router.put("/{teacher_id}", response_model=TeacherOut)
def update_teacher(teacher_id: int, data: TeacherUpdate, user: User = school_user, db: Session = Depends(get_db)):
    return TeacherService(db).update(teacher_id, data)


@router.delete("/{teacher_id}", status_code=204)
def delete_teacher(teacher_id: int, user: User = school_user, db: Session = Depends(get_db)):
    TeacherService(db).delete(teacher_id)

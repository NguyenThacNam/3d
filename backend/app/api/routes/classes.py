from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session

from app.api.deps import get_scope_school_id, require_roles
from app.core.database import get_db
from app.models.enums import Role
from app.models.user import User
from app.schemas.assignment import AssignUpdate, AssignmentsMap
from app.schemas.classroom import ClassCreate, ClassOut, ClassUpdate
from app.schemas.common import Page
from app.schemas.course import CourseSummaryOut
from app.services.class_service import ClassService

router = APIRouter(prefix="/classes", tags=["classes"])

# Cho phép vai trò 'school'
school_user = Depends(require_roles(Role.school))


@router.get("", response_model=Page[ClassOut])
def list_classes(
    page: int = Query(1, ge=1),
    page_size: int = Query(10, ge=1, le=1000),
    q: str | None = None,
    user: User = school_user,
    db: Session = Depends(get_db),
):
    return ClassService(db).list(get_scope_school_id(user), q=q, page=page, page_size=page_size)


@router.post("", response_model=ClassOut, status_code=201)
def create_class(data: ClassCreate, user: User = school_user, db: Session = Depends(get_db)):
    return ClassService(db).create(get_scope_school_id(user), data)


@router.put("/{class_id}", response_model=ClassOut)
def update_class(class_id: int, data: ClassUpdate, user: User = school_user, db: Session = Depends(get_db)):
    return ClassService(db).update(class_id, data)


@router.delete("/{class_id}", status_code=204)
def delete_class(class_id: int, user: User = school_user, db: Session = Depends(get_db)):
    ClassService(db).delete(class_id)


@router.get("/available-courses", response_model=list[CourseSummaryOut])
def available_courses(user: User = school_user, db: Session = Depends(get_db)):
    """Khóa học đã được hệ thống phân bổ cho trường (để gán cho lớp)."""
    return ClassService(db).school_available_courses(get_scope_school_id(user))


@router.get("/assignments", response_model=AssignmentsMap)
def class_assignments(user: User = school_user, db: Session = Depends(get_db)):
    return ClassService(db).assignments(get_scope_school_id(user))


@router.put("/{class_id}/courses", response_model=list[int])
def set_class_courses(class_id: int, data: AssignUpdate, user: User = school_user, db: Session = Depends(get_db)):
    return ClassService(db).set_courses(class_id, data.course_ids)

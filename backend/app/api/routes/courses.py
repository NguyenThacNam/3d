from fastapi import APIRouter, Depends, File, Query, UploadFile
from sqlalchemy.orm import Session

from app.api.deps import require_roles
from app.core.database import get_db
from app.models.enums import Role
from app.schemas.common import Page
from app.schemas.course import CourseAdminOut, CourseCreate, CourseUpdate
from app.services.course_service import CourseService

router = APIRouter(prefix="/courses", tags=["courses"], dependencies=[Depends(require_roles(Role.admin))])


@router.get("", response_model=Page[CourseAdminOut])
def list_courses(
    page: int = Query(1, ge=1),
    page_size: int = Query(10, ge=1, le=1000),
    q: str | None = None,
    db: Session = Depends(get_db),
):
    return CourseService(db).list_admin(q=q, page=page, page_size=page_size)


@router.post("", response_model=CourseAdminOut, status_code=201)
def create_course(data: CourseCreate, db: Session = Depends(get_db)):
    return CourseService(db).create(data)


@router.put("/{course_id}", response_model=CourseAdminOut)
def update_course(course_id: int, data: CourseUpdate, db: Session = Depends(get_db)):
    return CourseService(db).update(course_id, data)


@router.delete("/{course_id}", status_code=204)
def delete_course(course_id: int, db: Session = Depends(get_db)):
    CourseService(db).delete(course_id)


@router.post("/{course_id}/cover", response_model=CourseAdminOut)
async def upload_cover(course_id: int, file: UploadFile = File(...), db: Session = Depends(get_db)):
    """Upload ảnh nền cho khóa học."""
    content = await file.read()
    return CourseService(db).upload_cover(course_id, file.filename or "cover.png", content)

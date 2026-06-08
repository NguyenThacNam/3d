from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.api.deps import get_current_user
from app.core.database import get_db
from app.models.user import User
from app.schemas.course import CourseDetailOut, CourseSummaryOut
from app.services.course_service import CourseService

router = APIRouter(prefix="/learning", tags=["learning"])


@router.get("/courses", response_model=list[CourseSummaryOut])
def my_courses(user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    """Khóa học người dùng được phép xem (theo phân quyền role / lớp)."""
    return CourseService(db).home(user)


@router.get("/courses/{course_id}", response_model=CourseDetailOut)
def course_detail(course_id: int, user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    return CourseService(db).detail(user, course_id)

from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session

from app.api.deps import require_roles
from app.core.database import get_db
from app.models.enums import Role
from app.schemas.assignment import AssignUpdate, AssignmentsMap
from app.schemas.common import Page
from app.schemas.school import SchoolCreate, SchoolOut, SchoolUpdate
from app.services.school_service import SchoolService

router = APIRouter(prefix="/schools", tags=["schools"], dependencies=[Depends(require_roles(Role.admin))])


@router.get("", response_model=Page[SchoolOut])
def list_schools(
    page: int = Query(1, ge=1),
    page_size: int = Query(10, ge=1, le=1000),
    q: str | None = None,
    db: Session = Depends(get_db),
):
    return SchoolService(db).list(q=q, page=page, page_size=page_size)


@router.post("", response_model=SchoolOut, status_code=201)
def create_school(data: SchoolCreate, db: Session = Depends(get_db)):
    return SchoolService(db).create(data)


@router.put("/{school_id}", response_model=SchoolOut)
def update_school(school_id: int, data: SchoolUpdate, db: Session = Depends(get_db)):
    return SchoolService(db).update(school_id, data)


@router.delete("/{school_id}", status_code=204)
def delete_school(school_id: int, db: Session = Depends(get_db)):
    SchoolService(db).delete(school_id)


@router.get("/assignments", response_model=AssignmentsMap)
def school_assignments(db: Session = Depends(get_db)):
    return SchoolService(db).assignments()


@router.put("/{school_id}/courses", response_model=list[int])
def set_school_courses(school_id: int, data: AssignUpdate, db: Session = Depends(get_db)):
    return SchoolService(db).set_courses(school_id, data.course_ids)

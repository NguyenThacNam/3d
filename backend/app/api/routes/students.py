from fastapi import APIRouter, Depends, File, Query, UploadFile
from fastapi.responses import StreamingResponse
from sqlalchemy.orm import Session

from app.api.deps import get_scope_school_id, require_roles
from app.core.database import get_db
from app.models.enums import Role
from app.models.user import User
from app.schemas.common import Page
from app.schemas.people import StudentCreate, StudentImportResult, StudentOut, StudentUpdate
from app.services.excel import build_template, parse_students
from app.services.people_service import StudentService

router = APIRouter(prefix="/students", tags=["students"])
school_user = Depends(require_roles(Role.school))


@router.get("", response_model=Page[StudentOut])
def list_students(
    page: int = Query(1, ge=1),
    page_size: int = Query(10, ge=1, le=1000),
    q: str | None = None,
    user: User = school_user,
    db: Session = Depends(get_db),
):
    return StudentService(db).list(get_scope_school_id(user), q=q, page=page, page_size=page_size)


@router.post("", response_model=StudentOut, status_code=201)
def create_student(data: StudentCreate, user: User = school_user, db: Session = Depends(get_db)):
    return StudentService(db).create(get_scope_school_id(user), data)


@router.put("/{student_id}", response_model=StudentOut)
def update_student(student_id: int, data: StudentUpdate, user: User = school_user, db: Session = Depends(get_db)):
    return StudentService(db).update(student_id, get_scope_school_id(user), data)


@router.delete("/{student_id}", status_code=204)
def delete_student(student_id: int, user: User = school_user, db: Session = Depends(get_db)):
    StudentService(db).delete(student_id)


@router.get("/template")
def download_template(_: User = school_user):
    """Tải file Excel mẫu để nhập học sinh."""
    content = build_template()
    return StreamingResponse(
        iter([content]),
        media_type="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        headers={"Content-Disposition": 'attachment; filename="mau-danh-sach-hoc-sinh.xlsx"'},
    )


@router.post("/import", response_model=StudentImportResult)
async def import_students(
    file: UploadFile = File(...),
    user: User = school_user,
    db: Session = Depends(get_db),
):
    """Nhập học sinh hàng loạt từ file Excel/CSV."""
    content = await file.read()
    rows = parse_students(content)
    return StudentService(db).bulk_import(get_scope_school_id(user), rows)

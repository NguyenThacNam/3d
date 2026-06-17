from __future__ import annotations

from sqlalchemy import or_, select
from sqlalchemy.orm import Session, joinedload, selectinload

from app.core.exceptions import AppError, ConflictError, NotFoundError
from app.core.security import hash_password
from app.models.classroom import Classroom
from app.models.enums import Role, StudentStatus
from app.models.profiles import StudentProfile, TeacherProfile
from app.models.user import User
from app.repositories.profile_repo import StudentRepository, TeacherRepository
from app.repositories.user_repo import UserRepository
from app.schemas.common import Page
from app.schemas.people import (
    StudentCreate,
    StudentImportResult,
    StudentImportRow,
    StudentOut,
    StudentUpdate,
    TeacherCreate,
    TeacherOut,
    TeacherUpdate,
)
from app.services.pagination import page_count, paginate
from app.services.serializers import student_out, teacher_out
from app.services.usernames import (
    is_valid_username,
    normalize_username,
    slugify_username,
    unique_username,
)

DEFAULT_PASSWORD = "123456"

INVALID_USERNAME_MSG = (
    "Tên đăng nhập chỉ gồm chữ thường, số và . _ - (tối thiểu 3 ký tự, không chứa @)."
)


def resolve_username(users: UserRepository, provided: str | None, name: str) -> str:
    """Trả về username hợp lệ, duy nhất. Tự sinh từ họ tên nếu không nhập."""
    if provided and provided.strip():
        u = normalize_username(provided)
        if not is_valid_username(u):
            raise AppError(INVALID_USERNAME_MSG)
        if users.get_by_username(u):
            raise ConflictError("Tên đăng nhập đã tồn tại.")
        return u
    base = slugify_username(name)
    return unique_username(base, lambda c: users.get_by_username(c) is not None)


def check_new_email(users: UserRepository, email: str | None) -> str | None:
    """Kiểm tra email chưa bị dùng. Trả về None nếu để trống."""
    if not email:
        return None
    if users.get_by_email(email):
        raise ConflictError("Email đã tồn tại.")
    return email


class TeacherService:
    def __init__(self, db: Session):
        self.db = db
        self.teachers = TeacherRepository(db)
        self.users = UserRepository(db)

    def _get(self, teacher_id: int) -> TeacherProfile:
        t = self.teachers.get(teacher_id)
        if not t:
            raise NotFoundError("Không tìm thấy giáo viên.")
        return t

    def list(self, school_id: int, q: str | None = None, page: int = 1, page_size: int = 10) -> Page[TeacherOut]:
        stmt = (
            select(TeacherProfile)
            .where(TeacherProfile.school_id == school_id)
            .options(joinedload(TeacherProfile.user), selectinload(TeacherProfile.classes))
        )
        if q:
            like = f"%{q}%"
            stmt = stmt.join(TeacherProfile.user).where(
                or_(TeacherProfile.name.ilike(like), TeacherProfile.subject.ilike(like), User.email.ilike(like))
            )
        stmt = stmt.order_by(TeacherProfile.id)
        rows, total = paginate(self.db, stmt, page, page_size)
        items = [teacher_out(t) for t in rows]
        return Page[TeacherOut](items=items, total=total, page=page, pageSize=page_size, pages=page_count(total, page_size))

    def create(self, school_id: int, data: TeacherCreate) -> TeacherOut:
        email = check_new_email(self.users, data.email)
        username = resolve_username(self.users, data.username, data.name)
        user = User(
            email=email,
            username=username,
            password_hash=hash_password(data.password or DEFAULT_PASSWORD),
            full_name=data.name,
            role=Role.teacher,
            school_id=school_id,
        )
        self.users.add(user)
        profile = TeacherProfile(user=user, name=data.name, subject=data.subject, school_id=school_id)
        self.teachers.add(profile)
        self.teachers.commit()
        return teacher_out(profile)

    def update(self, teacher_id: int, data: TeacherUpdate) -> TeacherOut:
        t = self._get(teacher_id)
        if data.name is not None:
            t.name = data.name
            if t.user:
                t.user.full_name = data.name
        if data.email is not None and t.user and data.email != t.user.email:
            t.user.email = check_new_email(self.users, data.email)
        if data.username is not None and t.user:
            u = normalize_username(data.username)
            if u != (t.user.username or ""):
                if not is_valid_username(u):
                    raise AppError(INVALID_USERNAME_MSG)
                if self.users.get_by_username(u):
                    raise ConflictError("Tên đăng nhập đã tồn tại.")
                t.user.username = u
        if data.subject is not None:
            t.subject = data.subject
        self.teachers.commit()
        return teacher_out(t)

    def delete(self, teacher_id: int) -> None:
        t = self._get(teacher_id)
        user = t.user
        self.teachers.delete(t)
        if user:
            self.db.delete(user)
        self.teachers.commit()


class StudentService:
    def __init__(self, db: Session):
        self.db = db
        self.students = StudentRepository(db)
        self.users = UserRepository(db)

    def _get(self, student_id: int) -> StudentProfile:
        s = self.students.get(student_id)
        if not s:
            raise NotFoundError("Không tìm thấy học sinh.")
        return s

    def _class_in_school(self, class_id: int | None, school_id: int) -> Classroom | None:
        if not class_id:
            return None
        cls = self.db.get(Classroom, class_id)
        if cls and cls.school_id == school_id:
            return cls
        return None

    def list(self, school_id: int, q: str | None = None, page: int = 1, page_size: int = 10) -> Page[StudentOut]:
        stmt = (
            select(StudentProfile)
            .where(StudentProfile.school_id == school_id)
            .options(joinedload(StudentProfile.user), joinedload(StudentProfile.classroom))
        )
        if q:
            like = f"%{q}%"
            stmt = (
                stmt.join(StudentProfile.user)
                .outerjoin(StudentProfile.classroom)
                .where(or_(StudentProfile.name.ilike(like), User.email.ilike(like), Classroom.name.ilike(like)))
            )
        stmt = stmt.order_by(StudentProfile.id)
        rows, total = paginate(self.db, stmt, page, page_size)
        items = [student_out(s) for s in rows]
        return Page[StudentOut](items=items, total=total, page=page, pageSize=page_size, pages=page_count(total, page_size))

    def create(self, school_id: int, data: StudentCreate) -> StudentOut:
        email = check_new_email(self.users, data.email)
        username = resolve_username(self.users, data.username, data.name)
        cls = self._class_in_school(data.class_id, school_id)
        user = User(
            email=email,
            username=username,
            password_hash=hash_password(data.password or DEFAULT_PASSWORD),
            full_name=data.name,
            role=Role.student,
            school_id=school_id,
        )
        self.users.add(user)
        profile = StudentProfile(
            user=user,
            name=data.name,
            school_id=school_id,
            class_id=cls.id if cls else None,
            classroom=cls,
            status=data.status,
        )
        self.students.add(profile)
        self.students.commit()
        return student_out(profile)

    def update(self, student_id: int, school_id: int, data: StudentUpdate) -> StudentOut:
        s = self._get(student_id)
        if data.name is not None:
            s.name = data.name
            if s.user:
                s.user.full_name = data.name
        if data.email is not None and s.user and data.email != s.user.email:
            s.user.email = check_new_email(self.users, data.email)
        if data.username is not None and s.user:
            u = normalize_username(data.username)
            if u != (s.user.username or ""):
                if not is_valid_username(u):
                    raise AppError(INVALID_USERNAME_MSG)
                if self.users.get_by_username(u):
                    raise ConflictError("Tên đăng nhập đã tồn tại.")
                s.user.username = u
        if data.class_id is not None:
            cls = self._class_in_school(data.class_id, school_id)
            s.classroom = cls
            s.class_id = cls.id if cls else None
        if data.status is not None:
            s.status = data.status
        self.students.commit()
        return student_out(s)

    def delete(self, student_id: int) -> None:
        s = self._get(student_id)
        user = s.user
        self.students.delete(s)
        if user:
            self.db.delete(user)
        self.students.commit()

    def reset_password(self, student_id: int, school_id: int) -> str:
        """Đặt lại mật khẩu học sinh về mặc định. Trả về mật khẩu mới."""
        s = self._get(student_id)
        if s.school_id != school_id:
            raise NotFoundError("Không tìm thấy học sinh.")
        if s.user:
            s.user.password_hash = hash_password(DEFAULT_PASSWORD)
        self.students.commit()
        return DEFAULT_PASSWORD

    # ----- Nhập Excel hàng loạt -----
    def bulk_import(self, school_id: int, rows: list[StudentImportRow]) -> StudentImportResult:
        # map tên lớp (chữ thường) → Classroom trong trường
        classes = {
            c.name.strip().lower(): c
            for c in self.db.scalars(select(Classroom).where(Classroom.school_id == school_id)).all()
        }
        created: list[StudentProfile] = []
        skipped = 0
        for row in rows:
            name = (row.name or "").strip()
            if not name:
                skipped += 1
                continue
            email = (row.email or "").strip().lower() or None
            if email and self.users.get_by_email(email):
                skipped += 1
                continue
            # username: nhập sẵn (kiểm tra hợp lệ + trùng) hoặc tự sinh từ tên
            provided = (row.username or "").strip()
            if provided:
                username = normalize_username(provided)
                if not is_valid_username(username) or self.users.get_by_username(username):
                    skipped += 1
                    continue
            else:
                username = unique_username(
                    slugify_username(name), lambda c: self.users.get_by_username(c) is not None
                )
            cls = classes.get((row.className or "").strip().lower())
            status = (
                StudentStatus.inactive
                if (row.status or "").strip().lower() in {"inactive", "tạm nghỉ", "tam nghi", "nghỉ", "nghi"}
                else StudentStatus.active
            )
            user = User(
                email=email,
                username=username,
                password_hash=hash_password(DEFAULT_PASSWORD),
                full_name=name,
                role=Role.student,
                school_id=school_id,
            )
            self.users.add(user)
            profile = StudentProfile(
                user=user, name=name, school_id=school_id,
                class_id=cls.id if cls else None, classroom=cls, status=status,
            )
            self.students.add(profile)
            created.append(profile)
        self.students.commit()
        return StudentImportResult(
            created=len(created), skipped=skipped, students=[student_out(s) for s in created]
        )

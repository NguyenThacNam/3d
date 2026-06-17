"""Chuyển đổi ORM entity → Pydantic schema (DTO) cho frontend."""

from app.models.classroom import Classroom
from app.models.course import Course
from app.models.enums import Role
from app.models.lesson import Lesson
from app.models.profiles import StudentProfile, TeacherProfile
from app.models.school import School
from app.models.user import User
from app.schemas.classroom import ClassOut
from app.schemas.course import (
    CourseAdminOut,
    CourseDetailOut,
    CourseSummaryOut,
    ExperimentOut,
    LessonOut,
)
from app.schemas.people import StudentOut, TeacherOut
from app.schemas.profile import ProfileOut
from app.schemas.school import SchoolOut

ROLE_LABELS = {
    Role.admin: "Quản trị hệ thống",
    Role.school: "Quản trị trường",
    Role.teacher: "Giáo viên",
    Role.student: "Học sinh",
}


def initials_of(name: str, email: str) -> str:
    parts = [p for p in name.strip().split() if p]
    if len(parts) >= 2:
        return (parts[0][0] + parts[-1][0]).upper()
    if parts:
        return parts[0][:2].upper()
    return email[:2].upper()


def profile_out(user: User) -> ProfileOut:
    if user.role == Role.admin:
        org = "3D Learning Platform"
    elif user.role == Role.student and user.student_profile:
        sp = user.student_profile
        cls = sp.classroom.name if sp.classroom else ""
        school_name = sp.user.school.name if sp.user.school else ""
        org = f"{school_name} · {cls}".strip(" ·") or "—"
    else:
        org = user.school.name if user.school else "—"

    identifier = user.email or user.username or ""
    return ProfileOut(
        id=user.id,
        roleCode=user.role.value,
        name=user.full_name or identifier,
        email=user.email or "",
        username=user.username or "",
        role=ROLE_LABELS[user.role],
        org=org,
        phone=user.phone or "",
        joined=user.created_at.strftime("%m/%Y") if user.created_at else "",
        initials=initials_of(user.full_name or "", identifier),
    )


def school_out(s: School, students_count: int) -> SchoolOut:
    return SchoolOut(
        id=s.id,
        name=s.name,
        address=s.address or "",
        email=s.email or "",
        classes=len(s.classes),
        students=students_count,
    )


def asset_url(path: str | None) -> str | None:
    if not path:
        return None
    if path.startswith(("http://", "https://", "/uploads/")):
        return path
    return f"/uploads/{path.lstrip('/')}"


def course_admin_out(c: Course) -> CourseAdminOut:
    return CourseAdminOut(
        id=c.id,
        title=c.title,
        subject=c.subject or "",
        level=c.level or "",
        description=c.description or "",
        lessons=len(c.lessons),
        published=c.is_published,
        coverUrl=asset_url(c.cover_path),
    )


def course_summary_out(c: Course) -> CourseSummaryOut:
    return CourseSummaryOut(
        id=c.id,
        title=c.title,
        subject=c.subject or "",
        level=c.level or "",
        gradient=c.gradient or "from-indigo-500 to-violet-600",
        coverUrl=asset_url(c.cover_path),
        description=c.description or "",
        lessons=len(c.lessons),
    )


def experiment_html_url(html_path: str) -> str:
    """Chuẩn hóa đường dẫn file thí nghiệm thành URL phục vụ tĩnh."""
    if html_path.startswith(("http://", "https://", "/uploads/")):
        return html_path
    return f"/uploads/{html_path.lstrip('/')}"


def experiment_out(lesson: Lesson) -> ExperimentOut | None:
    e = lesson.experiment
    if not e:
        return None
    return ExperimentOut(
        id=e.id, name=e.name, htmlPath=experiment_html_url(e.html_path), description=e.description or ""
    )


def lesson_out(lesson: Lesson) -> LessonOut:
    return LessonOut(
        id=lesson.id,
        title=lesson.title,
        description=lesson.description or "",
        order=lesson.lesson_order,
        durationMin=lesson.duration_min,
        experiment=experiment_out(lesson),
    )


def course_detail_out(c: Course) -> CourseDetailOut:
    return CourseDetailOut(
        id=c.id,
        title=c.title,
        subject=c.subject or "",
        level=c.level or "",
        gradient=c.gradient or "from-indigo-500 to-violet-600",
        coverUrl=asset_url(c.cover_path),
        description=c.description or "",
        lessons=[lesson_out(lsn) for lsn in c.lessons],
    )


def class_out(c: Classroom) -> ClassOut:
    return ClassOut(
        id=c.id,
        name=c.name,
        grade=c.grade or "",
        teacher=c.teacher.name if c.teacher else "",
        teacher_profile_id=c.teacher_profile_id,
        students=len(c.students),
    )


def teacher_out(t: TeacherProfile) -> TeacherOut:
    return TeacherOut(
        id=t.id,
        name=t.name,
        email=(t.user.email or "") if t.user else "",
        username=(t.user.username or "") if t.user else "",
        subject=t.subject or "",
        classes=len(t.classes),
    )


def student_out(s: StudentProfile) -> StudentOut:
    return StudentOut(
        id=s.id,
        name=s.name,
        email=(s.user.email or "") if s.user else "",
        username=(s.user.username or "") if s.user else "",
        className=s.classroom.name if s.classroom else "",
        class_id=s.class_id,
        status=s.status.value,
    )

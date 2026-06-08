"""Import tất cả model để Base.metadata nhận diện đầy đủ bảng."""

from app.models.associations import class_courses, school_courses
from app.models.classroom import Classroom
from app.models.course import Course
from app.models.enums import Role, StudentStatus
from app.models.experiment import Experiment
from app.models.lesson import Lesson
from app.models.profiles import StudentProfile, TeacherProfile
from app.models.school import School
from app.models.user import User

__all__ = [
    "Classroom",
    "Course",
    "Experiment",
    "Lesson",
    "Role",
    "School",
    "StudentProfile",
    "StudentStatus",
    "TeacherProfile",
    "User",
    "class_courses",
    "school_courses",
]

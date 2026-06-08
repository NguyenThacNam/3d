import enum


class Role(str, enum.Enum):
    admin = "admin"      # quản trị hệ thống
    school = "school"    # quản trị trường (đối tác)
    teacher = "teacher"
    student = "student"


class StudentStatus(str, enum.Enum):
    active = "active"
    inactive = "inactive"

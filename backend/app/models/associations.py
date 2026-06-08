from sqlalchemy import Column, DateTime, ForeignKey, Integer, Table, UniqueConstraint, func

from app.core.database import Base

# Trường ⇄ Khóa học (admin gán khóa học cho trường)
school_courses = Table(
    "school_courses",
    Base.metadata,
    Column("id", Integer, primary_key=True, autoincrement=True),
    Column("school_id", ForeignKey("schools.id", ondelete="CASCADE"), nullable=False),
    Column("course_id", ForeignKey("courses.id", ondelete="CASCADE"), nullable=False),
    Column("assigned_at", DateTime(timezone=True), server_default=func.now()),
    UniqueConstraint("school_id", "course_id", name="uq_school_course"),
)

# Lớp ⇄ Khóa học (trường gán khóa học cho lớp)
class_courses = Table(
    "class_courses",
    Base.metadata,
    Column("id", Integer, primary_key=True, autoincrement=True),
    Column("class_id", ForeignKey("classes.id", ondelete="CASCADE"), nullable=False),
    Column("course_id", ForeignKey("courses.id", ondelete="CASCADE"), nullable=False),
    Column("assigned_at", DateTime(timezone=True), server_default=func.now()),
    UniqueConstraint("class_id", "course_id", name="uq_class_course"),
)

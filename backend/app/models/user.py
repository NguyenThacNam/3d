from __future__ import annotations

from typing import TYPE_CHECKING

from sqlalchemy import Enum as SAEnum
from sqlalchemy import ForeignKey, String
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.core.database import Base
from app.models._mixins import TimestampMixin
from app.models.enums import Role

if TYPE_CHECKING:
    from app.models.profiles import StudentProfile, TeacherProfile
    from app.models.school import School


class User(TimestampMixin, Base):
    __tablename__ = "users"

    id: Mapped[int] = mapped_column(primary_key=True)
    # Định danh đăng nhập: dùng email HOẶC username. Email có thể trống với học sinh nhỏ tuổi.
    email: Mapped[str | None] = mapped_column(String(255), unique=True, index=True)
    username: Mapped[str | None] = mapped_column(String(150), unique=True, index=True)
    password_hash: Mapped[str] = mapped_column(String(255), nullable=False)
    full_name: Mapped[str] = mapped_column(String(255), nullable=False, default="")
    role: Mapped[Role] = mapped_column(SAEnum(Role, name="role"), nullable=False)
    phone: Mapped[str | None] = mapped_column(String(50))

    school_id: Mapped[int | None] = mapped_column(ForeignKey("schools.id", ondelete="SET NULL"), index=True)
    school: Mapped["School | None"] = relationship(back_populates="users")

    student_profile: Mapped["StudentProfile | None"] = relationship(
        back_populates="user", cascade="all, delete-orphan", uselist=False
    )
    teacher_profile: Mapped["TeacherProfile | None"] = relationship(
        back_populates="user", cascade="all, delete-orphan", uselist=False
    )

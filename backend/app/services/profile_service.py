from sqlalchemy.orm import Session

from app.core.exceptions import AuthError, ConflictError
from app.core.security import hash_password, verify_password
from app.models.enums import Role
from app.models.user import User
from app.repositories.user_repo import UserRepository
from app.schemas.profile import ProfileOut, ProfileUpdate
from app.services.serializers import profile_out


class ProfileService:
    def __init__(self, db: Session):
        self.db = db
        self.users = UserRepository(db)

    def me(self, user: User) -> ProfileOut:
        return profile_out(user)

    def update(self, user: User, data: ProfileUpdate) -> ProfileOut:
        if data.email and data.email != user.email:
            if self.users.get_by_email(data.email):
                raise ConflictError("Email đã được sử dụng.")
            user.email = data.email
        if data.name is not None:
            user.full_name = data.name
            # đồng bộ tên ở hồ sơ tương ứng
            if user.role == Role.student and user.student_profile:
                user.student_profile.name = data.name
            if user.role == Role.teacher and user.teacher_profile:
                user.teacher_profile.name = data.name
        if data.phone is not None:
            user.phone = data.phone
        self.users.commit()
        self.db.refresh(user)
        return profile_out(user)

    def change_password(self, user: User, current_password: str, new_password: str) -> None:
        if not verify_password(current_password, user.password_hash):
            raise AuthError("Mật khẩu hiện tại không đúng.")
        if verify_password(new_password, user.password_hash):
            raise ConflictError("Mật khẩu mới phải khác mật khẩu hiện tại.")
        user.password_hash = hash_password(new_password)
        self.users.commit()

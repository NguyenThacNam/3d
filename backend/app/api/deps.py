from collections.abc import Callable

from fastapi import Depends
from fastapi.security import OAuth2PasswordBearer
from jose import JWTError
from sqlalchemy.orm import Session

from app.core.config import settings
from app.core.database import get_db
from app.core.exceptions import AuthError, ForbiddenError
from app.core.security import decode_access_token
from app.models.enums import Role
from app.models.user import User
from app.repositories.user_repo import UserRepository

oauth2_scheme = OAuth2PasswordBearer(tokenUrl=f"{settings.API_PREFIX}/auth/login", auto_error=False)


def get_current_user(
    token: str | None = Depends(oauth2_scheme),
    db: Session = Depends(get_db),
) -> User:
    if not token:
        raise AuthError("Chưa đăng nhập.")
    try:
        payload = decode_access_token(token)
        user_id = int(payload.get("sub", 0))
    except (JWTError, ValueError, TypeError) as exc:
        raise AuthError("Phiên đăng nhập không hợp lệ.") from exc

    user = UserRepository(db).get(user_id)
    if not user:
        raise AuthError("Tài khoản không tồn tại.")
    return user


def require_roles(*roles: Role) -> Callable[[User], User]:
    """Tạo dependency kiểm tra vai trò người dùng."""

    def checker(user: User = Depends(get_current_user)) -> User:
        if user.role not in roles:
            raise ForbiddenError()
        return user

    return checker


def get_scope_school_id(user: User) -> int:
    """Lấy school_id mà tài khoản 'school' đang quản trị."""
    if user.school_id is None:
        raise ForbiddenError("Tài khoản chưa gắn với trường nào.")
    return user.school_id

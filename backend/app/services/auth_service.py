from sqlalchemy.orm import Session

from app.core.exceptions import AuthError
from app.core.security import create_access_token, verify_password
from app.models.user import User
from app.repositories.user_repo import UserRepository
from app.schemas.auth import TokenResponse
from app.services.serializers import profile_out


class AuthService:
    def __init__(self, db: Session):
        self.db = db
        self.users = UserRepository(db)

    def authenticate(self, email: str, password: str) -> User:
        user = self.users.get_by_email(email)
        if not user or not verify_password(password, user.password_hash):
            raise AuthError()
        return user

    def login(self, email: str, password: str) -> TokenResponse:
        user = self.authenticate(email, password)
        token = create_access_token(subject=user.id, role=user.role.value)
        return TokenResponse(access_token=token, role=user.role.value, user=profile_out(user))

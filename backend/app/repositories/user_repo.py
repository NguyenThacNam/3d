from sqlalchemy import select

from app.models.user import User
from app.repositories.base import BaseRepository


class UserRepository(BaseRepository[User]):
    model = User

    def get_by_email(self, email: str) -> User | None:
        return self.db.scalar(select(User).where(User.email == email))

    def get_by_username(self, username: str) -> User | None:
        return self.db.scalar(select(User).where(User.username == username))

    def get_by_identifier(self, identifier: str) -> User | None:
        """Tìm user theo email (nếu có '@') hoặc username."""
        ident = identifier.strip()
        if "@" in ident:
            return self.get_by_email(ident)
        return self.get_by_username(ident.lower())

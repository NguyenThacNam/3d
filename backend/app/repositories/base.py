from typing import Generic, TypeVar

from sqlalchemy import select
from sqlalchemy.orm import Session

from app.core.database import Base

ModelT = TypeVar("ModelT", bound=Base)


class BaseRepository(Generic[ModelT]):
    """CRUD chung cho mọi entity. Các repo con kế thừa và bổ sung truy vấn riêng."""

    model: type[ModelT]

    def __init__(self, db: Session):
        self.db = db

    def get(self, id: int) -> ModelT | None:
        return self.db.get(self.model, id)

    def list(self) -> list[ModelT]:
        return list(self.db.scalars(select(self.model).order_by(self.model.id)).all())

    def add(self, obj: ModelT) -> ModelT:
        self.db.add(obj)
        self.db.flush()
        return obj

    def delete(self, obj: ModelT) -> None:
        self.db.delete(obj)
        self.db.flush()

    def commit(self) -> None:
        self.db.commit()

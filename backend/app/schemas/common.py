from typing import Generic, TypeVar

from pydantic import BaseModel

T = TypeVar("T")


class Page(BaseModel, Generic[T]):
    """Kết quả phân trang chuẩn cho mọi danh sách."""

    items: list[T]
    total: int
    page: int
    pageSize: int
    pages: int

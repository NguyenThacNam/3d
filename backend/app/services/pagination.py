import math

from sqlalchemy import Select, func, select
from sqlalchemy.orm import Session


def paginate(db: Session, stmt: Select, page: int, page_size: int) -> tuple[list, int]:
    """Đếm tổng (bỏ order_by) rồi lấy đúng trang. Trả (rows, total)."""
    total = db.scalar(select(func.count()).select_from(stmt.order_by(None).subquery())) or 0
    rows = list(db.scalars(stmt.limit(page_size).offset((page - 1) * page_size)).all())
    return rows, total


def page_count(total: int, page_size: int) -> int:
    return max(1, math.ceil(total / page_size)) if page_size else 1

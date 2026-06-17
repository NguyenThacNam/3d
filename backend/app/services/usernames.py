"""Tiện ích sinh và kiểm tra tên đăng nhập (username).

Username dùng làm định danh đăng nhập thay thế email (cho học sinh không có email).
Quy ước: chỉ gồm chữ thường a-z, số, và . _ - ; KHÔNG chứa '@' để phân biệt với email.
"""

import re
import unicodedata
from typing import Callable

USERNAME_RE = re.compile(r"^[a-z0-9._-]{3,150}$")


def strip_accents(text: str) -> str:
    """Bỏ dấu tiếng Việt: 'Đỗ Minh Khôi' -> 'Do Minh Khoi'."""
    text = text.replace("đ", "d").replace("Đ", "D")
    nfkd = unicodedata.normalize("NFD", text)
    return "".join(c for c in nfkd if not unicodedata.combining(c))


def normalize_username(username: str) -> str:
    """Chuẩn hóa username người dùng nhập: bỏ khoảng trắng, về chữ thường."""
    return username.strip().lower()


def is_valid_username(username: str) -> bool:
    return bool(USERNAME_RE.match(username)) and "@" not in username


def slugify_username(name: str) -> str:
    """Sinh username gốc từ họ tên. 'Đỗ Minh Khôi' -> 'do.minh.khoi'."""
    base = strip_accents(name).lower()
    base = re.sub(r"[^a-z0-9]+", ".", base).strip(".")
    if len(base) < 3:
        base = (base + "user")[:3] if base else "user"
    return base[:140]


def unique_username(base: str, exists: Callable[[str], bool]) -> str:
    """Thêm hậu tố số nếu trùng: base, base2, base3, ... cho đến khi không tồn tại."""
    candidate = base
    i = 1
    while exists(candidate):
        i += 1
        candidate = f"{base}{i}"
    return candidate

from pydantic import BaseModel

from app.schemas.profile import ProfileOut


class LoginRequest(BaseModel):
    # Định danh đăng nhập: email hoặc username
    identifier: str
    password: str


class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    role: str
    user: ProfileOut

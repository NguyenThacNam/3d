from pydantic import BaseModel, EmailStr

from app.schemas.profile import ProfileOut


class LoginRequest(BaseModel):
    email: EmailStr
    password: str


class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    role: str
    user: ProfileOut

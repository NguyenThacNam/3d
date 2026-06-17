from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.api.deps import get_current_user
from app.core.database import get_db
from app.models.user import User
from app.schemas.auth import LoginRequest, TokenResponse
from app.schemas.profile import ProfileOut
from app.services.auth_service import AuthService
from app.services.serializers import profile_out

router = APIRouter(prefix="/auth", tags=["auth"])


@router.post("/login", response_model=TokenResponse)
def login(payload: LoginRequest, db: Session = Depends(get_db)):
    return AuthService(db).login(payload.identifier, payload.password)


@router.get("/me", response_model=ProfileOut)
def me(user: User = Depends(get_current_user)):
    return profile_out(user)

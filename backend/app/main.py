from contextlib import asynccontextmanager
from pathlib import Path

from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from fastapi.staticfiles import StaticFiles
from sqlalchemy.exc import IntegrityError, ProgrammingError

import app.models  # noqa: F401  (đăng ký toàn bộ bảng vào Base.metadata)
from app.api.router import api_router
from app.core.config import settings
from app.core.database import Base, engine
from app.core.exceptions import AppError

UPLOAD_PATH = Path(settings.UPLOAD_DIR)


@asynccontextmanager
async def lifespan(_: FastAPI):
    # Prototype: tự tạo bảng nếu chưa có. Production nên dùng Alembic migration.
    # Chạy nhiều worker → khi DB mới, các worker có thể cùng lúc tạo schema/enum
    # và đua nhau (CREATE TYPE trùng). Bắt lỗi để worker thua không bị chết.
    try:
        Base.metadata.create_all(bind=engine)
    except (IntegrityError, ProgrammingError):
        pass  # worker khác đã tạo schema đồng thời — bỏ qua
    (UPLOAD_PATH / "experiments").mkdir(parents=True, exist_ok=True)
    yield


app = FastAPI(title=settings.PROJECT_NAME, lifespan=lifespan)

# Phục vụ file thí nghiệm 3D đã upload (iframe nạp từ đây)
UPLOAD_PATH.mkdir(parents=True, exist_ok=True)
app.mount("/uploads", StaticFiles(directory=str(UPLOAD_PATH)), name="uploads")

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins_list,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.exception_handler(AppError)
async def app_error_handler(_: Request, exc: AppError):
    return JSONResponse(status_code=exc.status_code, content={"detail": exc.message})


@app.get("/health", tags=["health"])
def health():
    return {"status": "ok", "name": settings.PROJECT_NAME}


app.include_router(api_router, prefix=settings.API_PREFIX)

from functools import lru_cache

from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    """Cấu hình ứng dụng, nạp từ biến môi trường / file .env."""

    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8", extra="ignore")

    PROJECT_NAME: str = "3D Learning API"
    API_PREFIX: str = "/api"

    DATABASE_URL: str = "postgresql+psycopg://postgres:postgres@localhost:5432/learning3d"

    # Tinh chỉnh connection pool (chịu tải đồng thời tốt hơn)
    DB_POOL_SIZE: int = 20
    DB_MAX_OVERFLOW: int = 40
    DB_POOL_TIMEOUT: int = 30
    DB_POOL_RECYCLE: int = 1800

    SECRET_KEY: str = "change-me"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 720

    CORS_ORIGINS: str = "http://localhost:5173,http://localhost:4173"

    # Thư mục lưu file thí nghiệm 3D (.htm) được upload, phục vụ tĩnh tại /uploads
    UPLOAD_DIR: str = "uploads"

    FIRST_ADMIN_EMAIL: str = "admin@3dlearning.vn"
    FIRST_ADMIN_PASSWORD: str = "admin123"

    @property
    def cors_origins_list(self) -> list[str]:
        return [o.strip() for o in self.CORS_ORIGINS.split(",") if o.strip()]


@lru_cache
def get_settings() -> Settings:
    return Settings()


settings = get_settings()

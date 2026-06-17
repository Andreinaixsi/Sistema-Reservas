from pydantic_settings import BaseSettings
from typing import List

class Settings(BaseSettings):
    # Base de datos
    DATABASE_URL: str = "postgresql://neondb_owner:npg_hZMu9n4IypcR@ep-rough-wave-apxrl7in-pooler.c-7.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require"
    
    # Seguridad y JWT
    SECRET_KEY: str = "super-secret-key-for-development-change-in-production"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24  # 1 día

    # CORS
    CORS_ORIGINS: List[str] = ["http://localhost:5173", "http://127.0.0.1:5173"]

    class Config:
        env_file = ".env"
        case_sensitive = True

settings = Settings()

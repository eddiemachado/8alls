"""Application configuration."""
from pydantic_settings import BaseSettings
from typing import List


class Settings(BaseSettings):
    """Application settings."""

    # API
    API_TITLE: str = "8alls API"
    API_VERSION: str = "1.0.0"
    API_KEY: str = "dev-key-change-in-production"

    # Database
    DATABASE_URL: str = "sqlite:///./8alls.db"

    # CORS
    CORS_ORIGINS: List[str] = [
        "http://localhost:3000",
        "http://localhost:3001",
    ]

    # Environment
    ENVIRONMENT: str = "development"

    class Config:
        env_file = ".env"
        case_sensitive = True


settings = Settings()

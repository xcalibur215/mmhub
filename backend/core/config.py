import json
from typing import List, Optional

from pydantic import AnyHttpUrl, field_validator
from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    # App Info
    APP_NAME: str = "mmeverything"
    JWT_ISSUER: str = "mmeverything"
    DEBUG: bool = True
    ENVIRONMENT: str = "development"
    API_V1_STR: str = "/api/v1"

    # JWT Settings
    SECRET_KEY: str = "your-super-secret-key-here-change-in-production"
    JWT_ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    REFRESH_TOKEN_EXPIRE_DAYS: int = 7

    # Database
    DATABASE_URL: str = "postgresql://username:password@localhost:5432/mmhub_db"

    # CORS
    BACKEND_CORS_ORIGINS: List[AnyHttpUrl] = [
        "http://localhost:3000",
        "http://localhost:8080",
        "http://localhost:8081",
    ]

    @field_validator("BACKEND_CORS_ORIGINS", mode="before")
    @classmethod
    def assemble_cors_origins(cls, v: "str | List[str]") -> List[str]:  # type: ignore[valid-type]
        """Allow BACKEND_CORS_ORIGINS to be provided as:
        - Comma separated string: "http://localhost:3000,http://localhost:8081"
        - JSON list string: "[\"http://localhost:3000\", \"http://localhost:8081\"]"
        - Already a list
        Returns a list of origins.
        """
        # Already a list
        if isinstance(v, list):
            return v
        if isinstance(v, str):
            value = v.strip()
            # JSON-style list
            if value.startswith("[") and value.endswith("]"):
                try:
                    parsed = json.loads(value)
                    if isinstance(parsed, list):
                        return parsed
                except json.JSONDecodeError:
                    # Fall back to splitting if JSON parsing fails
                    pass
            # Comma separated list
            return [i.strip() for i in value.split(",") if i.strip()]
        raise ValueError("Invalid BACKEND_CORS_ORIGINS value")

    # Email Settings
    SMTP_TLS: bool = True
    SMTP_PORT: int = 587
    SMTP_HOST: Optional[str] = None
    SMTP_USER: Optional[str] = None
    SMTP_PASSWORD: Optional[str] = None
    EMAILS_FROM_EMAIL: Optional[str] = None
    EMAILS_FROM_NAME: Optional[str] = None

    # Storage Settings (AWS S3)
    AWS_ACCESS_KEY_ID: Optional[str] = None
    AWS_SECRET_ACCESS_KEY: Optional[str] = None
    AWS_REGION: str = "us-east-1"
    S3_BUCKET: Optional[str] = None

    # Cloudinary (alternative to S3)
    CLOUDINARY_CLOUD_NAME: Optional[str] = None
    CLOUDINARY_API_KEY: Optional[str] = None
    CLOUDINARY_API_SECRET: Optional[str] = None

    # Search Settings (Meilisearch)
    MEILISEARCH_URL: str = "http://localhost:7700"
    MEILISEARCH_MASTER_KEY: Optional[str] = None

    # Payment Settings (Stripe)
    STRIPE_SECRET_KEY: Optional[str] = None
    STRIPE_PUBLISHABLE_KEY: Optional[str] = None
    STRIPE_WEBHOOK_SECRET: Optional[str] = None

    # Redis Settings
    REDIS_URL: str = "redis://localhost:6379/0"

    # Pagination
    DEFAULT_PAGE_SIZE: int = 20
    MAX_PAGE_SIZE: int = 100

    # File Upload Settings
    MAX_UPLOAD_SIZE: int = 10 * 1024 * 1024  # 10MB
    ALLOWED_IMAGE_TYPES: List[str] = ["image/jpeg", "image/png", "image/webp"]

    # Property Settings
    MAX_PROPERTY_PHOTOS: int = 20

    class Config:
        env_file = ".env"
        case_sensitive = True


# Create a single instance of settings
settings = Settings()

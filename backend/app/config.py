"""
Application configuration for FastAPI backend
Centralized environment and settings management
"""

import os
from typing import List
from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    """Application settings from environment variables"""

    # API Configuration
    TITLE: str = "EcoAI Carbon Twin API"
    DESCRIPTION: str = (
        "Backend API for calculations, simulations, and Gemini AI sustainability coaching"
    )
    VERSION: str = "1.0.0"

    # Server Configuration
    HOST: str = os.getenv("HOST", "0.0.0.0")
    PORT: int = int(os.getenv("PORT", 8080))
    DEBUG: bool = os.getenv("DEBUG", "False").lower() in ("true", "1")
    RELOAD: bool = os.getenv("RELOAD", "True").lower() in ("true", "1")

    # CORS Configuration
    ALLOWED_ORIGINS: List[str] = [
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "https://ecomind-frontend-713090010081.us-central1.run.app",
    ]

    def __init__(self, **data):
        super().__init__(**data)
        # Load additional origins from environment if provided
        env_origins = os.getenv("ALLOWED_ORIGINS")
        if env_origins:
            additional = [
                origin.strip()
                for origin in env_origins.split(",")
                if origin.strip()
            ]
            self.ALLOWED_ORIGINS.extend(additional)

    class Config:
        env_file = ".env"
        case_sensitive = True
        extra = "ignore"


# Global settings instance
settings = Settings()

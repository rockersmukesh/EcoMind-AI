"""
Standardized error handling and response schemas for the API
"""

from enum import Enum
from typing import Any, Optional
from pydantic import BaseModel


class ErrorCode(str, Enum):
    """Standardized error codes"""

    VALIDATION_ERROR = "VALIDATION_ERROR"
    NOT_FOUND = "NOT_FOUND"
    INTERNAL_ERROR = "INTERNAL_ERROR"
    UNAUTHORIZED = "UNAUTHORIZED"
    FORBIDDEN = "FORBIDDEN"


class ErrorResponse(BaseModel):
    """Standard error response format"""

    code: ErrorCode
    message: str
    details: Optional[Any] = None


class SuccessResponse(BaseModel):
    """Standard success response format"""

    success: bool = True
    data: Optional[Any] = None
    message: Optional[str] = None


class HealthResponse(BaseModel):
    """Health check response"""

    status: str
    service: str
    version: str
    environment: str = "production"

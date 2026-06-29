"""Health check endpoint for Nexus AI."""

from fastapi import APIRouter
from typing_extensions import TypedDict

from app.config.settings import get_settings


class HealthResponse(TypedDict):
    """Health check response payload."""

    status: str
    service: str
    version: str


router = APIRouter(tags=["health"])


@router.get("/health")
def get_health() -> HealthResponse:
    """Return service health information."""
    settings = get_settings()
    return {
        "status": "healthy",
        "service": settings.APP_NAME,
        "version": settings.APP_VERSION,
    }

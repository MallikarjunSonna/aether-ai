"""FastAPI application entry point for Nexus AI."""

from fastapi import FastAPI

from app.api.router import api_router
from app.config.settings import get_settings
from app.core.exception_handlers import register_exception_handlers
from app.core.logging import configure_logging


def create_app() -> FastAPI:
    """Create and configure the FastAPI application."""
    settings = get_settings()
    configure_logging(settings)

    app = FastAPI(
        title=settings.APP_NAME,
        version=settings.APP_VERSION,
        debug=False,
    )
    register_exception_handlers(app)
    app.include_router(api_router, prefix=settings.API_PREFIX)

    return app


app = create_app()

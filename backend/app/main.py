"""FastAPI application entry point for Nexus AI."""

import logging

from fastapi import FastAPI

from app.api.router import api_router
from app.config.settings import AppSettings, get_settings
from app.core.exception_handlers import register_exception_handlers
from app.core.logging import configure_logging
from app.core.middleware import register_middleware


logger = logging.getLogger(__name__)


def _validate_settings(settings: AppSettings) -> None:
    """Validate critical configuration at startup."""
    if settings.JWT_SECRET_KEY == "change-this-secret":
        raise RuntimeError(
            "JWT_SECRET_KEY is still set to the insecure default. "
            "Set a strong, unique value in your .env file or environment."
        )


def _log_startup_info(settings: AppSettings) -> None:
    """Log startup configuration without exposing secrets."""
    logger.info("Starting %s v%s", settings.APP_NAME, settings.APP_VERSION)
    logger.info("API prefix: %s", settings.API_PREFIX)
    logger.info("Log level: %s", settings.LOG_LEVEL)
    logger.info("Debug mode: %s", settings.DEBUG)
    logger.info("JWT algorithm: %s", settings.JWT_ALGORITHM)
    logger.info(
        "Access token expiry: %d minutes",
        settings.ACCESS_TOKEN_EXPIRE_MINUTES,
    )
    logger.info(
        "Refresh token expiry: %d days",
        settings.REFRESH_TOKEN_EXPIRE_DAYS,
    )


def create_app() -> FastAPI:
    """Create and configure the FastAPI application."""
    settings = get_settings()
    configure_logging(settings)

    _validate_settings(settings)
    _log_startup_info(settings)

    app = FastAPI(
        title=settings.APP_NAME,
        version=settings.APP_VERSION,
        debug=False,
    )
    register_middleware(app, settings)
    register_exception_handlers(app)
    app.include_router(api_router, prefix=settings.API_PREFIX)

    return app


app = create_app()

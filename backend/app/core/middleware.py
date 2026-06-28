"""Application middleware configuration."""

import logging

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.config.settings import AppSettings


logger = logging.getLogger(__name__)


_ALLOWED_METHODS = ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"]


def register_middleware(app: FastAPI, settings: AppSettings) -> None:
    """Register application middleware on the FastAPI instance."""
    origins = [
        origin.strip()
        for origin in settings.CORS_ORIGINS.split(",")
        if origin.strip()
    ]

    app.add_middleware(
        CORSMiddleware,
        allow_origins=origins,
        allow_credentials=True,
        allow_methods=_ALLOWED_METHODS,
        allow_headers=["*"],
    )
    logger.info("CORS configured for origins: %s", origins)

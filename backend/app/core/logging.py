"""Logging configuration for the Nexus AI backend."""

import logging

from app.config.settings import AppSettings


def configure_logging(settings: AppSettings) -> None:
    """Configure application-wide Python logging."""
    logging.basicConfig(
        level=settings.LOG_LEVEL,
        format="%(asctime)s %(levelname)s [%(name)s] %(message)s",
    )

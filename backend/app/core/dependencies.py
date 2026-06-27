"""Shared FastAPI dependency placeholders."""

import logging
from typing import NoReturn


logger = logging.getLogger(__name__)


def get_current_user() -> NoReturn:
    """Resolve the current authenticated user in a future auth implementation."""
    logger.debug("Current user dependency requested before auth implementation.")
    raise NotImplementedError("Current user dependency is not implemented.")


def get_request_context() -> NoReturn:
    """Resolve request-scoped context in a future infrastructure implementation."""
    logger.debug("Request context dependency requested before implementation.")
    raise NotImplementedError("Request context dependency is not implemented.")

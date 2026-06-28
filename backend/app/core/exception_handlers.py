"""Global FastAPI exception handlers."""

import logging
from http import HTTPStatus

from fastapi import FastAPI, Request
from fastapi.responses import JSONResponse

from app.core.exceptions import (
    AppException,
    AuthenticationException,
    ResourceNotFoundException,
    ValidationException,
)
from app.core.responses import ErrorResponse

logger = logging.getLogger(__name__)


def _error_response(exception: AppException) -> JSONResponse:
    """Build a JSON response from an application exception."""
    return JSONResponse(
        status_code=exception.status_code,
        content=exception.to_error_response().model_dump(),
    )


async def app_exception_handler(
    _request: Request,
    exception: AppException,
) -> JSONResponse:
    """Handle expected application exceptions."""
    return _error_response(exception)


async def validation_exception_handler(
    _request: Request,
    exception: ValidationException,
) -> JSONResponse:
    """Handle validation exceptions."""
    return _error_response(exception)


async def authentication_exception_handler(
    _request: Request,
    exception: AuthenticationException,
) -> JSONResponse:
    """Handle authentication exceptions."""
    return _error_response(exception)


async def resource_not_found_exception_handler(
    _request: Request,
    exception: ResourceNotFoundException,
) -> JSONResponse:
    """Handle missing resource exceptions."""
    return _error_response(exception)


async def generic_exception_handler(
    _request: Request,
    exception: Exception,
) -> JSONResponse:
    """Handle unexpected exceptions without exposing internals."""
    logger.exception("Unhandled exception while processing request.")
    error_response = ErrorResponse(
        error="internal_server_error",
        message="An unexpected error occurred.",
    )
    return JSONResponse(
        status_code=HTTPStatus.INTERNAL_SERVER_ERROR,
        content=error_response.model_dump(),
    )


def register_exception_handlers(app: FastAPI) -> None:
    """Register global exception handlers on the FastAPI application."""
    app.add_exception_handler(AppException, app_exception_handler)
    app.add_exception_handler(ValidationException, validation_exception_handler)
    app.add_exception_handler(AuthenticationException, authentication_exception_handler)
    app.add_exception_handler(
        ResourceNotFoundException,
        resource_not_found_exception_handler,
    )
    app.add_exception_handler(Exception, generic_exception_handler)

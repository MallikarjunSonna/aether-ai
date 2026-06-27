"""Application-specific exception types."""

from http import HTTPStatus
from typing import Any

from app.core.responses import ErrorResponse


class AppException(Exception):
    """Base exception for clean API error responses."""

    status_code: int = HTTPStatus.INTERNAL_SERVER_ERROR
    error_code: str = "application_error"
    default_message: str = "An application error occurred."

    def __init__(
        self,
        message: str | None = None,
        *,
        status_code: int | None = None,
        error_code: str | None = None,
        details: dict[str, Any] | None = None,
    ) -> None:
        """Initialize an application exception."""
        self.message = message or self.default_message
        self.status_code = status_code or self.status_code
        self.error_code = error_code or self.error_code
        self.details = details
        super().__init__(self.message)

    def to_error_response(self) -> ErrorResponse:
        """Convert the exception into a reusable API error response model."""
        return ErrorResponse(
            error=self.error_code,
            message=self.message,
            details=self.details,
        )


class ValidationException(AppException):
    """Exception raised when request or domain validation fails."""

    status_code = HTTPStatus.BAD_REQUEST
    error_code = "validation_error"
    default_message = "Validation failed."


class AuthenticationException(AppException):
    """Exception raised when authentication fails."""

    status_code = HTTPStatus.UNAUTHORIZED
    error_code = "authentication_error"
    default_message = "Authentication failed."


class AuthorizationException(AppException):
    """Exception raised when a user is not authorized for an action."""

    status_code = HTTPStatus.FORBIDDEN
    error_code = "authorization_error"
    default_message = "You are not authorized to perform this action."


class ResourceNotFoundException(AppException):
    """Exception raised when a requested resource does not exist."""

    status_code = HTTPStatus.NOT_FOUND
    error_code = "resource_not_found"
    default_message = "The requested resource was not found."

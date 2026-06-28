"""Shared FastAPI dependencies for authentication and request context."""

import logging
from datetime import UTC, datetime
from uuid import uuid4

from fastapi import Depends, Request
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer

from app.core.exceptions import AuthenticationException
from app.services.jwt_service import JWTService

logger = logging.getLogger(__name__)

_security_scheme = HTTPBearer(auto_error=False)


class AuthenticatedUser:
    """Placeholder representing an authenticated user resolved from a JWT."""

    def __init__(self, user_id: str, token_type: str) -> None:
        self.id = user_id
        self.token_type = token_type


class RequestContext:
    """Request-scoped context with identification and timing metadata."""

    def __init__(
        self,
        request_id: str,
        client_ip: str,
        timestamp: datetime,
    ) -> None:
        self.request_id = request_id
        self.client_ip = client_ip
        self.timestamp = timestamp


def _get_jwt_service() -> JWTService:
    """Provide a JWTService instance."""
    return JWTService()


async def get_current_user(
    credentials: HTTPAuthorizationCredentials | None = Depends(_security_scheme),
    jwt_service: JWTService = Depends(_get_jwt_service),
) -> AuthenticatedUser:
    """Resolve the current authenticated user from a Bearer JWT.

    Reads the Authorization header, validates the Bearer format, decodes
    the JWT, and returns an AuthenticatedUser placeholder.

    Raises:
        AuthenticationException: If the token is missing, malformed, or invalid.
    """
    if credentials is None:
        raise AuthenticationException(
            "Authentication required.",
            error_code="missing_authorization_header",
        )

    payload = jwt_service.decode_token(
        credentials.credentials,
        expected_token_type="access",
    )

    subject = payload.get("sub")
    if not subject or not isinstance(subject, str):
        raise AuthenticationException(
            "Token payload is invalid.",
            error_code="invalid_token_payload",
        )

    logger.debug("Authenticated user %s via JWT.", subject)
    return AuthenticatedUser(user_id=subject, token_type="access")


async def get_request_context(request: Request) -> RequestContext:
    """Resolve request-scoped context with identification and timing metadata.

    Returns:
        RequestContext containing a unique request ID, the client IP address,
        and the current UTC timestamp.
    """
    request_id = request.headers.get("X-Request-ID") or str(uuid4())
    client_ip = request.client.host if request.client else "unknown"
    timestamp = datetime.now(UTC)

    return RequestContext(
        request_id=request_id,
        client_ip=client_ip,
        timestamp=timestamp,
    )

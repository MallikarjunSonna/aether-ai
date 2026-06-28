"""Reusable JSON Web Token service."""

from datetime import UTC, datetime, timedelta
import logging
from typing import Any, Literal, cast

import jwt
from jwt import ExpiredSignatureError, InvalidTokenError

from app.config.settings import AppSettings, get_settings
from app.core.exceptions import AuthenticationException, ValidationException


logger = logging.getLogger(__name__)

TokenType = Literal["access", "refresh"]
"""Supported JWT token types."""

TokenPayload = dict[str, Any]
"""Decoded JWT payload."""


class JWTService:
    """Create and validate application JWT access and refresh tokens."""

    def __init__(self, settings: AppSettings | None = None) -> None:
        """Initialize the JWT service with application settings."""
        self._settings = settings or get_settings()

    def create_access_token(self, subject: str) -> str:
        """Create a signed access token for the provided subject."""
        return self._create_token(
            subject=subject,
            token_type="access",
            expires_delta=timedelta(
                minutes=self._settings.ACCESS_TOKEN_EXPIRE_MINUTES,
            ),
        )

    def create_refresh_token(self, subject: str) -> str:
        """Create a signed refresh token for the provided subject."""
        return self._create_token(
            subject=subject,
            token_type="refresh",
            expires_delta=timedelta(days=self._settings.REFRESH_TOKEN_EXPIRE_DAYS),
        )

    def decode_token(
        self,
        token: str,
        expected_token_type: TokenType | None = None,
    ) -> TokenPayload:
        """Decode and validate a signed JWT.

        Args:
            token: Encoded JWT string.
            expected_token_type: Optional token type that the payload must contain.

        Raises:
            AuthenticationException: If the token is expired, invalid, or has the
                wrong token type.
        """
        try:
            payload = jwt.decode(
                token,
                self._settings.JWT_SECRET_KEY,
                algorithms=[self._settings.JWT_ALGORITHM],
            )
        except ExpiredSignatureError as exc:
            logger.info("JWT decode failed because the token is expired.")
            raise AuthenticationException(
                "Token has expired.",
                error_code="token_expired",
            ) from exc
        except InvalidTokenError as exc:
            logger.info("JWT decode failed because the token is invalid.")
            raise AuthenticationException(
                "Token is invalid.",
                error_code="invalid_token",
            ) from exc

        if not isinstance(payload, dict):
            logger.info("JWT decode failed because the payload is malformed.")
            raise AuthenticationException(
                "Token payload is invalid.",
                error_code="invalid_token_payload",
            )

        token_payload = cast(TokenPayload, payload)
        token_type = token_payload.get("type")
        if expected_token_type is not None and token_type != expected_token_type:
            logger.info("JWT decode failed because the token type is incorrect.")
            raise AuthenticationException(
                "Token type is invalid.",
                error_code="invalid_token_type",
            )

        return token_payload

    def _create_token(
        self,
        *,
        subject: str,
        token_type: TokenType,
        expires_delta: timedelta,
    ) -> str:
        """Create a signed JWT with standard application claims."""
        normalized_subject = subject.strip()
        if not normalized_subject:
            raise ValidationException(
                "Token subject is required.",
                error_code="token_subject_required",
            )

        issued_at = datetime.now(UTC)
        expires_at = issued_at + expires_delta
        payload: TokenPayload = {
            "sub": normalized_subject,
            "iat": issued_at,
            "exp": expires_at,
            "type": token_type,
        }

        encoded_token = jwt.encode(
            payload,
            self._settings.JWT_SECRET_KEY,
            algorithm=self._settings.JWT_ALGORITHM,
        )
        logger.debug("Created %s JWT.", token_type)
        return encoded_token

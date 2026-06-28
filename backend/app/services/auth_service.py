"""Authentication service orchestration utilities."""

import logging
from typing import TypedDict

from app.core.exceptions import AuthenticationException, ValidationException
from app.core.security import verify_password
from app.models.user import User
from app.services.jwt_service import JWTService


logger = logging.getLogger(__name__)


class AuthTokens(TypedDict):
    """Access and refresh token pair returned after authentication."""

    access_token: str
    refresh_token: str


class AuthService:
    """Coordinate password validation and JWT creation for authenticated users."""

    def __init__(self, jwt_service: JWTService | None = None) -> None:
        """Initialize the authentication service."""
        self._jwt_service = jwt_service or JWTService()

    def authenticate_user(self, user: User, password: str) -> User:
        """Validate a user's active status and password.

        Args:
            user: User object supplied by the caller.
            password: Plaintext password to validate.

        Raises:
            AuthenticationException: If the user is inactive or the password is
                invalid.
        """
        if not user.is_active:
            logger.info("Authentication rejected for inactive user.")
            raise AuthenticationException(
                "User account is inactive.",
                error_code="inactive_user",
            )

        if not self.validate_password(password, user.hashed_password):
            logger.info("Authentication rejected because credentials are invalid.")
            raise AuthenticationException(
                "Invalid credentials.",
                error_code="invalid_credentials",
            )

        logger.info("User authenticated successfully.")
        return user

    def create_user_tokens(self, user: User) -> AuthTokens:
        """Create access and refresh tokens for an authenticated user.

        Args:
            user: Authenticated user object.

        Raises:
            ValidationException: If the user does not have a usable identifier.
        """
        subject = str(user.id).strip()
        if not subject:
            raise ValidationException(
                "Authenticated user identifier is required.",
                error_code="user_identifier_required",
            )

        logger.debug("Creating JWT token pair for authenticated user.")
        return {
            "access_token": self._jwt_service.create_access_token(subject),
            "refresh_token": self._jwt_service.create_refresh_token(subject),
        }

    def validate_password(self, plain_password: str, hashed_password: str) -> bool:
        """Return whether a plaintext password matches a stored password hash."""
        if not plain_password or not hashed_password:
            logger.info("Password validation rejected because input is missing.")
            return False

        return verify_password(plain_password, hashed_password)

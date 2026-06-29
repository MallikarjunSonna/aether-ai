"""Authentication service orchestration utilities."""

import logging
from uuid import UUID

from typing_extensions import TypedDict

from app.core.exceptions import AuthenticationException, ValidationException
from app.core.security import get_password_hash, verify_password
from app.models.user import User
from app.repositories.user_repository import UserRepository
from app.schemas.auth import LoginRequest, RegisterRequest
from app.services.jwt_service import JWTService

logger = logging.getLogger(__name__)


class AuthTokens(TypedDict):
    """Access and refresh token pair returned after authentication."""

    access_token: str
    refresh_token: str


class AuthService:
    """Coordinate password validation and JWT creation for authenticated users."""

    def __init__(
        self,
        user_repository: UserRepository,
        jwt_service: JWTService | None = None,
    ) -> None:
        """Initialize the authentication service."""
        self._user_repository = user_repository
        self._jwt_service = jwt_service or JWTService()

    async def register_user(self, request: RegisterRequest) -> AuthTokens:
        """Register a new user and return an authentication token pair.

        Validates uniqueness of email and username, hashes the password,
        persists the user, and returns signed tokens.

        Raises:
            ValidationException: If the email or username is already taken.
        """
        normalized_email = request.email.strip().lower()

        if await self._user_repository.exists_email(normalized_email):
            logger.info("Registration rejected: email already exists.")
            raise ValidationException(
                "A user with this email address already exists.",
                error_code="email_already_exists",
            )

        if await self._user_repository.exists_username(request.username.strip()):
            logger.info("Registration rejected: username already exists.")
            raise ValidationException(
                "A user with this username already exists.",
                error_code="username_already_exists",
            )

        hashed_password = get_password_hash(request.password)

        user = User(
            email=normalized_email,
            username=request.username.strip(),
            hashed_password=hashed_password,
            full_name=request.full_name.strip() if request.full_name else None,
        )

        created_user = await self._user_repository.create(user)
        logger.info("User registered successfully: %s", created_user.id)

        return self.create_user_tokens(created_user)

    async def login_user(self, request: LoginRequest) -> AuthTokens:
        """Authenticate a user and return an authentication token pair.

        Looks up the user by email, validates the password, and returns
        signed tokens.

        Raises:
            AuthenticationException: If the credentials are invalid.
        """
        normalized_email = request.email.strip().lower()
        user = await self._user_repository.get_by_email(normalized_email)

        if user is None:
            logger.info("Login rejected: user not found.")
            raise AuthenticationException(
                "Invalid credentials.",
                error_code="invalid_credentials",
            )

        self.authenticate_user(user, request.password)
        return self.create_user_tokens(user)

    async def refresh_access_token(self, refresh_token: str) -> AuthTokens:
        """Issue a new access token using a valid refresh token.

        Decodes the refresh token, looks up the user, verifies the account
        is active, and returns a new access token paired with the existing
        refresh token.

        Raises:
            AuthenticationException: If the token is invalid, the user does
                not exist, or the account is inactive.
        """
        payload = self._jwt_service.decode_token(
            refresh_token,
            expected_token_type="refresh",
        )

        subject = payload.get("sub")
        if not subject or not isinstance(subject, str):
            raise AuthenticationException(
                "Invalid refresh token.",
                error_code="invalid_refresh_token",
            )

        try:
            user_id = UUID(subject)
        except (ValueError, TypeError):
            raise AuthenticationException(
                "Invalid refresh token.",
                error_code="invalid_refresh_token",
            ) from None

        user = await self._user_repository.get_by_id(user_id)
        if user is None or not user.is_active:
            logger.info("Refresh rejected: user not found or inactive.")
            raise AuthenticationException(
                "Invalid refresh token.",
                error_code="invalid_refresh_token",
            )

        new_access_token = self._jwt_service.create_access_token(subject)
        logger.debug("Access token refreshed for user %s.", subject)

        return {
            "access_token": new_access_token,
            "refresh_token": refresh_token,
        }

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
                "Invalid credentials.",
                error_code="invalid_credentials",
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

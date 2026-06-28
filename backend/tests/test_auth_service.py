"""Tests for the authentication service layer."""

from unittest.mock import AsyncMock, MagicMock, patch
from uuid import UUID, uuid4
import pytest

from app.core.exceptions import AuthenticationException, ValidationException
from app.core.security import get_password_hash
from app.models.user import User
from app.repositories.user_repository import UserRepository
from app.schemas.auth import LoginRequest, RegisterRequest
from app.services.auth_service import AuthService
from app.services.jwt_service import JWTService


_USER_ID = uuid4()


def _make_user(
    *,
    user_id: UUID | None = None,
    email: str = "test@example.com",
    username: str = "testuser",
    password: str = "password123",
    full_name: str | None = "Test User",
    is_active: bool = True,
) -> User:
    return User(
        id=user_id or _USER_ID,
        email=email,
        username=username,
        hashed_password=get_password_hash(password),
        full_name=full_name,
        is_active=is_active,
    )


@pytest.fixture
def mock_repo() -> MagicMock:
    repo = MagicMock(spec=UserRepository)
    repo.create = AsyncMock()
    repo.get_by_email = AsyncMock()
    repo.get_by_username = AsyncMock()
    repo.get_by_id = AsyncMock()
    repo.exists_email = AsyncMock()
    repo.exists_username = AsyncMock()
    return repo


@pytest.fixture
def auth_service(mock_repo: MagicMock, jwt_service: JWTService) -> AuthService:
    return AuthService(user_repository=mock_repo, jwt_service=jwt_service)


@pytest.fixture
def active_user() -> User:
    return _make_user()


@pytest.fixture
def inactive_user() -> User:
    return _make_user(is_active=False)


# ---------------------------------------------------------------------------
# register_user
# ---------------------------------------------------------------------------


class TestRegisterUser:
    async def test_success(self, auth_service: AuthService, mock_repo: MagicMock) -> None:
        user = _make_user()
        mock_repo.exists_email.return_value = False
        mock_repo.exists_username.return_value = False
        mock_repo.create.return_value = user

        request = RegisterRequest(
            email="test@example.com",
            username="testuser",
            password="password123",
        )
        tokens = await auth_service.register_user(request)

        assert "access_token" in tokens
        assert "refresh_token" in tokens
        mock_repo.create.assert_awaited_once()

    async def test_duplicate_email_raises_error(
        self,
        auth_service: AuthService,
        mock_repo: MagicMock,
    ) -> None:
        mock_repo.exists_email.return_value = True

        request = RegisterRequest(
            email="existing@example.com",
            username="newuser",
            password="password123",
        )
        with pytest.raises(ValidationException) as exc:
            await auth_service.register_user(request)

        assert exc.value.error_code == "email_already_exists"
        mock_repo.create.assert_not_called()

    async def test_duplicate_username_raises_error(
        self,
        auth_service: AuthService,
        mock_repo: MagicMock,
    ) -> None:
        mock_repo.exists_email.return_value = False
        mock_repo.exists_username.return_value = True

        request = RegisterRequest(
            email="new@example.com",
            username="takenuser",
            password="password123",
        )
        with pytest.raises(ValidationException) as exc:
            await auth_service.register_user(request)

        assert exc.value.error_code == "username_already_exists"
        mock_repo.create.assert_not_called()

    async def test_normalizes_email(self, auth_service: AuthService, mock_repo: MagicMock) -> None:
        user = _make_user()
        mock_repo.exists_email.return_value = False
        mock_repo.exists_username.return_value = False
        mock_repo.create.return_value = user

        request = RegisterRequest(
            email="  Test@Example.COM  ",
            username="testuser",
            password="password123",
        )
        await auth_service.register_user(request)

        mock_repo.exists_email.assert_called_with("test@example.com")

    async def test_full_name_optional(self, auth_service: AuthService, mock_repo: MagicMock) -> None:
        user = _make_user(full_name=None)
        mock_repo.exists_email.return_value = False
        mock_repo.exists_username.return_value = False
        mock_repo.create.return_value = user

        request = RegisterRequest(
            email="test@example.com",
            username="testuser",
            password="password123",
        )
        tokens = await auth_service.register_user(request)

        assert "access_token" in tokens


# ---------------------------------------------------------------------------
# login_user
# ---------------------------------------------------------------------------


class TestLoginUser:
    async def test_success(
        self,
        auth_service: AuthService,
        mock_repo: MagicMock,
        active_user: User,
    ) -> None:
        mock_repo.get_by_email.return_value = active_user

        request = LoginRequest(email="test@example.com", password="password123")
        tokens = await auth_service.login_user(request)

        assert "access_token" in tokens
        assert "refresh_token" in tokens

    async def test_user_not_found_raises_error(
        self,
        auth_service: AuthService,
        mock_repo: MagicMock,
    ) -> None:
        mock_repo.get_by_email.return_value = None

        request = LoginRequest(email="unknown@example.com", password="password123")
        with pytest.raises(AuthenticationException) as exc:
            await auth_service.login_user(request)

        assert exc.value.error_code == "invalid_credentials"

    async def test_inactive_user_raises_error(
        self,
        auth_service: AuthService,
        mock_repo: MagicMock,
        inactive_user: User,
    ) -> None:
        mock_repo.get_by_email.return_value = inactive_user

        request = LoginRequest(email="inactive@example.com", password="password123")
        with pytest.raises(AuthenticationException) as exc:
            await auth_service.login_user(request)

        assert exc.value.error_code == "invalid_credentials"

    async def test_wrong_password_raises_error(
        self,
        auth_service: AuthService,
        mock_repo: MagicMock,
        active_user: User,
    ) -> None:
        mock_repo.get_by_email.return_value = active_user

        request = LoginRequest(email="test@example.com", password="wrong-password")
        with pytest.raises(AuthenticationException) as exc:
            await auth_service.login_user(request)

        assert exc.value.error_code == "invalid_credentials"

    async def test_normalizes_email(
        self,
        auth_service: AuthService,
        mock_repo: MagicMock,
        active_user: User,
    ) -> None:
        mock_repo.get_by_email.return_value = active_user

        request = LoginRequest(email="  Test@Example.COM  ", password="password123")
        await auth_service.login_user(request)

        mock_repo.get_by_email.assert_called_with("test@example.com")


# ---------------------------------------------------------------------------
# refresh_access_token
# ---------------------------------------------------------------------------


class TestRefreshAccessToken:
    async def test_success(
        self,
        auth_service: AuthService,
        mock_repo: MagicMock,
        jwt_service: JWTService,
    ) -> None:
        refresh_token = jwt_service.create_refresh_token(str(_USER_ID))
        user = _make_user()
        mock_repo.get_by_id.return_value = user

        tokens = await auth_service.refresh_access_token(refresh_token)

        assert "access_token" in tokens
        assert "refresh_token" in tokens
        assert tokens["refresh_token"] == refresh_token

    async def test_invalid_token_raises_error(
        self,
        auth_service: AuthService,
    ) -> None:
        with pytest.raises(AuthenticationException) as exc:
            await auth_service.refresh_access_token("not-a-valid-token")

        assert exc.value.error_code in ("invalid_token", "invalid_refresh_token")

    async def test_user_not_found_raises_error(
        self,
        auth_service: AuthService,
        mock_repo: MagicMock,
        jwt_service: JWTService,
    ) -> None:
        refresh_token = jwt_service.create_refresh_token(str(uuid4()))
        mock_repo.get_by_id.return_value = None

        with pytest.raises(AuthenticationException) as exc:
            await auth_service.refresh_access_token(refresh_token)

        assert exc.value.error_code == "invalid_refresh_token"

    async def test_inactive_user_raises_error(
        self,
        auth_service: AuthService,
        mock_repo: MagicMock,
        jwt_service: JWTService,
        inactive_user: User,
    ) -> None:
        refresh_token = jwt_service.create_refresh_token(str(_USER_ID))
        mock_repo.get_by_id.return_value = inactive_user

        with pytest.raises(AuthenticationException) as exc:
            await auth_service.refresh_access_token(refresh_token)

        assert exc.value.error_code == "invalid_refresh_token"

    async def test_issues_new_access_token(
        self,
        auth_service: AuthService,
        mock_repo: MagicMock,
        jwt_service: JWTService,
    ) -> None:
        refresh_token = jwt_service.create_refresh_token(str(_USER_ID))
        user = _make_user()
        mock_repo.get_by_id.return_value = user

        tokens = await auth_service.refresh_access_token(refresh_token)
        access_payload = jwt_service.decode_token(
            tokens["access_token"],
            expected_token_type="access",
        )

        assert access_payload["sub"] == str(_USER_ID)


# ---------------------------------------------------------------------------
# authenticate_user
# ---------------------------------------------------------------------------


class TestAuthenticateUser:
    def test_active_user_correct_password_succeeds(
        self,
        auth_service: AuthService,
        active_user: User,
    ) -> None:
        result = auth_service.authenticate_user(active_user, "password123")

        assert result is active_user

    def test_inactive_user_raises_error(
        self,
        auth_service: AuthService,
        inactive_user: User,
    ) -> None:
        with pytest.raises(AuthenticationException) as exc:
            auth_service.authenticate_user(inactive_user, "password123")

        assert exc.value.error_code == "invalid_credentials"

    def test_wrong_password_raises_error(
        self,
        auth_service: AuthService,
        active_user: User,
    ) -> None:
        with pytest.raises(AuthenticationException) as exc:
            auth_service.authenticate_user(active_user, "wrong-password")

        assert exc.value.error_code == "invalid_credentials"


# ---------------------------------------------------------------------------
# validate_password
# ---------------------------------------------------------------------------


class TestValidatePassword:
    def test_correct_password_returns_true(
        self,
        auth_service: AuthService,
    ) -> None:
        result = auth_service.validate_password(
            "password123",
            get_password_hash("password123"),
        )

        assert result is True

    def test_wrong_password_returns_false(
        self,
        auth_service: AuthService,
    ) -> None:
        result = auth_service.validate_password(
            "wrong-password",
            get_password_hash("password123"),
        )

        assert result is False

    def test_empty_password_returns_false(
        self,
        auth_service: AuthService,
    ) -> None:
        result = auth_service.validate_password(
            "",
            get_password_hash("password123"),
        )

        assert result is False

    def test_empty_hash_returns_false(
        self,
        auth_service: AuthService,
    ) -> None:
        result = auth_service.validate_password(
            "password123",
            "",
        )

        assert result is False


# ---------------------------------------------------------------------------
# create_user_tokens
# ---------------------------------------------------------------------------


class TestCreateUserTokens:
    def test_returns_auth_tokens(
        self,
        auth_service: AuthService,
    ) -> None:
        user = _make_user()
        tokens = auth_service.create_user_tokens(user)

        assert "access_token" in tokens
        assert "refresh_token" in tokens
        assert isinstance(tokens["access_token"], str)
        assert isinstance(tokens["refresh_token"], str)
        assert len(tokens["access_token"]) > 0
        assert len(tokens["refresh_token"]) > 0

    def test_access_and_refresh_are_different(
        self,
        auth_service: AuthService,
    ) -> None:
        user = _make_user()
        tokens = auth_service.create_user_tokens(user)

        assert tokens["access_token"] != tokens["refresh_token"]

    def test_user_id_encoded_in_both_tokens(
        self,
        auth_service: AuthService,
        jwt_service: JWTService,
    ) -> None:
        user = _make_user()
        tokens = auth_service.create_user_tokens(user)

        access_payload = jwt_service.decode_token(
            tokens["access_token"],
            expected_token_type="access",
        )
        refresh_payload = jwt_service.decode_token(
            tokens["refresh_token"],
            expected_token_type="refresh",
        )

        assert access_payload["sub"] == str(_USER_ID)
        assert refresh_payload["sub"] == str(_USER_ID)

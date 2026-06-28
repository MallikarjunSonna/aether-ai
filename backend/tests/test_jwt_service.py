"""Tests for JWT token creation and validation."""

import pytest

from app.config.settings import AppSettings
from app.core.exceptions import AuthenticationException
from app.services.jwt_service import JWTService


class TestCreateAccessToken:
    """Suite for access token creation."""

    def test_returns_string(self, jwt_service: JWTService) -> None:
        token = jwt_service.create_access_token("user-1")

        assert isinstance(token, str)
        assert len(token) > 0

    def test_contains_three_jwt_segments(self, jwt_service: JWTService) -> None:
        token = jwt_service.create_access_token("user-1")

        assert len(token.split(".")) == 3

    def test_preserves_subject(self, jwt_service: JWTService) -> None:
        token = jwt_service.create_access_token("user-1")
        payload = jwt_service.decode_token(token)

        assert payload["sub"] == "user-1"

    def test_has_correct_token_type(self, jwt_service: JWTService) -> None:
        token = jwt_service.create_access_token("user-1")
        payload = jwt_service.decode_token(token)

        assert payload["type"] == "access"

    def test_contains_expiration_claim(self, jwt_service: JWTService) -> None:
        token = jwt_service.create_access_token("user-1")
        payload = jwt_service.decode_token(token)

        assert "exp" in payload
        assert isinstance(payload["exp"], int)


class TestCreateRefreshToken:
    """Suite for refresh token creation."""

    def test_returns_string(self, jwt_service: JWTService) -> None:
        token = jwt_service.create_refresh_token("user-1")

        assert isinstance(token, str)
        assert len(token) > 0

    def test_has_refresh_type(self, jwt_service: JWTService) -> None:
        token = jwt_service.create_refresh_token("user-1")
        payload = jwt_service.decode_token(token)

        assert payload["type"] == "refresh"

    def test_preserves_subject(self, jwt_service: JWTService) -> None:
        token = jwt_service.create_refresh_token("user-1")
        payload = jwt_service.decode_token(token)

        assert payload["sub"] == "user-1"


class TestDecodeToken:
    """Suite for token decoding and validation."""

    def test_rejects_expired_token(self) -> None:
        settings = AppSettings(
            JWT_SECRET_KEY="test-secret-key-not-for-production",
            JWT_ALGORITHM="HS256",
            ACCESS_TOKEN_EXPIRE_MINUTES=-1,
        )
        past_service = JWTService(settings)
        token = past_service.create_access_token("user-1")
        verifier = JWTService(settings)

        with pytest.raises(AuthenticationException) as exc:
            verifier.decode_token(token)

        assert exc.value.error_code == "token_expired"

    def test_rejects_token_with_wrong_secret(self, jwt_service: JWTService) -> None:
        other_settings = AppSettings(
            JWT_SECRET_KEY="a-completely-different-secret",
            JWT_ALGORITHM="HS256",
        )
        other_service = JWTService(other_settings)
        token = other_service.create_access_token("user-1")

        with pytest.raises(AuthenticationException) as exc:
            jwt_service.decode_token(token)

        assert exc.value.error_code == "invalid_token"

    def test_rejects_wrong_token_type(self, jwt_service: JWTService) -> None:
        token = jwt_service.create_refresh_token("user-1")

        with pytest.raises(AuthenticationException) as exc:
            jwt_service.decode_token(token, expected_token_type="access")

        assert exc.value.error_code == "invalid_token_type"

    def test_rejects_tampered_token(self, jwt_service: JWTService) -> None:
        token = jwt_service.create_access_token("user-1")
        parts = token.split(".")
        tampered = f"{parts[0]}.{parts[1]}.invalidsignature"

        with pytest.raises(AuthenticationException) as exc:
            jwt_service.decode_token(tampered)

        assert exc.value.error_code == "invalid_token"

    def test_rejects_garbage_string(self, jwt_service: JWTService) -> None:
        with pytest.raises(AuthenticationException) as exc:
            jwt_service.decode_token("not-a-jwt-token")

        assert exc.value.error_code == "invalid_token"

    def test_accepts_access_token_when_expecting_access(
        self,
        jwt_service: JWTService,
    ) -> None:
        token = jwt_service.create_access_token("user-1")
        payload = jwt_service.decode_token(token, expected_token_type="access")

        assert payload["sub"] == "user-1"
        assert payload["type"] == "access"

    def test_accepts_refresh_token_when_expecting_refresh(
        self,
        jwt_service: JWTService,
    ) -> None:
        token = jwt_service.create_refresh_token("user-1")
        payload = jwt_service.decode_token(token, expected_token_type="refresh")

        assert payload["sub"] == "user-1"
        assert payload["type"] == "refresh"

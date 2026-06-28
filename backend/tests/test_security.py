"""Tests for password hashing utilities."""

from app.core.security import get_password_hash, verify_password


class TestGetPasswordHash:
    """Suite for password hash creation."""

    def test_hash_differs_from_plaintext(self) -> None:
        password = "a-secure-password"
        hashed = get_password_hash(password)

        assert hashed != password

    def test_hash_is_not_empty(self) -> None:
        hashed = get_password_hash("any-password")

        assert hashed
        assert len(hashed) > 10

    def test_each_hash_is_unique(self) -> None:
        """Same input produces a different hash each time (random salt)."""
        password = "same-password"
        hash_a = get_password_hash(password)
        hash_b = get_password_hash(password)

        assert hash_a != hash_b


class TestVerifyPassword:
    """Suite for password verification."""

    def test_correct_password_succeeds(self) -> None:
        password = "correct-password"
        hashed = get_password_hash(password)

        assert verify_password(password, hashed) is True

    def test_incorrect_password_fails(self) -> None:
        hashed = get_password_hash("real-password")

        assert verify_password("wrong-password", hashed) is False

    def test_invalid_hash_returns_false(self) -> None:
        assert verify_password("any-password", "not-a-valid-hash") is False

    def test_empty_password_returns_false(self) -> None:
        hashed = get_password_hash("real-password")

        assert verify_password("", hashed) is False

    def test_empty_hash_returns_false(self) -> None:
        assert verify_password("password", "") is False

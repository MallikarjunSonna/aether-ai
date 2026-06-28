"""Password hashing utilities for the Nexus AI backend."""

import logging
from typing import Protocol


logger = logging.getLogger(__name__)


class PasswordHasher(Protocol):
    """Protocol implemented by supported password hashing backends."""

    def hash(self, password: str) -> str:
        """Return a secure hash for the provided password."""

    def verify(self, plain_password: str, hashed_password: str) -> bool:
        """Return whether a plaintext password matches a stored hash."""


class PwdlibPasswordHasher:
    """Password hasher backed by pwdlib's recommended Argon2 configuration."""

    def __init__(self) -> None:
        """Initialize the pwdlib password hasher."""
        from pwdlib import PasswordHash

        self._password_hash: PasswordHash = PasswordHash.recommended()

    def hash(self, password: str) -> str:
        """Return an Argon2 password hash."""
        return self._password_hash.hash(password)

    def verify(self, plain_password: str, hashed_password: str) -> bool:
        """Return whether the plaintext password matches the stored hash."""
        return self._password_hash.verify(plain_password, hashed_password)


class PasslibPasswordHasher:
    """Password hasher backed by passlib's bcrypt context."""

    def __init__(self) -> None:
        """Initialize the passlib bcrypt password context."""
        from passlib.context import CryptContext

        self._password_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

    def hash(self, password: str) -> str:
        """Return a bcrypt password hash."""
        return self._password_context.hash(password)

    def verify(self, plain_password: str, hashed_password: str) -> bool:
        """Return whether the plaintext password matches the stored hash."""
        return bool(self._password_context.verify(plain_password, hashed_password))


def _create_password_hasher() -> PasswordHasher:
    """Create the preferred available password hashing backend."""
    try:
        hasher = PwdlibPasswordHasher()
    except ImportError:
        logger.warning("pwdlib is unavailable; falling back to passlib bcrypt.")
        return PasslibPasswordHasher()

    logger.info("Password hashing configured with pwdlib Argon2.")
    return hasher


password_hasher: PasswordHasher = _create_password_hasher()
"""Application-wide password hashing backend."""


def get_password_hash(password: str) -> str:
    """Return a secure hash for the provided plaintext password."""
    return password_hasher.hash(password)


def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Return whether a plaintext password matches a stored password hash."""
    try:
        return password_hasher.verify(plain_password, hashed_password)
    except Exception:
        logger.warning("Password verification failed because the hash is invalid.")
        return False

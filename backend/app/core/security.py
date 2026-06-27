"""Security helper placeholders.

Concrete password hashing and token handling will be implemented in a future
authentication ticket.
"""

import logging
from typing import NoReturn


logger = logging.getLogger(__name__)


def get_password_hash(password: str) -> NoReturn:
    """Return a secure password hash for the provided password."""
    logger.debug("Password hashing requested before security implementation.")
    raise NotImplementedError("Password hashing is not implemented.")


def verify_password(plain_password: str, hashed_password: str) -> NoReturn:
    """Verify a plaintext password against a stored password hash."""
    logger.debug("Password verification requested before security implementation.")
    raise NotImplementedError("Password verification is not implemented.")

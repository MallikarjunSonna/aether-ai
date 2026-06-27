"""User domain model."""

from datetime import datetime
import re

from sqlalchemy import CheckConstraint, DateTime, String
from sqlalchemy.orm import Mapped, mapped_column, validates

from app.models.base import BaseModel


EMAIL_PATTERN = re.compile(r"^[^@\s]+@[^@\s]+\.[^@\s]+$")
"""Basic email pattern for model-level validation."""


class User(BaseModel):
    """User entity for future authentication and ownership features."""

    __table_args__ = (
        CheckConstraint("email <> ''", name="ck_user_email_not_empty"),
        CheckConstraint("username <> ''", name="ck_user_username_not_empty"),
        CheckConstraint(
            "hashed_password <> ''",
            name="ck_user_hashed_password_not_empty",
        ),
        CheckConstraint("position('@' in email) > 1", name="ck_user_email_has_at"),
    )

    email: Mapped[str] = mapped_column(
        String(320),
        nullable=False,
        unique=True,
        index=True,
        doc="Unique email address for the user.",
    )
    username: Mapped[str] = mapped_column(
        String(150),
        nullable=False,
        unique=True,
        index=True,
        doc="Unique username for the user.",
    )
    full_name: Mapped[str | None] = mapped_column(
        String(255),
        nullable=True,
        default=None,
        doc="Optional full display name for the user.",
    )
    hashed_password: Mapped[str] = mapped_column(
        String(255),
        nullable=False,
        doc="Placeholder field for a future password hash.",
    )
    is_active: Mapped[bool] = mapped_column(
        default=True,
        nullable=False,
        doc="Whether the user account is active.",
    )
    is_superuser: Mapped[bool] = mapped_column(
        default=False,
        nullable=False,
        doc="Whether the user has global administrative privileges.",
    )
    last_login_at: Mapped[datetime | None] = mapped_column(
        DateTime(timezone=True),
        nullable=True,
        default=None,
        doc="UTC timestamp for the user's most recent login.",
    )

    @validates("email")
    def validate_email(self, _key: str, email: str) -> str:
        """Normalize and validate the user's email address."""
        normalized_email = email.strip().lower()
        if not EMAIL_PATTERN.fullmatch(normalized_email):
            raise ValueError("User email must be a valid email address.")
        return normalized_email

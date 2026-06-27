"""Organization domain model."""

from sqlalchemy import CheckConstraint, String, Text
from sqlalchemy.orm import Mapped, mapped_column

from app.models.base import BaseModel


class Organization(BaseModel):
    """Organization entity that owns future workspace and user records."""

    __table_args__ = (
        CheckConstraint("name <> ''", name="ck_organization_name_not_empty"),
        CheckConstraint("slug <> ''", name="ck_organization_slug_not_empty"),
    )

    name: Mapped[str] = mapped_column(
        String(255),
        nullable=False,
        index=True,
        doc="Display name for the organization.",
    )
    slug: Mapped[str] = mapped_column(
        String(255),
        nullable=False,
        unique=True,
        index=True,
        doc="Unique URL-safe organization identifier.",
    )
    description: Mapped[str | None] = mapped_column(
        Text,
        nullable=True,
        default=None,
        doc="Optional longer description for the organization.",
    )
    is_active: Mapped[bool] = mapped_column(
        default=True,
        nullable=False,
        doc="Whether the organization is active.",
    )

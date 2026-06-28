"""Workspace domain model."""

from uuid import UUID

from sqlalchemy import (
    CheckConstraint,
    ForeignKey,
    Index,
    String,
    Text,
    UniqueConstraint,
)
from sqlalchemy.orm import Mapped, mapped_column

from app.database.types import UUIDType
from app.models.base import BaseModel


class Workspace(BaseModel):
    """Workspace entity scoped to an organization."""

    __table_args__ = (
        UniqueConstraint(
            "organization_id",
            "slug",
            name="uq_workspace_organization_id_slug",
        ),
        CheckConstraint("name <> ''", name="ck_workspace_name_not_empty"),
        CheckConstraint("slug <> ''", name="ck_workspace_slug_not_empty"),
        Index("ix_workspace_organization_id", "organization_id"),
        Index("ix_workspace_slug", "slug"),
    )

    organization_id: Mapped[UUID] = mapped_column(
        UUIDType(as_uuid=True),
        ForeignKey("organization.id"),
        nullable=False,
        doc="Identifier of the organization that owns the workspace.",
    )
    name: Mapped[str] = mapped_column(
        String(255),
        nullable=False,
        doc="Display name for the workspace.",
    )
    slug: Mapped[str] = mapped_column(
        String(255),
        nullable=False,
        doc="Organization-scoped URL-safe workspace identifier.",
    )
    description: Mapped[str | None] = mapped_column(
        Text,
        nullable=True,
        default=None,
        doc="Optional longer description for the workspace.",
    )
    is_active: Mapped[bool] = mapped_column(
        default=True,
        nullable=False,
        doc="Whether the workspace is active.",
    )

"""Membership domain model."""

from datetime import datetime
from uuid import UUID

from sqlalchemy import DateTime, ForeignKey, Index, String, UniqueConstraint
from sqlalchemy.orm import Mapped, mapped_column

from app.database.types import UUIDType
from app.models.base import BaseModel


class Membership(BaseModel):
    """Membership entity linking a user to a workspace."""

    __table_args__ = (
        UniqueConstraint(
            "user_id",
            "workspace_id",
            name="uq_membership_user_id_workspace_id",
        ),
        Index("ix_membership_user_id", "user_id"),
        Index("ix_membership_workspace_id", "workspace_id"),
    )

    user_id: Mapped[UUID] = mapped_column(
        UUIDType(as_uuid=True),
        ForeignKey("user.id"),
        nullable=False,
        doc="Identifier of the user assigned to the workspace.",
    )
    workspace_id: Mapped[UUID] = mapped_column(
        UUIDType(as_uuid=True),
        ForeignKey("workspace.id"),
        nullable=False,
        doc="Identifier of the workspace the user belongs to.",
    )
    role: Mapped[str] = mapped_column(
        String(50),
        nullable=False,
        default="member",
        doc="Workspace role name for the membership.",
    )
    is_active: Mapped[bool] = mapped_column(
        default=True,
        nullable=False,
        doc="Whether the membership is active.",
    )
    joined_at: Mapped[datetime | None] = mapped_column(
        DateTime(timezone=True),
        nullable=True,
        default=None,
        doc="UTC timestamp for when the user joined the workspace.",
    )

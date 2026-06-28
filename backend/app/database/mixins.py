"""Reusable SQLAlchemy ORM mixins."""

from datetime import datetime
from uuid import UUID, uuid4

from sqlalchemy import DateTime, func
from sqlalchemy.orm import Mapped, mapped_column

from app.database.types import UUIDType


class TimestampMixin:
    """Add creation and update timestamps to an ORM model."""

    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        nullable=False,
        server_default=func.now(),
        doc="UTC timestamp for when the row was created.",
    )
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        nullable=False,
        server_default=func.now(),
        onupdate=func.now(),
        doc="UTC timestamp for when the row was last updated.",
    )


class UUIDPrimaryKeyMixin:
    """Add a UUID v4 primary key column to an ORM model."""

    id: Mapped[UUID] = mapped_column(
        UUIDType(as_uuid=True),
        primary_key=True,
        default=uuid4,
        doc="UUID v4 primary key.",
    )

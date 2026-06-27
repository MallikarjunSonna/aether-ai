"""Reusable base classes for future database entities."""

from datetime import datetime
import re

from sqlalchemy import DateTime
from sqlalchemy.orm import Mapped, declared_attr, mapped_column

from app.database.base import Base
from app.database.mixins import TimestampMixin, UUIDPrimaryKeyMixin


def _class_name_to_table_name(class_name: str) -> str:
    """Convert a PascalCase model class name to a snake_case table name."""
    name_with_boundaries = re.sub(r"(.)([A-Z][a-z]+)", r"\1_\2", class_name)
    return re.sub(r"([a-z0-9])([A-Z])", r"\1_\2", name_with_boundaries).lower()


class SoftDeleteMixin:
    """Add nullable soft deletion metadata to an ORM model."""

    deleted_at: Mapped[datetime | None] = mapped_column(
        DateTime(timezone=True),
        nullable=True,
        default=None,
        doc="UTC timestamp for when the row was soft deleted.",
    )

    @property
    def is_deleted(self) -> bool:
        """Return whether the row has been soft deleted."""
        return self.deleted_at is not None


class BaseModel(UUIDPrimaryKeyMixin, TimestampMixin, SoftDeleteMixin, Base):
    """Abstract base model for all future SQLAlchemy ORM entities."""

    __abstract__ = True

    @declared_attr.directive
    def __tablename__(cls) -> str:
        """Generate a snake_case table name from the model class name."""
        return _class_name_to_table_name(cls.__name__)

    def __repr__(self) -> str:
        """Return a compact developer-facing representation of the entity."""
        return f"{self.__class__.__name__}(id={self.id!r})"

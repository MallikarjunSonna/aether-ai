"""Reusable SQLAlchemy column types for database models."""

from typing import TypeAlias
from uuid import UUID

from sqlalchemy import DateTime, Uuid


UUIDType: TypeAlias = Uuid
"""Database-agnostic UUID column type that returns :class:`uuid.UUID` values."""

TimestampType: TypeAlias = DateTime
"""Timezone-aware timestamp column type factory."""

UUIDPythonType: TypeAlias = UUID
"""Python type used for UUID primary key values."""

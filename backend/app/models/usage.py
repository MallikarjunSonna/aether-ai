"""Usage tracking model for AI provider requests (structure only, no persistence)."""

from datetime import datetime

from app.models.base import BaseModel
from sqlalchemy import DateTime, Float, Integer, String, Text
from sqlalchemy.orm import Mapped, mapped_column


class UsageRecord(BaseModel):
    """Tracks AI provider usage for future billing, auditing, and capacity planning.

    Persistence is NOT yet required — the model exists as a schema contract
    so that the database migration can be generated when storage infrastructure
    is ready.
    """

    __abstract__ = True

    user_id: Mapped[str] = mapped_column(
        String(36),
        nullable=False,
        index=True,
        doc="UUID of the user who made the request.",
    )
    organization_id: Mapped[str | None] = mapped_column(
        String(36),
        nullable=True,
        index=True,
        doc="UUID of the organization the user belongs to.",
    )
    provider: Mapped[str] = mapped_column(
        String(32),
        nullable=False,
        doc="AI provider type (e.g. 'openai', 'anthropic').",
    )
    model: Mapped[str] = mapped_column(
        String(64),
        nullable=False,
        doc="Model identifier used for the request.",
    )
    prompt_tokens: Mapped[int] = mapped_column(
        Integer,
        nullable=False,
        default=0,
        doc="Number of prompt tokens consumed.",
    )
    completion_tokens: Mapped[int] = mapped_column(
        Integer,
        nullable=False,
        default=0,
        doc="Number of completion tokens generated.",
    )
    total_tokens: Mapped[int] = mapped_column(
        Integer,
        nullable=False,
        default=0,
        doc="Total tokens consumed (prompt + completion).",
    )
    latency_ms: Mapped[float | None] = mapped_column(
        Float,
        nullable=True,
        doc="Request latency in milliseconds.",
    )
    status: Mapped[str] = mapped_column(
        String(16),
        nullable=False,
        default="success",
        doc="Request status: 'success', 'error', 'rate_limited', etc.",
    )
    error_message: Mapped[str | None] = mapped_column(
        Text,
        nullable=True,
        doc="Error message if the request failed.",
    )
    timestamp: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        nullable=False,
        doc="UTC timestamp of when the request was processed.",
    )

"""Reusable API response models."""

from typing import Any, Generic, Literal, TypeVar

from pydantic import BaseModel, Field

DataT = TypeVar("DataT")


class SuccessResponse(BaseModel, Generic[DataT]):
    """Generic response model for successful API operations."""

    success: Literal[True] = True
    data: DataT | None = None
    message: str | None = None


class ErrorResponse(BaseModel):
    """Response model for API errors."""

    success: Literal[False] = False
    error: str = Field(..., description="Machine-readable error code.")
    message: str = Field(..., description="Human-readable error message.")
    details: dict[str, Any] | None = Field(
        default=None,
        description="Optional structured error details.",
    )


class MessageResponse(BaseModel):
    """Response model for simple message-based API responses."""

    success: Literal[True] = True
    message: str

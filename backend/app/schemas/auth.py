"""Pydantic schemas for authentication request and response contracts."""

from pydantic import BaseModel, Field


class RegisterRequest(BaseModel):
    """Request body for user registration."""

    email: str = Field(
        ...,
        min_length=1,
        max_length=320,
        description="User email address.",
    )
    username: str = Field(
        ...,
        min_length=1,
        max_length=150,
        description="Unique username.",
    )
    password: str = Field(
        ...,
        min_length=1,
        description="Plaintext password.",
    )
    full_name: str | None = Field(
        default=None,
        max_length=255,
        description="Optional display name.",
    )


class LoginRequest(BaseModel):
    """Request body for user login."""

    email: str = Field(
        ...,
        min_length=1,
        description="Registered email address.",
    )
    password: str = Field(
        ...,
        min_length=1,
        description="Account password.",
    )


class TokenResponse(BaseModel):
    """Response body returned after successful authentication."""

    access_token: str = Field(..., description="JWT access token.")
    refresh_token: str = Field(..., description="JWT refresh token.")
    token_type: str = "bearer"


class RefreshTokenRequest(BaseModel):
    """Request body for refreshing an access token."""

    refresh_token: str = Field(..., min_length=1, description="Valid refresh token.")


class LogoutRequest(BaseModel):
    """Request body for logout (placeholder — no token blacklist yet)."""

    refresh_token: str = Field(
        ..., min_length=1, description="Refresh token to discard."
    )

"""Authentication API routes for Nexus AI."""

import logging

from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.responses import MessageResponse, SuccessResponse
from app.database.session import get_db
from app.repositories.user_repository import UserRepository
from app.schemas.auth import (
    LoginRequest,
    LogoutRequest,
    RefreshTokenRequest,
    RegisterRequest,
    TokenResponse,
)
from app.services.auth_service import AuthService
from app.services.jwt_service import JWTService


logger = logging.getLogger(__name__)

router = APIRouter(prefix="/auth", tags=["auth"])


def _build_auth_service(db: AsyncSession) -> AuthService:
    """Wire dependencies and return a ready-to-use AuthService instance."""
    return AuthService(
        user_repository=UserRepository(db),
        jwt_service=JWTService(),
    )


@router.post("/register", response_model=SuccessResponse[TokenResponse])
async def register(body: RegisterRequest, db: AsyncSession = Depends(get_db)) -> SuccessResponse[TokenResponse]:
    """Register a new user account and return authentication tokens."""
    service = _build_auth_service(db)
    tokens = await service.register_user(body)
    return SuccessResponse(
        data=TokenResponse(
            access_token=tokens["access_token"],
            refresh_token=tokens["refresh_token"],
        ),
        message="Account created successfully.",
    )


@router.post("/login", response_model=SuccessResponse[TokenResponse])
async def login(body: LoginRequest, db: AsyncSession = Depends(get_db)) -> SuccessResponse[TokenResponse]:
    """Authenticate with email and password, returning authentication tokens."""
    service = _build_auth_service(db)
    tokens = await service.login_user(body)
    return SuccessResponse(
        data=TokenResponse(
            access_token=tokens["access_token"],
            refresh_token=tokens["refresh_token"],
        ),
        message="Authentication successful.",
    )


@router.post("/refresh", response_model=SuccessResponse[TokenResponse])
async def refresh(body: RefreshTokenRequest, db: AsyncSession = Depends(get_db)) -> SuccessResponse[TokenResponse]:
    """Issue a new access token using a valid refresh token."""
    service = _build_auth_service(db)
    tokens = await service.refresh_access_token(body.refresh_token)
    return SuccessResponse(
        data=TokenResponse(
            access_token=tokens["access_token"],
            refresh_token=tokens["refresh_token"],
        ),
        message="Token refreshed successfully.",
    )


@router.post("/logout", response_model=MessageResponse)
async def logout(_body: LogoutRequest) -> MessageResponse:
    """Log out a user (placeholder — no token blacklist yet)."""
    logger.debug("Logout requested.")
    return MessageResponse(message="Logged out successfully.")

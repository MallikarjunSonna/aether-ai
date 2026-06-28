"""User repository for persistence operations."""

import logging
from uuid import UUID

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.user import User

logger = logging.getLogger(__name__)


class UserRepository:
    """Repository for User persistence operations."""

    def __init__(self, session: AsyncSession) -> None:
        self._session = session

    async def get_by_email(self, email: str) -> User | None:
        """Return a user by normalized email, or None if not found."""
        stmt = select(User).where(User.email == email.strip().lower())
        result = await self._session.execute(stmt)
        return result.scalar_one_or_none()

    async def get_by_username(self, username: str) -> User | None:
        """Return a user by normalized username, or None if not found."""
        stmt = select(User).where(User.username == username.strip())
        result = await self._session.execute(stmt)
        return result.scalar_one_or_none()

    async def create(self, user: User) -> User:
        """Persist a new user and return it with generated fields."""
        self._session.add(user)
        await self._session.flush()
        await self._session.refresh(user)
        return user

    async def get_by_id(self, user_id: UUID) -> User | None:
        """Return a user by UUID, or None if not found."""
        stmt = select(User).where(User.id == user_id)
        result = await self._session.execute(stmt)
        return result.scalar_one_or_none()

    async def exists_email(self, email: str) -> bool:
        """Return whether a user with the given email exists."""
        stmt = select(User.id).where(User.email == email.strip().lower()).limit(1)
        result = await self._session.execute(stmt)
        return result.scalar_one_or_none() is not None

    async def exists_username(self, username: str) -> bool:
        """Return whether a user with the given username exists."""
        stmt = select(User.id).where(User.username == username.strip()).limit(1)
        result = await self._session.execute(stmt)
        return result.scalar_one_or_none() is not None

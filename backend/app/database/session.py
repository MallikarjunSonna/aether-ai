"""Async SQLAlchemy engine and session factory configuration."""

from collections.abc import AsyncIterator
from contextlib import asynccontextmanager
from os import getenv

from sqlalchemy.ext.asyncio import (
    AsyncEngine,
    AsyncSession,
    async_sessionmaker,
    create_async_engine,
)

DATABASE_URL_ENV_VAR: str = "DATABASE_URL"
"""Environment variable that stores the async PostgreSQL database URL."""


def get_database_url() -> str:
    """Return the configured async database URL.

    Raises:
        RuntimeError: If the database URL is not configured.
    """
    database_url = getenv(DATABASE_URL_ENV_VAR)
    if not database_url:
        raise RuntimeError(f"{DATABASE_URL_ENV_VAR} environment variable is required.")
    return database_url


engine: AsyncEngine = create_async_engine(
    get_database_url(),
    pool_pre_ping=True,
)
"""Application-wide async SQLAlchemy engine."""

AsyncSessionLocal: async_sessionmaker[AsyncSession] = async_sessionmaker(
    bind=engine,
    autoflush=False,
    expire_on_commit=False,
)
"""Factory for creating request-scoped async SQLAlchemy sessions."""


@asynccontextmanager
async def get_session() -> AsyncIterator[AsyncSession]:
    """Yield an async database session without committing implicitly."""
    async with AsyncSessionLocal() as session:
        yield session


async def get_db() -> AsyncIterator[AsyncSession]:
    """FastAPI dependency that yields a request-scoped async database session.

    Commits the transaction on success, rolls back on exception,
    and always closes the session when the request completes.
    """
    async with AsyncSessionLocal() as session:
        try:
            yield session
            await session.commit()
        except Exception:
            await session.rollback()
            raise

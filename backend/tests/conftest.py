"""pytest fixtures for the Nexus AI backend."""

import os
from collections.abc import AsyncIterator, Generator
from unittest.mock import patch

import pytest
import pytest_asyncio
from fastapi.testclient import TestClient
from sqlalchemy.ext.asyncio import AsyncSession, async_sessionmaker, create_async_engine

# Must be set before any app modules are imported so that the global async
# engine in app.database.session can be created without a real PostgreSQL URL.
os.environ.setdefault("DATABASE_URL", "sqlite+aiosqlite:///:memory:")

from app.config.settings import AppSettings
from app.database.base import Base
from app.repositories.user_repository import UserRepository
from app.services.jwt_service import JWTService


@pytest.fixture(autouse=True)
def _remove_sqlite_incompatible_constraints() -> None:
    """Remove CHECK constraints that use PostgreSQL-specific syntax.

    The ``ck_user_email_has_at`` constraint uses ``position('@' in email)``
    which is not valid SQLite DDL.  This fixture strips it from the shared
    metadata so that ``create_all`` works on the in-memory SQLite database.
    """
    from app.models.user import User

    table = User.__table__
    for c in list(table.constraints):
        if c.name == "ck_user_email_has_at":
            table.constraints.discard(c)
            break


@pytest.fixture
def test_settings() -> AppSettings:
    """Return test-safe settings that bypass startup validation."""
    return AppSettings(
        DEBUG=True,
        JWT_SECRET_KEY="test-secret-key-not-for-production",
        CORS_ORIGINS="*",
    )


@pytest.fixture
def jwt_service(test_settings: AppSettings) -> JWTService:
    """Return a JWTService pre-configured with test settings."""
    return JWTService(test_settings)


@pytest_asyncio.fixture
async def db_session() -> AsyncIterator[AsyncSession]:
    """Provide an isolated in-memory SQLite session per test."""
    engine = create_async_engine("sqlite+aiosqlite:///:memory:")

    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)

    factory = async_sessionmaker(engine, expire_on_commit=False)
    async with factory() as session:
        yield session

    await engine.dispose()


@pytest_asyncio.fixture
async def user_repository(db_session: AsyncSession) -> UserRepository:
    """Return a UserRepository bound to the test database session."""
    return UserRepository(db_session)


@pytest.fixture
def client(test_settings: AppSettings) -> Generator[TestClient, None, None]:
    """Provide a FastAPI TestClient with overridden settings."""

    with patch("app.config.settings.get_settings", return_value=test_settings):
        from app.main import create_app

        app = create_app()
        with TestClient(app) as c:
            yield c

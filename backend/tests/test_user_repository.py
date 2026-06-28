"""Tests for the UserRepository persistence layer."""

from uuid import uuid4

import pytest

from app.models.user import User
from app.repositories.user_repository import UserRepository

pytestmark = pytest.mark.asyncio


@pytest.fixture
def user_data() -> dict:
    return {
        "email": "alice@example.com",
        "username": "alice",
        "hashed_password": "$argon2id$v=19$m=65536,t=3,p=4$...",
        "full_name": "Alice Wonderland",
    }


async def _create_user(repo: UserRepository, **overrides: str | None) -> User:
    defaults = {
        "email": "default@example.com",
        "username": "defaultuser",
        "hashed_password": "$argon2id$v=19$m=65536,t=3,p=4$...",
    }
    defaults.update(overrides)
    user = User(**defaults)  # type: ignore[arg-type]
    return await repo.create(user)


class TestCreate:
    async def test_creates_user(
        self, user_repository: UserRepository, user_data: dict
    ) -> None:
        user = User(**user_data)  # type: ignore[arg-type]
        created = await user_repository.create(user)

        assert created.id is not None
        assert created.email == "alice@example.com"
        assert created.username == "alice"
        assert created.full_name == "Alice Wonderland"

    async def test_generates_uuid(self, user_repository: UserRepository) -> None:
        created = await _create_user(user_repository)

        assert isinstance(created.id, type(uuid4()))
        assert created.id is not None

    async def test_default_is_active(self, user_repository: UserRepository) -> None:
        created = await _create_user(user_repository)

        assert created.is_active is True

    async def test_default_is_not_superuser(
        self, user_repository: UserRepository
    ) -> None:
        created = await _create_user(user_repository)

        assert created.is_superuser is False


class TestGetByEmail:
    async def test_returns_user_when_found(
        self, user_repository: UserRepository
    ) -> None:
        await _create_user(user_repository, email="findme@example.com")

        found = await user_repository.get_by_email("findme@example.com")

        assert found is not None
        assert found.email == "findme@example.com"

    async def test_returns_none_when_not_found(
        self, user_repository: UserRepository
    ) -> None:
        found = await user_repository.get_by_email("nobody@example.com")

        assert found is None

    async def test_is_case_insensitive(self, user_repository: UserRepository) -> None:
        await _create_user(user_repository, email="Case@Test.Com")

        found = await user_repository.get_by_email("case@test.com")

        assert found is not None

    async def test_strips_whitespace(self, user_repository: UserRepository) -> None:
        await _create_user(user_repository, email="whitespace@test.com")

        found = await user_repository.get_by_email("  whitespace@test.com  ")

        assert found is not None


class TestGetByUsername:
    async def test_returns_user_when_found(
        self, user_repository: UserRepository
    ) -> None:
        await _create_user(user_repository, username="findme")

        found = await user_repository.get_by_username("findme")

        assert found is not None
        assert found.username == "findme"

    async def test_returns_none_when_not_found(
        self, user_repository: UserRepository
    ) -> None:
        found = await user_repository.get_by_username("nobody")

        assert found is None

    async def test_strips_whitespace(self, user_repository: UserRepository) -> None:
        await _create_user(user_repository, username="stripuser")

        found = await user_repository.get_by_username("  stripuser  ")

        assert found is not None


class TestGetById:
    async def test_returns_user_when_found(
        self, user_repository: UserRepository
    ) -> None:
        created = await _create_user(user_repository)

        found = await user_repository.get_by_id(created.id)

        assert found is not None
        assert found.id == created.id

    async def test_returns_none_for_unknown_id(
        self, user_repository: UserRepository
    ) -> None:
        found = await user_repository.get_by_id(uuid4())

        assert found is None


class TestExistsEmail:
    async def test_returns_true_when_exists(
        self, user_repository: UserRepository
    ) -> None:
        await _create_user(user_repository, email="exists@test.com")

        result = await user_repository.exists_email("exists@test.com")

        assert result is True

    async def test_returns_false_when_not_exists(
        self, user_repository: UserRepository
    ) -> None:
        result = await user_repository.exists_email("nobody@test.com")

        assert result is False


class TestExistsUsername:
    async def test_returns_true_when_exists(
        self, user_repository: UserRepository
    ) -> None:
        await _create_user(user_repository, username="existsuser")

        result = await user_repository.exists_username("existsuser")

        assert result is True

    async def test_returns_false_when_not_exists(
        self, user_repository: UserRepository
    ) -> None:
        result = await user_repository.exists_username("nobodyuser")

        assert result is False


class TestUniqueConstraint:
    async def test_duplicate_email_raises(
        self, user_repository: UserRepository
    ) -> None:
        await _create_user(user_repository, email="unique@test.com")

        with pytest.raises(Exception):
            await _create_user(user_repository, email="unique@test.com")

    async def test_duplicate_username_raises(
        self, user_repository: UserRepository
    ) -> None:
        await _create_user(user_repository, username="uniqueuser")

        with pytest.raises(Exception):
            await _create_user(user_repository, username="uniqueuser")

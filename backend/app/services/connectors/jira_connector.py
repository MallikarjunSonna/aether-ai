"""Jira connector — enterprise integration scaffold."""

from app.services.connectors.base_connector import BaseConnector
from app.services.connectors.mock_connector import MockConnector
from app.services.connectors.schemas import ConnectorType


class JiraConnector(BaseConnector):
    """Scaffold for the Jira connector."""

    def __init__(self) -> None:
        self._mock = MockConnector("jira")

    @property
    def type(self) -> ConnectorType:
        return self._mock.type

    @property
    def name(self) -> str:
        return self._mock.name

    async def connect(self) -> bool:
        return await self._mock.connect()

    async def disconnect(self) -> bool:
        return await self._mock.disconnect()

    async def health(self):
        return await self._mock.health()

    async def list_sources(self):
        return await self._mock.list_sources()

    async def sync(self):
        return await self._mock.sync()

    async def metadata(self):
        return await self._mock.metadata()

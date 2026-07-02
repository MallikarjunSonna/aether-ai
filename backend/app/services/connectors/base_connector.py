"""Abstract base class for all connector implementations."""

from abc import ABC, abstractmethod

from app.services.connectors.schemas import (
    ConnectorHealth,
    ConnectorMetadata,
    ConnectorType,
    SourceItem,
    SyncResult,
)


class BaseConnector(ABC):
    """Interface that every enterprise connector must implement."""

    @property
    @abstractmethod
    def type(self) -> ConnectorType:
        """Return the unique connector type identifier."""

    @property
    @abstractmethod
    def name(self) -> str:
        """Return the human-readable connector name."""

    @abstractmethod
    async def connect(self) -> bool:
        """Establish a connection to the external provider.

        Returns True if the connection was successful.
        """

    @abstractmethod
    async def disconnect(self) -> bool:
        """Tear down the connection to the external provider.

        Returns True if the disconnection was successful.
        """

    @abstractmethod
    async def health(self) -> ConnectorHealth:
        """Return the current health status of the connector."""

    @abstractmethod
    async def list_sources(self) -> list[SourceItem]:
        """List available source items from the external provider."""

    @abstractmethod
    async def sync(self) -> SyncResult:
        """Trigger a sync operation with the external provider."""

    @abstractmethod
    async def metadata(self) -> ConnectorMetadata:
        """Return full metadata about this connector instance."""

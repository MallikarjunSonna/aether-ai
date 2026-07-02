"""Factory for creating connector instances with pre-configured settings."""

from app.services.connectors.base_connector import BaseConnector
from app.services.connectors.connector_registry import ConnectorRegistry
from app.services.connectors.errors import ConnectorNotFoundError
from app.services.connectors.mock_connector import MockConnector
from app.services.connectors.schemas import ConnectorType


class ConnectorFactory:
    """Creates and pre-configures connector instances.

    The factory registers all known connector types and provides
    a single entry point for instantiation.
    """

    _instance: "ConnectorFactory | None" = None

    def __init__(self) -> None:
        self._registry = ConnectorRegistry()

    @classmethod
    def get_instance(cls) -> "ConnectorFactory":
        """Return the singleton factory instance."""
        if cls._instance is None:
            cls._instance = cls()
        return cls._instance

    def register_defaults(self) -> None:
        """Register all built-in connector types.

        Each provider gets a MockConnector instance keyed by its
        ConnectorType.  Real implementations will replace these
        as they are built.
        """
        providers: list[ConnectorType] = [
            "github",
            "notion",
            "confluence",
            "google_drive",
            "sharepoint",
            "slack",
            "jira",
            "linear",
        ]
        for provider in providers:
            connector = MockConnector(provider)
            self._registry.register(connector)

    def create(self, connector_type: ConnectorType) -> BaseConnector:
        """Return a registered connector instance.

        Raises ConnectorNotFoundError if the type has not been registered.
        """
        try:
            return self._registry.get(connector_type)
        except ConnectorNotFoundError:
            raise ConnectorNotFoundError(connector_type) from None

    def list_available(self) -> list[ConnectorType]:
        """Return all registered connector types."""
        return self._registry.list_types()

    def list_connectors(self) -> list[BaseConnector]:
        """Return all registered connector instances."""
        return self._registry.list()

    def register_custom(self, connector: BaseConnector) -> None:
        """Register a custom connector implementation."""
        self._registry.register(connector)

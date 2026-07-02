"""Registry for managing connector implementations."""

import logging

from app.services.connectors.base_connector import BaseConnector
from app.services.connectors.errors import ConnectorNotFoundError
from app.services.connectors.schemas import ConnectorType

logger = logging.getLogger(__name__)


class ConnectorRegistry:
    """Manages registration and retrieval of connector implementations."""

    def __init__(self) -> None:
        self._connectors: dict[ConnectorType, BaseConnector] = {}

    def register(self, connector: BaseConnector) -> None:
        """Register a connector implementation."""
        if connector.type in self._connectors:
            logger.warning(
                "Connector '%s' is already registered and will be replaced.",
                connector.type,
            )
        self._connectors[connector.type] = connector
        logger.info("Registered connector: %s (%s)", connector.name, connector.type)

    def get(self, connector_type: ConnectorType) -> BaseConnector:
        """Retrieve a connector by type. Raises ConnectorNotFoundError if not found."""
        connector = self._connectors.get(connector_type)
        if connector is None:
            raise ConnectorNotFoundError(connector_type)
        return connector

    def list_types(self) -> list[ConnectorType]:
        """Return all registered connector types."""
        return list(self._connectors.keys())

    def list(self) -> list[BaseConnector]:
        """Return all registered connector instances."""
        return list(self._connectors.values())

    def has(self, connector_type: ConnectorType) -> bool:
        """Return whether a connector type is registered."""
        return connector_type in self._connectors

    def unregister(self, connector_type: ConnectorType) -> None:
        """Unregister a connector by type."""
        self._connectors.pop(connector_type, None)
        logger.info("Unregistered connector: %s", connector_type)

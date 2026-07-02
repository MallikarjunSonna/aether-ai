"""Enterprise Connector Framework — plugin architecture for external integrations."""

from app.services.connectors.connector_registry import ConnectorRegistry
from app.services.connectors.connector_factory import ConnectorFactory
from app.services.connectors.base_connector import BaseConnector
from app.services.connectors.schemas import (
    ConnectorMetadata,
    ConnectorStatus,
    ConnectorHealth,
    SyncResult,
    SourceItem,
    ConnectorType,
)

__all__ = [
    "BaseConnector",
    "ConnectorRegistry",
    "ConnectorFactory",
    "ConnectorMetadata",
    "ConnectorStatus",
    "ConnectorHealth",
    "SyncResult",
    "SourceItem",
    "ConnectorType",
]

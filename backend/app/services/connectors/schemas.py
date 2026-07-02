"""Pydantic schemas for the Enterprise Connector Framework."""

from datetime import datetime
from typing import Literal

from pydantic import BaseModel, Field
from pydantic.alias_generators import to_camel

ConnectorType = Literal[
    "github",
    "notion",
    "confluence",
    "google_drive",
    "sharepoint",
    "slack",
    "jira",
    "linear",
    "custom",
]

ConnectorStatus = Literal["disconnected", "connecting", "connected", "error"]
HealthStatus = Literal["healthy", "degraded", "unreachable", "unknown"]

AuthenticationMethod = Literal[
    "oauth",
    "api_key",
    "basic_auth",
    "service_account",
    "custom",
]

SyncFrequency = Literal[
    "manual",
    "realtime",
    "every_5m",
    "every_15m",
    "every_1h",
    "every_6h",
    "every_24h",
]


class _CamelCaseAliasModel(BaseModel):
    model_config = {"alias_generator": to_camel, "populate_by_name": True}


class SourceItem(_CamelCaseAliasModel):
    """A source item returned by list_sources."""

    id: str
    name: str
    type: str
    path: str | None = None
    last_modified: datetime | None = None
    size: int | None = None


class SyncResult(_CamelCaseAliasModel):
    """Result of a sync operation."""

    success: bool
    items_synced: int = 0
    items_failed: int = 0
    duration_ms: int = 0
    cursor: str | None = None
    error: str | None = None


class ConnectorHealth(_CamelCaseAliasModel):
    """Health status for a connector."""

    status: HealthStatus
    latency: int | None = None
    last_checked: datetime | None = None
    message: str | None = None


class FutureCapabilities(_CamelCaseAliasModel):
    """Metadata describing what the connector will support in future."""

    supports_oauth: bool = False
    supports_api_keys: bool = False
    supports_webhooks: bool = False
    supports_polling: bool = False
    supports_incremental_sync: bool = False
    supports_permissions: bool = False
    supports_scopes: bool = False
    supports_rate_limits: bool = False


class ConnectorMetadata(_CamelCaseAliasModel):
    """Descriptor returned by every connector."""

    id: str
    name: str
    provider: ConnectorType
    status: ConnectorStatus
    health: ConnectorHealth
    connected: bool
    last_sync: datetime | None = None
    sync_frequency: SyncFrequency = "manual"
    workspace_id: str | None = None
    organization_id: str | None = None
    supported_source_types: list[str] = Field(default_factory=list)
    authentication_type: AuthenticationMethod = "custom"
    future_capabilities: FutureCapabilities = Field(default_factory=FutureCapabilities)

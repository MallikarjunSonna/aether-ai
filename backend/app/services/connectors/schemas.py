"""Pydantic schemas for the Enterprise Connector Framework."""

from datetime import datetime
from typing import Literal

from pydantic import BaseModel, Field

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

SyncFrequency = Literal["manual", "realtime", "every_5m", "every_15m", "every_1h", "every_6h", "every_24h"]


class SourceItem(BaseModel):
    """A source item returned by list_sources."""

    id: str
    name: str
    type: str
    path: str | None = None
    lastModified: datetime | None = None
    size: int | None = None


class SyncResult(BaseModel):
    """Result of a sync operation."""

    success: bool
    itemsSynced: int = 0
    itemsFailed: int = 0
    durationMs: int = 0
    cursor: str | None = None
    error: str | None = None


class ConnectorHealth(BaseModel):
    """Health status for a connector."""

    status: HealthStatus
    latency: int | None = None
    lastChecked: datetime | None = None
    message: str | None = None


class FutureCapabilities(BaseModel):
    """Metadata describing what the connector will support in future."""

    supportsOAuth: bool = False
    supportsApiKeys: bool = False
    supportsWebhooks: bool = False
    supportsPolling: bool = False
    supportsIncrementalSync: bool = False
    supportsPermissions: bool = False
    supportsScopes: bool = False
    supportsRateLimits: bool = False


class ConnectorMetadata(BaseModel):
    """Descriptor returned by every connector."""

    id: str
    name: str
    provider: ConnectorType
    status: ConnectorStatus
    health: ConnectorHealth
    connected: bool
    lastSync: datetime | None = None
    syncFrequency: SyncFrequency = "manual"
    workspaceId: str | None = None
    organizationId: str | None = None
    supportedSourceTypes: list[str] = Field(default_factory=list)
    authenticationType: AuthenticationMethod = "custom"
    futureCapabilities: FutureCapabilities = Field(default_factory=FutureCapabilities)

"""Mock connector that returns deterministic fake data for all interface methods.

Used for development and testing until real provider implementations exist.
"""

from datetime import datetime, timezone

from app.services.connectors.base_connector import BaseConnector
from app.services.connectors.schemas import (
    AuthenticationMethod,
    ConnectorHealth,
    ConnectorMetadata,
    ConnectorStatus,
    ConnectorType,
    FutureCapabilities,
    SourceItem,
    SyncFrequency,
    SyncResult,
)


def _utcnow() -> datetime:
    return datetime.now(timezone.utc)


MOCK_AUTH_MAP: dict[ConnectorType, AuthenticationMethod] = {
    "github": "oauth",
    "notion": "oauth",
    "confluence": "api_key",
    "google_drive": "oauth",
    "sharepoint": "oauth",
    "slack": "oauth",
    "jira": "api_key",
    "linear": "api_key",
    "custom": "custom",
}

MOCK_DISPLAY_NAMES: dict[ConnectorType, str] = {
    "github": "GitHub",
    "notion": "Notion",
    "confluence": "Confluence",
    "google_drive": "Google Drive",
    "sharepoint": "SharePoint",
    "slack": "Slack",
    "jira": "Jira",
    "linear": "Linear",
    "custom": "Custom Connector",
}

MOCK_SOURCE_TYPES: dict[ConnectorType, list[str]] = {
    "github": ["repository", "issue", "pull_request", "file"],
    "notion": ["page", "database", "block"],
    "confluence": ["page", "blog_post", "attachment", "space"],
    "google_drive": ["file", "folder", "document", "spreadsheet"],
    "sharepoint": ["site", "list", "library", "file"],
    "slack": ["channel", "message", "file", "thread"],
    "jira": ["project", "issue", "epic", "sprint"],
    "linear": ["project", "issue", "team", "cycle"],
    "custom": ["source"],
}


class MockConnector(BaseConnector):
    """Connector implementation that returns deterministic mock data."""

    def __init__(self, connector_type: ConnectorType) -> None:
        self._type = connector_type
        self._connected = False
        self._status: ConnectorStatus = "disconnected"

    @property
    def type(self) -> ConnectorType:
        return self._type

    @property
    def name(self) -> str:
        return MOCK_DISPLAY_NAMES.get(self._type, "Unknown")

    async def connect(self) -> bool:
        self._connected = True
        self._status = "connected"
        return True

    async def disconnect(self) -> bool:
        self._connected = False
        self._status = "disconnected"
        return True

    async def health(self) -> ConnectorHealth:
        return ConnectorHealth(
            status="healthy",
            latency=42,
            lastChecked=_utcnow(),
            message=f"{self.name} is reachable.",
        )

    async def list_sources(self) -> list[SourceItem]:
        return [
            SourceItem(
                id=f"{self._type}-src-{i}",
                name=f"{self.name} Source {i}",
                type=st,
                path=f"/{self._type}/{st}/{i}",
                lastModified=_utcnow(),
                size=1024 * i,
            )
            for i, st in enumerate(MOCK_SOURCE_TYPES.get(self._type, ["source"]), start=1)
        ]

    async def sync(self) -> SyncResult:
        return SyncResult(
            success=True,
            itemsSynced=42,
            itemsFailed=0,
            durationMs=1234,
            cursor="mock-cursor-001",
        )

    async def metadata(self) -> ConnectorMetadata:
        return ConnectorMetadata(
            id=f"conn-{self._type}",
            name=self.name,
            provider=self._type,
            status=self._status,
            health=await self.health(),
            connected=self._connected,
            lastSync=_utcnow(),
            syncFrequency="every_1h",
            workspaceId="ws-mock",
            organizationId="org-mock",
            supportedSourceTypes=MOCK_SOURCE_TYPES.get(self._type, ["source"]),
            authenticationType=MOCK_AUTH_MAP.get(self._type, "custom"),
            futureCapabilities=FutureCapabilities(
                supportsOAuth=True,
                supportsApiKeys=True,
                supportsWebhooks=True,
                supportsPolling=True,
                supportsIncrementalSync=True,
                supportsPermissions=True,
                supportsScopes=True,
                supportsRateLimits=True,
            ),
        )

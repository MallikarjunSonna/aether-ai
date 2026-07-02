"""Tests for the Enterprise Connector Framework."""

import pytest

from app.services.connectors.base_connector import BaseConnector
from app.services.connectors.connector_factory import ConnectorFactory
from app.services.connectors.connector_registry import ConnectorRegistry
from app.services.connectors.errors import (
    ConnectorAuthenticationError,
    ConnectorError,
    ConnectorNetworkError,
    ConnectorNotConnectedError,
    ConnectorNotFoundError,
    ConnectorRateLimitError,
)
from app.services.connectors.mock_connector import MockConnector
from app.services.connectors.schemas import (
    ConnectorHealth,
    ConnectorMetadata,
    ConnectorType,
    FutureCapabilities,
    SourceItem,
    SyncResult,
)


class TestConnectorRegistry:
    """Tests for the ConnectorRegistry."""

    def test_register_and_get(self) -> None:
        registry = ConnectorRegistry()
        connector = MockConnector("github")
        registry.register(connector)
        assert registry.get("github") is connector

    def test_get_unknown_raises(self) -> None:
        registry = ConnectorRegistry()
        with pytest.raises(ConnectorNotFoundError):
            registry.get("notion")

    def test_list_types(self) -> None:
        registry = ConnectorRegistry()
        registry.register(MockConnector("github"))
        registry.register(MockConnector("slack"))
        assert set(registry.list_types()) == {"github", "slack"}

    def test_list(self) -> None:
        registry = ConnectorRegistry()
        g = MockConnector("github")
        s = MockConnector("slack")
        registry.register(g)
        registry.register(s)
        assert registry.list() == [g, s]

    def test_has(self) -> None:
        registry = ConnectorRegistry()
        registry.register(MockConnector("github"))
        assert registry.has("github") is True
        assert registry.has("notion") is False

    def test_unregister(self) -> None:
        registry = ConnectorRegistry()
        registry.register(MockConnector("github"))
        registry.unregister("github")
        assert registry.has("github") is False


class TestConnectorFactory:
    """Tests for the ConnectorFactory."""

    def test_singleton(self) -> None:
        assert ConnectorFactory.get_instance() is ConnectorFactory.get_instance()

    def test_register_defaults_registers_all_providers(self) -> None:
        factory = ConnectorFactory()
        factory.register_defaults()
        available = factory.list_available()
        assert "github" in available
        assert "notion" in available
        assert "confluence" in available
        assert "google_drive" in available
        assert "sharepoint" in available
        assert "slack" in available
        assert "jira" in available
        assert "linear" in available

    def test_create_returns_connector(self) -> None:
        factory = ConnectorFactory()
        factory.register_defaults()
        connector = factory.create("github")
        assert isinstance(connector, BaseConnector)

    def test_create_unknown_raises(self) -> None:
        factory = ConnectorFactory()
        with pytest.raises(ConnectorNotFoundError):
            factory.create("notion")

    def test_register_custom(self) -> None:
        factory = ConnectorFactory()
        custom = MockConnector("custom")
        factory.register_custom(custom)
        assert factory.create("custom") is custom


class TestMockConnector:
    """Tests for the MockConnector used as placeholder for all providers."""

    @pytest.mark.parametrize(
        "provider",
        ["github", "notion", "confluence", "google_drive", "sharepoint", "slack", "jira", "linear", "custom"],
    )
    async def test_all_providers_have_unique_metadata(self, provider: ConnectorType) -> None:
        c = MockConnector(provider)
        meta = await c.metadata()
        assert meta.provider == provider
        assert meta.name
        assert meta.id == f"conn-{provider}"

    @pytest.mark.parametrize(
        "provider",
        ["github", "notion", "confluence", "google_drive", "sharepoint", "slack", "jira", "linear", "custom"],
    )
    async def test_all_providers_return_deterministic_mock_data(self, provider: ConnectorType) -> None:
        c = MockConnector(provider)
        m1 = await c.metadata()
        m2 = await c.metadata()
        assert m1.name == m2.name
        assert m1.provider == m2.provider

    async def test_connect_and_disconnect(self) -> None:
        c = MockConnector("github")
        meta_before = await c.metadata()
        assert meta_before.connected is False
        await c.connect()
        meta_after_connect = await c.metadata()
        assert meta_after_connect.connected is True
        await c.disconnect()
        meta_after_disconnect = await c.metadata()
        assert meta_after_disconnect.connected is False

    async def test_health_returns_healthy(self) -> None:
        c = MockConnector("github")
        health = await c.health()
        assert isinstance(health, ConnectorHealth)
        assert health.status == "healthy"
        assert health.latency == 42

    async def test_list_sources_returns_items(self) -> None:
        c = MockConnector("github")
        sources = await c.list_sources()
        assert len(sources) > 0
        for s in sources:
            assert isinstance(s, SourceItem)
            assert s.id
            assert s.name

    async def test_sync_returns_success(self) -> None:
        c = MockConnector("github")
        result = await c.sync()
        assert isinstance(result, SyncResult)
        assert result.success is True
        assert result.itemsSynced == 42

    async def test_metadata_shape(self) -> None:
        c = MockConnector("slack")
        meta = await c.metadata()
        assert isinstance(meta, ConnectorMetadata)
        assert isinstance(meta.health, ConnectorHealth)
        assert isinstance(meta.futureCapabilities, FutureCapabilities)
        assert meta.futureCapabilities.supportsOAuth is True
        assert meta.futureCapabilities.supportsWebhooks is True


class TestConnectorErrors:
    """Tests for connector error types."""

    def test_base_error(self) -> None:
        err = ConnectorError("test", code="test_code", connector="github")
        assert err.message == "test"
        assert err.code == "test_code"
        assert err.connector == "github"

    def test_not_connected_error(self) -> None:
        err = ConnectorNotConnectedError()
        assert err.code == "not_connected"

    def test_authentication_error(self) -> None:
        err = ConnectorAuthenticationError()
        assert err.code == "authentication_failed"

    def test_rate_limit_error(self) -> None:
        err = ConnectorRateLimitError()
        assert err.code == "rate_limited"

    def test_network_error(self) -> None:
        err = ConnectorNetworkError()
        assert err.code == "network_error"

    def test_not_found_error(self) -> None:
        err = ConnectorNotFoundError("custom")
        assert err.code == "unknown_connector"
        assert "custom" in err.message


class TestConnectorBaseInterface:
    """Verify that all provider scaffold classes implement BaseConnector."""

    def test_github_connector_type_and_name(self) -> None:
        from app.services.connectors.github_connector import GitHubConnector

        c = GitHubConnector()
        assert c.type == "github"
        assert c.name == "GitHub"

    def test_notion_connector(self) -> None:
        from app.services.connectors.notion_connector import NotionConnector

        c = NotionConnector()
        assert c.type == "notion"
        assert c.name == "Notion"

    def test_confluence_connector(self) -> None:
        from app.services.connectors.confluence_connector import ConfluenceConnector

        c = ConfluenceConnector()
        assert c.type == "confluence"

    def test_googledrive_connector(self) -> None:
        from app.services.connectors.googledrive_connector import GoogleDriveConnector

        c = GoogleDriveConnector()
        assert c.type == "google_drive"

    def test_sharepoint_connector(self) -> None:
        from app.services.connectors.sharepoint_connector import SharePointConnector

        c = SharePointConnector()
        assert c.type == "sharepoint"

    def test_slack_connector(self) -> None:
        from app.services.connectors.slack_connector import SlackConnector

        c = SlackConnector()
        assert c.type == "slack"

    def test_jira_connector(self) -> None:
        from app.services.connectors.jira_connector import JiraConnector

        c = JiraConnector()
        assert c.type == "jira"

    def test_linear_connector(self) -> None:
        from app.services.connectors.linear_connector import LinearConnector

        c = LinearConnector()
        assert c.type == "linear"

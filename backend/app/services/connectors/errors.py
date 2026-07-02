"""Connector-neutral error types for the Enterprise Connector Framework."""

from typing import Any

from app.services.connectors.schemas import ConnectorType


class ConnectorError(Exception):
    """Base error for connector failures with a machine-readable code."""

    def __init__(
        self,
        message: str,
        code: str = "unknown",
        connector: ConnectorType | None = None,
        details: dict[str, Any] | None = None,
    ) -> None:
        self.message = message
        self.code = code
        self.connector = connector
        self.details = details or {}
        super().__init__(self.message)


class ConnectorNotConnectedError(ConnectorError):
    """Raised when an operation is attempted on a disconnected connector."""

    def __init__(
        self,
        message: str = "Connector is not connected. Call connect() first.",
        connector: ConnectorType | None = None,
    ) -> None:
        super().__init__(
            message=message,
            code="not_connected",
            connector=connector,
        )


class ConnectorAuthenticationError(ConnectorError):
    """Raised when connector credentials are invalid or missing."""

    def __init__(
        self,
        message: str = "Connector authentication failed. Check your credentials.",
        connector: ConnectorType | None = None,
    ) -> None:
        super().__init__(
            message=message,
            code="authentication_failed",
            connector=connector,
        )


class ConnectorRateLimitError(ConnectorError):
    """Raised when the external provider rate limit is exceeded."""

    def __init__(
        self,
        message: str = "Rate limit exceeded. Please wait before retrying.",
        connector: ConnectorType | None = None,
    ) -> None:
        super().__init__(
            message=message,
            code="rate_limited",
            connector=connector,
        )


class ConnectorNetworkError(ConnectorError):
    """Raised when a network error occurs while contacting the provider."""

    def __init__(
        self,
        message: str = "Unable to reach the external service. Check your network connection.",
        connector: ConnectorType | None = None,
    ) -> None:
        super().__init__(
            message=message,
            code="network_error",
            connector=connector,
        )


class ConnectorNotFoundError(ConnectorError):
    """Raised when an unknown or unsupported connector type is requested."""

    def __init__(self, connector: str) -> None:
        super().__init__(
            message=f"Unknown connector: {connector}.",
            code="unknown_connector",
        )

"""Provider-neutral error types for the AI gateway."""

from typing import Any

from app.services.ai.schemas import ProviderType


class AIProviderError(Exception):
    """Base error for AI provider failures with a machine-readable code."""

    def __init__(
        self,
        message: str,
        code: str = "unknown",
        provider: ProviderType | None = None,
        details: dict[str, Any] | None = None,
    ) -> None:
        self.message = message
        self.code = code
        self.provider = provider
        self.details = details or {}
        super().__init__(self.message)


class AIAuthenticationError(AIProviderError):
    """Raised when a provider API key is invalid or missing."""

    def __init__(
        self,
        message: str = "AI service is not configured. Please set the provider API key.",
        provider: ProviderType | None = None,
    ) -> None:
        super().__init__(
            message=message,
            code="invalid_api_key",
            provider=provider,
        )


class AIRateLimitError(AIProviderError):
    """Raised when a provider rate limit is exceeded."""

    def __init__(
        self,
        message: str = "Too many requests. Please wait a moment and try again.",
        provider: ProviderType | None = None,
    ) -> None:
        super().__init__(
            message=message,
            code="rate_limited",
            provider=provider,
        )


class AINetworkError(AIProviderError):
    """Raised when a network error occurs while contacting a provider."""

    def __init__(
        self,
        message: str = "Unable to reach the AI service. Check your network connection.",
        provider: ProviderType | None = None,
    ) -> None:
        super().__init__(
            message=message,
            code="network_error",
            provider=provider,
        )


class AIUnknownProviderError(AIProviderError):
    """Raised when an unknown or unsupported provider is requested."""

    def __init__(self, provider: str) -> None:
        super().__init__(
            message=f"Unknown AI provider: {provider}.",
            code="unknown_provider",
        )

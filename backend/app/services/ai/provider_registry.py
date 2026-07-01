"""Registry for managing AI provider instances."""

import logging

from app.services.ai.base_provider import AIProvider
from app.services.ai.errors import AIUnknownProviderError
from app.services.ai.schemas import ProviderType

logger = logging.getLogger(__name__)


class ProviderRegistry:
    """Manages registration and retrieval of AI provider implementations."""

    def __init__(self) -> None:
        self._providers: dict[ProviderType, AIProvider] = {}

    def register(self, provider: AIProvider) -> None:
        """Register a provider implementation."""
        if provider.type in self._providers:
            logger.warning(
                "Provider '%s' is already registered and will be replaced.",
                provider.type,
            )
        self._providers[provider.type] = provider
        logger.info("Registered AI provider: %s (%s)", provider.name, provider.type)

    def get(self, provider_type: ProviderType) -> AIProvider:
        """Retrieve a provider by type. Raises AIUnknownProviderError if not found."""
        provider = self._providers.get(provider_type)
        if provider is None:
            raise AIUnknownProviderError(provider_type)
        return provider

    def list(self) -> list[ProviderType]:
        """Return all registered provider types."""
        return list(self._providers.keys())

    def has(self, provider_type: ProviderType) -> bool:
        """Return whether a provider type is registered."""
        return provider_type in self._providers

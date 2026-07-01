"""Abstract base class for AI provider implementations."""

from abc import ABC, abstractmethod

from app.services.ai.schemas import AIModel, ChatRequest, ChatResponse, ProviderType


class AIProvider(ABC):
    """Interface that every AI provider must implement."""

    @property
    @abstractmethod
    def type(self) -> ProviderType:
        """Return the unique provider type identifier."""

    @property
    @abstractmethod
    def name(self) -> str:
        """Return the human-readable provider name."""

    @abstractmethod
    async def generate(self, request: ChatRequest) -> ChatResponse:
        """Send a chat request and return the full response."""

    @abstractmethod
    async def stream(self, request: ChatRequest):
        """Send a chat request and yield streaming response chunks.

        Yields tuples of (content: str, finish_reason: str | None).
        The final chunk should include usage information.
        """

    @abstractmethod
    async def list_models(self) -> list[AIModel]:
        """Return the list of available models for this provider."""

    @abstractmethod
    async def health_check(self) -> bool:
        """Return whether the provider is configured and reachable."""

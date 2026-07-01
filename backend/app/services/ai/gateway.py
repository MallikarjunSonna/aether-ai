"""AI Gateway — orchestrates routing requests to the correct provider."""

import logging
import time
import uuid

from app.services.ai.errors import AIProviderError
from app.services.ai.model_registry import ModelRegistry
from app.services.ai.provider_registry import ProviderRegistry
from app.services.ai.schemas import (
    AIModel,
    ChatRequest,
    ChatResponse,
    ProviderType,
)

logger = logging.getLogger(__name__)


class AIGateway:
    """Routes AI generation requests to the appropriate provider."""

    def __init__(
        self,
        provider_registry: ProviderRegistry,
        model_registry: ModelRegistry,
    ) -> None:
        self._providers = provider_registry
        self._models = model_registry

    async def generate(self, request: ChatRequest) -> ChatResponse:
        """Send a chat request to the specified provider and return the response."""
        provider = self._providers.get(request.provider)
        start = time.monotonic()
        response = await provider.generate(request)
        elapsed = time.monotonic() - start

        logger.info(
            "AI generate | provider=%s model=%s latency=%.2fs tokens=%d",
            request.provider,
            request.model,
            elapsed,
            response.usage.total_tokens,
        )

        return response

    async def stream(self, request: ChatRequest):
        """Send a chat request and yield streaming SSE-compatible chunks.

        Each yield is a dict with keys: id, model, provider, content, usage,
        finish_reason. The last chunk includes final usage data and
        finish_reason.
        """
        provider = self._providers.get(request.provider)
        start = time.monotonic()
        stream_id = str(uuid.uuid4())
        full_content = ""

        try:
            async for content, finish_reason in provider.stream(request):
                full_content += content

                yield {
                    "id": stream_id,
                    "model": request.model,
                    "provider": request.provider,
                    "content": content,
                    "usage": None,
                    "finish_reason": finish_reason,
                }

            elapsed = time.monotonic() - start
            logger.info(
                "AI stream | provider=%s model=%s latency=%.2fs",
                request.provider,
                request.model,
                elapsed,
            )

        except AIProviderError:
            raise
        except Exception as exc:
            logger.exception("Unexpected error during AI stream.")
            raise AIProviderError(
                message="An unexpected error occurred during streaming.",
                code="stream_error",
                provider=request.provider,
            ) from exc

    def list_providers(self) -> list[ProviderType]:
        """Return all registered provider types."""
        return self._providers.list()

    def list_models(self) -> list[AIModel]:
        """Return all registered models."""
        return self._models.list_all()

    def get_provider_models(self, provider_type: ProviderType) -> list[AIModel]:
        """Return models for a specific provider."""
        return self._models.get_by_provider(provider_type)

    def get_provider_name(self, provider_type: ProviderType) -> str:
        """Return the human-readable name of a provider."""
        return self._providers.get(provider_type).name

    async def health_check(self, provider_type: ProviderType) -> bool:
        """Check if a provider is configured and reachable."""
        provider = self._providers.get(provider_type)
        return await provider.health_check()

    def _build_gateway(self) -> None:
        """Initialize providers and register their models."""
        from app.services.ai.anthropic_provider import MODELS as ANTHROPIC_MODELS
        from app.services.ai.anthropic_provider import AnthropicProvider
        from app.services.ai.mock_provider import MODELS as MOCK_MODELS
        from app.services.ai.mock_provider import MockProvider
        from app.services.ai.openai_provider import MODELS as OPENAI_MODELS
        from app.services.ai.openai_provider import (
            OpenAIProvider,
        )

        openai = OpenAIProvider()
        anthropic = AnthropicProvider()
        mock = MockProvider()

        self._providers.register(openai)
        self._providers.register(anthropic)
        self._providers.register(mock)

        self._models.register_many(OPENAI_MODELS)
        self._models.register_many(ANTHROPIC_MODELS)
        self._models.register_many(MOCK_MODELS)


def build_gateway() -> AIGateway:
    """Create and return a fully initialized AIGateway instance."""
    provider_registry = ProviderRegistry()
    model_registry = ModelRegistry()
    gateway = AIGateway(provider_registry, model_registry)
    gateway._build_gateway()
    return gateway

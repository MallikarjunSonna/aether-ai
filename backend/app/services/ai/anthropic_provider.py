"""Anthropic provider implementation using the official Python SDK."""

import logging

import anthropic
from anthropic import (
    APIConnectionError,
    APIError,
    AuthenticationError,
    RateLimitError,
)

from app.config.settings import get_settings
from app.services.ai.base_provider import AIProvider
from app.services.ai.errors import (
    AIAuthenticationError,
    AINetworkError,
    AIProviderError,
    AIRateLimitError,
)
from app.services.ai.schemas import (
    AIModel,
    ChatRequest,
    ChatResponse,
    FinishReason,
    ProviderType,
    TokenUsage,
)

logger = logging.getLogger(__name__)

MODELS: list[AIModel] = [
    AIModel(
        id="claude-sonnet-4-6",
        provider="anthropic",
        name="Claude Sonnet 4.6",
        capabilities=["chat", "streaming"],
        description="Best balance of intelligence and speed for most workloads.",
        max_tokens=8192,
        supports_streaming=True,
    ),
    AIModel(
        id="claude-haiku-4-5",
        provider="anthropic",
        name="Claude Haiku 4.5",
        capabilities=["chat", "streaming"],
        description="Fast and cost-effective for simple tasks "
        "and high-throughput use cases.",
        max_tokens=8192,
        supports_streaming=True,
    ),
    AIModel(
        id="claude-opus-4-7",
        provider="anthropic",
        name="Claude Opus 4.7",
        capabilities=["chat", "streaming"],
        description="Most capable model for complex reasoning, research, and strategy.",
        max_tokens=8192,
        supports_streaming=True,
    ),
]


def _map_finish_reason(reason: str | None) -> FinishReason:
    match reason:
        case "end_turn" | "stop_sequence" | "pause_turn":
            return "stop"
        case "max_tokens":
            return "length"
        case "tool_use":
            return "stop"
        case "refusal":
            return "error"
        case _:
            return "error"


def _separate_system_messages(
    messages: list[dict],
) -> tuple[str | None, list[dict]]:
    system_parts: list[str] = []
    filtered: list[dict] = []
    for msg in messages:
        if msg["role"] == "system":
            system_parts.append(msg["content"])
        else:
            filtered.append({"role": msg["role"], "content": msg["content"]})
    return ("\n".join(system_parts) if system_parts else None, filtered)


class AnthropicProvider(AIProvider):
    """Provider implementation for Anthropic's Messages API."""

    @property
    def type(self) -> ProviderType:
        return "anthropic"

    @property
    def name(self) -> str:
        return "Anthropic"

    def __init__(self) -> None:
        settings = get_settings()
        self._client = anthropic.AsyncAnthropic(
            api_key=settings.ANTHROPIC_API_KEY,
            max_retries=0,
        )

    async def generate(self, request: ChatRequest) -> ChatResponse:
        messages_dict = [
            {"role": m.role, "content": m.content} for m in request.messages
        ]
        system_content, filtered_messages = _separate_system_messages(messages_dict)

        try:
            response = await self._client.messages.create(
                model=request.model,
                max_tokens=request.max_tokens or 2048,
                messages=filtered_messages,
                system=system_content,
                stop_sequences=request.stop,
            )

            text_content = "".join(
                block.text for block in response.content if block.type == "text"
            )

            return ChatResponse(
                id=response.id,
                model=response.model,
                provider="anthropic",
                message={"role": "assistant", "content": text_content},
                usage=TokenUsage(
                    prompt_tokens=response.usage.input_tokens,
                    completion_tokens=response.usage.output_tokens,
                    total_tokens=(
                        response.usage.input_tokens + response.usage.output_tokens
                    ),
                ),
                finish_reason=_map_finish_reason(response.stop_reason),
            )
        except Exception as exc:
            raise self._map_error(exc) from exc

    async def stream(self, request: ChatRequest):
        messages_dict = [
            {"role": m.role, "content": m.content} for m in request.messages
        ]
        system_content, filtered_messages = _separate_system_messages(messages_dict)

        try:
            stream = await self._client.messages.create(
                model=request.model,
                max_tokens=request.max_tokens or 2048,
                messages=filtered_messages,
                system=system_content,
                stop_sequences=request.stop,
                stream=True,
            )

            async for event in stream:
                if (event.type == "content_block_delta"
                        and event.delta.type == "text_delta"):
                    yield event.delta.text, None

        except Exception as exc:
            raise self._map_error(exc) from exc

    async def list_models(self) -> list[AIModel]:
        return MODELS

    async def health_check(self) -> bool:
        settings = get_settings()
        if not settings.ANTHROPIC_API_KEY:
            return False
        try:
            await self._client.messages.create(
                model="claude-sonnet-4-6",
                max_tokens=1,
                messages=[{"role": "user", "content": "ping"}],
            )
            return True
        except AuthenticationError:
            return False
        except Exception:
            return False

    def _map_error(self, error: Exception) -> AIProviderError:
        if isinstance(error, AuthenticationError):
            return AIAuthenticationError(provider="anthropic")
        if isinstance(error, RateLimitError):
            return AIRateLimitError(provider="anthropic")
        if isinstance(error, APIConnectionError):
            return AINetworkError(provider="anthropic")
        if isinstance(error, APIError):
            return AIProviderError(
                message=error.message or "Anthropic API returned an error.",
                code="unknown",
                provider="anthropic",
            )
        return AIProviderError(
            message="An unexpected error occurred while calling Anthropic.",
            code="unknown",
            provider="anthropic",
        )

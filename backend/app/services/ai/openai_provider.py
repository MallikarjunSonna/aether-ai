"""OpenAI provider implementation using the official Python SDK."""

import logging

import openai
from openai import (
    APIConnectionError,
    APIError,
    AuthenticationError,
    RateLimitError,
)

from app.config.settings import get_settings
from app.services.ai.base_provider import AIProvider
from app.services.ai.errors import AIAuthenticationError, AINetworkError, AIProviderError, AIRateLimitError
from app.services.ai.schemas import AIModel, ChatRequest, ChatResponse, FinishReason, ProviderType, TokenUsage

logger = logging.getLogger(__name__)

MODELS: list[AIModel] = [
    AIModel(
        id="gpt-4.1",
        provider="openai",
        name="GPT-4.1",
        capabilities=["chat", "streaming"],
        description="OpenAI GPT-4.1 model for complex reasoning and instruction following.",
        max_tokens=32768,
        supports_streaming=True,
    ),
    AIModel(
        id="gpt-4.1-mini",
        provider="openai",
        name="GPT-4.1 Mini",
        capabilities=["chat", "streaming"],
        description="Faster and more cost-effective variant of GPT-4.1.",
        max_tokens=32768,
        supports_streaming=True,
    ),
    AIModel(
        id="gpt-4o-mini",
        provider="openai",
        name="GPT-4o Mini",
        capabilities=["chat", "streaming"],
        description="Fast, affordable small model for simple tasks.",
        max_tokens=16384,
        supports_streaming=True,
    ),
]


def _map_finish_reason(reason: str | None) -> FinishReason:
    match reason:
        case "stop":
            return "stop"
        case "length":
            return "length"
        case "tool_calls" | "function_call":
            return "stop"
        case _:
            return "error"


class OpenAIProvider(AIProvider):
    """Provider implementation for OpenAI's chat completion API."""

    @property
    def type(self) -> ProviderType:
        return "openai"

    @property
    def name(self) -> str:
        return "OpenAI"

    def __init__(self) -> None:
        settings = get_settings()
        self._client = openai.AsyncOpenAI(
            api_key=settings.OPENAI_API_KEY,
            max_retries=0,
        )

    async def generate(self, request: ChatRequest) -> ChatResponse:
        try:
            response = await self._client.chat.completions.create(
                model=request.model,
                messages=[{"role": m.role, "content": m.content} for m in request.messages],
                temperature=request.temperature,
                max_tokens=request.max_tokens,
                top_p=request.top_p,
                frequency_penalty=request.frequency_penalty,
                presence_penalty=request.presence_penalty,
                stop=request.stop,
            )

            choice = response.choices[0]
            content = choice.message.content or ""

            return ChatResponse(
                id=response.id,
                model=response.model,
                provider="openai",
                message={"role": "assistant", "content": content},
                usage=TokenUsage(
                    prompt_tokens=response.usage.prompt_tokens if response.usage else 0,
                    completion_tokens=response.usage.completion_tokens if response.usage else 0,
                    total_tokens=response.usage.total_tokens if response.usage else 0,
                ),
                finish_reason=_map_finish_reason(choice.finish_reason),
            )
        except Exception as exc:
            raise self._map_error(exc)

    async def stream(self, request: ChatRequest):
        try:
            stream = await self._client.chat.completions.create(
                model=request.model,
                messages=[{"role": m.role, "content": m.content} for m in request.messages],
                temperature=request.temperature,
                max_tokens=request.max_tokens,
                top_p=request.top_p,
                frequency_penalty=request.frequency_penalty,
                presence_penalty=request.presence_penalty,
                stop=request.stop,
                stream=True,
            )

            async for chunk in stream:
                choice = chunk.choices[0] if chunk.choices else None
                if not choice:
                    continue

                content = choice.delta.content or ""
                finish_reason = _map_finish_reason(choice.finish_reason) if choice.finish_reason else None

                yield content, finish_reason

        except Exception as exc:
            raise self._map_error(exc)

    async def list_models(self) -> list[AIModel]:
        return MODELS

    async def health_check(self) -> bool:
        settings = get_settings()
        if not settings.OPENAI_API_KEY:
            return False
        try:
            await self._client.models.list()
            return True
        except Exception:
            return False

    def _map_error(self, error: Exception) -> AIProviderError:
        if isinstance(error, AuthenticationError):
            return AIAuthenticationError(provider="openai")
        if isinstance(error, RateLimitError):
            return AIRateLimitError(provider="openai")
        if isinstance(error, APIConnectionError):
            return AINetworkError(provider="openai")
        if isinstance(error, APIError):
            return AIProviderError(
                message=error.message or "OpenAI API returned an error.",
                code="unknown",
                provider="openai",
            )
        return AIProviderError(
            message="An unexpected error occurred while calling OpenAI.",
            code="unknown",
            provider="openai",
        )

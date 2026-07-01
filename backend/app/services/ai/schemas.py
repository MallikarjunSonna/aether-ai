"""Pydantic schemas for the AI gateway service."""

from typing import Literal

from pydantic import BaseModel, Field

ProviderType = Literal["openai", "anthropic", "mock"]
FinishReason = Literal["stop", "length", "error"]


class ChatMessage(BaseModel):
    """A single message in a chat conversation."""

    role: Literal["system", "user", "assistant"]
    content: str


class ChatRequest(BaseModel):
    """Request payload for an AI chat generation."""

    provider: ProviderType = Field(default="openai")
    model: str
    messages: list[ChatMessage]
    temperature: float | None = Field(default=0.7, ge=0, le=2)
    max_tokens: int | None = Field(default=2048, ge=1)
    top_p: float | None = Field(default=1, ge=0, le=1)
    frequency_penalty: float | None = Field(default=0, ge=-2, le=2)
    presence_penalty: float | None = Field(default=0, ge=-2, le=2)
    stop: list[str] | None = None


class TokenUsage(BaseModel):
    """Token usage statistics for a generation request."""

    prompt_tokens: int = 0
    completion_tokens: int = 0
    total_tokens: int = 0


class ChatResponse(BaseModel):
    """Response payload from an AI chat generation."""

    id: str
    model: str
    provider: ProviderType
    message: ChatMessage
    usage: TokenUsage
    finish_reason: FinishReason | None = None


class StreamChunk(BaseModel):
    """A single streaming chunk from an AI chat generation."""

    id: str
    model: str
    provider: ProviderType
    content: str
    usage: TokenUsage | None = None
    finish_reason: FinishReason | None = None


class AIModel(BaseModel):
    """Descriptor for an AI model available through a provider."""

    id: str
    provider: ProviderType
    name: str
    capabilities: list[str]
    description: str | None = None
    max_tokens: int | None = None
    supports_streaming: bool = True


class ProviderInfo(BaseModel):
    """Information about an AI provider."""

    type: ProviderType
    name: str
    models: list[AIModel]


class HealthStatus(BaseModel):
    """Health status of an AI provider."""

    provider: ProviderType
    status: str
    available: bool

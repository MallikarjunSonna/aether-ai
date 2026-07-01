"""Mock provider for development and testing without real API keys."""

import asyncio
import logging

from app.services.ai.base_provider import AIProvider
from app.services.ai.schemas import AIModel, ChatRequest, ChatResponse, ProviderType, TokenUsage

logger = logging.getLogger(__name__)

MODELS: list[AIModel] = [
    AIModel(
        id="mock-chat",
        provider="mock",
        name="Mock Chat",
        capabilities=["chat", "streaming"],
        description="Mock provider for chat-based AI interactions.",
        max_tokens=4096,
        supports_streaming=True,
    ),
    AIModel(
        id="mock-completion",
        provider="mock",
        name="Mock Completion",
        capabilities=["completion"],
        description="Mock provider for text completion tasks.",
        max_tokens=4096,
        supports_streaming=False,
    ),
    AIModel(
        id="mock-embedding",
        provider="mock",
        name="Mock Embedding",
        capabilities=["embedding"],
        description="Mock provider for embedding generation.",
        max_tokens=8192,
        supports_streaming=False,
    ),
]


def _generate_id() -> str:
    import random
    import time
    return f"mock-{int(time.time() * 1000)}-{random.random():.9f}".split(".")[1]


def _estimate_tokens(text: str) -> int:
    return len(text.split())


RESPONSES: dict[str, str] = {
    "hello": "Hello from Aether AI Mock Provider. How can I assist you today?",
    "what is aether": (
        "Aether AI is an enterprise AI workspace platform designed for team "
        "collaboration, prompt management, and multi-agent workflows."
    ),
    "what can you do": (
        "I can assist with chat conversations, text completion, content generation, "
        "and various AI-powered tasks within the Aether AI platform."
    ),
}


class MockProvider(AIProvider):
    """Deterministic mock provider for development and testing."""

    @property
    def type(self) -> ProviderType:
        return "mock"

    @property
    def name(self) -> str:
        return "Mock Provider"

    async def generate(self, request: ChatRequest) -> ChatResponse:
        user_msg = next((m for m in request.messages if m.role == "user"), None)
        system_msg = next((m for m in request.messages if m.role == "system"), None)
        prompt = user_msg.content if user_msg else ""

        lower = prompt.lower().strip()
        match_key = next((k for k in RESPONSES if lower.startswith(k)), None)

        if match_key:
            content = RESPONSES[match_key]
        else:
            prefix = f"[Context: {system_msg.content[:40]}...]\n" if system_msg else ""
            content = (
                f"{prefix}You said: \"{prompt[:100]}\"\n\n"
                "This is a deterministic response from the Aether AI Mock Provider. "
                "Configure a real provider (OpenAI, Anthropic, etc.) to receive "
                "AI-generated responses."
            )

        prompt_tokens = _estimate_tokens(prompt)
        completion_tokens = _estimate_tokens(content)

        return ChatResponse(
            id=_generate_id(),
            model=request.model,
            provider="mock",
            message={"role": "assistant", "content": content},
            usage=TokenUsage(
                prompt_tokens=prompt_tokens,
                completion_tokens=completion_tokens,
                total_tokens=prompt_tokens + completion_tokens,
            ),
            finish_reason="stop",
        )

    async def stream(self, request: ChatRequest):
        full = await self.generate(request)
        words = full.message["content"].split(" ")
        for i, word in enumerate(words):
            separator = " " if i < len(words) - 1 else ""
            await asyncio.sleep(0.02)
            yield word + separator, None if i < len(words) - 1 else "stop"

    async def list_models(self) -> list[AIModel]:
        return MODELS

    async def health_check(self) -> bool:
        return True

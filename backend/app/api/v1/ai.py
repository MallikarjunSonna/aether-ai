"""AI Gateway API routes for Nexus AI.

All AI provider requests are proxied through these endpoints. Provider API keys
are managed server-side and never exposed to the browser.
"""

import json
import logging
import time

from fastapi import APIRouter, Depends, HTTPException, Request
from fastapi.responses import StreamingResponse
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.responses import SuccessResponse
from app.database.session import get_db
from app.services.ai.errors import (
    AIAuthenticationError,
    AINetworkError,
    AIProviderError,
    AIRateLimitError,
    AIUnknownProviderError,
)
from app.services.ai.gateway import AIGateway, build_gateway
from app.services.ai.schemas import (
    AIModel,
    ChatRequest,
    ChatResponse,
    HealthStatus,
    ProviderInfo,
    ProviderType,
)

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/ai", tags=["ai"])

_gateway: AIGateway | None = None


def _get_gateway() -> AIGateway:
    global _gateway
    if _gateway is None:
        _gateway = build_gateway()
    return _gateway


def _map_provider_error(exc: AIProviderError) -> HTTPException:
    status_map: dict[str, int] = {
        "invalid_api_key": 401,
        "rate_limited": 429,
        "network_error": 502,
        "unknown_provider": 400,
    }
    status = status_map.get(exc.code, 500)
    return HTTPException(
        status_code=status,
        detail={
            "error": exc.code,
            "message": exc.message,
            "provider": exc.provider,
        },
    )


@router.get("/providers", response_model=SuccessResponse[list[ProviderInfo]])
async def list_providers() -> SuccessResponse[list[ProviderInfo]]:
    """Return all available AI providers and their models."""
    gateway = _get_gateway()
    providers = gateway.list_providers()
    provider_infos: list[ProviderInfo] = []
    for pt in providers:
        models = gateway.get_provider_models(pt)
        provider_infos.append(
            ProviderInfo(
                type=pt,
                name=gateway.get_provider_name(pt),
                models=models,
            )
        )
    return SuccessResponse(data=provider_infos, message="Providers retrieved successfully.")


@router.get("/models/{provider}", response_model=SuccessResponse[list[AIModel]])
async def get_provider_models(
    provider: ProviderType,
) -> SuccessResponse[list[AIModel]]:
    """Return available models for a specific provider."""
    gateway = _get_gateway()
    models = gateway.get_provider_models(provider)
    return SuccessResponse(data=models, message="Models retrieved successfully.")


@router.post("/chat", response_model=SuccessResponse[ChatResponse])
async def chat(
    request: ChatRequest,
    db: AsyncSession = Depends(get_db),
) -> SuccessResponse[ChatResponse]:
    """Send a chat request to an AI provider and return the complete response."""
    gateway = _get_gateway()
    start = time.monotonic()

    try:
        response = await gateway.generate(request)
    except AIAuthenticationError as exc:
        raise _map_provider_error(exc)
    except AIRateLimitError as exc:
        raise _map_provider_error(exc)
    except AINetworkError as exc:
        raise _map_provider_error(exc)
    except AIUnknownProviderError as exc:
        raise _map_provider_error(exc)
    except AIProviderError as exc:
        logger.exception("AI provider error during chat generation.")
        raise _map_provider_error(exc)

    elapsed_ms = (time.monotonic() - start) * 1000
    logger.info(
        "Chat completed | provider=%s model=%s latency=%.0fms tokens=%d",
        request.provider,
        request.model,
        elapsed_ms,
        response.usage.total_tokens,
    )

    return SuccessResponse(data=response, message="Chat response generated successfully.")


@router.post("/chat/stream")
async def chat_stream(request: ChatRequest) -> StreamingResponse:
    """Send a chat request to an AI provider and stream the response via SSE."""
    gateway = _get_gateway()

    async def event_stream():
        try:
            async for chunk in gateway.stream(request):
                data = json.dumps(chunk)
                yield f"data: {data}\n\n"

            yield "data: [DONE]\n\n"
        except AIProviderError as exc:
            error_data = json.dumps({
                "error": exc.code,
                "message": exc.message,
                "provider": exc.provider,
            })
            yield f"data: {error_data}\n\n"
            yield "data: [DONE]\n\n"

    return StreamingResponse(
        event_stream(),
        media_type="text/event-stream",
        headers={
            "Cache-Control": "no-cache",
            "Connection": "keep-alive",
            "X-Accel-Buffering": "no",
        },
    )


@router.get("/health", response_model=SuccessResponse[list[HealthStatus]])
async def ai_health() -> SuccessResponse[list[HealthStatus]]:
    """Check the health of all registered AI providers."""
    gateway = _get_gateway()
    providers = gateway.list_providers()
    statuses: list[HealthStatus] = []
    for pt in providers:
        try:
            available = await gateway.health_check(pt)
            statuses.append(
                HealthStatus(
                    provider=pt,
                    status="healthy" if available else "unavailable",
                    available=available,
                )
            )
        except Exception:
            statuses.append(
                HealthStatus(
                    provider=pt,
                    status="error",
                    available=False,
                )
            )
    return SuccessResponse(data=statuses, message="Health check completed.")

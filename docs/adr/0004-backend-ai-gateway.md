# 0004 — Backend AI Gateway

**Status:** Accepted

**Date:** 2026-07-01

## Context

During Sprint 9, AI provider integrations (OpenAI and Anthropic) were implemented on the frontend. The `AIChatService` instantiates provider SDKs inside the browser, and API keys are passed via environment variables at build time (`VITE_OPENAI_API_KEY`, `VITE_ANTHROPIC_API_KEY`). This architecture was acceptable for rapid prototyping because it eliminated backend round-trips during streaming, simplified early debugging, and allowed the provider-agnostic `AIProvider` interface to be validated end-to-end without a backend deployment.

However, shipping provider SDKs and API keys to the browser introduces several production concerns:

- **API key exposure** — environment variables injected at build time are embedded in the JavaScript bundle. Anyone who inspects the client source can extract them.
- **No usage tracking** — the backend has no visibility into which providers, models, or users are consuming AI tokens. Billing attribution and capacity planning are impossible.
- **No rate limiting** — nothing prevents a compromised or abusive client from making unlimited AI requests, incurring unpredictable costs.
- **No audit log** — AI requests and responses are invisible to backend logging, making compliance and forensic analysis impossible.
- **Key rotation requires rebuild** — changing an API key requires rebuilding and redeploying the frontend.
- **Provider SDK bloat** — browser bundles include provider SDKs (`openai`, `@anthropic-ai/sdk`) that are designed for Node.js, requiring polyfills for `node:fs`, `node:path`, and other built-in modules.

The project now needs a production-grade architecture where all AI requests are proxied through the backend.

## Decision

Move all AI provider integrations from the frontend to the backend. The frontend sends chat requests to a new backend API endpoint (`POST /api/v1/ai/chat`), and the backend is responsible for provider selection, API key management, request routing, streaming, usage tracking, and audit logging.

### Target architecture

```
Browser (React)
   │
   │  POST /api/v1/ai/chat  { provider, model, messages }
   ▼
┌───────────────────────────────────┐
│   FastAPI Backend                 │
│                                   │
│  ┌─────────────────────────────┐  │
│  │  AI Router (api/v1/ai)      │  │
│  │  - Input validation         │  │
│  │  - Authentication check     │  │
│  │  - Authorization check      │  │
│  └───────────┬─────────────────┘  │
│              │                     │
│  ┌───────────▼─────────────────┐  │
│  │  AIGateway Service          │  │
│  │  - Provider routing         │  │
│  │  - Usage tracking           │  │
│  │  - Rate limiting            │  │
│  │  - Audit logging            │  │
│  └───────────┬─────────────────┘  │
│              │                     │
│  ┌───────────▼─────────────────┐  │
│  │  ProviderRegistry           │  │
│  │  - API key management       │  │
│  │  - Provider SDK instances   │  │
│  └───────────┬─────────────────┘  │
│              │                     │
│  ┌───────────▼─────────────────┐  │
│  │  OpenAI     Anthropic   Mock│  │
│  │  Provider   Provider   Provider│
│  │  (server SDK) (server SDK)    │  │
│  └─────────────────────────────┘  │
└───────────────────────────────────┘
              │
              ▼
        PostgreSQL
        - Usage records
        - Audit logs
        - Rate limit counters
```

### Key components

**AI Router** — a new FastAPI route module at `app/api/v1/ai.py` that accepts chat requests, validates input via Pydantic schemas, authenticates the user via `get_current_user`, and delegates to the gateway service.

**Backend Provider Implementations** — the existing `AIProvider` interface, `ProviderRegistry`, and `ModelRegistry` move to the backend. The frontend `AIProvider` interface is replaced by a lightweight HTTP client. Provider SDKs (`openai`, `@anthropic-ai/sdk`) are installed as backend dependencies.

**API Key Management** — provider API keys are stored in backend environment variables (`OPENAI_API_KEY`, `ANTHROPIC_API_KEY`) rather than frontend environment variables. They are never transmitted to the browser.

**Usage Tracking Service** — a new service that records each AI request to a `usage_records` database table, capturing:
- User ID and organization ID
- Provider and model used
- Token counts (prompt, completion, total)
- Latency and status
- Timestamp

**Rate Limiting Middleware** — per-user and per-organization rate limits enforced at the AI router level, preventing runaway costs from abusive or compromised clients.

**Audit Logging** — all AI requests and responses are written to an `audit_logs` table for compliance review, cost analysis, and debugging.

### Streaming

The backend streams AI responses to the frontend using Server-Sent Events (SSE) through FastAPI's `StreamingResponse`. The streaming path is:

```
Provider.stream() → AsyncIterable[ChatResponse]
    → AIGateway (decorates with usage metadata)
    → AI Router (wraps in SSE format)
    → FastAPI StreamingResponse
    → Browser (EventSource / fetch + ReadableStream)
```

This avoids buffering the entire response in memory and maintains the real-time UX established in Sprint 9.

## Alternatives Considered

### Keep providers on the frontend, add a lightweight proxy

A reverse proxy (e.g., NGINX, Caddy) sitting between the browser and provider APIs could mask API keys without backend code changes. However, a proxy cannot implement usage tracking, rate limiting, or audit logging without additional services.

**Rejected** because a proxy solves only the key exposure problem and leaves observability, cost control, and compliance unaddressed.

### Hybrid: frontend routing, backend key delivery

The frontend requests API keys from a backend endpoint at startup, then initializes provider SDKs in the browser with server-delivered keys. This keeps streaming low-latency (no backend hop) but still exposes keys in browser memory and precludes backend usage tracking.

**Rejected** because API keys in browser memory are extractable via XSS or devtools, and backend visibility into AI usage remains impossible.

### Keep current architecture indefinitely

The Sprint 9 architecture works for development and small-scale internal use. For a production enterprise platform, the security and observability gaps are unacceptable.

**Rejected** because shipping API keys to browsers and operating without usage visibility or cost controls is not viable for production.

## Consequences

### Positive

- **API keys never leave the server** — provider credentials are stored in backend environment variables or a secrets manager. The browser never sees them.
- **Full usage visibility** — every AI request is recorded with user, provider, model, and token counts. Billing, capacity planning, and abuse detection become possible.
- **Rate limiting** — per-user and per-organization quotas prevent cost overruns from compromised or buggy clients.
- **Audit trail** — all AI interactions are logged for compliance, debugging, and forensic analysis.
- **Key rotation without deployment** — API keys can be updated by restarting the backend or reloading environment variables. No frontend rebuild required.
- **Smaller browser bundles** — removing `openai`, `@anthropic-ai/sdk`, and their transitive dependencies reduces the production bundle size by hundreds of kilobytes. The Vite warnings about `node:fs` and `node:path` externalization are eliminated.
- **Unified error handling** — provider errors, network failures, and rate limits are handled server-side and returned as structured API errors rather than surfacing SDK-specific exceptions in the browser.
- **Future-ready** — RAG ingestion, agent execution, and multi-step orchestration all require backend-side provider access.

### Negative

- **Increased latency** — every streaming token now travels through the backend (provider → backend → browser) instead of directly (provider → browser). In practice, the additional hop adds 1–5 ms per chunk, which is imperceptible for text generation.
- **Backend streaming infrastructure required** — SSE or WebSocket support must be implemented in the AI router. FastAPI's `StreamingResponse` handles this natively, so no additional dependencies are needed.
- **Backend must manage concurrent streams** — each streaming request holds an open connection and a provider SDK stream on the server. Connection limits and graceful shutdown handling must be addressed.
- **Frontend provider interface changes** — the frontend `AIProvider` interface is replaced by an HTTP client. Existing hook and service abstractions need to call `/api/v1/ai/chat` instead of provider SDKs.

### Neutral

- The `AIProvider` interface defined in Sprint 9 was designed for this migration — it remains unchanged. The backend reuses the same interface; the frontend replaces it with an HTTP adapter.
- Provider-specific features (function calling, citations) remain accessible through the same abstraction, with the backend responsible for mapping them to the API contract.

## Future Work

- Implement the backend AI router with SSE streaming
- Migrate `AIProvider`, `ProviderRegistry`, and `ModelRegistry` from `frontend/src/` to `backend/app/`
- Create the usage tracking database model and service
- Implement per-user and per-organization rate limiting
- Build the audit logging pipeline
- Add configuration-driven provider registration via backend settings
- Replace `VITE_OPENAI_API_KEY` and `VITE_ANTHROPIC_API_KEY` with backend environment variables
- Update the frontend `AIChatService` to call the backend API instead of provider SDKs
- Remove provider SDKs (`openai`, `@anthropic-ai/sdk`) from frontend dependencies

# 0001 — Provider-Agnostic AI Gateway

**Status:** Accepted

**Date:** 2026-06-29

## Context

Aether AI is an enterprise AI workspace platform that will route user requests to multiple AI providers (OpenAI, Anthropic, Gemini, Ollama, Azure OpenAI). Without a dedicated abstraction layer, each client or service would need to import provider SDKs directly, handle authentication differences, and manage provider-specific error formats. This would couple the application logic to specific vendors and make it difficult to add, remove, or swap providers without widespread code changes.

The project needed a single integration point that:

- Hides provider-specific implementations behind a common interface
- Prevents UI code from directly calling any provider SDK
- Allows new providers to be added without modifying existing consumers
- Supports future capabilities (streaming, embeddings, agent orchestration) without breaking the public contract

## Decision

Introduce an AI Gateway as the single public entry point for all AI operations. The gateway delegates to a `ProviderRegistry` that manages registered `AIProvider` implementations. Every provider implements a common `AIProvider` interface. The UI and services interact only with the gateway; they never import provider classes directly.

The architecture enforces unidirectional dependency:

```
UI / Service
    ↓
AIGateway (public entry point)
    ↓
ProviderRegistry
    ↓
AIProvider (interface)
    ↓
MockProvider | OpenAIProvider | AnthropicProvider | ...
```

### Key components

- **AIGateway** — public API for `generate()`, `stream()`, `listProviders()`, `listModels()`, `healthCheck()`. Accepts a `ProviderType` to route requests.
- **ProviderRegistry** — manages provider lifecycle: `registerProvider()`, `unregisterProvider()`, `getProvider()`, `listProviders()`. Uses a `Map<ProviderType, AIProvider>` internally — no globals.
- **ModelRegistry** — manages model metadata: `registerModel()`, `unregisterModel()`, `getModel()`, `listModels()`, `getModelsByProvider()`. Each model is associated with a provider.
- **AIProvider interface** — contract requiring `generate()`, `stream()`, `listModels()`, `healthCheck()`. Located in `types/ai.ts` and re-exported from `providers/AIProvider.ts`.
- **MockProvider** — the only implementation in Sprint 8. Returns deterministic responses based on the input prompt. Supports three model variants: chat, completion, and embedding.

### File layout

```
src/
├── types/ai.ts              — AIProvider, AIModel, ChatRequest, ChatResponse, etc.
├── constants/ai.ts          — PROVIDER_TYPES, DEFAULT_GENERATION_OPTIONS, MODEL_REGISTRY_IDS
├── providers/
│   ├── AIProvider.ts        — Re-exports AIProvider interface from types
│   └── MockProvider.ts      — Deterministic mock implementation
├── services/ai/
│   ├── AIGateway.ts         — Public entry point
│   ├── ProviderRegistry.ts  — Provider lifecycle management
│   └── ModelRegistry.ts     — Model metadata management
└── mocks/ai.ts              — Mock model definitions (mock-chat, mock-completion, mock-embedding)
```

## Alternatives Considered

### Direct SDK calls from services

Each service would import the provider SDK it needs (e.g., `openai`, `@anthropic-ai/sdk`). This is the simplest approach initially but creates tight coupling. Replacing one provider with another would require changes across every service that imports it. Testing would require mocking SDK constructors at every call site.

**Rejected** because it violates the Open/Closed Principle and makes provider changes expensive.

### Singleton provider manager

A single global object that caches provider instances and returns them by name. This avoids passing dependencies through the application but introduces hidden global state that makes testing difficult and violates the Dependency Inversion Principle.

**Rejected** because global state complicates testing and makes instance lifecycle opaque.

### Interface-per-provider strategy

Each provider defines its own interface (e.g., `OpenAIProvider`, `AnthropicProvider`) with no shared contract. The gateway would branch on provider type using conditionals. This preserves type specificity but prevents the gateway from treating providers polymorphically — every new provider requires gateway changes.

**Rejected** because it increases the cost of adding providers and duplicates error handling, retry logic, and telemetry across provider-specific branches.

## Consequences

### Positive

- Adding a new provider requires exactly one new class implementing `AIProvider` and one registration call. The gateway and consumers require no changes.
- Providers can be tested independently by mocking the `AIProvider` interface.
- Provider selection is data-driven — the gateway accepts a `ProviderType` string, enabling runtime routing, per-request provider selection, and future policy-based routing.
- The `ModelRegistry` provides a single source of truth for available models and their capabilities across all providers.

### Negative

- Every provider call passes through an additional abstraction layer, adding minimal overhead.
- Provider-specific features (e.g., OpenAI's function calling, Anthropic's citations) require either broadening the `AIProvider` interface or exposing provider metadata that consumers can check.
- The `stream()` method returns `AsyncIterable<ChatResponse>`, which may need to become `AsyncGenerator` for real streaming implementations.

### Neutral

- `MockProvider` uses `Math.random()` for ID generation but the responses are otherwise deterministic. This is acceptable for development but should not be used in production.
- `ProviderRegistry` and `ModelRegistry` use in-memory `Map` storage. For production, registration could be driven by configuration or service discovery.

## Future Work

- OpenAI provider implementation
- Anthropic provider implementation
- Streaming support with `AsyncGenerator` and chunked response types
- Provider health-check polling and automatic failover
- Rate limiting and token quota enforcement at the gateway level
- Telemetry and cost tracking middleware inside the gateway
- Configuration-driven provider registration (YAML, environment, or remote config)

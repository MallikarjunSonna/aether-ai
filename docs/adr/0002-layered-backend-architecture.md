# 0002 — Layered Backend Architecture

**Status:** Accepted

**Date:** 2026-06-15

## Context

The Aether AI backend is a FastAPI application that must handle HTTP routing, authentication, business logic, data persistence, and cross-cutting concerns like logging and error handling. Without a clear layer boundary, business logic tends to leak into route handlers, database queries appear in service methods, and cross-cutting concerns are duplicated across the codebase.

The project needed a structure that:

- Separates HTTP concerns from business logic
- Isolates data access from service workflows
- Centralizes cross-cutting behavior (auth, logging, error handling)
- Supports testing each layer independently
- Scales to future capabilities (AI Gateway, agent orchestration, RAG)

## Decision

Organize the backend into six explicit layers with unidirectional dependencies:

```
API (app.api)
  ↓
Services (app.services)
  ↓
Repositories (app.repositories)
  ↓
Domain Models (app.models)
  ↓
Database (app.database)
  ↓
Core (app.core) — cross-cutting utilities used by all layers
```

### Layer responsibilities

**API layer** (`app.api`) owns HTTP routing. Route handlers validate input via Pydantic schemas, call services, and return standardized response models. They contain no business logic. Each route handler is typically one service call followed by a response construction.

**Service layer** (`app.services`) owns business logic and workflow orchestration. Services combine multiple repository calls, enforce domain rules, and raise application exceptions. They depend on repositories for data access and core utilities for security, but never import FastAPI objects.

**Repository layer** (`app.repositories`) owns data access. Each repository wraps SQLAlchemy queries for one aggregate root (e.g., `UserRepository` for user queries). Repositories accept `AsyncSession` via their constructor and return domain models or `None`. They contain no business logic.

**Domain model layer** (`app.models`) defines SQLAlchemy ORM entities. All models inherit from `BaseModel`, which provides UUID primary keys, timestamps, soft-delete metadata, generated table names, and compact representation. Models define constraints and indexes but no business methods.

**Database layer** (`app.database`) owns persistence infrastructure: engine creation, session factory configuration, mixins, and shared type aliases. Sessions are request-scoped through an async context manager and do not commit implicitly.

**Core layer** (`app.core`) contains shared infrastructure used across layers: application settings, structured responses, exception hierarchy, global exception handlers, logging configuration, password hashing, and security utilities.

### Request flow

```
1. HTTP request → FastAPI router
2. Router → Pydantic schema validation
3. Endpoint → calls service method
4. Service → calls repository for data access
5. Service → raises AppException on domain violations
6. Endpoint → returns SuccessResponse or MessageResponse
7. Exception handler → converts AppException to ErrorResponse
```

### Key rules

- API files never contain business logic — they validate input, call a service, and return a response.
- Services orchestrate — they combine repositories, call external utilities, and enforce business rules.
- Repositories query — one repository per aggregate root, focused on data access only.
- Dependency injection via FastAPI `Depends()` — services and repositories are constructed by factory functions, never instantiated manually in route handlers.
- Async everywhere — all database operations use `AsyncSession`.

## Alternatives Considered

### Monolithic route handlers

All logic — validation, business rules, and database queries — lives inside FastAPI route functions. This works for small applications but becomes unmaintainable as the codebase grows. Testing requires spinning up the full FastAPI test client even for pure logic checks.

**Rejected** because it prevents unit testing business logic in isolation and encourages copy-paste duplication across endpoints.

### Flat package structure

Services, repositories, and models live in a single package without subdirectories. This works for very small projects but becomes confusing as the number of files grows. There is no clear ownership boundary, and developers must scan a flat list to find relevant modules.

**Rejected** because it does not scale beyond a few files and provides no guidance for where new code belongs.

### Heavy framework integration

Using FastAPI's dependency injection for everything, including repository construction and database session management, without an explicit layer boundary. This ties business code to FastAPI's DI system and makes it harder to reuse services outside HTTP contexts (e.g., background jobs, CLI commands).

**Rejected** because service and repository classes should be constructable with plain constructor arguments — FastAPI `Depends()` is used only at the API boundary for wiring.

## Consequences

### Positive

- Each layer can be tested independently. Services are tested with mocked repositories. Repositories are tested with real database sessions. API routes are tested with `httpx.AsyncClient`.
- New features follow a predictable pattern: schema → endpoint → service method → repository method. Developers know exactly where to add code.
- Cross-cutting concerns (auth, logging, error responses) are centralized in `core` and are consistent across the application.
- The layer boundary makes it straightforward to replace the HTTP layer (e.g., add GraphQL, WebSocket, or CLI) without rewriting business logic.

### Negative

- Simple CRUD endpoints require touching four files (schema, route, service, repository). This overhead is justified for complex logic but feels excessive for trivial pass-through operations.
- Async propagation means every layer must be async-friendly. Sync databases or blocking I/O in services require explicit thread pool management.
- Repository abstraction can leak SQLAlchemy types if not carefully typed. The current convention keeps repository return types as domain models or `None`.

### Neutral

- The architecture is aligned with typical Python enterprise patterns (ports and adapters, clean architecture). Developers familiar with these patterns will find the structure intuitive.
- The `core` layer must remain stable — moving utilities into `core` early prevents cross-layer imports but also risks creating a dumping ground for unrelated helpers.

## Future Work

- Repository interface extraction for testing (e.g., `UserRepositoryProtocol`) to allow swapping implementations without changing service code
- Middleware layer implementation (request IDs, timing, audit logging)
- Background job processing integration without HTTP context
- CQRS-style read models for dashboard and reporting queries

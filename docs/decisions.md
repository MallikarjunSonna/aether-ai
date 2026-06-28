# Architecture Decisions

## FastAPI

Decision: Use FastAPI as the backend web framework.

Rationale: FastAPI provides explicit routing, dependency injection, Pydantic
integration, OpenAPI support, async request handling, and a direct development
model for API-first services. It fits the current backend foundation and future
AI Gateway use cases where streaming, async I/O, and typed request contracts
will matter.

Implications:

- Endpoint handlers should remain thin.
- Shared dependencies should be expressed through FastAPI dependency functions.
- Application wiring belongs in `app.main`.

## SQLAlchemy 2.0

Decision: Use SQLAlchemy 2.0 ORM models for persistence.

Rationale: SQLAlchemy 2.0 provides typed ORM mappings, mature relational
modeling, explicit session handling, and compatibility with Alembic migrations.
The current models use `Mapped` and `mapped_column` to keep domain definitions
typed and close to database constraints.

Implications:

- ORM models live in `app.models`.
- Database infrastructure lives in `app.database`.
- Data access should eventually move into repositories instead of API routes.

## JWT Service

Decision: Encapsulate JWT creation and validation in `JWTService`.

Rationale: Token signing, expiration, token type validation, and payload
validation are security-sensitive concerns. Keeping them in one service avoids
duplicating token logic across endpoints and keeps authentication flows
testable.

Implications:

- Access and refresh tokens are created through explicit service methods.
- Token decoding validates the expected token type.
- JWT settings are loaded from the central application settings model.

## Auth Service

Decision: Use `AuthService` to coordinate authentication workflows.

Rationale: Authentication is more than password verification. It must account
for user activation state, password validation, and token issuance. `AuthService`
keeps this orchestration out of endpoints and delegates token details to
`JWTService`.

Implications:

- API routes should call `AuthService` for login workflows.
- Password verification should use `core.security`.
- Failed authentication should raise `AuthenticationException`.

## Layered Architecture

Decision: Organize the backend into API, services, models, database, and core
layers.

Rationale: Layering reduces coupling and clarifies ownership. API routes handle
HTTP. Services handle business rules. Models represent persisted domain state.
Database modules handle engine and session concerns. Core modules provide shared
infrastructure.

Implications:

- HTTP concerns should not leak into services.
- Database concerns should not leak into route handlers.
- Cross-cutting behavior belongs in `core` or `middleware`.

## Multi-Tenant Workspace Design

Decision: Model tenancy with organizations, workspaces, users, and memberships.

Rationale: Organizations provide the top-level tenant boundary. Workspaces
provide project or collaboration boundaries inside an organization. Memberships
connect users to workspaces and carry role information.

Implications:

- Workspace slugs are unique within an organization, not globally.
- User identity is separate from workspace access.
- Future authorization should evaluate membership and role in the active
  workspace context.

## BaseModel Inheritance

Decision: All ORM domain models inherit from a shared abstract `BaseModel`.

Rationale: UUID primary keys, timestamps, soft deletion, generated table names,
and consistent representations are common requirements across persistent
entities. A shared base avoids repeated declarations and keeps model behavior
consistent.

Implications:

- Domain entities receive `id`, `created_at`, `updated_at`, and `deleted_at`.
- Table names are generated from model class names.
- Soft deletion can be standardized across future repositories and queries.

## Async Database

Decision: Use SQLAlchemy async engine and async sessions.

Rationale: The backend will likely perform I/O-heavy operations, including
database access, AI provider calls, retrieval workflows, and external service
integration. Async database access aligns with FastAPI's async execution model
and leaves room for high-concurrency workloads.

Implications:

- Database sessions are `AsyncSession` instances.
- Service and repository methods that use the database should be async.
- Transaction boundaries should be explicit and tested.

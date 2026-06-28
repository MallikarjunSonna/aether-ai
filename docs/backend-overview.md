# Backend Package Overview

## `api`

The `api` package owns HTTP routing. It contains the top-level API router and
versioned route modules. The current router mounts `api.v1.health` under the
configured API prefix, producing a health endpoint for service status.

Responsibilities:

- define versioned HTTP routes
- keep endpoint handlers thin
- call services for business behavior
- return shared response models

## `services`

The `services` package contains application business workflows.

Current services:

- `AuthService` coordinates user authentication, password verification, active
  user checks, and token-pair creation.
- `JWTService` creates and validates access and refresh JWTs using configured
  signing settings.

Services are the right place for domain orchestration. They should raise
application exceptions instead of constructing HTTP responses directly.

## `models`

The `models` package contains SQLAlchemy ORM domain entities.

Current models:

- `BaseModel`: shared abstract base with UUID primary key, timestamps,
  soft-delete metadata, generated table names, and developer representation.
- `User`: account identity, credentials, activation state, superuser flag, and
  last-login metadata.
- `Organization`: top-level tenant container with unique slug.
- `Workspace`: organization-scoped collaboration space with organization-local
  slug uniqueness.
- `Membership`: link between users and workspaces, including role and active
  state.

Model classes define database constraints and indexes close to the domain data
they protect.

## `schemas`

The `schemas` package is reserved for request and response DTOs that are
specific to application features. Shared generic responses currently live in
`core.responses`. As APIs expand, endpoint-specific Pydantic models should be
placed here to keep transport shapes separate from ORM models.

Expected responsibilities:

- request body validation schemas
- response DTOs
- pagination and filtering schemas
- input normalization models

## `database`

The `database` package owns persistence infrastructure.

Current modules:

- `base`: SQLAlchemy declarative base.
- `session`: async engine, async session factory, and database URL loading.
- `mixins`: reusable UUID primary key and timestamp mixins.
- `types`: shared database type aliases.

The database layer uses SQLAlchemy 2.0 async sessions with `pool_pre_ping=True`
and `expire_on_commit=False`. Sessions are yielded through an async context
manager and do not commit implicitly.

## `middleware`

The `middleware` package is reserved for cross-cutting request and response
processing. It currently has no custom middleware implementation.

Expected responsibilities:

- request IDs and correlation IDs
- tenant context propagation
- audit headers
- rate limiting hooks
- security headers
- request timing and telemetry

## `core`

The `core` package contains shared application infrastructure.

Current modules:

- `constants`: shared constants.
- `dependencies`: dependency placeholders for current user and request context.
- `exceptions`: application exception hierarchy.
- `exception_handlers`: FastAPI exception handler registration.
- `logging`: application logging configuration.
- `responses`: generic success, error, and message response models.
- `security`: password hashing and verification utilities.

The package is intentionally central and stable. Feature-specific business logic
should stay in services, not in `core`.

## `agents`

The `agents` package is reserved for future agent orchestration. It should host
agent definitions, planning interfaces, tool routing, and agent execution
policies once AI workflows are introduced.

Expected responsibilities:

- agent runtime abstractions
- tool selection and invocation policies
- multi-step task orchestration
- safety and permission boundaries for agent actions

## `rag`

The `rag` package is reserved for retrieval-augmented generation capabilities.
It should contain retrieval pipelines, chunking strategies, embedding workflows,
vector-store adapters, and prompt-context assembly.

Expected responsibilities:

- document ingestion and chunking
- embedding generation
- vector search integration
- retrieval ranking
- context assembly for AI Gateway calls

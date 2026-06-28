# Nexus AI Backend Architecture

## Overview

The Nexus AI backend is a FastAPI application organized around a layered
architecture. The current foundation includes application startup, API routing,
reusable response models, global exception handling, application settings,
logging, password hashing, JWT creation and validation, authentication
coordination, async database session management, and SQLAlchemy domain models.

The application is intentionally structured so API endpoints stay thin, business
logic lives in services, persistence concerns are isolated from request
handling, and cross-cutting behavior is centralized in `core`.

```text
+-------------------+
| External Clients  |
+---------+---------+
          |
          v
+-------------------+
| FastAPI App       |
| app.main          |
+---------+---------+
          |
          v
+-------------------+       +----------------------+
| API Routers       +------->| Core Dependencies    |
| app.api           |        | Auth, context, errors |
+---------+---------+        +----------------------+
          |
          v
+-------------------+       +----------------------+
| Services          +------->| Core Utilities       |
| Auth, JWT, domain |        | settings, logging,   |
+---------+---------+        | security, responses  |
          |                  +----------------------+
          v
+-------------------+       +----------------------+
| Repositories      +------->| Async DB Session     |
| Future data access|        | SQLAlchemy 2.0       |
+---------+---------+       +----------+-----------+
                                      |
                                      v
                            +----------------------+
                            | Database             |
                            | PostgreSQL via       |
                            | async driver         |
                            +----------------------+
```

## Layers

### Application Layer

`app.main` builds the FastAPI application, configures logging, registers global
exception handlers, and mounts the API router under the configured API prefix.
This layer owns application assembly, not business behavior.

### API Layer

`app.api` contains versioned HTTP routers. The current implementation exposes a
versioned health endpoint through `api.v1.health`. Future endpoints should parse
requests, invoke services, and return response models without embedding domain
logic.

### Service Layer

`app.services` contains business workflows. The current services are:

- `AuthService`, which validates user state and passwords before issuing tokens.
- `JWTService`, which creates and validates signed access and refresh tokens.

Services raise application exceptions from `app.core.exceptions` so HTTP
translation remains centralized.

### Domain Model Layer

`app.models` contains SQLAlchemy ORM entities. The current model set supports a
multi-tenant foundation:

- `Organization` owns workspaces.
- `Workspace` is scoped to an organization.
- `User` represents an account.
- `Membership` links users to workspaces with roles.

All domain models inherit from the shared `BaseModel`, which provides UUID
primary keys, timestamps, soft-delete metadata, generated table names, and a
compact representation.

### Database Layer

`app.database` owns SQLAlchemy 2.0 declarative base configuration, async engine
creation, async session factory setup, reusable mixins, and shared column type
aliases. Database sessions are request-scoped through an async context manager
and do not commit implicitly.

### Core Layer

`app.core` contains shared infrastructure:

- settings and dependency placeholders
- structured response models
- custom exception classes and global handlers
- logging configuration
- password hashing utilities
- security helpers

This layer is intentionally framework-adjacent and reused by API and services.

## Request Flow

```text
1. Client sends HTTP request
        |
        v
2. FastAPI application receives request
        |
        v
3. Router matches path and API version
        |
        v
4. Dependencies resolve request context, auth, and database session
        |
        v
5. Endpoint calls service layer
        |
        v
6. Service validates input, user state, and domain rules
        |
        v
7. Service uses repositories or database session when persistence is needed
        |
        v
8. Endpoint returns SuccessResponse or MessageResponse
        |
        v
9. Exceptions are converted to ErrorResponse by global handlers
```

Expected application failures are represented by `AppException` subclasses and
returned as existing `ErrorResponse` payloads. Unexpected exceptions are logged
and returned as sanitized internal server error responses without stack traces.

## Exception Flow

```text
Service or endpoint raises exception
        |
        +-- ValidationException ---------> 400 ErrorResponse
        |
        +-- AuthenticationException -----> 401 ErrorResponse
        |
        +-- ResourceNotFoundException ---> 404 ErrorResponse
        |
        +-- AppException ----------------> configured ErrorResponse
        |
        +-- Exception -------------------> log exception, 500 ErrorResponse
```

## Multi-Tenant Foundation

The data model is designed for workspace-scoped collaboration.

```text
+--------------+        +-------------+        +-------------+
| Organization | 1 ---> *| Workspace   | 1 ---> *| Membership |
+--------------+        +-------------+        +------+------+ 
                                                     |
                                                     *
                                                     |
                                              +------+------+
                                              | User        |
                                              +-------------+
```

The `Workspace` slug is unique only inside an organization. `Membership`
connects a user to a workspace and stores role and activation state. This keeps
global account identity separate from tenant access.

## Future AI Gateway Integration

The planned AI Gateway should sit behind API routes and services rather than
inside endpoint functions. That keeps model-provider integration, agent routing,
RAG orchestration, quotas, and audit logging outside the HTTP boundary.

```text
Client
  |
  v
API Route
  |
  v
Application Service
  |
  +--------------------+
  | AI Gateway         |
  | - provider routing |
  | - policy checks    |
  | - prompt controls  |
  | - rate limits      |
  | - telemetry        |
  +---------+----------+
            |
            +--> Agents
            |
            +--> RAG pipeline
            |
            +--> External AI providers
```

The `agents` and `rag` packages are reserved for this future capability. They
should depend on core interfaces and services, not on FastAPI route objects.

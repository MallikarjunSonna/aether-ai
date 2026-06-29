# Aether AI — Engineering Handbook

> Enterprise-grade AI application with a FastAPI backend and React frontend.

---

## 1. Project Overview

Aether AI is an enterprise AI workspace platform. The monorepo contains a **FastAPI async backend** (Python 3.11+) and a **React 19 SPA frontend** (TypeScript, Vite). It provides JWT-authenticated REST APIs, user management, organization management, and an extensible dashboard shell.

---

## 2. Vision

Aether AI enables teams to collaborate with AI agents in a secure, organized workspace. The platform provides prompt management, knowledge bases, AI chat, and multi-organization support—all wrapped in a modern, accessible, dark-first design system.

---

## 3. Technology Stack

### Backend
| Concern | Choice |
|---|---|
| Runtime | Python 3.11+ |
| Framework | FastAPI |
| ORM | SQLAlchemy 2.0 (async) |
| Auth | JWT (access + refresh tokens) |
| Password Hashing | Argon2 via `pwdlib` (fallback: bcrypt via `passlib`) |
| Validation | Pydantic v2 |
| DB Driver | `asyncpg` (prod), `aiosqlite` (tests) |
| Linting | Ruff, Black, isort |
| Testing | pytest, pytest-asyncio, httpx |
| CI | GitHub Actions |

### Frontend
| Concern | Choice |
|---|---|
| Runtime | Node.js 22 LTS |
| Framework | React 19 |
| Build | Vite 8 |
| Language | TypeScript (strict) |
| Routing | React Router v7 |
| Server State | TanStack React Query |
| Animation | Framer Motion |
| Icons | Lucide React |
| Styling | Tailwind CSS |
| Linting | ESLint (flat config) |
| Formatting | Prettier |
| Testing | Vitest, Testing Library |
| CI | GitHub Actions |

---

## 4. Repository Structure

```
aether-ai/
├── AGENTS.md                  # This handbook
├── CONTRIBUTING.md            # Contribution guide
├── README.md                  # Project overview
├── docker-compose.yml
├── docker/
├── docs/                      # Architecture docs and ADRs
│   ├── architecture.md
│   ├── backend-overview.md
│   ├── decisions.md
│   └── roadmap.md
├── backend/
│   ├── app/
│   │   ├── __init__.py
│   │   ├── main.py                # FastAPI app factory
│   │   ├── api/
│   │   │   ├── router.py          # Top-level router
│   │   │   └── v1/
│   │   │       ├── auth.py        # Auth endpoints
│   │   │       └── health.py      # Health check
│   │   ├── config/
│   │   │   └── settings.py        # pydantic-settings
│   │   ├── core/
│   │   │   ├── constants.py
│   │   │   ├── dependencies.py    # get_current_user, get_request_context
│   │   │   ├── exception_handlers.py
│   │   │   ├── exceptions.py      # AuthenticationException, ValidationException
│   │   │   ├── logging.py
│   │   │   ├── middleware.py      # CORS, trust headers
│   │   │   ├── responses.py      # Standardized response envelopes
│   │   │   └── security.py       # Password hashing
│   │   ├── database/
│   │   │   ├── __init__.py
│   │   │   ├── base.py           # DeclarativeBase
│   │   │   ├── mixins.py         # UUIDPrimaryKeyMixin, TimestampMixin
│   │   │   ├── session.py        # Engine, session factory, get_db
│   │   │   └── types.py          # Custom SQLAlchemy types
│   │   ├── models/
│   │   │   ├── base.py           # BaseModel (UUID + timestamps + soft delete)
│   │   │   ├── user.py           # User model
│   │   │   ├── membership.py
│   │   │   ├── organization.py
│   │   │   └── workspace.py
│   │   ├── repositories/
│   │   │   └── user_repository.py
│   │   ├── schemas/
│   │   │   └── auth.py           # Pydantic request/response schemas
│   │   └── services/
│   │       ├── auth_service.py   # Business logic for auth
│   │       └── jwt_service.py    # JWT creation and validation
│   └── tests/
│       ├── conftest.py
│       ├── test_auth_service.py
│       ├── test_health.py
│       ├── test_jwt_service.py
│       ├── test_security.py
│       └── test_user_repository.py
├── frontend/
│   ├── src/
│   │   ├── main.tsx              # Entry point
│   │   ├── App.tsx               # Provider tree
│   │   ├── router.tsx            # Route definitions
│   │   ├── api/
│   │   │   ├── client.ts         # Fetch wrapper with auth
│   │   │   └── auth.ts           # Auth API functions
│   │   ├── components/
│   │   │   ├── auth/             # AuthCard, AuthDivider, InputField
│   │   │   ├── navigation/       # Sidebar, Header, Breadcrumbs, UserMenu
│   │   │   └── organization/     # OrganizationCard, OrganizationList, etc.
│   │   ├── contexts/
│   │   │   └── AuthContext.tsx    # Auth state provider
│   │   ├── hooks/
│   │   │   └── useAuth.ts        # Auth context hook
│   │   ├── layouts/
│   │   │   ├── RootLayout.tsx
│   │   │   ├── DashboardLayout.tsx
│   │   │   └── AuthLayout.tsx
│   │   ├── lib/
│   │   │   └── queryClient.ts    # React Query client
│   │   ├── mocks/
│   │   │   └── organizations.ts
│   │   ├── pages/
│   │   │   ├── DashboardHome.tsx
│   │   │   ├── DashboardPage.tsx
│   │   │   ├── DashboardPlaceholder.tsx
│   │   │   ├── auth/
│   │   │   │   ├── LoginPage.tsx
│   │   │   │   ├── RegisterPage.tsx
│   │   │   │   └── ForgotPasswordPage.tsx
│   │   │   └── organizations/
│   │   │       └── OrganizationsPage.tsx
│   │   ├── routes/
│   │   │   ├── ProtectedRoute.tsx
│   │   │   └── GuestRoute.tsx
│   │   ├── services/
│   │   │   └── tokenStorage.ts   # localStorage token persistence
│   │   ├── styles/
│   │   │   ├── design-tokens.ts  # Primitive tokens (colors, typography, spacing, etc.)
│   │   │   ├── global.css        # Tailwind directives and base styles
│   │   │   └── theme.ts          # Semantic theme mapping
│   │   └── types/
│   │       └── organization.ts
│   └── tests/
│       ├── AuthContext.test.tsx
│       ├── GuestRoute.test.tsx
│       ├── LoginPage.test.tsx
│       ├── ProtectedRoute.test.tsx
│       ├── RegisterPage.test.tsx
│       ├── tokenStorage.test.ts
│       └── useAuth.test.tsx
└── .github/workflows/
    └── ci.yml
```

---

## 5. Backend Architecture

A strict **layered architecture** with unidirectional data flow:

```
Client Request
     │
     ▼
┌──────────────┐
│    API       │  ← FastAPI routes (auth.py, health.py)
│  (Routes)    │     Input validation via Pydantic schemas
└──────┬───────┘
       │
┌──────▼───────┐
│  Schemas     │  ← Pydantic v2 request/response models
└──────┬───────┘
       │
┌──────▼───────┐
│  Services    │  ← Business logic orchestration (auth_service.py)
│              │     Coordinates repositories + utilities
└──────┬───────┘
       │
┌──────▼──────────┐
│  Repositories   │  ← Data access layer (user_repository.py)
│                 │     Wraps SQLAlchemy queries
└──────┬──────────┘
       │
┌──────▼──────────┐
│  Database       │  ← SQLAlchemy ORM models + session
│  (Models)       │     UUID PKs, timestamps, soft delete
└─────────────────┘
```

### Key rules

- **API files never contain business logic** — they validate input, call a service, and return a response.
- **Services orchestrate** — they combine repositories, call external utilities, and enforce business rules.
- **Repositories query** — one repository per aggregate root, focused on data access only.
- **Dependency injection** via FastAPI `Depends()` — never instantiate services/repos inside route handlers manually (use factory functions).
- **Async everywhere** — all database operations use `AsyncSession`.
- **TypedDict for internal types** — use `typing_extensions.TypedDict` for Python 3.11 compat.

Example pattern:

```python
# api/v1/auth.py — Thin route handler
@router.post("/login", response_model=SuccessResponse[TokenResponse])
async def login(body: LoginRequest, db: AsyncSession = Depends(get_db)) -> SuccessResponse[TokenResponse]:
    service = _build_auth_service(db)
    tokens = await service.login_user(body)
    return SuccessResponse(data=tokens, message="Authentication successful.")

# services/auth_service.py — Business logic
class AuthService:
    async def login_user(self, request: LoginRequest) -> AuthTokens:
        user = await self._user_repository.get_by_email(request.email)
        if user is None:
            raise AuthenticationException("Invalid credentials.")
        self.authenticate_user(user, request.password)
        return self.create_user_tokens(user)

# repositories/user_repository.py — Data access
class UserRepository:
    async def get_by_email(self, email: str) -> User | None:
        stmt = select(User).where(User.email == email.strip().lower())
        result = await self._session.execute(stmt)
        return result.scalar_one_or_none()
```

---

## 6. Frontend Architecture

A **unidirectional data flow** following this chain:

```
Page → Component → Hook → Context → API → Backend
  │        │         │        │       │
  │        │         │        │       └── api/client.ts (fetch wrapper)
  │        │         │        │
  │        │         │        └────────── contexts/AuthContext.tsx
  │        │         │
  │        │         └─────────────────── hooks/useAuth.ts
  │        │
  │        └───────────────────────────── components/ (pure UI, no data logic)
  │
  └────────────────────────────────────── pages/ (compose components + hooks)
```

### Key rules

- **Pages compose** — they combine components, hooks, and layouts. Minimal logic.
- **Components are pure UI** — no data fetching, no business logic. Receive data via props.
- **Hooks encapsulate stateful logic** — `useAuth` reads context, `useQuery` manages server state.
- **Context provides global state** — auth state, theme, etc.
- **API layer is the ONLY place `fetch()` is called** — never call `fetch()` or `axios` directly in pages, components, or hooks.
- **Services abstract persistence** — `tokenStorage` wraps `localStorage`; never access `localStorage` directly from components.

```
App.tsx
  └── QueryClientProvider
        └── AuthProvider
              └── RouterProvider
                    ├── / → RootLayout
                    │     ├── / → DashboardPage (redirect)
                    │     └── /dashboard → ProtectedRoute → DashboardLayout
                    │           ├── index → DashboardHome
                    │           └── organizations → OrganizationsPage
                    ├── /login → GuestRoute → AuthLayout → LoginPage
                    ├── /register → GuestRoute → AuthLayout → RegisterPage
                    └── /forgot-password → AuthLayout → ForgotPasswordPage
```

---

## 7. Design System Guidelines

### Tokens vs Theme

The design system has **two layers**:

1. **Primitive tokens** (`styles/design-tokens.ts`) — framework-neutral values (colors, typography, spacing, radius, shadows, z-index, durations). These are `as const` for type safety.
2. **Semantic theme** (`styles/theme.ts`) — maps primitives to semantic names (`primary`, `background`, `text`, `border`, `surface`, `error`, `success`, `warning`). Defaults to dark mode.

### Usage rules

- **Never hardcode color/spacing/radius values** in components. Reuse existing theme tokens.
- All components use semantic Tailwind classes: `text-ink`, `text-muted`, `bg-canvas`, `bg-surface`, `border-line`, `text-primary`, `text-error`, `text-success`, `text-warning`.
- Duration tokens: `duration-instant` (75ms), `duration-fast` (150ms), `duration-normal` (250ms), `duration-slow` (400ms), `duration-slower` (700ms).
- Z-index tokens: `z-dropdown` (1000), `z-sticky` (1100), `z-overlay` (1200), `z-modal` (1300), `z-toast` (1400), `z-tooltip` (1500).
- Icons from `lucide-react` only — never use inline SVGs or icon fonts.
- Animations use `framer-motion` — prefer `motion.div` with `initial`, `whileInView`, and `transition` props.

---

## 8. Coding Standards

### General

- **Strong typing everywhere**. No `any` unless absolutely necessary (and justify with a comment).
- **Small, focused components** — one responsibility per component.
- **Prefer composition over inheritance** — use props, children, and render props; avoid class hierarchies.
- **No business logic inside UI** — pages/ components render data; hooks/services manage logic.
- **Reuse existing design tokens** — never hardcode values.
- **Named exports** over default exports (consistency, better refactoring).
- **Async/await** over raw promises/callbacks.
- **Functional components only** — no class components.

### TypeScript

- `strict: true` in tsconfig.
- Define explicit interfaces for all props.
- Use `type` for unions/utility types, `interface` for object shapes.
- Avoid type assertions (`as`) — prefer type guards or proper narrowing.

### Python

- Type hints on all function signatures.
- Pydantic v2 for all request/response schemas.
- SQLAlchemy 2.0 Mapped-column style (not legacy `declarative_base()`).
- `typing_extensions.TypedDict` for Python 3.11 compatibility.
- No `Optional[x]` — prefer `x | None`.

---

## 9. SOLID Principles

| Principle | Application |
|---|---|
| **S**ingle Responsibility | Each class/module has one reason to change. Models define schema, services implement business logic, repositories handle data access. |
| **O**pen/Closed | Services accept repository interfaces; new persistence strategies don't require service changes. |
| **L**iskov Substitution | Repository protocol ensures any implementation is swappable. |
| **I**nterface Segregation | Small focused interfaces (`PasswordHasher` protocol) over large monoliths. |
| **D**ependency Inversion | High-level services depend on abstractions (repositories, protocols), not concrete implementations. FastAPI `Depends()` wires concrete instances. |

---

## 10. Testing Standards

### Rules

- **Tests required before commit** for any new feature or bug fix.
- **Lint and build must pass before commit** — run `npm run lint && npm run build` (frontend) and `ruff check . && black --check . && isort --check-only .` (backend).
- All CI checks must pass before merging.

### Backend (pytest)
- Async tests use `pytest-asyncio` and `pytest_asyncio.fixture`.
- Database tests use isolated in-memory SQLite (`sqlite+aiosqlite:///:memory:`).
- FastAPI integration tests use `TestClient` with patched settings.
- Aim for 90%+ coverage.

### Frontend (Vitest)
- Component tests use `@testing-library/react` with `render` + `screen`.
- Auth and hook tests use `renderHook` from `@testing-library/react`.
- API modules are mocked with `vi.mock()`.
- Run: `npm run test`.

---

## 11. Git Workflow

- `main` — stable, production-ready. Protected — no direct pushes.
- `develop` — integration branch for feature work.
- `feat/<short-description>` — new features (branched from `develop`).
- `fix/<short-description>` — bug fixes (branched from `develop`).
- `chore/<short-description>` — tooling, CI, dependency updates.
- `docs/<short-description>` — documentation-only changes.

Always open pull requests against `develop` unless it is a hotfix for `main`.

---

## 12. Commit Message Convention

Follow [Conventional Commits](https://www.conventionalcommits.org/):

```
<type>(<scope>): <short summary>

[optional body]
```

**Types:** `feat`, `fix`, `chore`, `docs`, `style`, `refactor`, `test`, `ci`.

| Type | Usage |
|---|---|
| `feat` | A new feature |
| `fix` | A bug fix |
| `chore` | Tooling, CI, deps |
| `docs` | Documentation only |
| `style` | Formatting, no logic change |
| `refactor` | Code change, no feature or fix |
| `test` | Adding or fixing tests |
| `ci` | CI config/scripts |

**Examples:**
```
feat(auth): add refresh token rotation
fix(api): handle null email in user lookup
chore(deps): upgrade fastapi to 0.115.x
test(auth): add login validation tests
```

**Keep commits small and atomic** — one logical change per commit.

---

## 13. Pull Request Checklist

Before opening a PR, verify:

- [ ] Feature/fix works as expected
- [ ] All existing tests pass
- [ ] New tests added for changes
- [ ] Lint passes (Ruff/ESLint)
- [ ] TypeScript strict check passes (`npx tsc --noEmit`)
- [ ] Build succeeds (`npm run build`)
- [ ] Code follows design token conventions (no hardcoded values)
- [ ] No `any` types (unless justified)
- [ ] No `fetch()`/`localStorage` calls in components or pages
- [ ] Commit messages follow Conventional Commits
- [ ] PR description explains what and why
- [ ] Screenshots added for UI changes

---

## 14. Definition of Done

A ticket is **done** when:

1. All acceptance criteria are met
2. Code is implemented following architecture rules
3. Tests are written and passing
4. Lint, type-check, and build all pass
5. PR is reviewed and approved
6. Branch is merged into `develop`

---

## 15. OpenCode Workflow

When working with OpenCode on this project:

1. Load all relevant context files before starting work.
2. Understand the existing architecture before proposing changes.
3. Follow existing patterns — match code style, component structure, and naming conventions.
4. Run `npm run lint` and `npm run build` (frontend) or `ruff check` and `pytest` (backend) before completing any ticket.
5. Update AGENTS.md if new architectural patterns or conventions are established.
6. Stage and commit only intended files — avoid committing build artifacts (`tsconfig.tsbuildinfo`, `dist/`, `__pycache__/`, `.ruff_cache/`).
7. Keep each commit atomic — one logical change per commit.

---

## 16. Rules for AI-assisted Development

1. **Never assume library availability** — check `package.json` (or `pyproject.toml`) before importing.
2. **Never modify AGENTS.md** unless explicitly asked.
3. **Never add comments to code** unless the existing codebase has them or the user asks.
4. **Never modify existing architectural patterns** — match the style of neighboring files.
5. **Always read the file before editing** — use the Read tool first.
6. **Always verify with lint + build + test** before declaring work complete.
7. **Prefer edits over rewrites** — make minimal, targeted changes.
8. **Explain what the command does** when running non-trivial bash commands.
9. **Never commit unless explicitly asked** — present a suggested commit message instead.
10. **Never stage build artifacts** — `tsconfig.tsbuildinfo`, `dist/`, `__pycache__/`, `.ruff_cache/`, `.coverage`, etc.

---

## 17. Things Never Allowed

- ❌ Calling `fetch()` or `axios` directly inside React pages or components. Use `api/client.ts`.
- ❌ Accessing `localStorage` or `sessionStorage` directly from components. Use `tokenStorage` service.
- ❌ Business logic inside UI components. Pages/ components render data; services/hooks manage logic.
- ❌ Hardcoded color, spacing, or typography values. Use design tokens.
- ❌ `any` types (unless absolutely necessary with a clear justification comment).
- ❌ Modifying `tsconfig.tsbuildinfo`, `dist/`, or other build artifacts.
- ❌ Large monolithic components — keep them small and focused.
- ❌ Class components (React) — use functional components with hooks.
- ❌ `git push --force` on protected branches.
- ❌ Committing secrets, API keys, or environment files.
- ❌ Merging without passing CI checks.

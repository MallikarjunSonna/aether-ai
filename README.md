# Aether AI

> Enterprise AI workspace platform.

[![Release](https://img.shields.io/badge/release-v0.3.0-blueviolet)](https://github.com/MallikarjunSonna/aether-ai/releases)
[![License: MIT](https://img.shields.io/badge/license-MIT-blue)](./LICENSE)
[![React](https://img.shields.io/badge/React-19-61DAFB?logo=react)](https://react.dev)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.115-009688?logo=fastapi)](https://fastapi.tiangolo.com)
[![TypeScript](https://img.shields.io/badge/TypeScript-strict-3178C6?logo=typescript)](https://www.typescriptlang.org)
[![Python](https://img.shields.io/badge/Python-3.11-3776AB?logo=python)](https://www.python.org)

A provider-agnostic AI workspace platform with built-in authentication, organization management, role-based access control, and a pluggable AI Gateway architecture. Backend built with FastAPI and SQLAlchemy; frontend built with React 19, TypeScript, and Tailwind CSS.

## Key Features

- **JWT Authentication** — Access/refresh token flow with Argon2 password hashing
- **User Management** — Registration, login, logout, and profile management
- **AI Gateway** — Provider-agnostic architecture with pluggable AI providers
- **Multi-Provider AI** — OpenAI and Anthropic with runtime provider selection
- **Streaming Responses** — Real-time token-by-token streaming via SSE-like async iterables
- **Modular Architecture** — Separated concerns with repositories, services, and API layers
- **Async by Default** — Async SQLAlchemy sessions and FastAPI async endpoints
- **Type-Safe** — Pydantic v2 schemas, TypeScript frontend, and shared type contracts
- **Testing Foundation** — Comprehensive test suite with 90%+ backend coverage
- **Code Quality** — Ruff, Black, isort (backend) + ESLint, Prettier, TypeScript strict (frontend)
- **CI Pipeline** — GitHub Actions with lint, type-check, test, and build on every push

## Architecture

```
Browser
   │
   ▼
┌────────────────────────────┐
│   React (TypeScript)       │
│   ├── Auth Context         │
│   ├── useAIChat Hook       │
│   ├── useProviderSelection │
│   ├── API Client           │
│   └── ProviderSelector     │
└─────────────┬──────────────┘
              │ HTTP / JSON
              ▼
┌────────────────────────────┐
│   FastAPI (Python)         │
│   ├── API Routes v1        │
│   ├── Auth                 │
│   ├── Services             │
│   └── Repositories         │
└─────────────┬──────────────┘
              │
              ▼
┌────────────────────────────┐
│   AI Gateway               │
│   (Provider-Agnostic)      │
│                            │
│  ┌──────────────────────┐  │
│  │ ProviderRegistry     │  │
│  │ ModelRegistry        │  │
│  └──────────┬───────────┘  │
│             │              │
│  ┌──────────▼───────────┐  │
│  │  AIProvider Interface│  │
│  └──────────┬───────────┘  │
│             │              │
│  ┌──────────┼──────────┐   │
│  ▼          ▼          ▼   │
│ OpenAI   Anthropic   Mock  │
│ Provider Provider   Provider│
└────────────────────────────┘
              │
              ▼
┌────────────────────────────┐
│   PostgreSQL               │
└────────────────────────────┘
```

## Technology Stack

### Backend
| Category        | Technology                          |
|-----------------|-------------------------------------|
| Framework       | FastAPI                             |
| Language        | Python 3.11+                        |
| ORM             | SQLAlchemy (async)                  |
| Database        | PostgreSQL (asyncpg)                |
| Migrations      | Alembic                             |
| Auth            | PyJWT (access + refresh tokens)     |
| Password Hashing| Argon2 via pwdlib, bcrypt via passlib|
| Validation      | Pydantic v2                         |
| Testing         | pytest, pytest-asyncio, httpx, aiosqlite |
| Lint / Format   | Ruff, Black, isort                  |

### Frontend
| Category        | Technology                          |
|-----------------|-------------------------------------|
| Framework       | React 19                            |
| Language        | TypeScript (strict)                 |
| Build Tool      | Vite                                |
| Routing         | React Router 7                      |
| State Mgmt      | TanStack Query, React Context       |
| Forms           | react-hook-form, Zod                |
| Styling         | Tailwind CSS 3                      |
| Animations      | Framer Motion                       |
| Testing         | Vitest, React Testing Library, user-event |
| Lint / Format   | ESLint, Prettier                    |

## Repository Structure

```
aether-ai/
├── .github/
│   ├── workflows/
│   │   └── ci.yml                  # CI pipeline
│   ├── ISSUE_TEMPLATE/
│   │   ├── bug_report.md
│   │   └── feature_request.md
│   └── PULL_REQUEST_TEMPLATE.md
│
├── backend/
│   ├── app/
│   │   ├── api/                    # FastAPI route handlers
│   │   ├── config/                 # Application settings
│   │   ├── core/                   # Security, exceptions, middleware
│   │   ├── database/               # SQLAlchemy engine, session, mixins
│   │   ├── models/                 # SQLAlchemy ORM models
│   │   ├── repositories/           # Data access layer
│   │   ├── schemas/                # Pydantic request/response schemas
│   │   ├── services/               # Business logic layer
│   │   └── main.py                 # Application entry point
│   ├── tests/                      # Backend test suite
│   ├── pyproject.toml
│   └── .env.example
│
├── frontend/
│   ├── src/
│   │   ├── api/                    # API client and auth API functions
│   │   ├── components/             # Reusable UI components
│   │   │   └── chat/               # AI Chat UI (ProviderSelector, ChatLayout, etc.)
│   │   ├── constants/              # Application constants
│   │   ├── contexts/               # React Context providers
│   │   ├── hooks/                  # Custom React hooks (useAIChat, useProviderSelection, etc.)
│   │   ├── layouts/                # Layout components
│   │   ├── lib/                    # Third-party library configs
│   │   ├── pages/                  # Page components
│   │   ├── providers/              # AI provider implementations (OpenAI, Anthropic, Mock)
│   │   ├── routes/                 # Route guards
│   │   ├── services/               # Client-side services (AIChatService, token storage, AI Gateway)
│   │   ├── styles/                 # Design tokens, theme, global CSS
│   │   ├── types/                  # TypeScript type definitions
│   │   ├── App.tsx
│   │   ├── main.tsx
│   │   └── router.tsx
│   ├── tests/                      # Frontend test suite
│   ├── package.json
│   ├── tsconfig.json
│   ├── vitest.config.ts
│   └── .env.example
│
├── docker/                         # Docker configuration
├── docs/                           # Architecture documentation
├── .editorconfig
├── .prettierignore
├── CONTRIBUTING.md
├── LICENSE
└── README.md
```

## Prerequisites

- Python 3.11+
- Node.js 22 LTS
- PostgreSQL 16+ (or Docker for local dev)
- Git

## Run with Docker

```bash
docker compose up --build
```

The API is available at `http://localhost:8000` and the frontend at `http://localhost:5173`.

## Installation

### Backend Setup

```bash
# Clone the repository
git clone https://github.com/MallikarjunSonna/aether-ai.git
cd aether-ai/backend

# Create and activate a virtual environment
python -m venv .venv
source .venv/bin/activate  # Linux/macOS
# .venv\Scripts\activate   # Windows

# Install dependencies (including test and dev)
pip install -e ".[test,dev]"

# Copy environment file and configure
cp .env.example .env
```

### Frontend Setup

```bash
cd aether-ai/frontend

# Install dependencies
npm install

# Copy environment file and configure
cp .env.example .env
```

## Environment Variables

### Backend (`backend/.env`)

| Variable                     | Description                  | Default               |
|------------------------------|------------------------------|-----------------------|
| `DATABASE_URL`               | PostgreSQL connection string | `postgresql+asyncpg://user:pass@localhost:5432/aether` |
| `JWT_SECRET_KEY`             | Secret key for JWT signing   | *(required)*          |
| `JWT_ALGORITHM`              | JWT signing algorithm        | `HS256`               |
| `ACCESS_TOKEN_EXPIRE_MINUTES`| Access token TTL             | `30`                  |
| `REFRESH_TOKEN_EXPIRE_DAYS`  | Refresh token TTL            | `7`                   |

### Frontend (`frontend/.env`)

| Variable                  | Description                  | Default                 |
|---------------------------|------------------------------|-------------------------|
| `VITE_API_BASE_URL`       | Backend API base URL         | `http://localhost:8000` |
| `VITE_OPENAI_API_KEY`     | OpenAI API key (optional)    | —                       |
| `VITE_ANTHROPIC_API_KEY`  | Anthropic API key (optional) | —                       |

## Running Locally

### Backend

```bash
cd backend
source .venv/bin/activate  # or .venv\Scripts\activate on Windows
uvicorn app.main:app --reload
```

The API is available at `http://localhost:8000`. Interactive docs at `http://localhost:8000/docs`.

### Frontend

```bash
cd frontend
npm run dev
```

The app is available at `http://localhost:5173`.

## Running Tests

### Backend

```bash
cd backend
pytest                          # Run all tests
pytest --cov=app                # With coverage report
pytest -v                       # Verbose output
```

### Frontend

```bash
cd frontend
npm run test                    # Run all tests
npm run test:watch              # Watch mode
```

## Code Quality

### Backend

```bash
cd backend
ruff check app/ tests/          # Lint
black --check app/ tests/       # Format check
isort --check-only app/ tests/  # Import sort check
```

### Frontend

```bash
cd frontend
npm run lint                    # ESLint
npm run format:check            # Prettier check
npx tsc --noEmit                # TypeScript check
```

## CI Pipeline

Every push and pull request triggers GitHub Actions to run:

- **Backend:** ruff → black --check → isort --check-only → pytest → pytest --cov
- **Frontend:** lint → tsc --noEmit → test → build

## Screenshots

*Screenshots coming soon.*

## Roadmap

- [x] Project scaffold and architecture
- [x] Design system and theming
- [x] Authentication (register, login, logout, refresh)
- [x] Testing foundation and auth tests
- [x] Code quality tooling and CI pipeline
- [x] Dashboard shell and widget system
- [x] Organization and workspace management
- [x] Role-based access control (RBAC)
- [x] AI Gateway foundation, Provider Registry, Model Registry
- [x] OpenAI provider integration
- [x] Anthropic provider integration
- [x] Streaming responses
- [x] AI Chat interface with provider selection
- [ ] Member management and invitations
- [ ] Conversation persistence
- [ ] Markdown rendering and code highlighting
- [ ] RAG (Retrieval-Augmented Generation) pipeline
- [ ] AI Agents
- [ ] Real-time collaboration

## Contributing

Please read [CONTRIBUTING.md](./CONTRIBUTING.md) for details on our code of conduct, branching strategy, commit conventions, and the pull request process.

## License

This project is licensed under the MIT License — see the [LICENSE](./LICENSE) file for details.

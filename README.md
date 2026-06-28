# Aether AI

[![Build Status]](https://github.com/your-org/aether-ai/actions)
[![Coverage]](https://github.com/your-org/aether-ai/actions)
[![License: MIT]](./LICENSE)
[![Python 3.11+]](https://www.python.org)
[![React 19+]](https://react.dev)
[![TypeScript]](https://www.typescriptlang.org)

Enterprise-grade AI application foundation with a FastAPI backend and React frontend, featuring built-in authentication, user management, and a scalable architecture.

## Key Features

- **JWT Authentication** — Access/refresh token flow with Argon2 password hashing
- **User Management** — Registration, login, logout, and profile management
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
┌─────────────────────────────┐
│       React (Vite)          │
│  ┌───────────────────────┐  │
│  │    Auth Context        │  │
│  │    useAuth Hook        │  │
│  └──────────┬────────────┘  │
│  ┌──────────▼────────────┐  │
│  │    API Client          │  │
│  │    (fetch / axios)     │  │
│  └──────────┬────────────┘  │
└─────────────┼───────────────┘
              │ HTTP / JSON
              ▼
┌─────────────────────────────┐
│       FastAPI (Python)      │
│  ┌───────────────────────┐  │
│  │   API Routes (v1)     │  │
│  ├───────────────────────┤  │
│  │   Auth Dependencies   │  │
│  ├───────────────────────┤  │
│  │     Services          │  │
│  ├───────────────────────┤  │
│  │   Repositories        │  │
│  ├───────────────────────┤  │
│  │   SQLAlchemy ORM      │  │
│  └──────────┬────────────┘  │
└─────────────┼───────────────┘
              │
              ▼
      ┌───────────────┐
      │  PostgreSQL   │
      └───────────────┘
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
│   │   ├── contexts/               # React Context providers
│   │   ├── hooks/                  # Custom React hooks
│   │   ├── layouts/                # Layout components
│   │   ├── lib/                    # Third-party library configs
│   │   ├── pages/                  # Page components
│   │   ├── routes/                 # Route guards
│   │   ├── services/               # Client-side services (token storage)
│   │   ├── styles/                 # Design tokens, theme, global CSS
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

## Installation

### Backend Setup

```bash
# Clone the repository
git clone https://github.com/your-org/aether-ai.git
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

| Variable             | Description                  | Default                 |
|----------------------|------------------------------|-------------------------|
| `VITE_API_BASE_URL`  | Backend API base URL         | `http://localhost:8000` |

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
- [ ] Dashboard and user profile pages
- [ ] Organization and workspace management
- [ ] Member management and invitations
- [ ] AI agent integration
- [ ] RAG (Retrieval-Augmented Generation) pipeline
- [ ] Real-time collaboration

## Contributing

Please read [CONTRIBUTING.md](./CONTRIBUTING.md) for details on our code of conduct, branching strategy, commit conventions, and the pull request process.

## License

This project is licensed under the MIT License — see the [LICENSE](./LICENSE) file for details.

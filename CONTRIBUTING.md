# Contributing to Aether AI

Thank you for your interest in contributing! We welcome contributions of all kinds — bug fixes, features, documentation, and tests.

## Table of Contents

- [Branching Strategy](#branching-strategy)
- [Commit Message Style](#commit-message-style)
- [Coding Standards](#coding-standards)
- [Testing Requirements](#testing-requirements)
- [Pull Request Checklist](#pull-request-checklist)

## Branching Strategy

- `main` — Stable, production-ready code. Protected — no direct pushes.
- `develop` — Integration branch for feature work.
- `feat/<short-description>` — New features (branched from `develop`).
- `fix/<short-description>` — Bug fixes (branched from `develop`).
- `chore/<short-description>` — Tooling, CI, dependency updates.
- `docs/<short-description>` — Documentation-only changes.

Always open pull requests against `develop` unless it is a hotfix for `main`.

## Commit Message Style

We follow [Conventional Commits](https://www.conventionalcommits.org/):

```
<type>(<scope>): <short summary>

[optional body]
```

Types: `feat`, `fix`, `chore`, `docs`, `style`, `refactor`, `test`, `ci`.

Examples:
```
feat(auth): add refresh token rotation
fix(api): handle null email in user lookup
chore(deps): upgrade fastapi to 0.115.x
docs(readme): update architecture diagram
```

Scopes: `api`, `auth`, `ui`, `deps`, `config`, `ci`, `docs`, etc.

### Backend

- Follow PEP 8. Black and isort enforce formatting automatically.
- Run `ruff check` before committing.
- Type-annotate all function signatures and public methods.
- Use Pydantic v2 schemas for request/response validation.
- Write async functions for all database and network operations.

### Frontend

- TypeScript strict mode is enabled. Avoid `any` (warn-level rule).
- Use named exports for components and utilities.
- Preter and ESLint enforce style and quality — run `npm run lint` and `npm run format:check`.
- Use React Testing Library and `user-event` for component tests.
- Prefer functional components with hooks over class components.

## Testing Requirements

### Backend

- All new endpoints must have integration tests via `httpx.AsyncClient`.
- Services and repositories require unit tests with mocked dependencies.
- Maintain or improve the 90% coverage threshold.
- Use `pytest-asyncio` for async tests.
- Prefer in-memory SQLite via `aiosqlite` for test database.

### Frontend

- All pages and route guards must have interaction tests.
- Mock the API layer (`src/api/auth.ts`) and `useAuth` hook — never mock fetch directly.
- Use `userEvent.setup()` for realistic user interactions.
- Avoid snapshot tests; prefer explicit assertions on rendered output.

## Pull Request Checklist

Before submitting a pull request, ensure the following:

- [ ] Code builds without errors (`npm run build` / backend imports resolve)
- [ ] All tests pass (`pytest` / `npm run test`)
- [ ] Lint checks pass (`ruff check` / `npm run lint`)
- [ ] Format checks pass (`black --check` + `isort --check-only` / `npm run format:check`)
- [ ] TypeScript compiles cleanly (`npx tsc --noEmit`)
- [ ] No new warnings introduced
- [ ] Documentation updated if behavior changed
- [ ] Changes are scoped to a single concern (avoid mixed commits)
- [ ] Branch is up to date with `develop`
- [ ] Commit messages follow Conventional Commits

## Getting Help

If you have questions, open a [Discussion](https://github.com/your-org/aether-ai/discussions) or reach out to the maintainers.

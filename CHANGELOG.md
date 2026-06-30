# Changelog

All notable changes to the Aether AI project are documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/).

---

## [Unreleased]

### Planned

- Conversation persistence
- Markdown rendering and code highlighting
- RAG (Retrieval-Augmented Generation) pipeline
- AI Agents
- Provider plugins
- Real-time collaboration

---

## [0.3.0] — Multi-Provider AI Chat — 2026-07-01

### Added

- OpenAI provider integration with `OpenAIProvider` implementing the `AIProvider` interface
- Anthropic provider integration with `AnthropicProvider` supporting system message handling
- `AIChatService` as the UI-facing layer over the AI Gateway
- `useAIChat` hook for chat state management with loading, error, and message history
- `useProviderSelection` hook for runtime provider and model switching
- `ProviderSelector` component with health status and streaming capability indicators
- Enterprise AI Chat UI with dedicated page at `/dashboard/chat`
- Chat components: `ChatEmptyState`, `ChatMessage`, `ChatMessages`, `ChatInput`, `ChatLayout`
- Streaming response support across all providers via async iterables
- Provider-neutral error mapping that translates SDK errors into user-friendly messages
- Real-time token-by-token streaming with abort/cancellation support

### Changed

- AI Gateway validated end-to-end with OpenAI and Anthropic providers
- AI Chat architecture now supports runtime provider selection without UI provider-specific logic
- OpenAI model IDs verified against the official SDK `ChatModel` type

---

## [0.2.0] — Enterprise Platform Foundation — 2026-06-29

### Added

- Enterprise authentication with JWT-based access and refresh token rotation
- Dashboard shell with responsive sidebar, header, breadcrumbs, and user menu
- Organization management with CRUD operations, search, and filtering
- Workspace management with nested organization hierarchy and role controls
- Role-based access control foundation with permission strings, role hierarchy, and guards
- Dashboard widget system with reusable `DashboardWidget` container and `DashboardGrid` layout
- AI Gateway foundation including provider-agnostic architecture, `ProviderRegistry`, and `ModelRegistry`
- Mock AI Provider with deterministic responses for chat, completion, and embedding models
- Shared `useClickOutside` hook for consistent dropdown behavior
- Placeholder route pages for all navigation items (chat, agents, prompts, knowledge base, documents, projects, analytics, settings)
- GitHub Actions CI pipeline for automated linting, type checking, testing, and builds
- Testing infrastructure with Vitest, React Testing Library, and mock services
- AGENTS.md engineering handbook codifying architecture rules, coding standards, and contribution guidelines

### Changed

- Dashboard refactored from hardcoded cards into a reusable widget architecture using `DashboardWidget` and `DashboardGrid`
- Click-outside dropdown logic extracted into a shared `useClickOutside` hook, eliminating five duplicate implementations
- Direct `localStorage` access in the auth API replaced with the existing `tokenStorage` service

### Fixed

- Sidebar navigation completeness — all eleven navigation items now have corresponding registered routes
- Duplicate click-outside logic eliminated across `UserMenu`, `OrganizationCard`, `OrganizationSwitcher`, `WorkspaceCard`, and `WorkspaceSwitcher`

---

## [0.1.0] — Foundation Release — 2026-06-15

### Added

- FastAPI backend scaffold with async SQLAlchemy 2.0 ORM and Pydantic v2 validation
- React 19 frontend scaffold with TypeScript, Vite 8, and Tailwind CSS
- Design system with primitive design tokens and semantic theme mapping
- Authentication foundation with login, registration, password reset, and JWT service
- Project documentation including architecture overview, backend structure, and roadmap
- Docker setup with `docker-compose.yml` for local development
- Initial CI configuration with linting, type checking, and test execution

[Unreleased]: https://github.com/MallikarjunSonna/aether-ai/compare/v0.3.0...HEAD
[0.3.0]: https://github.com/MallikarjunSonna/aether-ai/releases/tag/v0.3.0
[0.2.0]: https://github.com/MallikarjunSonna/aether-ai/releases/tag/v0.2.0
[0.1.0]: https://github.com/MallikarjunSonna/aether-ai/releases/tag/v0.1.0

"""Mock retriever that returns synthetic results from Knowledge Hub, Workspace Memory,
and Prompt Library metadata using simple keyword-based mock ranking."""

import logging
import random
import time

from app.services.rag.base_retriever import Retriever
from app.services.rag.errors import RetrievalError
from app.services.rag.schemas import RetrievalQuery, RetrievalResponse, RetrievalResult

logger = logging.getLogger(__name__)

MOCK_KNOWLEDGE_ITEMS: list[dict] = [
    {"id": "know-001", "title": "API Design Guidelines", "content": "All REST APIs must use semantic versioning, paginate list responses, and return standardized error envelopes. Rate limits are enforced per organization."},
    {"id": "know-002", "title": "Database Schema Overview", "content": "The primary database uses PostgreSQL with SQLAlchemy 2.0 async sessions. All tables use UUID primary keys with automatic timestamps and soft delete support."},
    {"id": "know-003", "title": "Authentication Flow", "content": "Authentication uses JWT access and refresh tokens. Access tokens expire after 15 minutes. Refresh tokens expire after 7 days. Passwords are hashed with Argon2 via pwdlib."},
    {"id": "know-004", "title": "Deployment Architecture", "content": "The application is deployed as Docker containers orchestrated by Kubernetes. The frontend is served as a static SPA behind a CDN. The backend runs as a FastAPI application with async workers."},
    {"id": "know-005", "title": "Monitoring and Observability", "content": "All services emit structured JSON logs. Metrics are collected via OpenTelemetry and sent to the observability stack. Alerts are configured for error rate spikes and latency degradation."},
    {"id": "know-006", "title": "Workspace Memory Retention", "content": "Workspace memory retains conversation summaries for 90 days. Each summary is compressed using a configurable strategy. Memory items are associated with specific workspaces and users."},
    {"id": "know-007", "title": "Prompt Template System", "content": "Prompt templates support variable interpolation, versioning, and categorization. Templates are stored as YAML files in the prompts directory and loaded at application startup."},
    {"id": "know-008", "title": "Security Best Practices", "content": "All API endpoints require authentication except the health check. CORS is configured per environment. API keys are stored in environment variables, never in the codebase or database."},
]

MOCK_MEMORY_ITEMS: list[dict] = [
    {"id": "mem-001", "title": "User prefers concise responses", "content": "Users across the platform consistently prefer concise, bullet-point responses over verbose paragraphs. The AI should prioritize clarity and brevity."},
    {"id": "mem-002", "title": "Common customer question: API keys", "content": "Customers frequently ask how to rotate API keys without downtime. The standard recommendation is to use the key rotation endpoint and update client configurations during off-peak hours."},
    {"id": "mem-003", "title": "Team decision: TypeScript strict mode", "content": "The frontend team decided to enable TypeScript strict mode across all new features. Existing code is being migrated incrementally. No exceptions without team lead approval."},
    {"id": "mem-004", "title": "Performance requirement: P95 < 200ms", "content": "The platform has a P95 latency requirement of under 200 milliseconds for all API endpoints excluding AI generation. This is enforced through automated performance regression tests."},
    {"id": "mem-005", "title": "Deployment schedule: Wednesday window", "content": "Production deployments are scheduled for Wednesdays between 2 PM and 4 PM UTC. Emergency hotfixes bypass this window but require immediate post-deployment monitoring."},
]

MOCK_PROMPT_ITEMS: list[dict] = [
    {"id": "prm-001", "title": "Code Review Assistant", "content": "You are a senior code reviewer. Analyze the provided code diff for bugs, security vulnerabilities, style issues, and performance problems. Provide specific line-level feedback."},
    {"id": "prm-002", "title": "Documentation Generator", "content": "You are a technical writer. Generate comprehensive documentation for the provided code or API specification. Include descriptions, type information, usage examples, and edge cases."},
    {"id": "prm-003", "title": "Architecture Advisor", "content": "You are a software architect. Evaluate the proposed architecture against the project's constraints, scalability requirements, and technology stack. Identify risks and suggest alternatives."},
    {"id": "prm-004", "title": "Database Query Optimizer", "content": "You are a database specialist. Analyze the provided SQL query and schema for performance optimization opportunities. Suggest index additions, query rewrites, and schema adjustments."},
    {"id": "prm-005", "title": "Security Auditor", "content": "You are a security engineer. Review the provided code or configuration for security vulnerabilities following OWASP guidelines. Classify findings by severity and propose fixes."},
]


def _keyword_match(text: str, query: str) -> float:
    """Return a mock relevance score between 0 and 1."""
    query_lower = query.lower()
    text_lower = text.lower()
    words = query_lower.split()
    if not words:
        return 0
    matches = sum(1 for w in words if w in text_lower)
    return matches / len(words) if matches > 0 else 0


def _mock_retrieval(items: list[dict], query: RetrievalQuery, source_type: str) -> list[RetrievalResult]:
    """Rank items by keyword match and return scored results."""
    scored: list[tuple[float, dict]] = []
    for item in items:
        score = _keyword_match(item["content"] + " " + item["title"], query.text)
        if score > 0:
            scored.append((score, item))

    scored.sort(key=lambda x: x[0], reverse=True)

    results: list[RetrievalResult] = []
    for score, item in scored[:query.max_results]:
        results.append(
            RetrievalResult(
                content=item["content"],
                source_type=source_type,
                source_id=item["id"],
                title=item["title"],
                score=round(score, 4),
                embedding_model="mock-keyword-v1",
                similarity_score=round(score, 4),
                chunk_id=f"{item['id']}-chunk-0",
                reranking_score=round(score * random.uniform(0.9, 1.0), 4),
            )
        )
    return results


class MockRetriever(Retriever):
    """Deterministic mock retriever using keyword matching.

    Retrieves from three internal mock corpora:
    - Knowledge Hub metadata (8 items)
    - Workspace Memory (5 items)
    - Prompt Library (5 items)

    Replace with VectorRetriever for production embedding-based search.
    """

    async def retrieve(self, query: RetrievalQuery) -> RetrievalResponse:
        """Retrieve and rank mock results by keyword overlap."""
        start = time.monotonic()
        logger.info("MockRetriever retrieving for query: %s", query.text[:60])

        try:
            if not query.text.strip():
                raise RetrievalError("Query text must not be empty.")

            source_handlers: list[tuple[str, list[dict]]] = [
                ("knowledge", MOCK_KNOWLEDGE_ITEMS),
                ("memory", MOCK_MEMORY_ITEMS),
                ("prompt", MOCK_PROMPT_ITEMS),
            ]

            if query.source_types:
                source_handlers = [
                    (st, items) for st, items in source_handlers if st in query.source_types
                ]

            all_results: list[RetrievalResult] = []
            for source_type, items in source_handlers:
                results = _mock_retrieval(items, query, source_type)
                all_results.extend(results)

            all_results.sort(key=lambda r: r.score, reverse=True)
            top_results = all_results[: query.max_results]

            elapsed = (time.monotonic() - start) * 1000
            logger.info("MockRetriever found %d results in %.1fms", len(top_results), elapsed)

            return RetrievalResponse(
                results=top_results,
                total_found=len(top_results),
                retrieval_latency_ms=round(elapsed, 2),
            )

        except RetrievalError:
            raise
        except Exception as exc:
            logger.exception("MockRetriever failed unexpectedly.")
            raise RetrievalError(str(exc)) from exc

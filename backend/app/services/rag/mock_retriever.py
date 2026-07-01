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
    {
        "id": "know-001",
        "title": "API Design Guidelines",
        "content": "All REST APIs must use semantic versioning and paginate list responses.",  # noqa: E501
    },
    {
        "id": "know-002",
        "title": "Database Schema Overview",
        "content": "The primary database uses PostgreSQL with SQLAlchemy 2.0 async sessions. All tables use UUID primary keys with soft delete.",  # noqa: E501
    },
    {
        "id": "know-003",
        "title": "Authentication Flow",
        "content": "Authentication uses JWT access and refresh tokens. Access tokens expire after 15 minutes. Refresh tokens after 7 days.",  # noqa: E501
    },
    {
        "id": "know-004",
        "title": "Deployment Architecture",
        "content": "The application is deployed in Docker containers orchestrated by Kubernetes. The frontend is a static SPA behind a CDN.",  # noqa: E501
    },
    {
        "id": "know-005",
        "title": "Monitoring and Observability",
        "content": "All services emit structured JSON logs. Metrics are collected via OpenTelemetry. Alerts fire on error rate spikes and latency degradation.",  # noqa: E501
    },
    {
        "id": "know-006",
        "title": "Workspace Memory Retention",
        "content": "Workspace memory retains conversation summaries for 90 days. Each summary is compressed. Items are tied to workspaces and users.",  # noqa: E501
    },
    {
        "id": "know-007",
        "title": "Prompt Template System",
        "content": "Prompt templates support variable interpolation, versioning, and categorization. Templates are stored as YAML files and loaded at startup.",  # noqa: E501
    },
    {
        "id": "know-008",
        "title": "Security Best Practices",
        "content": "All API endpoints require authentication except health check. CORS is per environment. API keys are in environment variables, never in code.",  # noqa: E501
    },
]

MOCK_MEMORY_ITEMS: list[dict] = [
    {
        "id": "mem-001",
        "title": "User prefers concise responses",
        "content": "Users prefer concise, bullet-point responses. The AI should prioritize clarity and brevity over verbosity.",  # noqa: E501
    },
    {
        "id": "mem-002",
        "title": "Common customer question: API keys",
        "content": "Customers ask how to rotate API keys without downtime. Use the key rotation endpoint during off-peak hours.",  # noqa: E501
    },
    {
        "id": "mem-003",
        "title": "Team decision: TypeScript strict mode",
        "content": "The frontend team enables TypeScript strict mode on all new features. Existing code migrates incrementally.",  # noqa: E501
    },
    {
        "id": "mem-004",
        "title": "Performance requirement: P95 < 200ms",
        "content": "P95 latency must be under 200ms for all API endpoints excluding AI generation. Enforced via automated regression tests.",  # noqa: E501
    },
    {
        "id": "mem-005",
        "title": "Deployment schedule: Wednesday window",
        "content": "Production deploys are Wednesdays 2-4 PM UTC. Hotfixes bypass this window but require immediate post-deploy monitoring.",  # noqa: E501
    },
]

MOCK_PROMPT_ITEMS: list[dict] = [
    {
        "id": "prm-001",
        "title": "Code Review Assistant",
        "content": "You are a senior code reviewer. Analyze the code diff for bugs, vulnerabilities, style issues, and performance problems.",  # noqa: E501
    },
    {
        "id": "prm-002",
        "title": "Documentation Generator",
        "content": "You are a technical writer. Generate documentation for the provided code or API spec with examples and edge cases.",  # noqa: E501
    },
    {
        "id": "prm-003",
        "title": "Architecture Advisor",
        "content": "You are a software architect. Evaluate the architecture against constraints, scalability needs, and technology stack.",  # noqa: E501
    },
    {
        "id": "prm-004",
        "title": "Database Query Optimizer",
        "content": "You are a database specialist. Analyze SQL queries for performance optimization opportunities and suggest improvements.",  # noqa: E501
    },
    {
        "id": "prm-005",
        "title": "Security Auditor",
        "content": "You are a security engineer. Review code for OWASP vulnerabilities, classify by severity, and propose fixes.",  # noqa: E501
    },
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


def _mock_retrieval(
    items: list[dict], query: RetrievalQuery, source_type: str
) -> list[RetrievalResult]:
    """Rank items by keyword match and return scored results."""
    scored: list[tuple[float, dict]] = []
    for item in items:
        score = _keyword_match(item["content"] + " " + item["title"], query.text)
        if score > 0:
            scored.append((score, item))

    scored.sort(key=lambda x: x[0], reverse=True)

    results: list[RetrievalResult] = []
    for score, item in scored[: query.max_results]:
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
                    (st, items)
                    for st, items in source_handlers
                    if st in query.source_types
                ]

            all_results: list[RetrievalResult] = []
            for source_type, items in source_handlers:
                results = _mock_retrieval(items, query, source_type)
                all_results.extend(results)

            all_results.sort(key=lambda r: r.score, reverse=True)
            top_results = all_results[: query.max_results]

            elapsed = (time.monotonic() - start) * 1000
            logger.info(
                "MockRetriever found %d results in %.1fms", len(top_results), elapsed
            )

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

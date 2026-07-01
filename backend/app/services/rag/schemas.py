"""Pydantic schemas for the RAG pipeline."""

from datetime import datetime
from typing import Any, Literal

from pydantic import BaseModel, Field

SourceType = Literal["knowledge", "memory", "prompt"]


class Citation(BaseModel):
    """Attribution for a single retrieved source."""

    source_id: str
    source_type: SourceType
    title: str
    excerpt: str
    relevance_score: float = Field(default=0.0, ge=0, le=1)
    url: str | None = None


class RetrievalResult(BaseModel):
    """A single item returned by a retriever."""

    content: str
    source_type: SourceType
    source_id: str
    title: str
    score: float = Field(default=0.0, ge=0, le=1)

    embedding_model: str | None = None
    similarity_score: float | None = None
    chunk_id: str | None = None
    reranking_score: float | None = None


class RetrievalQuery(BaseModel):
    """Input to a retriever."""

    text: str
    max_results: int = Field(default=5, ge=1, le=50)
    source_types: list[SourceType] | None = None
    metadata_filter: dict[str, Any] | None = None


class RetrievalResponse(BaseModel):
    """Output from a retriever."""

    results: list[RetrievalResult]
    total_found: int
    retrieval_latency_ms: float = 0


class MergedContext(BaseModel):
    """Unified context assembled from all retrieval sources."""

    knowledge_items: list[RetrievalResult] = []
    memory_items: list[RetrievalResult] = []
    prompt_items: list[RetrievalResult] = []
    combined_text: str = ""
    total_sources: int = 0


class PromptAssembly(BaseModel):
    """Assembled prompt ready for the AI gateway."""

    system_prompt: str
    context_section: str
    user_question: str
    full_prompt: str


class RagMetadata(BaseModel):
    """Future-ready metadata for the RAG pipeline."""

    embedding_model: str | None = None
    retrieval_latency_ms: float = 0
    context_build_latency_ms: float = 0
    prompt_build_latency_ms: float = 0
    total_pipeline_latency_ms: float = 0
    total_tokens_used: int = 0
    sources_retrieved: int = 0
    sources_after_reranking: int = 0


class RagRequest(BaseModel):
    """Full request to the RAG pipeline."""

    query: str
    system_prompt: str | None = None
    provider: str = "mock"
    model: str = "mock-chat"
    max_results: int = Field(default=5, ge=1, le=50)
    source_types: list[SourceType] | None = None
    metadata_filter: dict[str, Any] | None = None
    temperature: float | None = Field(default=0.7, ge=0, le=2)
    max_tokens: int | None = Field(default=2048, ge=1)


class RagResponse(BaseModel):
    """Full response from the RAG pipeline."""

    answer: str
    query: str
    context: MergedContext
    citations: list[Citation]
    prompt: PromptAssembly
    metadata: RagMetadata

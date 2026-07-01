"""Tests for the RAG pipeline."""

import pytest

from app.services.ai.gateway import build_gateway
from app.services.rag.base_retriever import Retriever
from app.services.rag.context_builder import ContextBuilder
from app.services.rag.errors import PromptBuildError, RetrievalError
from app.services.rag.mock_retriever import MockRetriever
from app.services.rag.prompt_builder import PromptBuilder
from app.services.rag.rag_service import RagService
from app.services.rag.schemas import (
    MergedContext,
    PromptAssembly,
    RagRequest,
    RetrievalQuery,
    RetrievalResponse,
    RetrievalResult,
)


class TestMockRetriever:
    @pytest.mark.asyncio
    async def test_retrieve_returns_results(self) -> None:
        retriever = MockRetriever()
        query = RetrievalQuery(text="API authentication guidelines")
        response = await retriever.retrieve(query)

        assert isinstance(response, RetrievalResponse)
        assert len(response.results) > 0
        assert response.retrieval_latency_ms >= 0

    @pytest.mark.asyncio
    async def test_retrieve_respects_max_results(self) -> None:
        retriever = MockRetriever()
        query = RetrievalQuery(text="database", max_results=2)
        response = await retriever.retrieve(query)

        assert len(response.results) <= 2

    @pytest.mark.asyncio
    async def test_retrieve_filters_by_source_type(self) -> None:
        retriever = MockRetriever()
        query = RetrievalQuery(text="API", source_types=["memory"])
        response = await retriever.retrieve(query)

        for r in response.results:
            assert r.source_type == "memory"

    @pytest.mark.asyncio
    async def test_retrieve_returns_metadata(self) -> None:
        retriever = MockRetriever()
        query = RetrievalQuery(text="security")
        response = await retriever.retrieve(query)

        if response.results:
            r = response.results[0]
            assert r.embedding_model is not None
            assert r.similarity_score is not None
            assert r.chunk_id is not None

    @pytest.mark.asyncio
    async def test_retrieve_empty_query_raises_error(self) -> None:
        retriever = MockRetriever()
        query = RetrievalQuery(text="  ")

        with pytest.raises(RetrievalError, match="must not be empty"):
            await retriever.retrieve(query)

    @pytest.mark.asyncio
    async def test_results_are_ranked_by_score(self) -> None:
        retriever = MockRetriever()
        query = RetrievalQuery(text="database deployment", max_results=10)
        response = await retriever.retrieve(query)

        scores = [r.score for r in response.results]
        assert scores == sorted(scores, reverse=True)


class TestContextBuilder:
    def test_build_merges_all_sources(self) -> None:
        builder = ContextBuilder()

        knowledge = [
            RetrievalResult(
                content="Knowledge about APIs.",
                source_type="knowledge",
                source_id="know-001",
                title="API Guide",
                score=0.9,
            )
        ]
        memory = [
            RetrievalResult(
                content="Memory about API preferences.",
                source_type="memory",
                source_id="mem-001",
                title="User Preferences",
                score=0.8,
            )
        ]
        prompt = [
            RetrievalResult(
                content="Prompt for API review.",
                source_type="prompt",
                source_id="prm-001",
                title="API Review Prompt",
                score=0.7,
            )
        ]

        context = builder.build(knowledge, memory, prompt)

        assert isinstance(context, MergedContext)
        assert len(context.knowledge_items) == 1
        assert len(context.memory_items) == 1
        assert len(context.prompt_items) == 1
        assert context.total_sources == 3
        assert "[KNOWLEDGE]" in context.combined_text

    def test_build_deduplicates_by_source_id(self) -> None:
        builder = ContextBuilder()
        item = RetrievalResult(
            content="Duplicate content.",
            source_type="knowledge",
            source_id="know-001",
            title="Duplicate",
            score=0.9,
        )

        context = builder.build([item], [item], [item])

        assert context.total_sources == 1

    def test_build_empty_lists(self) -> None:
        builder = ContextBuilder()
        context = builder.build([], [], [])

        assert context.total_sources == 0
        assert context.combined_text == ""


class TestPromptBuilder:
    def test_assemble_builds_all_sections(self) -> None:
        builder = PromptBuilder()
        context = MergedContext(
            knowledge_items=[
                RetrievalResult(
                    content="API guidelines content.",
                    source_type="knowledge",
                    source_id="know-001",
                    title="API Guidelines",
                    score=0.9,
                )
            ],
            memory_items=[],
            prompt_items=[],
            combined_text="[KNOWLEDGE] API Guidelines\nAPI guidelines content.",
            total_sources=1,
        )

        prompt = builder.assemble(
            context=context, question="What are the API guidelines?"
        )

        assert isinstance(prompt, PromptAssembly)
        assert prompt.system_prompt
        assert prompt.context_section
        assert prompt.user_question == "What are the API guidelines?"
        assert "<system>" in prompt.full_prompt
        assert "<context>" in prompt.full_prompt
        assert "<question>" in prompt.full_prompt
        assert "API Guidelines" in prompt.context_section

    def test_assemble_uses_custom_system_prompt(self) -> None:
        builder = PromptBuilder()
        context = MergedContext(
            knowledge_items=[],
            memory_items=[],
            prompt_items=[],
            combined_text="",
            total_sources=0,
        )
        custom_prompt = "You are a test assistant."

        prompt = builder.assemble(
            context=context,
            question="Test?",
            system_prompt=custom_prompt,
        )

        assert prompt.system_prompt == custom_prompt

    def test_assemble_empty_context(self) -> None:
        builder = PromptBuilder()
        context = MergedContext(
            knowledge_items=[],
            memory_items=[],
            prompt_items=[],
            combined_text="",
            total_sources=0,
        )

        prompt = builder.assemble(context=context, question="Test?")

        assert "No relevant context was retrieved" in prompt.context_section

    def test_assemble_empty_question_raises_error(self) -> None:
        builder = PromptBuilder()
        context = MergedContext(
            knowledge_items=[],
            memory_items=[],
            prompt_items=[],
            combined_text="",
            total_sources=0,
        )

        with pytest.raises(PromptBuildError, match="must not be empty"):
            builder.assemble(context=context, question="  ")


class TestRagServiceE2E:
    @pytest.mark.asyncio
    async def test_rag_pipeline_returns_response(self) -> None:
        gateway = build_gateway()
        service = RagService(
            retriever=MockRetriever(),
            context_builder=ContextBuilder(),
            prompt_builder=PromptBuilder(),
            ai_gateway=gateway,
        )

        request = RagRequest(
            query="What are the API authentication guidelines?",
            system_prompt="You are a helpful test assistant.",
            provider="mock",
            model="mock-chat",
        )

        response = await service.answer(request)

        assert response.query == request.query
        assert response.answer
        assert response.context.total_sources > 0
        assert len(response.citations) > 0
        assert response.metadata.total_pipeline_latency_ms >= 0

    @pytest.mark.asyncio
    async def test_rag_pipeline_respects_source_filter(self) -> None:
        gateway = build_gateway()
        service = RagService(
            retriever=MockRetriever(),
            context_builder=ContextBuilder(),
            prompt_builder=PromptBuilder(),
            ai_gateway=gateway,
        )

        request = RagRequest(
            query="API",
            source_types=["memory"],
            provider="mock",
            model="mock-chat",
        )

        response = await service.answer(request)

        assert len(response.context.knowledge_items) == 0
        assert len(response.context.prompt_items) == 0
        assert response.context.total_sources > 0

    @pytest.mark.asyncio
    async def test_rag_pipeline_includes_citations(self) -> None:
        gateway = build_gateway()
        service = RagService(
            retriever=MockRetriever(),
            context_builder=ContextBuilder(),
            prompt_builder=PromptBuilder(),
            ai_gateway=gateway,
        )

        request = RagRequest(
            query="deployment architecture", provider="mock", model="mock-chat"
        )

        response = await service.answer(request)

        assert len(response.citations) > 0
        for citation in response.citations:
            assert citation.source_id
            assert citation.title
            assert citation.excerpt

    @pytest.mark.asyncio
    async def test_rag_pipeline_without_context_still_answers(self) -> None:
        gateway = build_gateway()

        class EmptyRetriever(Retriever):
            async def retrieve(self, query: RetrievalQuery) -> RetrievalResponse:
                return RetrievalResponse(
                    results=[], total_found=0, retrieval_latency_ms=0
                )

        service = RagService(
            retriever=EmptyRetriever(),
            context_builder=ContextBuilder(),
            prompt_builder=PromptBuilder(),
            ai_gateway=gateway,
        )

        request = RagRequest(query="Hello world", provider="mock", model="mock-chat")

        response = await service.answer(request)

        assert response.answer
        assert response.context.total_sources == 0

"""RAG service — orchestrates the full retrieval-augmented generation pipeline.

Pipeline:
    Question
        ↓
    Retriever.retrieve(query)
        ↓
    ContextBuilder.build(knowledge, memory, prompt)
        ↓
    PromptBuilder.assemble(context, question)
        ↓
    AIGateway.generate(prompt)
        ↓
    Response with citations and metadata
"""

import logging
import time
from dataclasses import dataclass

from app.services.ai.gateway import AIGateway
from app.services.ai.schemas import ChatMessage, ChatRequest
from app.services.rag.base_retriever import Retriever
from app.services.rag.context_builder import ContextBuilder
from app.services.rag.errors import RagError
from app.services.rag.prompt_builder import PromptBuilder
from app.services.rag.schemas import (
    Citation,
    MergedContext,
    RagMetadata,
    RagRequest,
    RagResponse,
    RetrievalQuery,
    RetrievalResult,
)

logger = logging.getLogger(__name__)


@dataclass
class RagService:
    """Orchestrate the RAG pipeline.

    Depends on abstractions (Retriever) not concretions (MockRetriever),
    so the retriever can be swapped for a VectorRetriever later without
    changing this class.
    """

    retriever: Retriever
    context_builder: ContextBuilder
    prompt_builder: PromptBuilder
    ai_gateway: AIGateway

    async def answer(self, request: RagRequest) -> RagResponse:
        """Run the full RAG pipeline and return a structured response.

        Args:
            request: The RAG request including question, source preferences,
                and AI generation parameters.

        Returns:
            A RagResponse containing the answer, context, citations,
            assembled prompt, and pipeline metadata.

        Raises:
            RagError: If any stage of the pipeline fails.
        """
        pipeline_start = time.monotonic()
        logger.info("RAGService starting pipeline for query: %s", request.query[:60])

        try:
            # Stage 1 — Retrieval
            retrieval_start = time.monotonic()
            retrieval_query = RetrievalQuery(
                text=request.query,
                max_results=request.max_results,
                source_types=request.source_types,
                metadata_filter=request.metadata_filter,
            )
            retrieval_response = await self.retriever.retrieve(retrieval_query)
            retrieval_latency = (time.monotonic() - retrieval_start) * 1000

            # Categorize results by source type
            knowledge_results: list[RetrievalResult] = []
            memory_results: list[RetrievalResult] = []
            prompt_results: list[RetrievalResult] = []
            for item in retrieval_response.results:
                if item.source_type == "knowledge":
                    knowledge_results.append(item)
                elif item.source_type == "memory":
                    memory_results.append(item)
                elif item.source_type == "prompt":
                    prompt_results.append(item)

            # Stage 2 — Context building
            context_start = time.monotonic()
            merged_context: MergedContext = self.context_builder.build(
                knowledge_results=knowledge_results,
                memory_results=memory_results,
                prompt_results=prompt_results,
            )
            context_latency = (time.monotonic() - context_start) * 1000

            # Stage 3 — Prompt assembly
            prompt_start = time.monotonic()
            prompt_assembly = self.prompt_builder.assemble(
                context=merged_context,
                question=request.query,
                system_prompt=request.system_prompt,
            )
            prompt_latency = (time.monotonic() - prompt_start) * 1000

            # Stage 4 — AI generation
            gen_start = time.monotonic()
            chat_request = ChatRequest(
                provider=request.provider,
                model=request.model,
                messages=[
                    ChatMessage(role="system", content=prompt_assembly.system_prompt),
                    ChatMessage(role="user", content=prompt_assembly.full_prompt),
                ],
                temperature=request.temperature,
                max_tokens=request.max_tokens,
            )
            chat_response = await self.ai_gateway.generate(chat_request)
            gen_latency = (time.monotonic() - gen_start) * 1000

            # Stage 5 — Build citations
            citations = self._build_citations(merged_context)

            total_latency = (time.monotonic() - pipeline_start) * 1000

            logger.info(
                "RAG pipeline complete | retrieval=%.1fms context=%.1fms prompt=%.1fms gen=%.1fms total=%.1fms",
                retrieval_latency,
                context_latency,
                prompt_latency,
                gen_latency,
                total_latency,
            )

            return RagResponse(
                answer=chat_response.message.content,
                query=request.query,
                context=merged_context,
                citations=citations,
                prompt=prompt_assembly,
                metadata=RagMetadata(
                    retrieval_latency_ms=round(retrieval_latency, 2),
                    context_build_latency_ms=round(context_latency, 2),
                    prompt_build_latency_ms=round(prompt_latency, 2),
                    total_pipeline_latency_ms=round(total_latency, 2),
                    total_tokens_used=chat_response.usage.total_tokens,
                    sources_retrieved=retrieval_response.total_found,
                    sources_after_reranking=merged_context.total_sources,
                    embedding_model=retrieval_response.results[0].embedding_model
                    if retrieval_response.results
                    else None,
                ),
            )

        except RagError:
            raise
        except Exception as exc:
            logger.exception("RAG pipeline failed unexpectedly.")
            raise RagError(str(exc)) from exc

    async def answer_stream(self, request: RagRequest):
        """Run the RAG pipeline and yield streaming chunks.

        Performs retrieval, context building, and prompt assembly
        synchronously, then streams the AI generation response.
        Each yielded chunk includes citation metadata on the final chunk.
        """
        logger.info("RAGService starting streaming pipeline for query: %s", request.query[:60])

        try:
            retrieval_query = RetrievalQuery(
                text=request.query,
                max_results=request.max_results,
                source_types=request.source_types,
                metadata_filter=request.metadata_filter,
            )
            retrieval_response = await self.retriever.retrieve(retrieval_query)

            knowledge_results = [r for r in retrieval_response.results if r.source_type == "knowledge"]
            memory_results = [r for r in retrieval_response.results if r.source_type == "memory"]
            prompt_results = [r for r in retrieval_response.results if r.source_type == "prompt"]

            merged_context = self.context_builder.build(
                knowledge_results=knowledge_results,
                memory_results=memory_results,
                prompt_results=prompt_results,
            )

            prompt_assembly = self.prompt_builder.assemble(
                context=merged_context,
                question=request.query,
                system_prompt=request.system_prompt,
            )

            chat_request = ChatRequest(
                provider=request.provider,
                model=request.model,
                messages=[
                    ChatMessage(role="system", content=prompt_assembly.system_prompt),
                    ChatMessage(role="user", content=prompt_assembly.full_prompt),
                ],
                temperature=request.temperature,
                max_tokens=request.max_tokens,
            )

            citations = self._build_citations(merged_context)

            async for chunk in self.ai_gateway.stream(chat_request):
                chunk["citations"] = [c.model_dump() for c in citations] if chunk.get("finish_reason") else None
                yield chunk

        except RagError:
            raise
        except Exception as exc:
            logger.exception("RAG streaming pipeline failed.")
            raise RagError(str(exc)) from exc

    def _build_citations(self, context: MergedContext) -> list[Citation]:
        """Build citation list from merged context items."""
        citations: list[Citation] = []
        all_items = context.knowledge_items + context.memory_items + context.prompt_items
        for item in all_items:
            citations.append(
                Citation(
                    source_id=item.source_id,
                    source_type=item.source_type,
                    title=item.title,
                    excerpt=item.content[:200],
                    relevance_score=item.score,
                )
            )
        return citations

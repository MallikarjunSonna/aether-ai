"""Merge retrieved results from all sources into a unified context."""

import logging
import time

from app.services.rag.errors import ContextBuildError
from app.services.rag.schemas import MergedContext, RetrievalResult

logger = logging.getLogger(__name__)


class ContextBuilder:
    """Merge retrieval results from knowledge, memory, and prompt sources.

    Combines results into a single MergedContext with deduplication
    by source_id and preserves per-source categorization.
    """

    def build(
        self,
        knowledge_results: list[RetrievalResult],
        memory_results: list[RetrievalResult],
        prompt_results: list[RetrievalResult],
    ) -> MergedContext:
        """Merge results from all retriever sources into one context object.

        Deduplicates by source_id across sources, preferring the first
        occurrence. Returns a MergedContext with categorized items and
        combined plain-text representation.

        Raises:
            ContextBuildError: If merging fails.
        """
        start = time.monotonic()
        logger.info(
            "ContextBuilder merging %d knowledge, %d memory, %d prompt items.",
            len(knowledge_results),
            len(memory_results),
            len(prompt_results),
        )

        try:
            seen_ids: set[str] = set()

            def deduplicate(items: list[RetrievalResult]) -> list[RetrievalResult]:
                nonlocal seen_ids
                result: list[RetrievalResult] = []
                for item in items:
                    if item.source_id not in seen_ids:
                        seen_ids.add(item.source_id)
                        result.append(item)
                return result

            deduped_knowledge = deduplicate(knowledge_results)
            deduped_memory = deduplicate(memory_results)
            deduped_prompt = deduplicate(prompt_results)

            all_items = deduped_knowledge + deduped_memory + deduped_prompt
            combined_lines: list[str] = []
            for item in all_items:
                combined_lines.append(
                    f"[{item.source_type.upper()}] {item.title}\n{item.content}"
                )

            elapsed = (time.monotonic() - start) * 1000
            logger.info(
                "ContextBuilder merged %d sources in %.1fms", len(all_items), elapsed
            )

            return MergedContext(
                knowledge_items=deduped_knowledge,
                memory_items=deduped_memory,
                prompt_items=deduped_prompt,
                combined_text="\n\n".join(combined_lines),
                total_sources=len(all_items),
            )

        except Exception as exc:
            logger.exception("ContextBuilder failed to merge results.")
            raise ContextBuildError(str(exc)) from exc

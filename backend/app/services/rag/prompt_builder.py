"""Prompt builder — assembles system prompt, retrieved context, and user question.

No provider-specific code. This module is responsible ONLY for prompt assembly.
"""

import logging
import time

from app.services.rag.errors import PromptBuildError
from app.services.rag.schemas import MergedContext, PromptAssembly

logger = logging.getLogger(__name__)

DEFAULT_SYSTEM_PROMPT = (
    "You are a helpful enterprise AI assistant. "
    "Answer the user's question based on the provided context. "
    "If the context does not contain enough information, acknowledge the limitation "
    "and suggest what additional information would help. "
    "Always cite your sources using the [SOURCE: title] format."
)


class PromptBuilder:
    """Assemble prompts from system instructions, retrieved context, and user input.

    Produces a PromptAssembly containing the individual sections and the
    combined full prompt ready for the AI gateway.
    """

    def assemble(
        self,
        context: MergedContext,
        question: str,
        system_prompt: str | None = None,
    ) -> PromptAssembly:
        """Build a complete prompt from context and question.

        Args:
            context: Merged context from all retrieval sources.
            question: The user's original question.
            system_prompt: Optional system prompt override. Falls back to
                a default enterprise assistant prompt.

        Returns:
            A PromptAssembly with separated sections and the combined prompt.

        Raises:
            PromptBuildError: If assembly fails.
        """
        start = time.monotonic()
        logger.info("PromptBuilder assembling prompt for question: %s", question[:60])

        try:
            if not question.strip():
                raise PromptBuildError("Question must not be empty.")

            chosen_system = system_prompt or DEFAULT_SYSTEM_PROMPT

            context_section = self._build_context_section(context)
            user_section = self._build_user_section(question)

            full_lines = [
                f"<system>\n{chosen_system}\n</system>",
                f"<context>\n{context_section}\n</context>",
                f"<question>\n{user_section}\n</question>",
            ]
            full_prompt = "\n\n".join(full_lines)

            elapsed = (time.monotonic() - start) * 1000
            logger.info("PromptBuilder assembled prompt in %.1fms", elapsed)

            return PromptAssembly(
                system_prompt=chosen_system,
                context_section=context_section,
                user_question=user_section,
                full_prompt=full_prompt,
            )

        except PromptBuildError:
            raise
        except Exception as exc:
            logger.exception("PromptBuilder failed to assemble prompt.")
            raise PromptBuildError(str(exc)) from exc

    def _build_context_section(self, context: MergedContext) -> str:
        """Format the merged context into a structured text section."""
        if context.total_sources == 0:
            return "No relevant context was retrieved."

        lines: list[str] = ["Retrieved context:"]

        if context.knowledge_items:
            lines.append("\nKnowledge Base:")
            for item in context.knowledge_items:
                lines.append(f"  [{item.source_id}] {item.title}: {item.content}")

        if context.memory_items:
            lines.append("\nWorkspace Memory:")
            for item in context.memory_items:
                lines.append(f"  [{item.source_id}] {item.title}: {item.content}")

        if context.prompt_items:
            lines.append("\nPrompt Library:")
            for item in context.prompt_items:
                lines.append(f"  [{item.source_id}] {item.title}: {item.content}")

        return "\n".join(lines)

    def _build_user_section(self, question: str) -> str:
        """Format the user question."""
        return question.strip()

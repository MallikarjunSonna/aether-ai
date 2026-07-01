"""RAG-specific error types."""

from typing import Any


class RagError(Exception):
    """Base error for RAG pipeline failures."""

    def __init__(
        self,
        message: str,
        code: str = "rag_error",
        details: dict[str, Any] | None = None,
    ) -> None:
        self.message = message
        self.code = code
        self.details = details or {}
        super().__init__(self.message)


class RetrievalError(RagError):
    """Raised when retrieval from a source fails."""

    def __init__(
        self,
        message: str = "Failed to retrieve context.",
        source_type: str | None = None,
        details: dict[str, Any] | None = None,
    ) -> None:
        super().__init__(
            message=message,
            code="retrieval_error",
            details=(
                {**(details or {}), "source_type": source_type}
                if source_type
                else details
            ),
        )


class ContextBuildError(RagError):
    """Raised when merging retrieved results fails."""

    def __init__(
        self,
        message: str = "Failed to build context from retrieved sources.",
        details: dict[str, Any] | None = None,
    ) -> None:
        super().__init__(
            message=message,
            code="context_build_error",
            details=details,
        )


class PromptBuildError(RagError):
    """Raised when assembling the prompt fails."""

    def __init__(
        self,
        message: str = "Failed to assemble prompt.",
        details: dict[str, Any] | None = None,
    ) -> None:
        super().__init__(
            message=message,
            code="prompt_build_error",
            details=details,
        )

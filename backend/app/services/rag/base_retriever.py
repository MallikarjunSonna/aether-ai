"""Abstract base class for all retrievers."""

from abc import ABC, abstractmethod

from app.services.rag.schemas import RetrievalQuery, RetrievalResponse


class Retriever(ABC):
    """Interface that every retriever must implement.

    Designed so that MockRetriever can be replaced by VectorRetriever
    without changing RAGService.
    """

    @abstractmethod
    async def retrieve(self, query: RetrievalQuery) -> RetrievalResponse:
        """Retrieve relevant context for the given query."""

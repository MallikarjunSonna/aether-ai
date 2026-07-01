"""Registry for AI model metadata."""

from app.services.ai.schemas import AIModel, ProviderType


class ModelRegistry:
    """Stores and retrieves metadata about available AI models."""

    def __init__(self) -> None:
        self._models: dict[str, AIModel] = {}

    def register(self, model: AIModel) -> None:
        """Register a model."""
        self._models[model.id] = model

    def register_many(self, models: list[AIModel]) -> None:
        """Register multiple models at once."""
        for model in models:
            self._models[model.id] = model

    def get(self, model_id: str) -> AIModel | None:
        """Look up a model by its ID."""
        return self._models.get(model_id)

    def list_all(self) -> list[AIModel]:
        """Return all registered models."""
        return list(self._models.values())

    def get_by_provider(self, provider: ProviderType) -> list[AIModel]:
        """Return all models belonging to a specific provider."""
        return [m for m in self._models.values() if m.provider == provider]

    def has(self, model_id: str) -> bool:
        """Return whether a model is registered."""
        return model_id in self._models

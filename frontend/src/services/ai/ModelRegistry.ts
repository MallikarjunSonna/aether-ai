import type { AIModel, ProviderType } from "../../types/ai";

export class ModelRegistry {
  private models = new Map<string, AIModel>();

  registerModel(model: AIModel): void {
    if (this.models.has(model.id)) {
      throw new Error(`Model "${model.id}" is already registered.`);
    }
    this.models.set(model.id, model);
  }

  unregisterModel(modelId: string): void {
    this.models.delete(modelId);
  }

  getModel(modelId: string): AIModel | undefined {
    return this.models.get(modelId);
  }

  listModels(): AIModel[] {
    return Array.from(this.models.values());
  }

  getModelsByProvider(type: ProviderType): AIModel[] {
    return this.listModels().filter((m) => m.provider === type);
  }

  hasModel(modelId: string): boolean {
    return this.models.has(modelId);
  }
}

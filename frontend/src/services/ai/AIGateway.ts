import type { AIModel, ChatRequest, ChatResponse, GenerationOptions, ProviderType } from "../../types/ai";
import type { ModelRegistry } from "./ModelRegistry";
import type { ProviderRegistry } from "./ProviderRegistry";

export class AIGateway {
  constructor(
    private readonly providers: ProviderRegistry,
    private readonly models: ModelRegistry,
  ) {}

  async generate(
    providerType: ProviderType,
    request: ChatRequest,
    options?: GenerationOptions,
  ): Promise<ChatResponse> {
    const provider = this.providers.getProvider(providerType);
    return provider.generate(request, options);
  }

  async stream(
    providerType: ProviderType,
    request: ChatRequest,
    options?: GenerationOptions,
  ): Promise<AsyncIterable<ChatResponse>> {
    const provider = this.providers.getProvider(providerType);
    return provider.stream(request, options);
  }

  listProviders(): ProviderType[] {
    return this.providers.listProviders();
  }

  listModels(): AIModel[] {
    return this.models.listModels();
  }

  getModelsByProvider(type: ProviderType): AIModel[] {
    return this.models.getModelsByProvider(type);
  }

  getModel(modelId: string): AIModel | undefined {
    return this.models.getModel(modelId);
  }

  async healthCheck(providerType: ProviderType): Promise<boolean> {
    const provider = this.providers.getProvider(providerType);
    return provider.healthCheck();
  }

  async getProviderModels(type: ProviderType): Promise<AIModel[]> {
    const provider = this.providers.getProvider(type);
    return provider.listModels();
  }

  getProviderName(type: ProviderType): string {
    return this.providers.getProvider(type).name;
  }
}

import type { AIModel, ChatMessage, ChatResponse, ProviderType } from "../../types/ai";
import { AnthropicProvider } from "../../providers/AnthropicProvider";
import { OpenAIProvider } from "../../providers/OpenAIProvider";
import { AIGateway } from "./AIGateway";
import { ModelRegistry } from "./ModelRegistry";
import { ProviderRegistry } from "./ProviderRegistry";

export class AIChatService {
  private gateway: AIGateway;

  constructor() {
    const providerRegistry = new ProviderRegistry();
    const modelRegistry = new ModelRegistry();

    const openaiProvider = new OpenAIProvider();
    providerRegistry.registerProvider(openaiProvider);

    const anthropicProvider = new AnthropicProvider();
    providerRegistry.registerProvider(anthropicProvider);

    this.gateway = new AIGateway(providerRegistry, modelRegistry);
  }

  async sendMessage(
    provider: ProviderType,
    model: string,
    messages: ChatMessage[],
  ): Promise<ChatResponse> {
    return this.gateway.generate(provider, { model, messages });
  }

  async *sendMessageStream(
    provider: ProviderType,
    model: string,
    messages: ChatMessage[],
    signal?: AbortSignal,
  ): AsyncIterable<ChatResponse> {
    const stream = await this.gateway.stream(provider, { model, messages });

    for await (const chunk of stream) {
      if (signal?.aborted) return;
      yield chunk;
    }
  }

  listProviders(): ProviderType[] {
    return this.gateway.listProviders();
  }

  async getProviderModels(type: ProviderType): Promise<AIModel[]> {
    return this.gateway.getProviderModels(type);
  }

  getProviderName(type: ProviderType): string {
    return this.gateway.getProviderName(type);
  }

  async checkProviderHealth(type: ProviderType): Promise<boolean> {
    return this.gateway.healthCheck(type);
  }
}

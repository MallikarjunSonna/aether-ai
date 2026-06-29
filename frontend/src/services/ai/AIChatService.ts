import type { ChatMessage, ChatResponse, ProviderType } from "../../types/ai";
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

    this.gateway = new AIGateway(providerRegistry, modelRegistry);
  }

  async sendMessage(
    provider: ProviderType,
    model: string,
    messages: ChatMessage[],
  ): Promise<ChatResponse> {
    return this.gateway.generate(provider, { model, messages });
  }

  listProviders(): ProviderType[] {
    return this.gateway.listProviders();
  }
}

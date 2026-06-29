import type { AIProvider, ProviderType } from "../../types/ai";

export class ProviderRegistry {
  private providers = new Map<ProviderType, AIProvider>();

  registerProvider(provider: AIProvider): void {
    if (this.providers.has(provider.type)) {
      throw new Error(`Provider "${provider.type}" is already registered.`);
    }
    this.providers.set(provider.type, provider);
  }

  unregisterProvider(type: ProviderType): void {
    this.providers.delete(type);
  }

  getProvider(type: ProviderType): AIProvider {
    const provider = this.providers.get(type);
    if (!provider) {
      throw new Error(`Provider "${type}" is not registered.`);
    }
    return provider;
  }

  listProviders(): ProviderType[] {
    return Array.from(this.providers.keys());
  }

  hasProvider(type: ProviderType): boolean {
    return this.providers.has(type);
  }
}

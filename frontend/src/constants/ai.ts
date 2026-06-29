import type { GenerationOptions, ProviderType } from "../types/ai";

export const PROVIDER_TYPES: readonly ProviderType[] = [
  "mock",
  "openai",
  "anthropic",
  "gemini",
  "ollama",
  "azure-openai",
] as const;

export const DEFAULT_GENERATION_OPTIONS: GenerationOptions = {
  temperature: 0.7,
  maxTokens: 2048,
  topP: 1,
  frequencyPenalty: 0,
  presencePenalty: 0,
};

export const MODEL_REGISTRY_IDS = {
  MOCK_CHAT: "mock-chat",
  MOCK_COMPLETION: "mock-completion",
  MOCK_EMBEDDING: "mock-embedding",
} as const;

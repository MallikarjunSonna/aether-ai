import type { AIModel } from "../types/ai";

export const mockModels: AIModel[] = [
  {
    id: "mock-chat",
    provider: "mock",
    name: "Mock Chat",
    capabilities: ["chat", "streaming"],
    description: "Mock provider for chat-based AI interactions.",
    maxTokens: 4096,
    supportsStreaming: true,
  },
  {
    id: "mock-completion",
    provider: "mock",
    name: "Mock Completion",
    capabilities: ["completion"],
    description: "Mock provider for text completion tasks.",
    maxTokens: 4096,
    supportsStreaming: false,
  },
  {
    id: "mock-embedding",
    provider: "mock",
    name: "Mock Embedding",
    capabilities: ["embedding"],
    description: "Mock provider for embedding generation.",
    maxTokens: 8192,
    supportsStreaming: false,
  },
];

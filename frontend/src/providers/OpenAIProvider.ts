import OpenAI, {
  APIConnectionError,
  APIError,
  AuthenticationError,
  RateLimitError,
} from "openai";

import { DEFAULT_GENERATION_OPTIONS } from "../constants/ai";
import type {
  AIProvider,
  AIModel,
  ChatRequest,
  ChatResponse,
  FinishReason,
  GenerationOptions,
  ProviderType,
} from "../types/ai";

export type AIErrorCode = "invalid_api_key" | "rate_limited" | "network_error" | "unknown";

export class AIProviderError extends Error {
  constructor(
    message: string,
    public readonly code: AIErrorCode,
    public readonly provider: ProviderType,
  ) {
    super(message);
    this.name = "AIProviderError";
  }
}

function mapFinishReason(reason: string | null): FinishReason {
  switch (reason) {
    case "stop":
      return "stop";
    case "length":
      return "length";
    case "tool_calls":
    case "function_call":
      return "stop";
    default:
      return "error";
  }
}

const MODELS: AIModel[] = [
  {
    id: "gpt-4.1",
    provider: "openai",
    name: "GPT-4.1",
    capabilities: ["chat"],
    description: "OpenAI GPT-4.1 model for complex reasoning and instruction following.",
    maxTokens: 32768,
    supportsStreaming: false,
  },
  {
    id: "gpt-4.1-mini",
    provider: "openai",
    name: "GPT-4.1 Mini",
    capabilities: ["chat"],
    description: "Faster and more cost-effective variant of GPT-4.1.",
    maxTokens: 32768,
    supportsStreaming: false,
  },
  {
    id: "gpt-4o-mini",
    provider: "openai",
    name: "GPT-4o Mini",
    capabilities: ["chat"],
    description: "Fast, affordable small model for simple tasks.",
    maxTokens: 16384,
    supportsStreaming: false,
  },
];

export class OpenAIProvider implements AIProvider {
  readonly type: ProviderType = "openai";
  readonly name = "OpenAI";
  private client: OpenAI;

  constructor() {
    const apiKey = import.meta.env.VITE_OPENAI_API_KEY;
    this.client = new OpenAI({
      apiKey,
      dangerouslyAllowBrowser: true,
      maxRetries: 0,
    });
  }

  async generate(
    request: ChatRequest,
    options?: GenerationOptions,
  ): Promise<ChatResponse> {
    const resolvedOptions = { ...DEFAULT_GENERATION_OPTIONS, ...options };

    try {
      const response = await this.client.chat.completions.create({
        model: request.model,
        messages: request.messages.map((m) => ({
          role: m.role,
          content: m.content,
        })),
        temperature: resolvedOptions.temperature,
        max_tokens: resolvedOptions.maxTokens,
        top_p: resolvedOptions.topP,
        frequency_penalty: resolvedOptions.frequencyPenalty,
        presence_penalty: resolvedOptions.presencePenalty,
        stop: resolvedOptions.stop ?? undefined,
      });

      const choice = response.choices[0];
      const messageContent = choice.message.content ?? "";

      return {
        id: response.id,
        model: response.model,
        provider: "openai",
        message: {
          role: "assistant",
          content: messageContent,
        },
        usage: {
          promptTokens: response.usage?.prompt_tokens ?? 0,
          completionTokens: response.usage?.completion_tokens ?? 0,
          totalTokens: response.usage?.total_tokens ?? 0,
        },
        finishReason: mapFinishReason(choice.finish_reason),
      };
    } catch (error) {
      throw this.mapError(error);
    }
  }

  stream(
    _request: ChatRequest,
    _options?: GenerationOptions,
  ): AsyncIterable<ChatResponse> {
    throw new AIProviderError(
      "Streaming is not yet implemented for the OpenAI provider.",
      "unknown",
      "openai",
    );
  }

  async listModels(): Promise<AIModel[]> {
    return MODELS;
  }

  async healthCheck(): Promise<boolean> {
    const apiKey = import.meta.env.VITE_OPENAI_API_KEY;
    if (!apiKey) return false;
    try {
      this.client = new OpenAI({
        apiKey,
        dangerouslyAllowBrowser: true,
        maxRetries: 0,
      });
      return true;
    } catch {
      return false;
    }
  }

  private mapError(error: unknown): AIProviderError {
    if (error instanceof AuthenticationError) {
      return new AIProviderError(
        "Invalid API key. Check your VITE_OPENAI_API_KEY environment variable.",
        "invalid_api_key",
        "openai",
      );
    }

    if (error instanceof RateLimitError) {
      return new AIProviderError(
        "OpenAI rate limit exceeded. Please wait and try again.",
        "rate_limited",
        "openai",
      );
    }

    if (error instanceof APIConnectionError) {
      return new AIProviderError(
        "Failed to connect to OpenAI. Check your network connection.",
        "network_error",
        "openai",
      );
    }

    if (error instanceof APIError) {
      return new AIProviderError(
        error.message || "OpenAI API returned an error.",
        "unknown",
        "openai",
      );
    }

    return new AIProviderError(
      "An unexpected error occurred while calling OpenAI.",
      "unknown",
      "openai",
    );
  }
}

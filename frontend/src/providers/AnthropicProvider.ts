import Anthropic, {
  APIConnectionError,
  APIError,
  AuthenticationError,
  RateLimitError,
} from "@anthropic-ai/sdk";

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
import { AIProviderError } from "./OpenAIProvider";

function mapFinishReason(reason: string | null): FinishReason {
  switch (reason) {
    case "end_turn":
    case "stop_sequence":
    case "pause_turn":
      return "stop";
    case "max_tokens":
      return "length";
    case "tool_use":
      return "stop";
    case "refusal":
      return "error";
    default:
      return "error";
  }
}

const MODELS: AIModel[] = [
  {
    id: "claude-sonnet-4-6",
    provider: "anthropic",
    name: "Claude Sonnet 4.6",
    capabilities: ["chat", "streaming"],
    description: "Best balance of intelligence and speed for most workloads.",
    maxTokens: 8192,
    supportsStreaming: true,
  },
  {
    id: "claude-haiku-4-5",
    provider: "anthropic",
    name: "Claude Haiku 4.5",
    capabilities: ["chat", "streaming"],
    description: "Fast and cost-effective for simple tasks and high-throughput use cases.",
    maxTokens: 8192,
    supportsStreaming: true,
  },
  {
    id: "claude-opus-4-7",
    provider: "anthropic",
    name: "Claude Opus 4.7",
    capabilities: ["chat", "streaming"],
    description: "Most capable model for complex reasoning, research, and strategy.",
    maxTokens: 8192,
    supportsStreaming: true,
  },
];

export class AnthropicProvider implements AIProvider {
  readonly type: ProviderType = "anthropic";
  readonly name = "Anthropic";
  private client: Anthropic;

  constructor() {
    const apiKey = import.meta.env.VITE_ANTHROPIC_API_KEY;
    this.client = new Anthropic({
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
    const { systemContent, messages } = separateSystemMessages(request.messages);

    try {
      const response = await this.client.messages.create({
        model: request.model,
        max_tokens: resolvedOptions.maxTokens ?? 2048,
        messages,
        system: systemContent ?? undefined,
        stop_sequences: resolvedOptions.stop,
      });

      const textContent = response.content
        .filter((block) => block.type === "text")
        .map((block) => {
          const textBlock = block as { type: "text"; text: string };
          return textBlock.text;
        })
        .join("");

      return {
        id: response.id,
        model: response.model,
        provider: "anthropic",
        message: {
          role: "assistant",
          content: textContent,
        },
        usage: {
          promptTokens: response.usage.input_tokens,
          completionTokens: response.usage.output_tokens,
          totalTokens: response.usage.input_tokens + response.usage.output_tokens,
        },
        finishReason: mapFinishReason(response.stop_reason),
      };
    } catch (error) {
      throw this.mapError(error);
    }
  }

  async *stream(
    request: ChatRequest,
    options?: GenerationOptions,
  ): AsyncIterable<ChatResponse> {
    const resolvedOptions = { ...DEFAULT_GENERATION_OPTIONS, ...options };
    const { systemContent, messages } = separateSystemMessages(request.messages);

    let messageId = "";

    try {
      const stream = await this.client.messages.create({
        model: request.model,
        max_tokens: resolvedOptions.maxTokens ?? 2048,
        messages,
        system: systemContent ?? undefined,
        stop_sequences: resolvedOptions.stop,
        stream: true,
      });

      for await (const event of stream) {
        if (event.type === "message_start") {
          messageId = event.message.id;
          continue;
        }

        if (event.type === "content_block_delta" && event.delta.type === "text_delta") {
          yield {
            id: messageId,
            model: request.model,
            provider: "anthropic" as ProviderType,
            message: {
              role: "assistant" as const,
              content: event.delta.text,
            },
            usage: { promptTokens: 0, completionTokens: 0, totalTokens: 0 },
            finishReason: undefined,
          };
        }
      }
    } catch (error) {
      throw this.mapError(error);
    }
  }

  async listModels(): Promise<AIModel[]> {
    return MODELS;
  }

  async healthCheck(): Promise<boolean> {
    const apiKey = import.meta.env.VITE_ANTHROPIC_API_KEY;
    if (!apiKey) return false;
    try {
      this.client = new Anthropic({
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
        "Invalid API key. Check your ANTHROPIC_API_KEY environment variable.",
        "invalid_api_key",
        "anthropic",
      );
    }

    if (error instanceof RateLimitError) {
      return new AIProviderError(
        "Anthropic rate limit exceeded. Please wait and try again.",
        "rate_limited",
        "anthropic",
      );
    }

    if (error instanceof APIConnectionError) {
      return new AIProviderError(
        "Failed to connect to Anthropic. Check your network connection.",
        "network_error",
        "anthropic",
      );
    }

    if (error instanceof APIError) {
      return new AIProviderError(
        error.message || "Anthropic API returned an error.",
        "unknown",
        "anthropic",
      );
    }

    return new AIProviderError(
      "An unexpected error occurred while calling Anthropic.",
      "unknown",
      "anthropic",
    );
  }
}

function separateSystemMessages(
  messages: ChatRequest["messages"],
): {
  systemContent: string | null;
  messages: Array<{ role: "user" | "assistant"; content: string }>;
} {
  const systemParts: string[] = [];
  const filtered: Array<{ role: "user" | "assistant"; content: string }> = [];

  for (const msg of messages) {
    if (msg.role === "system") {
      systemParts.push(msg.content);
    } else {
      filtered.push({ role: msg.role, content: msg.content });
    }
  }

  return {
    systemContent: systemParts.length > 0 ? systemParts.join("\n") : null,
    messages: filtered,
  };
}

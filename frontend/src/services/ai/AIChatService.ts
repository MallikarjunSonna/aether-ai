import {
  fetchHealthStatus,
  fetchProviderModels,
  fetchProviders,
  sendChatMessage,
} from "../../api/ai";
import type { AIModel, ChatMessage, ChatResponse, FinishReason, ProviderType } from "../../types/ai";

function mapFinishReason(reason: string | null | undefined): FinishReason | undefined {
  if (!reason) return undefined;
  if (reason === "stop" || reason === "length" || reason === "error") return reason;
  return "error";
}

const BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:8000";

interface StreamChunk {
  id: string;
  model: string;
  provider: ProviderType;
  content: string;
  usage: { prompt_tokens: number; completion_tokens: number; total_tokens: number } | null;
  finish_reason: string | null;
}

export class AIChatService {
  async sendMessage(
    provider: ProviderType,
    model: string,
    messages: ChatMessage[],
  ): Promise<ChatResponse> {
    const response = await sendChatMessage({
      provider,
      model,
      messages: messages.map((m) => ({ role: m.role, content: m.content })),
    });

    return {
      id: response.id,
      model: response.model,
      provider: response.provider,
      message: {
        role: "assistant",
        content: response.message.content,
      },
      usage: {
        promptTokens: response.usage.prompt_tokens,
        completionTokens: response.usage.completion_tokens,
        totalTokens: response.usage.total_tokens,
      },
      finishReason: mapFinishReason(response.finish_reason),
    };
  }

  async *sendMessageStream(
    provider: ProviderType,
    model: string,
    messages: ChatMessage[],
    signal?: AbortSignal,
  ): AsyncIterable<ChatResponse> {
    const url = `${BASE_URL}/api/v1/ai/chat/stream`;

    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        provider,
        model,
        messages: messages.map((m) => ({ role: m.role, content: m.content })),
      }),
      signal,
    });

    if (!response.ok) {
      const body = await response.json().catch(() => null);
      const message = body?.detail?.message ?? `AI request failed with status ${response.status}`;
      throw new Error(message);
    }

    const reader = response.body?.getReader();
    if (!reader) throw new Error("Streaming not supported by the browser.");

    const decoder = new TextDecoder();
    let buffer = "";

    try {
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n");
        buffer = lines.pop() ?? "";

        for (const line of lines) {
          const trimmed = line.trim();
          if (!trimmed || !trimmed.startsWith("data: ")) continue;

          const data = trimmed.slice(6);
          if (data === "[DONE]") return;

          try {
            const chunk: StreamChunk = JSON.parse(data);

            if ("error" in chunk && chunk.finish_reason === null) {
              throw new Error((chunk as unknown as Record<string, string>).message ?? "Stream error");
            }

            yield {
              id: chunk.id,
              model: chunk.model,
              provider: chunk.provider,
              message: {
                role: "assistant",
                content: chunk.content,
              },
              usage: chunk.usage
                ? {
                    promptTokens: chunk.usage.prompt_tokens,
                    completionTokens: chunk.usage.completion_tokens,
                    totalTokens: chunk.usage.total_tokens,
                  }
                : { promptTokens: 0, completionTokens: 0, totalTokens: 0 },
              finishReason: mapFinishReason(chunk.finish_reason),
            };
          } catch {
            // skip malformed JSON chunks
          }
        }
      }
    } finally {
      reader.releaseLock();
    }
  }

  async listProviders(): Promise<ProviderType[]> {
    const providers = await fetchProviders();
    return providers.map((p) => p.type);
  }

  async getProviderModels(type: ProviderType): Promise<AIModel[]> {
    const models = await fetchProviderModels(type);
    return models.map((m) => ({
      id: m.id,
      provider: m.provider,
      name: m.name,
      capabilities: m.capabilities as AIModel["capabilities"],
      description: m.description,
      maxTokens: m.max_tokens,
      supportsStreaming: m.supports_streaming,
    }));
  }

  async getProviderName(type: ProviderType): Promise<string> {
    const providers = await fetchProviders();
    const provider = providers.find((p) => p.type === type);
    return provider?.name ?? type;
  }

  async checkProviderHealth(type: ProviderType): Promise<boolean> {
    const statuses = await fetchHealthStatus();
    const status = statuses.find((s) => s.provider === type);
    return status?.available ?? false;
  }
}

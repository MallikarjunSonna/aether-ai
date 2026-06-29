import { useCallback, useRef, useState } from "react";

import { AIChatService } from "../services/ai/AIChatService";
import type { ProviderType } from "../types/ai";
import { AIProviderError } from "../providers/OpenAIProvider";

export interface ChatEntry {
  id: string;
  role: "user" | "assistant";
  content: string;
}

function generateId(): string {
  return `msg-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

function normalizeError(error: unknown): string {
  if (error instanceof AIProviderError) {
    switch (error.code) {
      case "invalid_api_key":
        return "AI service is not configured. Please set your API key in settings.";
      case "rate_limited":
        return "Too many requests. Please wait a moment and try again.";
      case "network_error":
        return "Unable to reach the AI service. Check your internet connection.";
      default:
        return "An unexpected AI error occurred. Please try again.";
    }
  }
  return "Something went wrong. Please try again.";
}

export function useAIChat() {
  const [messages, setMessages] = useState<ChatEntry[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const serviceRef = useRef<AIChatService | null>(null);

  const getService = useCallback((): AIChatService => {
    if (!serviceRef.current) {
      serviceRef.current = new AIChatService();
    }
    return serviceRef.current;
  }, []);

  const sendMessage = useCallback(
    async (content: string, provider: ProviderType = "openai", model: string = "gpt-4.1-mini") => {
      const userEntry: ChatEntry = {
        id: generateId(),
        role: "user",
        content,
      };

      setMessages((prev) => [...prev, userEntry]);
      setIsLoading(true);
      setError(null);

      try {
        const service = getService();
        const chatMessages = messages
          .concat(userEntry)
          .filter((m): m is ChatEntry => m.role === "user" || m.role === "assistant")
          .map((m) => ({ role: m.role, content: m.content }));

        const response = await service.sendMessage(provider, model, chatMessages);

        const assistantEntry: ChatEntry = {
          id: response.id,
          role: "assistant",
          content: response.message.content,
        };

        setMessages((prev) => [...prev, assistantEntry]);
      } catch (err) {
        setError(normalizeError(err));
      } finally {
        setIsLoading(false);
      }
    },
    [messages, getService],
  );

  const clearMessages = useCallback(() => {
    setMessages([]);
    setError(null);
  }, []);

  return {
    messages,
    isLoading,
    error,
    sendMessage,
    clearMessages,
  };
}

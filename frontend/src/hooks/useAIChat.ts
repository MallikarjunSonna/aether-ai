import { useCallback, useEffect, useRef, useState } from "react";

import { AIChatService } from "../services/ai/AIChatService";
import type { ProviderType } from "../types/ai";
import { AIProviderError } from "../providers/OpenAIProvider";

export interface ChatEntry {
  id: string;
  role: "user" | "assistant";
  content: string;
  isStreaming?: boolean;
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
  const abortRef = useRef<AbortController | null>(null);
  const messagesRef = useRef<ChatEntry[]>([]);

  useEffect(() => {
    messagesRef.current = messages;
  }, [messages]);

  const getService = useCallback((): AIChatService => {
    if (!serviceRef.current) {
      serviceRef.current = new AIChatService();
    }
    return serviceRef.current;
  }, []);

  const cancelGeneration = useCallback(() => {
    abortRef.current?.abort();
    abortRef.current = null;
    setIsLoading(false);
    setMessages((prev) =>
      prev.map((msg) => (msg.isStreaming ? { ...msg, isStreaming: false } : msg)),
    );
  }, []);

  const sendMessage = useCallback(
    async (content: string, provider: ProviderType = "openai", model: string = "gpt-4.1-mini") => {
      const currentMessages = messagesRef.current;

      const userEntry: ChatEntry = {
        id: generateId(),
        role: "user",
        content,
      };

      const assistantId = generateId();
      const assistantEntry: ChatEntry = {
        id: assistantId,
        role: "assistant",
        content: "",
        isStreaming: true,
      };

      const abortController = new AbortController();
      abortRef.current = abortController;

      setMessages((prev) => [...prev, userEntry, assistantEntry]);
      setIsLoading(true);
      setError(null);

      try {
        const service = getService();
        const chatMessages = currentMessages
          .concat(userEntry)
          .map((m) => ({ role: m.role, content: m.content }));

        const stream = service.sendMessageStream(
          provider,
          model,
          chatMessages,
          abortController.signal,
        );

        for await (const chunk of stream) {
          if (abortController.signal.aborted) return;
          setMessages((prev) =>
            prev.map((msg) =>
              msg.id === assistantId
                ? { ...msg, content: msg.content + chunk.message.content }
                : msg,
            ),
          );
        }
      } catch (err) {
        if (abortController.signal.aborted) return;

        setMessages((prev) => prev.filter((msg) => msg.id !== assistantId));
        setError(normalizeError(err));
      } finally {
        setIsLoading(false);
        abortRef.current = null;
        setMessages((prev) =>
          prev.map((msg) => (msg.id === assistantId ? { ...msg, isStreaming: false } : msg)),
        );
      }
    },
    [getService],
  );

  const clearMessages = useCallback(() => {
    abortRef.current?.abort();
    abortRef.current = null;
    setMessages([]);
    setError(null);
    setIsLoading(false);
  }, []);

  return {
    messages,
    isLoading,
    error,
    sendMessage,
    cancelGeneration,
    clearMessages,
  };
}

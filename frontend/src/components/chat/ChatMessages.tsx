import { useEffect, useRef } from "react";

import type { ChatEntry } from "../../hooks/useAIChat";
import { ChatMessage } from "./ChatMessage";

interface ChatMessagesProps {
  messages: ChatEntry[];
  isLoading: boolean;
}

export function ChatMessages({ messages, isLoading }: ChatMessagesProps) {
  const bottomRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const isNearBottom =
      container.scrollHeight - container.scrollTop - container.clientHeight < 150;

    if (isNearBottom || isLoading) {
      bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isLoading]);

  return (
    <div
      ref={containerRef}
      className="flex-1 space-y-4 overflow-y-auto px-6 py-4"
      role="log"
      aria-label="Chat messages"
      aria-live="polite"
    >
      {messages.map((msg) => (
        <ChatMessage
          key={msg.id}
          role={msg.role}
          content={msg.content}
          isStreaming={msg.isStreaming}
        />
      ))}

      <div ref={bottomRef} />
    </div>
  );
}

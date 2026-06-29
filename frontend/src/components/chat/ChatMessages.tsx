import { useEffect, useRef } from "react";
import { Loader2 } from "lucide-react";

import type { ChatEntry } from "../../hooks/useAIChat";
import { ChatMessage } from "./ChatMessage";

interface ChatMessagesProps {
  messages: ChatEntry[];
  isLoading: boolean;
}

export function ChatMessages({ messages, isLoading }: ChatMessagesProps) {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  return (
    <div
      className="flex-1 space-y-4 overflow-y-auto px-6 py-4"
      role="log"
      aria-label="Chat messages"
      aria-live="polite"
    >
      {messages.map((msg) => (
        <ChatMessage key={msg.id} role={msg.role} content={msg.content} />
      ))}

      {isLoading && (
        <div className="flex items-center gap-2.5 text-sm text-muted" aria-live="polite">
          <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
          <span>AI is thinking...</span>
        </div>
      )}

      <div ref={bottomRef} />
    </div>
  );
}

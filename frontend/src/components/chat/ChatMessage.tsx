import { Bot, User } from "lucide-react";

interface ChatMessageProps {
  role: "user" | "assistant";
  content: string;
  isStreaming?: boolean;
}

export function ChatMessage({ role, content, isStreaming }: ChatMessageProps) {
  const isUser = role === "user";
  const showCursor = isStreaming && !isUser;

  return (
    <div
      className={`flex gap-3 ${isUser ? "flex-row-reverse" : "flex-row"}`}
      role="listitem"
      aria-label={`${isUser ? "User" : "Assistant"} message`}
      aria-busy={isStreaming}
    >
      <span
        className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${
          isUser
            ? "border border-primary/20 bg-primary/10 text-primary"
            : "border border-line/60 bg-surface text-ink"
        }`}
      >
        {isUser ? (
          <User className="h-4 w-4" aria-hidden="true" />
        ) : (
          <Bot className="h-4 w-4" aria-hidden="true" />
        )}
      </span>

      <div
        className={`max-w-[75%] rounded-xl px-4 py-2.5 text-sm leading-relaxed ${
          isUser
            ? "bg-primary text-white"
            : "border border-line/60 bg-surface text-ink"
        }`}
      >
        <p className="whitespace-pre-wrap">
          {content}
          {showCursor && (
            <span
              className="ml-0.5 inline-block h-4 w-2 animate-pulse rounded-sm bg-primary align-text-bottom"
              aria-hidden="true"
            />
          )}
        </p>
      </div>
    </div>
  );
}

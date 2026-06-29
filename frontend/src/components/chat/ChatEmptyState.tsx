import { MessageSquare } from "lucide-react";

export function ChatEmptyState() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center px-6 py-16 text-center">
      <span className="flex h-16 w-16 items-center justify-center rounded-2xl border border-primary/20 bg-primary/10 text-primary">
        <MessageSquare className="h-8 w-8" aria-hidden="true" />
      </span>
      <h2 className="mt-5 text-lg font-semibold text-ink">Start a conversation</h2>
      <p className="mt-2 max-w-sm text-sm text-muted">
        Type a message below to begin chatting with AI through the Aether AI Gateway.
      </p>
    </div>
  );
}

import type { ReactNode } from "react";
import { MessageSquare } from "lucide-react";

interface ChatLayoutProps {
  header?: ReactNode;
  children: ReactNode;
  footer?: ReactNode;
  error?: string | null;
  onDismissError?: () => void;
}

export function ChatLayout({
  header,
  children,
  footer,
  error,
  onDismissError,
}: ChatLayoutProps) {
  return (
    <div className="mx-auto flex h-full max-w-4xl flex-col">
      <div className="flex items-center gap-2.5 border-b border-line/60 px-6 py-3">
        <span className="flex h-8 w-8 items-center justify-center rounded-lg border border-primary/20 bg-primary/10 text-primary">
          <MessageSquare className="h-4 w-4" aria-hidden="true" />
        </span>
        <h1 className="text-sm font-semibold text-ink">AI Chat</h1>
        {header}
      </div>

      {error && (
        <div
          className="mx-6 mt-3 flex items-center justify-between rounded-lg border border-error/30 bg-error/10 px-4 py-2.5 text-sm text-error"
          role="alert"
        >
          <span>{error}</span>
          {onDismissError && (
            <button
              onClick={onDismissError}
              className="ml-3 shrink-0 text-sm font-medium text-error transition-colors hover:text-red-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-error/50"
              aria-label="Dismiss error"
            >
              Dismiss
            </button>
          )}
        </div>
      )}

      <div className="flex flex-1 flex-col overflow-hidden">{children}</div>

      {footer}
    </div>
  );
}

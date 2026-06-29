import { AlertTriangle, RefreshCw } from "lucide-react";

interface WorkspaceErrorProps {
  message?: string;
  onRetry?: () => void;
}

export function WorkspaceError({
  message = "Failed to load workspaces.",
  onRetry,
}: WorkspaceErrorProps) {
  return (
    <div className="flex min-h-[40vh] flex-col items-center justify-center text-center">
      <span className="flex h-14 w-14 items-center justify-center rounded-2xl border border-error/20 bg-error/10 text-error">
        <AlertTriangle className="h-7 w-7" aria-hidden="true" />
      </span>
      <p className="mt-4 text-sm text-muted">{message}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="mt-5 inline-flex items-center gap-2 rounded-md border border-line bg-surface px-4 py-2 text-sm font-medium text-ink transition-colors duration-fast hover:bg-neutral-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50"
        >
          <RefreshCw className="h-4 w-4" aria-hidden="true" />
          Retry
        </button>
      )}
    </div>
  );
}

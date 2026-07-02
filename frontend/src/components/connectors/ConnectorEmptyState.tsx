import { Plug, Plus } from "lucide-react";

interface ConnectorEmptyStateProps {
  onAdd: () => void;
}

export function ConnectorEmptyState({ onAdd }: ConnectorEmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center rounded-xl border border-line/60 bg-surface py-20">
      <div className="flex h-14 w-14 items-center justify-center rounded-xl border border-line/60 bg-neutral-900">
        <Plug className="h-7 w-7 text-muted/40" aria-hidden="true" />
      </div>
      <h3 className="mt-5 text-base font-semibold text-ink">No Connectors Configured</h3>
      <p className="mt-1.5 max-w-sm text-center text-sm text-muted">
        Connect your external tools and services to bring data into your workspace.
      </p>
      <button
        onClick={onAdd}
        className="mt-6 inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-white transition-colors duration-fast hover:bg-blue-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50"
      >
        <Plus className="h-4 w-4" aria-hidden="true" />
        Add Connector
      </button>
    </div>
  );
}

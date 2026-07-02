import { RefreshCw, Clock, CheckCircle2, XCircle } from "lucide-react";

import type { Connector, SyncResult } from "../../types/connector";

interface ConnectorSyncPanelProps {
  connector: Connector;
  syncResult: SyncResult | null;
  syncing: boolean;
  onSync: (id: string) => void;
}

function formatLastSync(lastSync: string | null): string {
  if (!lastSync) return "Never";
  const date = new Date(lastSync);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMin = Math.floor(diffMs / 60000);
  if (diffMin < 1) return "Less than a minute ago";
  if (diffMin < 60) return `${diffMin} minute${diffMin > 1 ? "s" : ""} ago`;
  const diffHr = Math.floor(diffMin / 60);
  if (diffHr < 24) return `${diffHr} hour${diffHr > 1 ? "s" : ""} ago`;
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric", hour: "numeric", minute: "2-digit" });
}

export function ConnectorSyncPanel({ connector, syncResult, syncing, onSync }: ConnectorSyncPanelProps) {
  return (
    <div className="rounded-xl border border-line/60 bg-surface p-5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Clock className="h-5 w-5 text-muted" aria-hidden="true" />
          <div>
            <p className="text-sm font-medium text-ink">Last Sync</p>
            <p className="text-xs text-muted">{formatLastSync(connector.lastSync)}</p>
          </div>
        </div>
        <button
          onClick={() => onSync(connector.id)}
          disabled={syncing || !connector.connected}
          className="inline-flex items-center gap-2 rounded-md border border-line/60 px-3 py-1.5 text-xs font-medium text-muted transition-colors duration-fast hover:bg-neutral-800 hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 disabled:cursor-not-allowed disabled:opacity-40"
        >
          <RefreshCw className={`h-3.5 w-3.5 ${syncing ? "animate-spin" : ""}`} aria-hidden="true" />
          {syncing ? "Syncing..." : "Sync Now"}
        </button>
      </div>

      {syncResult && (
        <div className="mt-4 flex items-center gap-4 border-t border-line/60 pt-4 text-xs text-muted">
          {syncResult.success ? (
            <span className="flex items-center gap-1.5 text-success">
              <CheckCircle2 className="h-3.5 w-3.5" aria-hidden="true" />
              {syncResult.itemsSynced} items synced
            </span>
          ) : (
            <span className="flex items-center gap-1.5 text-error">
              <XCircle className="h-3.5 w-3.5" aria-hidden="true" />
              Sync failed
            </span>
          )}
          <span>{syncResult.durationMs}ms</span>
          {syncResult.itemsFailed > 0 && (
            <span className="text-warning">{syncResult.itemsFailed} failed</span>
          )}
        </div>
      )}
    </div>
  );
}

import { useEffect, useState } from "react";
import { Plug, Wifi, WifiOff, AlertTriangle } from "lucide-react";

import { ConnectorEmptyState } from "../../components/connectors/ConnectorEmptyState";
import { ConnectorGrid } from "../../components/connectors/ConnectorGrid";
import { ConnectorSetupModal } from "../../components/connectors/ConnectorSetupModal";
import { useConnectors } from "../../hooks/useConnectors";

export function ConnectorHubPage() {
  const {
    connectors,
    loading,
    error,
    refresh,
    connect,
    disconnect,
    sync,
    connectedCount,
    disconnectedCount,
    errorCount,
    totalCount,
  } = useConnectors();

  const [setupOpen, setSetupOpen] = useState(false);
  const [syncingId, setSyncingId] = useState<string | null>(null);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const handleConnect = async (id: string) => {
    try {
      await connect(id);
    } catch {
      // Error handled in hook
    }
  };

  const handleDisconnect = async (id: string) => {
    try {
      await disconnect(id);
    } catch {
      // Error handled in hook
    }
  };

  const handleSync = async (id: string) => {
    setSyncingId(id);
    try {
      await sync(id);
    } catch {
      // Sync error handled silently
    } finally {
      setSyncingId(null);
    }
  };

  if (loading) {
    return (
      <div className="mx-auto max-w-5xl">
        <div className="mb-6">
          <h1 className="text-xl font-semibold tracking-tight text-ink">Connectors</h1>
          <p className="mt-1 text-sm text-muted">Manage your enterprise integrations.</p>
        </div>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="animate-pulse rounded-xl border border-line/60 bg-surface p-5">
              <div className="flex items-start gap-4">
                <div className="h-10 w-10 rounded-lg bg-neutral-800" />
                <div className="flex-1 space-y-3">
                  <div className="h-5 w-28 rounded bg-neutral-800" />
                  <div className="h-3 w-20 rounded bg-neutral-800" />
                  <div className="h-8 w-24 rounded bg-neutral-800" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mx-auto max-w-5xl">
        <div className="mb-6">
          <h1 className="text-xl font-semibold tracking-tight text-ink">Connectors</h1>
        </div>
        <div className="flex flex-col items-center justify-center rounded-xl border border-error/20 bg-error/5 py-16">
          <AlertTriangle className="h-10 w-10 text-error" aria-hidden="true" />
          <p className="mt-3 text-sm text-error">{error}</p>
          <button
            onClick={refresh}
            className="mt-4 inline-flex items-center gap-2 rounded-md border border-line/60 px-4 py-2 text-sm text-muted transition-colors duration-fast hover:bg-neutral-800 hover:text-ink"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl">
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-semibold tracking-tight text-ink">Connectors</h1>
          <p className="mt-1 text-sm text-muted">Manage your enterprise integrations.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-3 text-xs text-muted">
            <span className="flex items-center gap-1.5">
              <Wifi className="h-3.5 w-3.5 text-success" aria-hidden="true" />
              {connectedCount} connected
            </span>
            <span className="flex items-center gap-1.5">
              <WifiOff className="h-3.5 w-3.5" aria-hidden="true" />
              {disconnectedCount} disconnected
            </span>
            {errorCount > 0 && (
              <span className="flex items-center gap-1.5 text-error">
                <AlertTriangle className="h-3.5 w-3.5" aria-hidden="true" />
                {errorCount} errors
              </span>
            )}
          </div>
          <button
            onClick={() => setSetupOpen(true)}
            className="inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-white transition-colors duration-fast hover:bg-blue-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50"
          >
            <Plug className="h-4 w-4" aria-hidden="true" />
            Add Connector
          </button>
        </div>
      </div>

      {totalCount === 0 ? (
        <ConnectorEmptyState onAdd={() => setSetupOpen(true)} />
      ) : (
        <ConnectorGrid
          connectors={connectors}
          onConnect={handleConnect}
          onDisconnect={handleDisconnect}
          onSync={handleSync}
          syncingId={syncingId}
        />
      )}

      <ConnectorSetupModal open={setupOpen} onClose={() => setSetupOpen(false)} />
    </div>
  );
}

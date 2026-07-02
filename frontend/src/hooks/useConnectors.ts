import { useCallback, useMemo, useState } from "react";

import type { Connector, SyncResult } from "../types/connector";
import { connectorService } from "../services/connectors/connectorService";

export interface UseConnectorsReturn {
  connectors: Connector[];
  loading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
  getById: (id: string) => Connector | undefined;
  connect: (id: string) => Promise<Connector>;
  disconnect: (id: string) => Promise<Connector>;
  sync: (id: string) => Promise<SyncResult>;
  connectedCount: number;
  disconnectedCount: number;
  errorCount: number;
  totalCount: number;
}

export function useConnectors(): UseConnectorsReturn {
  const [connectors, setConnectors] = useState<Connector[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await connectorService.list();
      setConnectors(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load connectors.");
    } finally {
      setLoading(false);
    }
  }, []);

  const getById = useCallback(
    (id: string) => connectors.find((c) => c.id === id),
    [connectors],
  );

  const connect = useCallback(async (id: string) => {
    const updated = await connectorService.connect(id);
    setConnectors((prev) => prev.map((c) => (c.id === id ? updated : c)));
    return updated;
  }, []);

  const disconnect = useCallback(async (id: string) => {
    const updated = await connectorService.disconnect(id);
    setConnectors((prev) => prev.map((c) => (c.id === id ? updated : c)));
    return updated;
  }, []);

  const sync = useCallback(async (id: string) => {
    return connectorService.sync(id);
  }, []);

  const connectedCount = useMemo(
    () => connectors.filter((c) => c.connected).length,
    [connectors],
  );

  const disconnectedCount = useMemo(
    () => connectors.filter((c) => !c.connected).length,
    [connectors],
  );

  const errorCount = useMemo(
    () => connectors.filter((c) => c.status === "error").length,
    [connectors],
  );

  const totalCount = connectors.length;

  return {
    connectors,
    loading,
    error,
    refresh,
    getById,
    connect,
    disconnect,
    sync,
    connectedCount,
    disconnectedCount,
    errorCount,
    totalCount,
  };
}

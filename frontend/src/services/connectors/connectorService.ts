import { mockConnectors } from "../../mocks/connectors";
import type { Connector, SyncResult } from "../../types/connector";

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export const connectorService = {
  async list(): Promise<Connector[]> {
    await delay(300);
    return [...mockConnectors];
  },

  async getById(id: string): Promise<Connector | null> {
    await delay(150);
    return mockConnectors.find((c) => c.id === id) ?? null;
  },

  async connect(id: string): Promise<Connector> {
    await delay(800);
    const connector = mockConnectors.find((c) => c.id === id);
    if (!connector) throw new Error(`Connector ${id} not found.`);
    connector.status = "connected";
    connector.connected = true;
    connector.health = {
      status: "healthy",
      latency: 42,
      lastChecked: new Date().toISOString(),
      message: `${connector.name} is reachable.`,
    };
    return { ...connector };
  },

  async disconnect(id: string): Promise<Connector> {
    await delay(500);
    const connector = mockConnectors.find((c) => c.id === id);
    if (!connector) throw new Error(`Connector ${id} not found.`);
    connector.status = "disconnected";
    connector.connected = false;
    connector.health = { status: "unknown", latency: null, lastChecked: null, message: null };
    return { ...connector };
  },

  async sync(_id: string): Promise<SyncResult> {
    await delay(1200);
    return {
      success: true,
      itemsSynced: 42,
      itemsFailed: 0,
      durationMs: 1234,
      cursor: "mock-cursor-001",
      error: null,
    };
  },
};

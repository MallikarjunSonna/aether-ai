export type ConnectorProvider =
  | "github"
  | "notion"
  | "confluence"
  | "google_drive"
  | "sharepoint"
  | "slack"
  | "jira"
  | "linear"
  | "custom";

export type ConnectorStatus = "disconnected" | "connecting" | "connected" | "error";

export type HealthStatus = "healthy" | "degraded" | "unreachable" | "unknown";

export type AuthenticationMethod =
  | "oauth"
  | "api_key"
  | "basic_auth"
  | "service_account"
  | "custom";

export type SyncFrequency =
  | "manual"
  | "realtime"
  | "every_5m"
  | "every_15m"
  | "every_1h"
  | "every_6h"
  | "every_24h";

export interface ConnectorHealth {
  status: HealthStatus;
  latency: number | null;
  lastChecked: string | null;
  message: string | null;
}

export interface FutureCapabilities {
  supportsOAuth: boolean;
  supportsApiKeys: boolean;
  supportsWebhooks: boolean;
  supportsPolling: boolean;
  supportsIncrementalSync: boolean;
  supportsPermissions: boolean;
  supportsScopes: boolean;
  supportsRateLimits: boolean;
}

export interface Connector {
  id: string;
  name: string;
  provider: ConnectorProvider;
  status: ConnectorStatus;
  health: ConnectorHealth;
  connected: boolean;
  lastSync: string | null;
  syncFrequency: SyncFrequency;
  workspaceId: string | null;
  organizationId: string | null;
  supportedSourceTypes: string[];
  authenticationType: AuthenticationMethod;
  futureCapabilities: FutureCapabilities;
}

export interface SyncResult {
  success: boolean;
  itemsSynced: number;
  itemsFailed: number;
  durationMs: number;
  cursor: string | null;
  error: string | null;
}

export interface SourceItem {
  id: string;
  name: string;
  type: string;
  path: string | null;
  lastModified: string | null;
  size: number | null;
}

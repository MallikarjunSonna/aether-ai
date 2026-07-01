export interface ProviderHealth {
  id: string;
  name: string;
  status: "healthy" | "degraded" | "down";
  latency: number;
  uptime: number;
  lastChecked: string;
  region: string;
  model: string;
}

export interface RequestMetric {
  total: number;
  success: number;
  failed: number;
  successRate: number;
  avgLatency: number;
  p95Latency: number;
  p99Latency: number;
}

export interface TokenUsage {
  promptTokens: number;
  completionTokens: number;
  totalTokens: number;
  estimatedCost: number;
  period: "24h" | "7d" | "30d";
}

export interface RagMetric {
  totalRetrievals: number;
  avgRetrievalTime: number;
  avgContextLength: number;
  retrievalSuccessRate: number;
  topKAvg: number;
  chunkUtilization: number;
}

export interface TrendDataPoint {
  timestamp: string;
  value: number;
}

export interface ProviderComparison {
  id: string;
  name: string;
  totalRequests: number;
  avgLatency: number;
  successRate: number;
  totalTokens: number;
  estimatedCost: number;
}

export interface OpsDashboardData {
  providerHealth: ProviderHealth[];
  requestMetrics: RequestMetric;
  tokenUsage: TokenUsage[];
  ragMetrics: RagMetric;
  latencyTrend: TrendDataPoint[];
  requestTrend: TrendDataPoint[];
  providerComparison: ProviderComparison[];
  lastUpdated: string;
}

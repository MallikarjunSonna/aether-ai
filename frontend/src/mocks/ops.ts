import type {
  OpsDashboardData,
  ProviderHealth,
  ProviderComparison,
  RagMetric,
  RequestMetric,
  TokenUsage,
  TrendDataPoint,
} from "../types/ops";

function hoursAgo(h: number): string {
  return new Date(Date.now() - h * 3600000).toISOString();
}

const providerHealth: ProviderHealth[] = [
  { id: "openai", name: "OpenAI", status: "healthy", latency: 1240, uptime: 99.97, lastChecked: hoursAgo(0), region: "us-east-1", model: "gpt-4o" },
  { id: "anthropic", name: "Anthropic", status: "healthy", latency: 980, uptime: 99.99, lastChecked: hoursAgo(0), region: "us-west-2", model: "claude-3-opus" },
  { id: "google", name: "Google AI", status: "degraded", latency: 2150, uptime: 98.45, lastChecked: hoursAgo(0), region: "us-central1", model: "gemini-1.5-pro" },
  { id: "mistral", name: "Mistral", status: "healthy", latency: 1100, uptime: 99.88, lastChecked: hoursAgo(0), region: "eu-west-1", model: "mistral-large" },
  { id: "cohere", name: "Cohere", status: "down", latency: 0, uptime: 95.12, lastChecked: hoursAgo(0), region: "us-east-1", model: "command-r-plus" },
  { id: "groq", name: "Groq", status: "healthy", latency: 420, uptime: 99.95, lastChecked: hoursAgo(0), region: "us-west-1", model: "llama3-70b" },
];

const requestMetrics: RequestMetric = {
  total: 284731,
  success: 281954,
  failed: 2777,
  successRate: 99.02,
  avgLatency: 1320,
  p95Latency: 3400,
  p99Latency: 6200,
};

const tokenUsage: TokenUsage[] = [
  { promptTokens: 84500000, completionTokens: 32100000, totalTokens: 116600000, estimatedCost: 582.5, period: "24h" },
  { promptTokens: 589000000, completionTokens: 215000000, totalTokens: 804000000, estimatedCost: 4020.0, period: "7d" },
  { promptTokens: 2450000000, completionTokens: 920000000, totalTokens: 3370000000, estimatedCost: 16850.0, period: "30d" },
];

const ragMetrics: RagMetric = {
  totalRetrievals: 45231,
  avgRetrievalTime: 185,
  avgContextLength: 4200,
  retrievalSuccessRate: 97.8,
  topKAvg: 4.2,
  chunkUtilization: 72.4,
};

const latencyTrend: TrendDataPoint[] = [];
const requestTrend: TrendDataPoint[] = [];
for (let i = 24; i >= 0; i--) {
  latencyTrend.push({ timestamp: hoursAgo(i), value: 800 + Math.random() * 2000 });
  requestTrend.push({ timestamp: hoursAgo(i), value: 8000 + Math.random() * 12000 });
}

const providerComparison: ProviderComparison[] = [
  { id: "openai", name: "OpenAI", totalRequests: 124500, avgLatency: 1240, successRate: 99.2, totalTokens: 1560000000, estimatedCost: 7800 },
  { id: "anthropic", name: "Anthropic", totalRequests: 82100, avgLatency: 980, successRate: 99.5, totalTokens: 980000000, estimatedCost: 4900 },
  { id: "google", name: "Google AI", totalRequests: 45120, avgLatency: 2150, successRate: 98.1, totalTokens: 520000000, estimatedCost: 2600 },
  { id: "mistral", name: "Mistral", totalRequests: 18420, avgLatency: 1100, successRate: 99.3, totalTokens: 210000000, estimatedCost: 1050 },
  { id: "groq", name: "Groq", totalRequests: 14591, avgLatency: 420, successRate: 99.8, totalTokens: 98000000, estimatedCost: 490 },
];

export const mockOpsDashboard: OpsDashboardData = {
  providerHealth,
  requestMetrics,
  tokenUsage,
  ragMetrics,
  latencyTrend,
  requestTrend,
  providerComparison,
  lastUpdated: new Date().toISOString(),
};

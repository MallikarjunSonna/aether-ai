import { Activity, BarChart3, Clock, RefreshCw, Server } from "lucide-react";
import { useCallback, useState } from "react";

import { OpsMetricCard } from "../../components/ops/OpsMetricCard";
import { ProviderHealthCard } from "../../components/ops/ProviderHealthCard";
import { RagMetricsCard } from "../../components/ops/RagMetricsCard";
import { RequestMetricsCard } from "../../components/ops/RequestMetricsCard";
import { TokenUsageCard } from "../../components/ops/TokenUsageCard";
import { mockOpsDashboard } from "../../mocks/ops";

export function OpsCenterPage() {
  const [dashboard] = useState(mockOpsDashboard);
  const [refreshing, setRefreshing] = useState(false);

  const handleRefresh = useCallback(() => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 800);
  }, []);

  const successCount = dashboard.requestMetrics.total - dashboard.requestMetrics.failed;

  return (
    <div className="mx-auto max-w-6xl">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold tracking-tight text-ink">AI Operations Center</h1>
          <p className="mt-1 text-sm text-muted">
            Monitor AI provider health, usage metrics, and RAG performance.
          </p>
        </div>
        <button
          onClick={handleRefresh}
          disabled={refreshing}
          className="inline-flex items-center gap-2 rounded-md border border-line bg-surface px-4 py-2 text-sm font-medium text-ink transition-colors duration-fast hover:bg-neutral-800 disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50"
        >
          <RefreshCw className={`h-4 w-4 ${refreshing ? "animate-spin" : ""}`} aria-hidden="true" />
          Refresh
        </button>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <OpsMetricCard
          title="Total Requests"
          value={dashboard.requestMetrics.total.toLocaleString()}
          subtitle="All providers"
          icon={<Activity className="h-5 w-5" />}
          trend="up"
          trendLabel="+12% from last week"
        />
        <OpsMetricCard
          title="Success Rate"
          value={`${dashboard.requestMetrics.successRate}%`}
          subtitle={`${successCount.toLocaleString()} successful`}
          icon={<BarChart3 className="h-5 w-5" />}
          trend={dashboard.requestMetrics.successRate >= 99 ? "up" : "down"}
          trendLabel={dashboard.requestMetrics.successRate >= 99 ? "Above 99% target" : "Below 99% target"}
        />
        <OpsMetricCard
          title="Avg Latency"
          value={`${(dashboard.requestMetrics.avgLatency / 1000).toFixed(2)}s`}
          subtitle={`P95: ${(dashboard.requestMetrics.p95Latency / 1000).toFixed(1)}s`}
          icon={<Clock className="h-5 w-5" />}
          trend="neutral"
          trendLabel="Within normal range"
        />
        <OpsMetricCard
          title="Providers"
          value={dashboard.providerHealth.length}
          subtitle={`${dashboard.providerHealth.filter((p) => p.status === "healthy").length} healthy`}
          icon={<Server className="h-5 w-5" />}
          trend={
            dashboard.providerHealth.some((p) => p.status === "down")
              ? "down"
              : dashboard.providerHealth.some((p) => p.status === "degraded")
                ? "neutral"
                : "up"
          }
          trendLabel={
            dashboard.providerHealth.some((p) => p.status === "down")
              ? "Provider outage detected"
              : dashboard.providerHealth.some((p) => p.status === "degraded")
                ? "Some providers degraded"
                : "All providers healthy"
          }
        />
      </div>

      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
        <ProviderHealthCard providers={dashboard.providerHealth} />
        <RequestMetricsCard metrics={dashboard.requestMetrics} trend={dashboard.requestTrend} />
      </div>

      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <TokenUsageCard usage={dashboard.tokenUsage} />
        </div>
        <RagMetricsCard metrics={dashboard.ragMetrics} />
      </div>

      <div className="mt-6 mb-8">
        <div className="rounded-xl border border-line/60 bg-surface p-5">
          <h3 className="text-sm font-semibold text-ink mb-4">Provider Comparison</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-line/60">
                  <th className="text-left py-2.5 px-3 text-xs font-medium text-muted uppercase tracking-wider">Provider</th>
                  <th className="text-right py-2.5 px-3 text-xs font-medium text-muted uppercase tracking-wider">Requests</th>
                  <th className="text-right py-2.5 px-3 text-xs font-medium text-muted uppercase tracking-wider">Avg Latency</th>
                  <th className="text-right py-2.5 px-3 text-xs font-medium text-muted uppercase tracking-wider">Success Rate</th>
                  <th className="text-right py-2.5 px-3 text-xs font-medium text-muted uppercase tracking-wider">Total Tokens</th>
                  <th className="text-right py-2.5 px-3 text-xs font-medium text-muted uppercase tracking-wider">Est. Cost</th>
                </tr>
              </thead>
              <tbody>
                {dashboard.providerComparison.map((p) => (
                  <tr key={p.id} className="border-b border-line/40 last:border-0 hover:bg-canvas/30 transition-colors">
                    <td className="py-2.5 px-3 font-medium text-ink">{p.name}</td>
                    <td className="py-2.5 px-3 text-right text-ink">{p.totalRequests.toLocaleString()}</td>
                    <td className="py-2.5 px-3 text-right text-ink">{p.avgLatency}ms</td>
                    <td className="py-2.5 px-3 text-right">
                      <span className={p.successRate >= 99 ? "text-green-400" : "text-amber-400"}>
                        {p.successRate}%
                      </span>
                    </td>
                    <td className="py-2.5 px-3 text-right text-ink">{(p.totalTokens / 1_000_000).toFixed(1)}M</td>
                    <td className="py-2.5 px-3 text-right font-medium text-ink">${p.estimatedCost.toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

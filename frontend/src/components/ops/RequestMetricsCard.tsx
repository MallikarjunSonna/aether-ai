import { Activity, AlertTriangle, CheckCircle, XCircle } from "lucide-react";

import type { TrendDataPoint, RequestMetric } from "../../types/ops";

interface RequestMetricsCardProps {
  metrics: RequestMetric;
  trend: TrendDataPoint[];
}

export function RequestMetricsCard({ metrics, trend }: RequestMetricsCardProps) {
  const current = trend[trend.length - 1];
  const previous = trend.length > 1 ? trend[trend.length - 2] : null;
  const trendDirection = previous && current
    ? current.value >= previous.value ? "up" : "down"
    : "neutral";

  return (
    <div className="rounded-xl border border-line/60 bg-surface p-5">
      <h3 className="text-sm font-semibold text-ink mb-4">Request Metrics</h3>
      <div className="grid grid-cols-2 gap-4">
        <div className="rounded-lg bg-canvas/50 p-4">
          <div className="flex items-center gap-2 text-xs text-muted mb-1">
            <Activity className="h-3.5 w-3.5" />
            Total Requests
          </div>
          <p className="text-xl font-semibold text-ink">{metrics.total.toLocaleString()}</p>
        </div>
        <div className="rounded-lg bg-canvas/50 p-4">
          <div className="flex items-center gap-2 text-xs text-muted mb-1">
            <CheckCircle className="h-3.5 w-3.5 text-green-400" />
            Success Rate
          </div>
          <p className="text-xl font-semibold text-ink">{metrics.successRate}%</p>
        </div>
        <div className="rounded-lg bg-canvas/50 p-4">
          <div className="flex items-center gap-2 text-xs text-muted mb-1">
            <XCircle className="h-3.5 w-3.5 text-error" />
            Failed
          </div>
          <p className="text-xl font-semibold text-ink">{metrics.failed.toLocaleString()}</p>
        </div>
        <div className="rounded-lg bg-canvas/50 p-4">
          <div className="flex items-center gap-2 text-xs text-muted mb-1">
            <AlertTriangle className="h-3.5 w-3.5 text-amber-400" />
            Avg Latency
          </div>
          <p className="text-xl font-semibold text-ink">{(metrics.avgLatency / 1000).toFixed(1)}s</p>
        </div>
      </div>

      <div className="mt-4 pt-4 border-t border-line/60">
        <div className="flex items-center justify-between text-xs text-muted">
          <span className="inline-flex items-center gap-1">
            P95: {(metrics.p95Latency / 1000).toFixed(1)}s
          </span>
          <span className="inline-flex items-center gap-1">
            P99: {(metrics.p99Latency / 1000).toFixed(1)}s
          </span>
          <span className="inline-flex items-center gap-1">
            Trend: {trendDirection === "up" ? "↑" : "↓"} {current ? Math.round(current.value).toLocaleString() : "—"}
          </span>
        </div>
      </div>
    </div>
  );
}

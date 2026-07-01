import { BookOpen, Gauge, Layers, Search, Target, Zap } from "lucide-react";

import type { RagMetric } from "../../types/ops";

interface RagMetricsCardProps {
  metrics: RagMetric;
}

export function RagMetricsCard({ metrics }: RagMetricsCardProps) {
  return (
    <div className="rounded-xl border border-line/60 bg-surface p-5">
      <h3 className="text-sm font-semibold text-ink mb-4">RAG Performance</h3>
      <div className="grid grid-cols-2 gap-3">
        <div className="rounded-lg bg-canvas/50 p-3">
          <div className="flex items-center gap-1.5 text-[11px] text-muted mb-1">
            <Search className="h-3 w-3" />
            Total Retrievals
          </div>
          <p className="text-base font-semibold text-ink">{metrics.totalRetrievals.toLocaleString()}</p>
        </div>
        <div className="rounded-lg bg-canvas/50 p-3">
          <div className="flex items-center gap-1.5 text-[11px] text-muted mb-1">
            <Zap className="h-3 w-3" />
            Avg Retrieval Time
          </div>
          <p className="text-base font-semibold text-ink">{metrics.avgRetrievalTime}ms</p>
        </div>
        <div className="rounded-lg bg-canvas/50 p-3">
          <div className="flex items-center gap-1.5 text-[11px] text-muted mb-1">
            <Layers className="h-3 w-3" />
            Avg Context Length
          </div>
          <p className="text-base font-semibold text-ink">{(metrics.avgContextLength / 1000).toFixed(1)}K</p>
        </div>
        <div className="rounded-lg bg-canvas/50 p-3">
          <div className="flex items-center gap-1.5 text-[11px] text-muted mb-1">
            <Target className="h-3 w-3" />
            Retrieval Success
          </div>
          <p className="text-base font-semibold text-ink">{metrics.retrievalSuccessRate}%</p>
        </div>
        <div className="rounded-lg bg-canvas/50 p-3">
          <div className="flex items-center gap-1.5 text-[11px] text-muted mb-1">
            <BookOpen className="h-3 w-3" />
            Top-K Average
          </div>
          <p className="text-base font-semibold text-ink">{metrics.topKAvg}</p>
        </div>
        <div className="rounded-lg bg-canvas/50 p-3">
          <div className="flex items-center gap-1.5 text-[11px] text-muted mb-1">
            <Gauge className="h-3 w-3" />
            Chunk Utilization
          </div>
          <p className="text-base font-semibold text-ink">{metrics.chunkUtilization}%</p>
        </div>
      </div>
    </div>
  );
}

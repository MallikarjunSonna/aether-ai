import { Activity, CheckCircle, XCircle } from "lucide-react";

import { DashboardWidget } from "../dashboard/DashboardWidget";

interface RagStatus {
  pipelineHealthy: boolean;
  retrieverReady: boolean;
  contextBuilderReady: boolean;
  promptBuilderReady: boolean;
  aiGatewayReady: boolean;
  lastIndexed: string;
  totalDocuments: number;
  averageLatencyMs: number;
}

interface RagStatusWidgetProps {
  data: RagStatus;
}

const MOCK_STATUS: RagStatus = {
  pipelineHealthy: true,
  retrieverReady: true,
  contextBuilderReady: true,
  promptBuilderReady: true,
  aiGatewayReady: true,
  lastIndexed: "2026-07-01 18:30 UTC",
  totalDocuments: 18,
  averageLatencyMs: 142,
};

const statusItems = [
  { label: "Retriever", key: "retrieverReady" as const },
  { label: "Context Builder", key: "contextBuilderReady" as const },
  { label: "Prompt Builder", key: "promptBuilderReady" as const },
  { label: "AI Gateway", key: "aiGatewayReady" as const },
];

export function RagStatusWidget({ data = MOCK_STATUS }: RagStatusWidgetProps) {
  return (
    <DashboardWidget title="RAG Pipeline Status" icon={Activity}>
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          {data.pipelineHealthy ? (
            <span className="flex h-10 w-10 items-center justify-center rounded-lg border border-success/20 bg-success/10 text-success">
              <CheckCircle className="h-5 w-5" aria-hidden="true" />
            </span>
          ) : (
            <span className="flex h-10 w-10 items-center justify-center rounded-lg border border-error/20 bg-error/10 text-error">
              <XCircle className="h-5 w-5" aria-hidden="true" />
            </span>
          )}
          <div>
            <p className="text-sm font-semibold text-ink">
              {data.pipelineHealthy ? "Pipeline Healthy" : "Pipeline Degraded"}
            </p>
            <p className="text-xs text-muted">Last indexed: {data.lastIndexed}</p>
          </div>
        </div>

        <div className="space-y-2">
          {statusItems.map((item) => {
            const ready = data[item.key];
            return (
              <div key={item.key} className="flex items-center justify-between">
                <span className="text-sm text-muted">{item.label}</span>
                {ready ? (
                  <span className="inline-flex items-center gap-1.5 text-xs font-medium text-success">
                    <CheckCircle className="h-3.5 w-3.5" aria-hidden="true" />
                    Ready
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1.5 text-xs font-medium text-error">
                    <XCircle className="h-3.5 w-3.5" aria-hidden="true" />
                    Unavailable
                  </span>
                )}
              </div>
            );
          })}
        </div>

        <div className="grid grid-cols-2 gap-3 pt-1">
          <div className="rounded-lg border border-line/60 bg-canvas p-3">
            <p className="text-xs text-muted">Documents</p>
            <p className="mt-0.5 text-lg font-semibold text-ink">{data.totalDocuments}</p>
          </div>
          <div className="rounded-lg border border-line/60 bg-canvas p-3">
            <p className="text-xs text-muted">Avg Latency</p>
            <p className="mt-0.5 text-lg font-semibold text-ink">{data.averageLatencyMs}ms</p>
          </div>
        </div>
      </div>
    </DashboardWidget>
  );
}

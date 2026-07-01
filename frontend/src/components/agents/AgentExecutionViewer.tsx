import { CheckCircle2, XCircle } from "lucide-react";

import type { AgentExecution } from "../../types/agent";

interface AgentExecutionViewerProps {
  execution: AgentExecution;
}

export function AgentExecutionViewer({ execution }: AgentExecutionViewerProps) {
  return (
    <div className="rounded-xl border border-line/60 bg-surface p-5">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-sm font-semibold text-ink">Execution Traces</h3>
        <div className="flex items-center gap-2">
          <span className={`flex h-2 w-2 rounded-full ${execution.status === "running" ? "bg-green-400 animate-pulse" : execution.status === "completed" ? "bg-green-400" : execution.status === "failed" ? "bg-error" : "bg-muted"}`} />
          <span className="text-xs text-muted capitalize">{execution.status}</span>
        </div>
      </div>

      <div className="space-y-2">
        {execution.traces.map((trace) => (
          <div key={trace.id} className="rounded-lg bg-canvas/50 p-3">
            <div className="flex items-center gap-2">
              {trace.status === "success" ? (
                <CheckCircle2 className="h-3.5 w-3.5 text-green-400 shrink-0" />
              ) : (
                <XCircle className="h-3.5 w-3.5 text-error shrink-0" />
              )}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="text-xs font-medium text-ink">{trace.type.replace("_", " ")}</p>
                  <span className="text-[10px] text-muted">{trace.duration}ms</span>
                </div>
                <p className="text-[11px] text-muted truncate">{trace.input}</p>
              </div>
              <span className="text-[10px] text-muted shrink-0">
                {new Date(trace.timestamp).toLocaleTimeString()}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

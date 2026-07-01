import { CheckCircle2, Circle, Loader2, XCircle } from "lucide-react";

import type { AgentPlan } from "../../types/agent";

interface AgentPlanViewerProps {
  plan: AgentPlan;
}

const stepIcons = {
  pending: Circle,
  running: Loader2,
  completed: CheckCircle2,
  failed: XCircle,
};

const stepColors = {
  pending: "text-muted",
  running: "text-primary",
  completed: "text-green-400",
  failed: "text-error",
};

const typeLabels: Record<string, string> = {
  reason: "Reasoning",
  retrieve: "Retrieval",
  generate: "Generation",
  transform: "Transformation",
  observe: "Observation",
};

export function AgentPlanViewer({ plan }: AgentPlanViewerProps) {
  return (
    <div className="rounded-xl border border-line/60 bg-surface p-5">
      <div className="mb-4">
        <h3 className="text-sm font-semibold text-ink">Execution Plan</h3>
        <p className="mt-0.5 text-xs text-muted">{plan.goal}</p>
      </div>
      <div className="relative space-y-0">
        {plan.steps.map((step, i) => {
          const Icon = stepIcons[step.status];
          const color = stepColors[step.status];
          const isLast = i === plan.steps.length - 1;

          return (
            <div key={step.id} className="flex gap-3">
              <div className="flex flex-col items-center">
                <Icon className={`h-4 w-4 ${color} ${step.status === "running" ? "animate-spin" : ""}`} />
                {!isLast && <div className="mt-1 w-px flex-1 bg-line/40 min-h-[24px]" />}
              </div>
              <div className={`pb-4 ${isLast ? "" : ""}`}>
                <p className="text-sm font-medium text-ink">{step.description}</p>
                <div className="mt-0.5 flex items-center gap-2 text-[11px] text-muted">
                  <span>{typeLabels[step.type]}</span>
                  {step.duration && <span>{step.duration}ms</span>}
                  {step.result && (
                    <span className="truncate max-w-[200px] text-muted">{step.result}</span>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

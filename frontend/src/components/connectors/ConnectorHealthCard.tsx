import { Activity } from "lucide-react";

import type { ConnectorHealth } from "../../types/connector";

interface ConnectorHealthCardProps {
  health: ConnectorHealth;
}

const healthStyles = {
  healthy: "border-success/20 text-success",
  degraded: "border-warning/20 text-warning",
  unreachable: "border-error/20 text-error",
  unknown: "border-neutral-700 text-muted",
} as const;

const healthLabels: Record<string, string> = {
  healthy: "Healthy",
  degraded: "Degraded",
  unreachable: "Unreachable",
  unknown: "Unknown",
};

export function ConnectorHealthCard({ health }: ConnectorHealthCardProps) {
  return (
    <div
      className={`rounded-lg border px-3 py-2 ${healthStyles[health.status] ?? healthStyles.unknown}`}
    >
      <div className="flex items-center gap-2">
        <Activity className="h-3.5 w-3.5" aria-hidden="true" />
        <span className="text-xs font-medium">{healthLabels[health.status] ?? "Unknown"}</span>
      </div>
      {health.latency !== null && (
        <p className="mt-1 text-[11px] text-muted">{health.latency}ms latency</p>
      )}
      {health.message && (
        <p className="mt-0.5 text-[11px] text-muted">{health.message}</p>
      )}
    </div>
  );
}

import { Clock, Globe } from "lucide-react";

import type { ProviderHealth } from "../../types/ops";

interface ProviderHealthCardProps {
  providers: ProviderHealth[];
}

export function ProviderHealthCard({ providers }: ProviderHealthCardProps) {
  const statusColor = (status: ProviderHealth["status"]) => {
    switch (status) {
      case "healthy": return "bg-green-400 shadow-sm shadow-green-400/30";
      case "degraded": return "bg-amber-400 shadow-sm shadow-amber-400/30";
      case "down": return "bg-error shadow-sm shadow-error/30";
    }
  };

  const statusLabel = (status: ProviderHealth["status"]) => {
    switch (status) {
      case "healthy": return "Healthy";
      case "degraded": return "Degraded";
      case "down": return "Down";
    }
  };

  return (
    <div className="rounded-xl border border-line/60 bg-surface p-5">
      <h3 className="text-sm font-semibold text-ink mb-4">Provider Health</h3>
      <div className="space-y-3">
        {providers.map((p) => (
          <div key={p.id} className="flex items-center justify-between rounded-lg bg-canvas/50 px-4 py-3">
            <div className="flex items-center gap-3">
              <span className={`flex h-2.5 w-2.5 rounded-full ${statusColor(p.status)}`} />
              <div>
                <p className="text-sm font-medium text-ink">{p.name}</p>
                <p className="text-xs text-muted">{p.model}</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className={`text-xs font-medium ${p.status === "healthy" ? "text-green-400" : p.status === "degraded" ? "text-amber-400" : "text-error"}`}>
                  {statusLabel(p.status)}
                </p>
                <p className="text-[11px] text-muted">{p.latency.toFixed(0)}ms</p>
              </div>
              <div className="hidden sm:flex items-center gap-3 text-[11px] text-muted">
                <span className="inline-flex items-center gap-1">
                  <Globe className="h-3 w-3" /> {p.region}
                </span>
                <span className="inline-flex items-center gap-1">
                  <Clock className="h-3 w-3" /> {p.uptime}%
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

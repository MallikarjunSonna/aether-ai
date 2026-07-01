import { Brain, Cpu, RefreshCw } from "lucide-react";

import type { AgentConfig } from "../../types/agent";

interface AgentCardProps {
  agent: AgentConfig;
  isSelected: boolean;
  onSelect: (id: string) => void;
}

const statusConfig = {
  idle: { dot: "bg-muted", label: "Idle" },
  running: { dot: "bg-green-400 animate-pulse", label: "Running" },
  error: { dot: "bg-error", label: "Error" },
  paused: { dot: "bg-amber-400", label: "Paused" },
};

export function AgentCard({ agent, isSelected, onSelect }: AgentCardProps) {
  const status = statusConfig[agent.status];

  return (
    <button
      onClick={() => onSelect(agent.id)}
      className={`w-full rounded-xl border p-4 text-left transition-all duration-fast focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 ${
        isSelected
          ? "border-primary/40 bg-primary/5"
          : "border-line/60 bg-surface hover:border-neutral-500"
      }`}
    >
      <div className="flex items-start gap-3">
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-line bg-surface text-primary">
          <Brain className="h-5 w-5" />
        </span>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <p className="text-sm font-semibold text-ink">{agent.name}</p>
            <span className={`flex h-2 w-2 rounded-full ${status.dot}`} title={status.label} />
          </div>
          <p className="mt-0.5 text-xs text-muted line-clamp-1">{agent.description}</p>
          <div className="mt-2 flex items-center gap-3 text-[11px] text-muted">
            <span className="inline-flex items-center gap-1">
              <Cpu className="h-3 w-3" />
              {agent.provider}
            </span>
            <span>{agent.model}</span>
            <span>{agent.capabilities.length} caps</span>
          </div>
        </div>
        <div className="shrink-0">
          {agent.status === "running" && <RefreshCw className="h-4 w-4 animate-spin text-green-400" />}
        </div>
      </div>
    </button>
  );
}

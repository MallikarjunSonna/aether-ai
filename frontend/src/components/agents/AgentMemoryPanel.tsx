import { Database, HardDrive, MessageSquare, Eye } from "lucide-react";

import type { MemoryEntry } from "../../types/agent";

interface AgentMemoryPanelProps {
  entries: MemoryEntry[];
}

const typeConfig = {
  context: { icon: Database, label: "Context" },
  conversation: { icon: MessageSquare, label: "Conversation" },
  working: { icon: HardDrive, label: "Working" },
  observation: { icon: Eye, label: "Observation" },
};

export function AgentMemoryPanel({ entries }: AgentMemoryPanelProps) {
  return (
    <div className="rounded-xl border border-line/60 bg-surface p-5">
      <h3 className="text-sm font-semibold text-ink mb-4">Agent Memory</h3>
      <div className="space-y-2">
        {entries.map((entry) => {
          const config = typeConfig[entry.type];
          const Icon = config.icon;

          return (
            <div key={entry.id} className="rounded-lg bg-canvas/50 p-3">
              <div className="flex items-center gap-1.5 text-[11px] text-muted mb-1">
                <Icon className="h-3 w-3" />
                <span>{config.label}</span>
                <span className="ml-auto text-muted">
                  {new Date(entry.timestamp).toLocaleTimeString()}
                </span>
              </div>
              <p className="text-xs text-ink leading-relaxed">{entry.content}</p>
              {entry.ttl && (
                <p className="mt-1 text-[10px] text-muted">TTL: {entry.ttl}s</p>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

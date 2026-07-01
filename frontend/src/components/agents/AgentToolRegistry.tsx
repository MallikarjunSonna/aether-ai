import { Puzzle, ToggleLeft, ToggleRight } from "lucide-react";

import type { ToolDefinition } from "../../types/agent";

interface AgentToolRegistryProps {
  tools: ToolDefinition[];
}

const categoryColors: Record<string, string> = {
  retrieval: "bg-blue-500/10 text-blue-400 border-blue-500/20",
  transformation: "bg-purple-500/10 text-purple-400 border-purple-500/20",
  search: "bg-green-500/10 text-green-400 border-green-500/20",
  computation: "bg-amber-500/10 text-amber-400 border-amber-500/20",
  integration: "bg-pink-500/10 text-pink-400 border-pink-500/20",
};

export function AgentToolRegistry({ tools }: AgentToolRegistryProps) {
  return (
    <div className="rounded-xl border border-line/60 bg-surface p-5">
      <h3 className="text-sm font-semibold text-ink mb-4">Tool Registry</h3>
      <div className="space-y-2">
        {tools.map((tool) => (
          <div key={tool.id} className="flex items-start gap-3 rounded-lg bg-canvas/50 p-3">
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-line bg-surface text-muted">
              <Puzzle className="h-4 w-4" />
            </span>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <p className="text-sm font-medium text-ink">{tool.name}</p>
                <span className={`rounded border px-1.5 py-0.5 text-[10px] font-medium ${categoryColors[tool.category]}`}>
                  {tool.category}
                </span>
              </div>
              <p className="mt-0.5 text-xs text-muted">{tool.description}</p>
              <div className="mt-1.5 flex flex-wrap gap-1">
                {tool.parameters.map((p) => (
                  <span key={p.name} className="rounded bg-neutral-800 px-1.5 py-0.5 text-[10px] text-muted">
                    {p.name}{p.required ? "*" : ""}
                  </span>
                ))}
              </div>
            </div>
            <button
              aria-label={`${tool.enabled ? "Disable" : "Enable"} ${tool.name}`}
              className={`shrink-0 transition-colors ${tool.enabled ? "text-primary" : "text-muted"}`}
            >
              {tool.enabled ? <ToggleRight className="h-5 w-5" /> : <ToggleLeft className="h-5 w-5" />}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

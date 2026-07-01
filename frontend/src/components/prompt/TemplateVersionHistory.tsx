import { Clock, GitCommit, User } from "lucide-react";
import { useState } from "react";

import type { PromptVersion } from "../../types/prompt";

interface TemplateVersionHistoryProps {
  versions: PromptVersion[];
}

export function TemplateVersionHistory({ versions }: TemplateVersionHistoryProps) {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  if (versions.length === 0) {
    return (
      <p className="text-sm text-muted">No version history available.</p>
    );
  }

  return (
    <div className="space-y-1">
      {[...versions].reverse().map((v) => {
        const isExpanded = expandedId === v.id;
        const date = new Date(v.createdAt).toLocaleDateString("en-US", {
          year: "numeric",
          month: "short",
          day: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        });

        return (
          <div key={v.id} className="rounded-lg border border-line/60 bg-canvas/50">
            <button
              onClick={() => setExpandedId(isExpanded ? null : v.id)}
              className="flex w-full items-center gap-3 px-4 py-3 text-left transition-colors duration-fast hover:bg-neutral-800/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50"
            >
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-line bg-surface">
                <GitCommit className="h-4 w-4 text-primary" aria-hidden="true" />
              </span>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-ink">v{v.version}</span>
                  <span className="text-xs text-muted truncate">{v.changelog}</span>
                </div>
                <div className="mt-0.5 flex items-center gap-3 text-[11px] text-muted">
                  <span className="inline-flex items-center gap-1">
                    <User className="h-3 w-3" aria-hidden="true" />
                    {v.createdBy}
                  </span>
                  <span className="inline-flex items-center gap-1">
                    <Clock className="h-3 w-3" aria-hidden="true" />
                    {date}
                  </span>
                </div>
              </div>
            </button>
            {isExpanded && (
              <div className="border-t border-line/60 px-4 py-3">
                <pre className="max-h-48 overflow-auto rounded bg-neutral-900 p-3 text-xs text-ink font-mono whitespace-pre-wrap break-words">
                  {v.content}
                </pre>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

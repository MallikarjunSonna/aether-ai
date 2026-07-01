import { BookOpen, Database, FileText } from "lucide-react";

import { DashboardWidget } from "../dashboard/DashboardWidget";

interface SourceSummary {
  type: string;
  label: string;
  count: number;
  icon: "book" | "database" | "file";
}

interface KnowledgeSourcesWidgetProps {
  sources: SourceSummary[];
}

const MOCK_SOURCES: SourceSummary[] = [
  { type: "knowledge", label: "Knowledge Base", count: 8, icon: "book" },
  { type: "memory", label: "Workspace Memory", count: 5, icon: "database" },
  { type: "prompt", label: "Prompt Library", count: 5, icon: "file" },
];

const iconMap = {
  book: BookOpen,
  database: Database,
  file: FileText,
};

export function KnowledgeSourcesWidget({ sources = MOCK_SOURCES }: KnowledgeSourcesWidgetProps) {
  return (
    <DashboardWidget title="Knowledge Sources" icon={Database}>
      <div className="space-y-3">
        {sources.map((source) => {
          const Icon = iconMap[source.icon];
          return (
            <div
              key={source.type}
              className="flex items-center gap-3 rounded-lg border border-line/60 bg-canvas px-4 py-3"
            >
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-primary/20 bg-primary/10 text-primary">
                <Icon className="h-4 w-4" aria-hidden="true" />
              </span>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-ink">{source.label}</p>
                <p className="text-xs text-muted">{source.count} items</p>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-4 rounded-lg border border-line/60 bg-canvas p-3 text-center">
        <p className="text-xs text-muted">
          Sources are retrieved using keyword matching. Replace with vector search for production.
        </p>
      </div>
    </DashboardWidget>
  );
}

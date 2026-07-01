import { BookOpen, ExternalLink } from "lucide-react";

import { DashboardWidget } from "../dashboard/DashboardWidget";

interface Citation {
  sourceId: string;
  sourceType: "knowledge" | "memory" | "prompt";
  title: string;
  excerpt: string;
  relevanceScore: number;
}

interface CitationListProps {
  citations?: Citation[];
}

const MOCK_CITATIONS: Citation[] = [
  {
    sourceId: "know-003",
    sourceType: "knowledge",
    title: "Authentication Flow",
    excerpt:
      "Authentication uses JWT access and refresh tokens. Access tokens expire after 15 minutes.",
    relevanceScore: 0.95,
  },
  {
    sourceId: "know-001",
    sourceType: "knowledge",
    title: "API Design Guidelines",
    excerpt:
      "All REST APIs must use semantic versioning, paginate list responses, and return standardized error envelopes.",
    relevanceScore: 0.88,
  },
  {
    sourceId: "mem-002",
    sourceType: "memory",
    title: "Common customer question: API keys",
    excerpt:
      "Customers frequently ask how to rotate API keys without downtime.",
    relevanceScore: 0.82,
  },
];

const sourceBadgeColors = {
  knowledge: "border-blue-500/30 bg-blue-500/10 text-blue-400",
  memory: "border-purple-500/30 bg-purple-500/10 text-purple-400",
  prompt: "border-emerald-500/30 bg-emerald-500/10 text-emerald-400",
};

const sourceLabels = {
  knowledge: "KB",
  memory: "MEM",
  prompt: "PRM",
};

export function CitationList({ citations = MOCK_CITATIONS }: CitationListProps) {
  return (
    <DashboardWidget title="Citations" icon={BookOpen}>
      <div className="space-y-3">
        {citations.map((citation) => (
          <div
            key={citation.sourceId}
            className="rounded-lg border border-line/60 bg-canvas px-4 py-3"
          >
            <div className="mb-1.5 flex items-center justify-between">
              <span
                className={`inline-flex rounded-md border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider ${sourceBadgeColors[citation.sourceType]}`}
              >
                {sourceLabels[citation.sourceType]}
              </span>
              <button
                type="button"
                className="inline-flex items-center gap-1 text-xs text-muted transition-colors hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50"
                title="View source"
              >
                <ExternalLink className="h-3 w-3" aria-hidden="true" />
                Source
              </button>
            </div>

            <p className="mb-0.5 text-sm font-medium text-ink">{citation.title}</p>
            <p className="mb-1.5 line-clamp-2 text-xs text-muted">{citation.excerpt}</p>

            <div className="flex items-center gap-1.5">
              <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-line">
                <div
                  className="h-full rounded-full bg-primary transition-all duration-slow"
                  style={{ width: `${Math.round(citation.relevanceScore * 100)}%` }}
                />
              </div>
              <span className="shrink-0 text-[10px] font-medium text-muted">
                {Math.round(citation.relevanceScore * 100)}%
              </span>
            </div>
          </div>
        ))}
      </div>
    </DashboardWidget>
  );
}

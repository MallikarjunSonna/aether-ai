import { FileText } from "lucide-react";

import { DashboardWidget } from "../dashboard/DashboardWidget";

interface ContextItem {
  sourceId: string;
  sourceType: "knowledge" | "memory" | "prompt";
  title: string;
  content: string;
  score: number;
}

interface RetrievedContextPanelProps {
  items: ContextItem[];
}

const MOCK_ITEMS: ContextItem[] = [
  {
    sourceId: "know-003",
    sourceType: "knowledge",
    title: "Authentication Flow",
    content:
      "Authentication uses JWT access and refresh tokens. Access tokens expire after 15 minutes. Refresh tokens expire after 7 days.",
    score: 0.95,
  },
  {
    sourceId: "mem-002",
    sourceType: "memory",
    title: "Common customer question: API keys",
    content:
      "Customers frequently ask how to rotate API keys without downtime.",
    score: 0.82,
  },
  {
    sourceId: "prm-001",
    sourceType: "prompt",
    title: "Code Review Assistant",
    content:
      "You are a senior code reviewer. Analyze the provided code diff for bugs and security vulnerabilities.",
    score: 0.71,
  },
];

const sourceLabels = {
  knowledge: "Knowledge Base",
  memory: "Workspace Memory",
  prompt: "Prompt Library",
};

export function RetrievedContextPanel({ items = MOCK_ITEMS }: RetrievedContextPanelProps) {
  return (
    <DashboardWidget title="Retrieved Context" icon={FileText}>
      <div className="space-y-3">
        {items.map((item) => (
          <div
            key={item.sourceId}
            className="rounded-lg border border-line/60 bg-canvas px-4 py-3"
          >
            <div className="mb-1 flex items-center justify-between">
              <span className="text-xs font-medium text-primary">
                {sourceLabels[item.sourceType]}
              </span>
              <span className="text-xs text-muted">
                Score: {Math.round(item.score * 100)}%
              </span>
            </div>
            <p className="mb-0.5 text-sm font-medium text-ink">{item.title}</p>
            <p className="line-clamp-2 text-xs text-muted">{item.content}</p>
          </div>
        ))}
      </div>

      <div className="mt-3 text-center text-xs text-muted">
        {items.length} context item{items.length !== 1 ? "s" : ""} retrieved
      </div>
    </DashboardWidget>
  );
}

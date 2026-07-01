import type { PromptCategory } from "../../types/prompt";

const categoryLabels: Record<PromptCategory, string> = {
  "code-review": "Code Review",
  "bug-explainer": "Bug Explainer",
  "sql-generator": "SQL Generator",
  "blog-writer": "Blog Writer",
  "meeting-summary": "Meeting Summary",
  "api-documentation": "API Documentation",
  "customer-support": "Customer Support",
  "release-notes": "Release Notes",
};

const categoryColors: Record<PromptCategory, string> = {
  "code-review": "bg-blue-500/10 text-blue-400",
  "bug-explainer": "bg-red-500/10 text-red-400",
  "sql-generator": "bg-green-500/10 text-green-400",
  "blog-writer": "bg-purple-500/10 text-purple-400",
  "meeting-summary": "bg-amber-500/10 text-amber-400",
  "api-documentation": "bg-cyan-500/10 text-cyan-400",
  "customer-support": "bg-emerald-500/10 text-emerald-400",
  "release-notes": "bg-pink-500/10 text-pink-400",
};

interface PromptCategoryBadgeProps {
  category: PromptCategory;
}

export function PromptCategoryBadge({ category }: PromptCategoryBadgeProps) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-medium ${categoryColors[category]}`}
    >
      {categoryLabels[category]}
    </span>
  );
}

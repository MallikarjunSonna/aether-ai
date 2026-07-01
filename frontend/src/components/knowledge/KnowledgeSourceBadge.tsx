import type { SourceType } from "../../types/knowledge";

const sourceLabels: Record<SourceType, string> = {
  pdf: "PDF",
  markdown: "Markdown",
  docx: "DOCX",
  website: "Website",
  github: "GitHub",
  notion: "Notion",
  confluence: "Confluence",
  "google-drive": "Google Drive",
  sharepoint: "SharePoint",
  csv: "CSV",
};

const sourceColors: Record<SourceType, string> = {
  pdf: "bg-red-500/10 text-red-400",
  markdown: "bg-blue-500/10 text-blue-400",
  docx: "bg-indigo-500/10 text-indigo-400",
  website: "bg-purple-500/10 text-purple-400",
  github: "bg-neutral-500/10 text-neutral-400",
  notion: "bg-neutral-500/10 text-neutral-400",
  confluence: "bg-cyan-500/10 text-cyan-400",
  "google-drive": "bg-green-500/10 text-green-400",
  sharepoint: "bg-blue-500/10 text-blue-400",
  csv: "bg-amber-500/10 text-amber-400",
};

interface KnowledgeSourceBadgeProps {
  sourceType: SourceType;
}

export function KnowledgeSourceBadge({ sourceType }: KnowledgeSourceBadgeProps) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-medium ${sourceColors[sourceType]}`}
    >
      {sourceLabels[sourceType]}
    </span>
  );
}

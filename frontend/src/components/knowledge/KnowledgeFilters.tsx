import { Heart } from "lucide-react";

import type { KnowledgeCollection, SourceType } from "../../types/knowledge";

const collectionOptions: { value: KnowledgeCollection; label: string }[] = [
  { value: "engineering", label: "Engineering" },
  { value: "product", label: "Product" },
  { value: "hr", label: "HR" },
  { value: "legal", label: "Legal" },
  { value: "marketing", label: "Marketing" },
  { value: "customer-support", label: "Customer Support" },
  { value: "security", label: "Security" },
  { value: "operations", label: "Operations" },
];

const sourceTypeOptions: { value: SourceType; label: string }[] = [
  { value: "pdf", label: "PDF" },
  { value: "markdown", label: "Markdown" },
  { value: "docx", label: "DOCX" },
  { value: "website", label: "Website" },
  { value: "github", label: "GitHub" },
  { value: "notion", label: "Notion" },
  { value: "confluence", label: "Confluence" },
  { value: "google-drive", label: "Google Drive" },
  { value: "sharepoint", label: "SharePoint" },
  { value: "csv", label: "CSV" },
];

interface KnowledgeFiltersProps {
  collectionFilter: KnowledgeCollection | null;
  onCollectionChange: (collection: KnowledgeCollection | null) => void;
  sourceTypeFilter: SourceType | null;
  onSourceTypeChange: (sourceType: SourceType | null) => void;
  favoritesOnly: boolean;
  onFavoritesChange: (favorites: boolean) => void;
}

export function KnowledgeFilters({
  collectionFilter,
  onCollectionChange,
  sourceTypeFilter,
  onSourceTypeChange,
  favoritesOnly,
  onFavoritesChange,
}: KnowledgeFiltersProps) {
  return (
    <div className="space-y-3">
      <div>
        <p className="mb-1.5 text-xs font-medium text-muted">Collection</p>
        <div className="flex flex-wrap gap-1.5">
          <button
            onClick={() => onCollectionChange(null)}
            aria-pressed={collectionFilter === null}
            className={`rounded-md px-3 py-1.5 text-xs font-medium transition-colors duration-fast focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 ${
              collectionFilter === null
                ? "bg-primary text-white"
                : "bg-neutral-800 text-muted hover:bg-neutral-700 hover:text-ink"
            }`}
          >
            All
          </button>
          {collectionOptions.map((option) => (
            <button
              key={option.value}
              onClick={() => onCollectionChange(option.value)}
              aria-pressed={collectionFilter === option.value}
              className={`rounded-md px-3 py-1.5 text-xs font-medium transition-colors duration-fast focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 ${
                collectionFilter === option.value
                  ? "bg-primary text-white"
                  : "bg-neutral-800 text-muted hover:bg-neutral-700 hover:text-ink"
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>
      <div>
        <p className="mb-1.5 text-xs font-medium text-muted">Source Type</p>
        <div className="flex flex-wrap gap-1.5">
          <button
            onClick={() => onSourceTypeChange(null)}
            aria-pressed={sourceTypeFilter === null}
            className={`rounded-md px-3 py-1.5 text-xs font-medium transition-colors duration-fast focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 ${
              sourceTypeFilter === null
                ? "bg-primary text-white"
                : "bg-neutral-800 text-muted hover:bg-neutral-700 hover:text-ink"
            }`}
          >
            All
          </button>
          {sourceTypeOptions.map((option) => (
            <button
              key={option.value}
              onClick={() => onSourceTypeChange(option.value)}
              aria-pressed={sourceTypeFilter === option.value}
              className={`rounded-md px-3 py-1.5 text-xs font-medium transition-colors duration-fast focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 ${
                sourceTypeFilter === option.value
                  ? "bg-primary text-white"
                  : "bg-neutral-800 text-muted hover:bg-neutral-700 hover:text-ink"
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>
      <div>
        <button
          onClick={() => onFavoritesChange(!favoritesOnly)}
          aria-pressed={favoritesOnly}
          className={`inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium transition-colors duration-fast focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 ${
            favoritesOnly
              ? "bg-amber-400/10 text-amber-400"
              : "bg-neutral-800 text-muted hover:bg-neutral-700 hover:text-ink"
          }`}
        >
          <Heart
            className={`h-3.5 w-3.5 ${favoritesOnly ? "fill-amber-400" : ""}`}
            aria-hidden="true"
          />
          Favorites
        </button>
      </div>
    </div>
  );
}

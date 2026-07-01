import { Heart } from "lucide-react";

import type { PromptCategory } from "../../types/prompt";

const categoryOptions: { value: PromptCategory; label: string }[] = [
  { value: "code-review", label: "Code Review" },
  { value: "bug-explainer", label: "Bug Explainer" },
  { value: "sql-generator", label: "SQL Generator" },
  { value: "blog-writer", label: "Blog Writer" },
  { value: "meeting-summary", label: "Meeting Summary" },
  { value: "api-documentation", label: "API Documentation" },
  { value: "customer-support", label: "Customer Support" },
  { value: "release-notes", label: "Release Notes" },
];

interface PromptFiltersProps {
  categoryFilter: PromptCategory | null;
  onCategoryChange: (category: PromptCategory | null) => void;
  favoritesOnly: boolean;
  onFavoritesChange: (favorites: boolean) => void;
}

export function PromptFilters({
  categoryFilter,
  onCategoryChange,
  favoritesOnly,
  onFavoritesChange,
}: PromptFiltersProps) {
  return (
    <div className="flex flex-wrap items-center gap-3">
      <div className="flex flex-wrap gap-1.5">
        <button
          onClick={() => onCategoryChange(null)}
          aria-pressed={categoryFilter === null}
          className={`rounded-md px-3 py-1.5 text-xs font-medium transition-colors duration-fast focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 ${
            categoryFilter === null
              ? "bg-primary text-white"
              : "bg-neutral-800 text-muted hover:bg-neutral-700 hover:text-ink"
          }`}
        >
          All
        </button>
        {categoryOptions.map((option) => (
          <button
            key={option.value}
            onClick={() => onCategoryChange(option.value)}
            aria-pressed={categoryFilter === option.value}
            className={`rounded-md px-3 py-1.5 text-xs font-medium transition-colors duration-fast focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 ${
              categoryFilter === option.value
                ? "bg-primary text-white"
                : "bg-neutral-800 text-muted hover:bg-neutral-700 hover:text-ink"
            }`}
          >
            {option.label}
          </button>
        ))}
      </div>

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
  );
}

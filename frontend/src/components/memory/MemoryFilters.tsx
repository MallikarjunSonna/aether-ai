import { Heart } from "lucide-react";

import type { MemoryFilters as MemoryFiltersType } from "../../types/memory";
import type { ProviderType } from "../../types/ai";

const providerOptions: { value: ProviderType; label: string }[] = [
  { value: "openai", label: "OpenAI" },
  { value: "anthropic", label: "Anthropic" },
  { value: "gemini", label: "Gemini" },
  { value: "ollama", label: "Ollama" },
  { value: "azure-openai", label: "Azure OpenAI" },
];

interface MemoryFiltersProps {
  filters: MemoryFiltersType;
  onFilterChange: <K extends keyof MemoryFiltersType>(key: K, value: MemoryFiltersType[K]) => void;
  onClearFilters: () => void;
  hasActiveFilters: boolean;
}

export function MemoryFilters({
  filters,
  onFilterChange,
  onClearFilters,
  hasActiveFilters,
}: MemoryFiltersProps) {
  return (
    <div className="flex flex-wrap items-center gap-3">
      <div className="flex flex-wrap gap-1.5">
        <button
          onClick={() => onFilterChange("provider", null)}
          aria-pressed={!filters.provider}
          className={`rounded-md px-3 py-1.5 text-xs font-medium transition-colors duration-fast focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 ${
            !filters.provider
              ? "bg-primary text-white"
              : "bg-neutral-800 text-muted hover:bg-neutral-700 hover:text-ink"
          }`}
        >
          All
        </button>
        {providerOptions.map((option) => (
          <button
            key={option.value}
            onClick={() => onFilterChange("provider", option.value)}
            aria-pressed={filters.provider === option.value}
            className={`rounded-md px-3 py-1.5 text-xs font-medium transition-colors duration-fast focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 ${
              filters.provider === option.value
                ? "bg-primary text-white"
                : "bg-neutral-800 text-muted hover:bg-neutral-700 hover:text-ink"
            }`}
          >
            {option.label}
          </button>
        ))}
      </div>

      <button
        onClick={() => onFilterChange("favoritesOnly", !filters.favoritesOnly)}
        aria-pressed={!!filters.favoritesOnly}
        className={`inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium transition-colors duration-fast focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 ${
          filters.favoritesOnly
            ? "bg-amber-400/10 text-amber-400"
            : "bg-neutral-800 text-muted hover:bg-neutral-700 hover:text-ink"
        }`}
      >
        <Heart
          className={`h-3.5 w-3.5 ${filters.favoritesOnly ? "fill-amber-400" : ""}`}
          aria-hidden="true"
        />
        Favorites
      </button>

      <div className="flex items-center gap-2">
        <input
          type="date"
          value={filters.dateFrom ?? ""}
          onChange={(e) => onFilterChange("dateFrom", e.target.value || null)}
          aria-label="From date"
          className="h-7 rounded border border-line bg-surface px-2 text-xs text-ink transition-colors duration-fast focus:border-primary/50 focus:outline-none focus:ring-2 focus:ring-primary/20"
        />
        <span className="text-xs text-muted">to</span>
        <input
          type="date"
          value={filters.dateTo ?? ""}
          onChange={(e) => onFilterChange("dateTo", e.target.value || null)}
          aria-label="To date"
          className="h-7 rounded border border-line bg-surface px-2 text-xs text-ink transition-colors duration-fast focus:border-primary/50 focus:outline-none focus:ring-2 focus:ring-primary/20"
        />
      </div>

      <div className="flex items-center gap-1.5">
        <button
          onClick={() => onFilterChange("status", "active")}
          aria-pressed={filters.status === "active"}
          className={`rounded-md px-3 py-1.5 text-xs font-medium transition-colors duration-fast focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 ${
            filters.status === "active"
              ? "bg-primary text-white"
              : "bg-neutral-800 text-muted hover:bg-neutral-700 hover:text-ink"
          }`}
        >
          Active
        </button>
        <button
          onClick={() => onFilterChange("status", "archived")}
          aria-pressed={filters.status === "archived"}
          className={`rounded-md px-3 py-1.5 text-xs font-medium transition-colors duration-fast focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 ${
            filters.status === "archived"
              ? "bg-primary text-white"
              : "bg-neutral-800 text-muted hover:bg-neutral-700 hover:text-ink"
          }`}
        >
          Archived
        </button>
        {hasActiveFilters && (
          <button
            onClick={onClearFilters}
            className="ml-1.5 rounded-md px-3 py-1.5 text-xs font-medium text-muted transition-colors duration-fast hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50"
          >
            Clear
          </button>
        )}
      </div>
    </div>
  );
}

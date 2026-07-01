import { BrainCircuit, SearchX } from "lucide-react";

interface MemoryEmptyStateProps {
  hasFilters: boolean;
  onClearFilters: () => void;
}

export function MemoryEmptyState({ hasFilters, onClearFilters }: MemoryEmptyStateProps) {
  if (hasFilters) {
    return (
      <div className="flex min-h-[40vh] flex-col items-center justify-center text-center">
        <span className="flex h-16 w-16 items-center justify-center rounded-2xl border border-line bg-surface text-muted">
          <SearchX className="h-8 w-8" aria-hidden="true" />
        </span>
        <h2 className="mt-6 text-lg font-semibold text-ink">No memory entries found</h2>
        <p className="mt-2 max-w-sm text-sm leading-relaxed text-muted">
          No entries match your current search or filters.
        </p>
        <button
          onClick={onClearFilters}
          className="mt-6 rounded-md bg-primary px-5 py-2.5 text-sm font-medium text-white transition-colors duration-fast hover:bg-blue-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50"
        >
          Clear filters
        </button>
      </div>
    );
  }

  return (
    <div className="flex min-h-[40vh] flex-col items-center justify-center text-center">
      <span className="flex h-16 w-16 items-center justify-center rounded-2xl border border-line bg-surface text-muted">
        <BrainCircuit className="h-8 w-8" aria-hidden="true" />
      </span>
      <h2 className="mt-6 text-lg font-semibold text-ink">No memory yet</h2>
      <p className="mt-2 max-w-sm text-sm leading-relaxed text-muted">
        AI conversations will appear here as workspace memory, ready to search, reference, and reuse.
      </p>
    </div>
  );
}

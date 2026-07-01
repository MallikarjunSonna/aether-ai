import { BookOpen, Plus, SearchX } from "lucide-react";

interface KnowledgeEmptyStateProps {
  hasFilters: boolean;
  onCreate: () => void;
  onClearFilters: () => void;
}

export function KnowledgeEmptyState({ hasFilters, onCreate, onClearFilters }: KnowledgeEmptyStateProps) {
  if (hasFilters) {
    return (
      <div className="flex min-h-[40vh] flex-col items-center justify-center text-center">
        <span className="flex h-16 w-16 items-center justify-center rounded-2xl border border-line bg-surface text-muted">
          <SearchX className="h-8 w-8" aria-hidden="true" />
        </span>
        <h2 className="mt-6 text-lg font-semibold text-ink">No knowledge items found</h2>
        <p className="mt-2 max-w-sm text-sm leading-relaxed text-muted">
          No items match your current search or filters.
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
        <BookOpen className="h-8 w-8" aria-hidden="true" />
      </span>
      <h2 className="mt-6 text-lg font-semibold text-ink">No knowledge yet</h2>
      <p className="mt-2 max-w-sm text-sm leading-relaxed text-muted">
        Create your first knowledge item to start building your enterprise knowledge hub.
      </p>
      <button
        onClick={onCreate}
        className="mt-6 inline-flex items-center gap-2 rounded-md bg-primary px-5 py-2.5 text-sm font-medium text-white transition-colors duration-fast hover:bg-blue-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50"
      >
        <Plus className="h-4 w-4" aria-hidden="true" />
        Create Knowledge Item
      </button>
    </div>
  );
}

import { FileText, Plus, SearchX } from "lucide-react";

interface PromptEmptyStateProps {
  hasFilters: boolean;
  onCreate: () => void;
  onClearFilters: () => void;
}

export function PromptEmptyState({ hasFilters, onCreate, onClearFilters }: PromptEmptyStateProps) {
  if (hasFilters) {
    return (
      <div className="flex min-h-[40vh] flex-col items-center justify-center text-center">
        <span className="flex h-16 w-16 items-center justify-center rounded-2xl border border-line bg-surface text-muted">
          <SearchX className="h-8 w-8" aria-hidden="true" />
        </span>
        <h2 className="mt-6 text-lg font-semibold text-ink">No prompts found</h2>
        <p className="mt-2 max-w-sm text-sm leading-relaxed text-muted">
          No prompts match your current search or filters.
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
        <FileText className="h-8 w-8" aria-hidden="true" />
      </span>
      <h2 className="mt-6 text-lg font-semibold text-ink">No prompts yet</h2>
      <p className="mt-2 max-w-sm text-sm leading-relaxed text-muted">
        Create your first prompt to start building your prompt library.
      </p>
      <button
        onClick={onCreate}
        className="mt-6 inline-flex items-center gap-2 rounded-md bg-primary px-5 py-2.5 text-sm font-medium text-white transition-colors duration-fast hover:bg-blue-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50"
      >
        <Plus className="h-4 w-4" aria-hidden="true" />
        Create Prompt
      </button>
    </div>
  );
}

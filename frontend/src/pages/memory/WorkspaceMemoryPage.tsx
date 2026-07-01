import { useWorkspaceMemory } from "../../hooks/useWorkspaceMemory";
import { MemoryDetailsDrawer } from "../../components/memory/MemoryDetailsDrawer";
import { MemoryEmptyState } from "../../components/memory/MemoryEmptyState";
import { MemoryFilters } from "../../components/memory/MemoryFilters";
import { MemorySearch } from "../../components/memory/MemorySearch";
import { MemoryStats } from "../../components/memory/MemoryStats";
import { MemoryTimeline } from "../../components/memory/MemoryTimeline";

export function WorkspaceMemoryPage() {
  const {
    memories,
    searchQuery,
    setSearchQuery,
    filters,
    setFilter,
    clearFilters,
    hasActiveFilters,
    loading,
    selectedMemory,
    setSelectedMemory,
    toggleFavorite,
    archiveMemory,
    deleteMemory,
    stats,
  } = useWorkspaceMemory();

  if (loading) {
    return (
      <div className="mx-auto max-w-4xl">
        <div className="mb-6">
          <div className="h-7 w-48 animate-pulse rounded bg-neutral-800" />
          <div className="mt-2 h-4 w-72 animate-pulse rounded bg-neutral-800" />
        </div>
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-28 animate-pulse rounded-xl bg-neutral-800" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl">
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-semibold tracking-tight text-ink">Workspace Memory</h1>
          <p className="mt-1 text-sm text-muted">
            Browse and search AI conversation memory across your workspace.
          </p>
        </div>
        <MemoryStats
          total={stats.total}
          totalTokens={stats.totalTokens}
          providers={stats.providers}
        />
      </div>

      <div className="mb-6 space-y-4">
        <MemorySearch value={searchQuery} onChange={setSearchQuery} />
        <MemoryFilters
          filters={filters}
          onFilterChange={setFilter}
          onClearFilters={clearFilters}
          hasActiveFilters={hasActiveFilters}
        />
      </div>

      {memories.length === 0 ? (
        <MemoryEmptyState
          hasFilters={hasActiveFilters}
          onClearFilters={clearFilters}
        />
      ) : (
        <MemoryTimeline
          memories={memories}
          onSelect={setSelectedMemory}
          onToggleFavorite={toggleFavorite}
          onArchive={archiveMemory}
          onDelete={deleteMemory}
        />
      )}

      <MemoryDetailsDrawer
        memory={selectedMemory}
        onClose={() => setSelectedMemory(null)}
        onToggleFavorite={toggleFavorite}
        onArchive={archiveMemory}
        onDelete={deleteMemory}
      />
    </div>
  );
}

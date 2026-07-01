import { Plus } from "lucide-react";
import { useState } from "react";

import { CreateKnowledgeModal } from "../../components/knowledge/CreateKnowledgeModal";
import { KnowledgeCollectionCard } from "../../components/knowledge/KnowledgeCollectionCard";
import { KnowledgeDetailsDrawer } from "../../components/knowledge/KnowledgeDetailsDrawer";
import { KnowledgeEmptyState } from "../../components/knowledge/KnowledgeEmptyState";
import { KnowledgeFilters } from "../../components/knowledge/KnowledgeFilters";
import { KnowledgeGrid } from "../../components/knowledge/KnowledgeGrid";
import { KnowledgeSearch } from "../../components/knowledge/KnowledgeSearch";
import { KnowledgeStats } from "../../components/knowledge/KnowledgeStats";
import { useKnowledgeHub } from "../../hooks/useKnowledgeHub";
import type { KnowledgeCollection } from "../../types/knowledge";
import type { CreateKnowledgeItemRequest } from "../../types/knowledge";

export function KnowledgeHubPage() {
  const {
    items,
    allItems,
    collections,
    searchQuery,
    setSearchQuery,
    collectionFilter,
    setCollectionFilter,
    sourceTypeFilter,
    setSourceTypeFilter,
    favoritesOnly,
    setFavoritesOnly,
    selectedItem,
    setSelectedItem,
    hasActiveFilters,
    createItem,
    toggleFavorite,
    archiveItem,
    deleteItem,
    clearFilters,
  } = useKnowledgeHub();

  const [createOpen, setCreateOpen] = useState(false);

  const totalArchived = allItems.filter((i) => i.status === "archived").length;
  const totalFavorites = allItems.filter((i) => i.favorite).length;

  function handleCreate(request: CreateKnowledgeItemRequest) {
    createItem(request);
  }

  function handleCollectionClick(id: KnowledgeCollection) {
    if (collectionFilter === id) {
      setCollectionFilter(null);
    } else {
      setCollectionFilter(id);
      setSourceTypeFilter(null);
      setFavoritesOnly(false);
    }
  }

  return (
    <div className="mx-auto max-w-5xl">
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-semibold tracking-tight text-ink">Knowledge Hub</h1>
          <p className="mt-1 text-sm text-muted">
            Manage your enterprise knowledge collections and items.
          </p>
        </div>
        <button
          onClick={() => setCreateOpen(true)}
          className="inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-white transition-colors duration-fast hover:bg-blue-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50"
        >
          <Plus className="h-4 w-4" aria-hidden="true" />
          New Item
        </button>
      </div>

      <div className="mb-6">
        <KnowledgeStats
          totalItems={allItems.filter((i) => i.status === "active").length}
          totalCollections={collections.length}
          totalArchived={totalArchived}
          totalFavorites={totalFavorites}
        />
      </div>

      <div className="mb-6">
        <h2 className="mb-3 text-sm font-semibold text-ink">Collections</h2>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {collections.map((col) => (
            <KnowledgeCollectionCard
              key={col.id}
              collection={col}
              active={collectionFilter === col.id}
              onClick={handleCollectionClick}
            />
          ))}
        </div>
      </div>

      <div className="mb-6 space-y-4">
        <KnowledgeSearch value={searchQuery} onChange={setSearchQuery} />
        <KnowledgeFilters
          collectionFilter={collectionFilter}
          onCollectionChange={setCollectionFilter}
          sourceTypeFilter={sourceTypeFilter}
          onSourceTypeChange={setSourceTypeFilter}
          favoritesOnly={favoritesOnly}
          onFavoritesChange={setFavoritesOnly}
        />
      </div>

      {items.length === 0 ? (
        <KnowledgeEmptyState
          hasFilters={hasActiveFilters}
          onCreate={() => setCreateOpen(true)}
          onClearFilters={clearFilters}
        />
      ) : (
        <KnowledgeGrid
          items={items}
          onSelect={setSelectedItem}
          onToggleFavorite={toggleFavorite}
          onArchive={archiveItem}
          onDelete={deleteItem}
        />
      )}

      <CreateKnowledgeModal open={createOpen} onClose={() => setCreateOpen(false)} onSubmit={handleCreate} />

      {selectedItem && (
        <KnowledgeDetailsDrawer item={selectedItem} onClose={() => setSelectedItem(null)} />
      )}
    </div>
  );
}

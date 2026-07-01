import { Plus } from "lucide-react";
import { useState } from "react";

import { CreatePromptModal } from "../../components/prompt/CreatePromptModal";
import { PromptEditor } from "../../components/prompt/PromptEditor";
import { PromptEmptyState } from "../../components/prompt/PromptEmptyState";
import { PromptFilters } from "../../components/prompt/PromptFilters";
import { PromptGrid } from "../../components/prompt/PromptGrid";
import { PromptSearch } from "../../components/prompt/PromptSearch";
import { usePromptLibrary } from "../../hooks/usePromptLibrary";
import type { CreatePromptRequest, UpdatePromptRequest } from "../../types/prompt";

export function PromptLibraryPage() {
  const {
    prompts,
    searchQuery,
    setSearchQuery,
    categoryFilter,
    setCategoryFilter,
    favoritesOnly,
    setFavoritesOnly,
    createPrompt,
    updatePrompt,
    deletePrompt,
    toggleFavorite,
    duplicatePrompt,
    publishPrompt,
    draftPrompt,
  } = usePromptLibrary();

  const [createOpen, setCreateOpen] = useState(false);
  const [editingPrompt, setEditingPrompt] = useState<{
    open: boolean;
    id: string;
  }>({ open: false, id: "" });

  const hasFilters = searchQuery !== "" || categoryFilter !== null || favoritesOnly;

  function handleEdit(prompt: { id: string }) {
    setEditingPrompt({ open: true, id: prompt.id });
  }

  function handleSubmitEdit(id: string, request: UpdatePromptRequest) {
    updatePrompt(id, request);
  }

  function handleCreate(request: CreatePromptRequest) {
    createPrompt(request);
  }

  function handleClearFilters() {
    setSearchQuery("");
    setCategoryFilter(null);
    setFavoritesOnly(false);
  }

  const editingPromptData = editingPrompt.id
    ? prompts.find((p) => p.id === editingPrompt.id) ?? null
    : null;

  return (
    <div className="mx-auto max-w-5xl">
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-semibold tracking-tight text-ink">Prompt Library</h1>
          <p className="mt-1 text-sm text-muted">
            Manage your AI prompt templates and presets.
          </p>
        </div>
        <button
          onClick={() => setCreateOpen(true)}
          className="inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-white transition-colors duration-fast hover:bg-blue-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50"
        >
          <Plus className="h-4 w-4" aria-hidden="true" />
          New Prompt
        </button>
      </div>

      <div className="mb-6 space-y-4">
        <PromptSearch value={searchQuery} onChange={setSearchQuery} />
        <PromptFilters
          categoryFilter={categoryFilter}
          onCategoryChange={setCategoryFilter}
          favoritesOnly={favoritesOnly}
          onFavoritesChange={setFavoritesOnly}
        />
      </div>

      {prompts.length === 0 ? (
        <PromptEmptyState
          hasFilters={hasFilters}
          onCreate={() => setCreateOpen(true)}
          onClearFilters={handleClearFilters}
        />
      ) : (
        <PromptGrid
          prompts={prompts}
          onEdit={handleEdit}
          onDuplicate={duplicatePrompt}
          onToggleFavorite={toggleFavorite}
          onDelete={deletePrompt}
        />
      )}

      <CreatePromptModal open={createOpen} onClose={() => setCreateOpen(false)} onSubmit={handleCreate} />

      {editingPromptData && (
        <PromptEditor
          key={editingPromptData.id}
          prompt={editingPromptData}
          open={editingPrompt.open}
          onClose={() => setEditingPrompt({ open: false, id: "" })}
          onSubmit={handleSubmitEdit}
          onPublish={publishPrompt}
          onDraft={draftPrompt}
        />
      )}
    </div>
  );
}

import { useCallback, useMemo, useState } from "react";

import type { Prompt, PromptCategory, CreatePromptRequest, UpdatePromptRequest } from "../types/prompt";
import { promptService } from "../services/prompt/PromptService";

export function usePromptLibrary() {
  const [prompts, setPrompts] = useState<Prompt[]>(() => promptService.listPrompts());
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<PromptCategory | null>(null);
  const [favoritesOnly, setFavoritesOnly] = useState(false);
  const [selectedPrompt, setSelectedPrompt] = useState<Prompt | null>(null);

  const filteredPrompts = useMemo(() => {
    let result = prompts;

    if (favoritesOnly) {
      result = result.filter((p) => p.favorite);
    }

    if (categoryFilter) {
      result = result.filter((p) => p.category === categoryFilter);
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          p.content.toLowerCase().includes(q) ||
          p.tags.some((t) => t.toLowerCase().includes(q)),
      );
    }

    return result;
  }, [prompts, searchQuery, categoryFilter, favoritesOnly]);

  const createPrompt = useCallback((request: CreatePromptRequest): Prompt => {
    const created = promptService.createPrompt(request);
    setPrompts((prev) => [created, ...prev]);
    return created;
  }, []);

  const updatePrompt = useCallback((id: string, request: UpdatePromptRequest): Prompt | null => {
    const updated = promptService.updatePrompt(id, request);
    if (updated) {
      setPrompts((prev) => prev.map((p) => (p.id === id ? updated : p)));
    }
    return updated;
  }, []);

  const deletePrompt = useCallback((id: string): boolean => {
    const deleted = promptService.deletePrompt(id);
    if (deleted) {
      setPrompts((prev) => prev.filter((p) => p.id !== id));
      setSelectedPrompt((prev) => (prev?.id === id ? null : prev));
    }
    return deleted;
  }, []);

  const toggleFavorite = useCallback((id: string): Prompt | null => {
    const updated = promptService.favoritePrompt(id);
    if (updated) {
      setPrompts((prev) => prev.map((p) => (p.id === id ? updated : p)));
    }
    return updated;
  }, []);

  const duplicatePrompt = useCallback((id: string): Prompt | null => {
    const created = promptService.duplicatePrompt(id);
    if (created) {
      setPrompts((prev) => [created, ...prev]);
    }
    return created;
  }, []);

  return {
    prompts: filteredPrompts,
    allPrompts: prompts,
    searchQuery,
    setSearchQuery,
    categoryFilter,
    setCategoryFilter,
    favoritesOnly,
    setFavoritesOnly,
    selectedPrompt,
    setSelectedPrompt,
    createPrompt,
    updatePrompt,
    deletePrompt,
    toggleFavorite,
    duplicatePrompt,
  };
}

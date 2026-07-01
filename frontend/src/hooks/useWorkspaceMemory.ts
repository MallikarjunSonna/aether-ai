import { useCallback, useEffect, useMemo, useState } from "react";

import { memoryService } from "../services/memory/MemoryService";
import type { Memory, MemoryFilters } from "../types/memory";

export function useWorkspaceMemory() {
  const [memories, setMemories] = useState<Memory[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState<MemoryFilters>({});
  const [selectedMemory, setSelectedMemory] = useState<Memory | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    memoryService
      .list()
      .then(setMemories)
      .finally(() => setLoading(false));
  }, []);

  const filteredMemories = useMemo(() => {
    let result = memories;

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(
        (m) =>
          m.title.toLowerCase().includes(q) ||
          m.summary.toLowerCase().includes(q) ||
          m.tags.some((t) => t.toLowerCase().includes(q)),
      );
    }

    if (filters.provider) {
      result = result.filter((m) => m.provider === filters.provider);
    }
    if (filters.model) {
      result = result.filter((m) => m.model === filters.model);
    }
    if (filters.tags && filters.tags.length > 0) {
      result = result.filter((m) => filters.tags!.some((t) => m.tags.includes(t)));
    }
    if (filters.favoritesOnly) {
      result = result.filter((m) => m.favorite);
    }
    if (filters.dateFrom) {
      result = result.filter((m) => m.createdAt >= filters.dateFrom!);
    }
    if (filters.dateTo) {
      result = result.filter((m) => m.createdAt <= filters.dateTo!);
    }
    if (filters.status) {
      result = result.filter((m) => m.status === filters.status);
    }

    return result;
  }, [memories, searchQuery, filters]);

  const stats = useMemo(
    () => ({
      total: filteredMemories.length,
      totalTokens: filteredMemories.reduce((acc, m) => acc + m.tokenUsage.totalTokens, 0),
      providers: [...new Set(filteredMemories.map((m) => m.provider))],
      archivedCount: memories.filter((m) => m.status === "archived").length,
    }),
    [filteredMemories, memories],
  );

  const setFilter = useCallback(<K extends keyof MemoryFilters>(key: K, value: MemoryFilters[K]) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  }, []);

  const clearFilters = useCallback(() => {
    setFilters({});
    setSearchQuery("");
  }, []);

  const toggleFavorite = useCallback(async (id: string) => {
    const updated = await memoryService.toggleFavorite(id);
    setMemories((prev) => prev.map((m) => (m.id === id ? updated : m)));
    setSelectedMemory((prev) => (prev?.id === id ? updated : prev));
  }, []);

  const archiveMemory = useCallback(async (id: string) => {
    const updated = await memoryService.archive(id);
    setMemories((prev) => prev.map((m) => (m.id === id ? updated : m)));
    setSelectedMemory((prev) => (prev?.id === id ? updated : prev));
  }, []);

  const deleteMemory = useCallback(async (id: string) => {
    await memoryService.delete(id);
    setMemories((prev) => prev.filter((m) => m.id !== id));
    setSelectedMemory((prev) => (prev?.id === id ? null : prev));
  }, []);

  const hasActiveFilters =
    searchQuery !== "" ||
    filters.provider !== undefined ||
    filters.model !== undefined ||
    (filters.tags !== undefined && filters.tags.length > 0) ||
    filters.favoritesOnly === true ||
    filters.dateFrom !== undefined ||
    filters.dateTo !== undefined ||
    filters.status !== undefined;

  return {
    memories: filteredMemories,
    allMemories: memories,
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
  };
}

import { useCallback, useMemo, useState } from "react";

import type {
  CollectionInfo,
  CreateKnowledgeItemRequest,
  KnowledgeCollection,
  KnowledgeItem,
  SourceType,
} from "../types/knowledge";
import { knowledgeService } from "../services/knowledge/KnowledgeService";

export function useKnowledgeHub() {
  const [items, setItems] = useState<KnowledgeItem[]>(() => knowledgeService.list());
  const [searchQuery, setSearchQuery] = useState("");
  const [collectionFilter, setCollectionFilter] = useState<KnowledgeCollection | null>(null);
  const [sourceTypeFilter, setSourceTypeFilter] = useState<SourceType | null>(null);
  const [favoritesOnly, setFavoritesOnly] = useState(false);
  const [selectedItem, setSelectedItem] = useState<KnowledgeItem | null>(null);

  const filteredItems = useMemo(() => {
    let result = items;

    if (favoritesOnly) {
      result = result.filter((i) => i.favorite);
    }

    if (collectionFilter) {
      result = result.filter((i) => i.collection === collectionFilter);
    }

    if (sourceTypeFilter) {
      result = result.filter((i) => i.sourceType === sourceTypeFilter);
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (i) =>
          i.title.toLowerCase().includes(q) ||
          i.description.toLowerCase().includes(q) ||
          i.tags.some((t) => t.toLowerCase().includes(q)) ||
          i.sourceName.toLowerCase().includes(q),
      );
    }

    return result;
  }, [items, searchQuery, collectionFilter, sourceTypeFilter, favoritesOnly]);

  const collections: CollectionInfo[] = useMemo(() => {
    return knowledgeService.getCollections();
  }, []);

  const hasActiveFilters = searchQuery !== "" || collectionFilter !== null || sourceTypeFilter !== null || favoritesOnly;

  const createItem = useCallback((request: CreateKnowledgeItemRequest): KnowledgeItem => {
    const created = knowledgeService.create(request);
    setItems((prev) => [created, ...prev]);
    return created;
  }, []);

  const toggleFavorite = useCallback((id: string): KnowledgeItem | null => {
    const updated = knowledgeService.toggleFavorite(id);
    if (updated) {
      setItems((prev) => prev.map((i) => (i.id === id ? updated : i)));
      setSelectedItem((prev) => (prev?.id === id ? updated : prev));
    }
    return updated;
  }, []);

  const archiveItem = useCallback((id: string): KnowledgeItem | null => {
    const updated = knowledgeService.archive(id);
    if (updated) {
      setItems((prev) => prev.map((i) => (i.id === id ? updated : i)));
      setSelectedItem((prev) => (prev?.id === id ? updated : prev));
    }
    return updated;
  }, []);

  const deleteItem = useCallback((id: string): boolean => {
    const deleted = knowledgeService.delete(id);
    if (deleted) {
      setItems((prev) => prev.filter((i) => i.id !== id));
      setSelectedItem((prev) => (prev?.id === id ? null : prev));
    }
    return deleted;
  }, []);

  const clearFilters = useCallback(() => {
    setSearchQuery("");
    setCollectionFilter(null);
    setSourceTypeFilter(null);
    setFavoritesOnly(false);
  }, []);

  return {
    items: filteredItems,
    allItems: items,
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
  };
}

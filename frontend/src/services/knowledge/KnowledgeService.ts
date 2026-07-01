import type {
  CollectionInfo,
  CreateKnowledgeItemRequest,
  KnowledgeCollection,
  KnowledgeItem,
  SourceType,
} from "../../types/knowledge";
import { buildCollections, mockKnowledgeItems } from "../../mocks/knowledge";

class KnowledgeService {
  private items: KnowledgeItem[] = [...mockKnowledgeItems];

  list(): KnowledgeItem[] {
    return [...this.items];
  }

  create(request: CreateKnowledgeItemRequest): KnowledgeItem {
    const now = new Date().toISOString();
    const item: KnowledgeItem = {
      id: `knowledge-${Date.now()}`,
      title: request.title,
      description: request.description,
      collection: request.collection,
      sourceType: request.sourceType,
      sourceName: request.sourceName,
      organizationId: "org-1",
      workspaceId: "ws-1",
      owner: "Current User",
      status: "active",
      tags: request.tags,
      language: request.language,
      version: 1,
      createdAt: now,
      updatedAt: now,
      size: 0,
      documentCount: 0,
      favorite: false,
      embeddingStatus: "not_configured",
      lastIndexedAt: null,
      chunkCount: 0,
      vectorStore: null,
    };
    this.items.unshift(item);
    return item;
  }

  delete(id: string): boolean {
    const index = this.items.findIndex((i) => i.id === id);
    if (index === -1) return false;
    this.items.splice(index, 1);
    return true;
  }

  toggleFavorite(id: string): KnowledgeItem | null {
    const index = this.items.findIndex((i) => i.id === id);
    if (index === -1) return null;
    this.items[index] = {
      ...this.items[index],
      favorite: !this.items[index].favorite,
    };
    return this.items[index];
  }

  archive(id: string): KnowledgeItem | null {
    const index = this.items.findIndex((i) => i.id === id);
    if (index === -1) return null;
    this.items[index] = {
      ...this.items[index],
      status: this.items[index].status === "archived" ? "active" : "archived",
    };
    return this.items[index];
  }

  search(query: string): KnowledgeItem[] {
    const q = query.toLowerCase();
    return this.items.filter(
      (i) =>
        i.title.toLowerCase().includes(q) ||
        i.description.toLowerCase().includes(q) ||
        i.tags.some((t) => t.toLowerCase().includes(q)) ||
        i.sourceName.toLowerCase().includes(q),
    );
  }

  filter(options: {
    collection?: KnowledgeCollection | null;
    sourceType?: SourceType | null;
    favoritesOnly?: boolean;
  }): KnowledgeItem[] {
    let result = [...this.items];
    if (options.collection) {
      result = result.filter((i) => i.collection === options.collection);
    }
    if (options.sourceType) {
      result = result.filter((i) => i.sourceType === options.sourceType);
    }
    if (options.favoritesOnly) {
      result = result.filter((i) => i.favorite);
    }
    return result;
  }

  getCollections(): CollectionInfo[] {
    return buildCollections();
  }
}

export const knowledgeService = new KnowledgeService();

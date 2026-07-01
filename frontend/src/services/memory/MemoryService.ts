import { mockMemories } from "../../mocks/memory";
import type { Memory, MemoryFilters, MemoryStatus } from "../../types/memory";

class MemoryService {
  private memories: Memory[] = [...mockMemories];

  async list(): Promise<Memory[]> {
    return [...this.memories];
  }

  async search(query: string): Promise<Memory[]> {
    const q = query.toLowerCase().trim();
    if (!q) return [...this.memories];
    return this.memories.filter(
      (m) =>
        m.title.toLowerCase().includes(q) ||
        m.summary.toLowerCase().includes(q) ||
        m.tags.some((t) => t.toLowerCase().includes(q)),
    );
  }

  async filter(filters: MemoryFilters): Promise<Memory[]> {
    let result = [...this.memories];

    if (filters.provider) {
      result = result.filter((m) => m.provider === filters.provider);
    }
    if (filters.model) {
      result = result.filter((m) => m.model === filters.model);
    }
    if (filters.tags && filters.tags.length > 0) {
      result = result.filter((m) =>
        filters.tags!.some((t) => m.tags.includes(t)),
      );
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
  }

  async toggleFavorite(id: string): Promise<Memory> {
    const idx = this.memories.findIndex((m) => m.id === id);
    if (idx === -1) throw new Error(`Memory not found: ${id}`);
    this.memories[idx] = {
      ...this.memories[idx],
      favorite: !this.memories[idx].favorite,
    };
    return this.memories[idx];
  }

  async archive(id: string): Promise<Memory> {
    return this.setStatus(id, "archived");
  }

  async delete(id: string): Promise<void> {
    const idx = this.memories.findIndex((m) => m.id === id);
    if (idx === -1) throw new Error(`Memory not found: ${id}`);
    this.memories.splice(idx, 1);
  }

  private async setStatus(id: string, status: MemoryStatus): Promise<Memory> {
    const idx = this.memories.findIndex((m) => m.id === id);
    if (idx === -1) throw new Error(`Memory not found: ${id}`);
    this.memories[idx] = { ...this.memories[idx], status };
    return this.memories[idx];
  }
}

export const memoryService = new MemoryService();

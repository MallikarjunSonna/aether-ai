import type { ProviderType, TokenUsage } from "./ai";

export type MemoryStatus = "active" | "archived";

export interface Memory {
  id: string;
  title: string;
  summary: string;
  conversationId: string;
  organizationId: string;
  workspaceId: string;
  provider: ProviderType;
  model: string;
  promptId?: string;
  promptTitle?: string;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  messageCount: number;
  tokenUsage: TokenUsage;
  favorite: boolean;
  tags: string[];
  status: MemoryStatus;
}

export interface MemoryFilters {
  provider?: ProviderType | null;
  model?: string | null;
  tags?: string[];
  favoritesOnly?: boolean;
  dateFrom?: string | null;
  dateTo?: string | null;
  status?: MemoryStatus;
}

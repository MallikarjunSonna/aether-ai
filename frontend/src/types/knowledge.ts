export type KnowledgeCollection =
  | "engineering"
  | "product"
  | "hr"
  | "legal"
  | "marketing"
  | "customer-support"
  | "security"
  | "operations";

export type SourceType =
  | "pdf"
  | "markdown"
  | "docx"
  | "website"
  | "github"
  | "notion"
  | "confluence"
  | "google-drive"
  | "sharepoint"
  | "csv";

export type EmbeddingStatus = "pending" | "indexed" | "failed" | "not_configured";

export interface KnowledgeItem {
  id: string;
  title: string;
  description: string;
  collection: KnowledgeCollection;
  sourceType: SourceType;
  sourceName: string;
  organizationId: string;
  workspaceId: string;
  owner: string;
  status: "active" | "archived";
  tags: string[];
  language: string;
  version: number;
  createdAt: string;
  updatedAt: string;
  size: number;
  documentCount: number;
  favorite: boolean;
  embeddingStatus: EmbeddingStatus;
  lastIndexedAt: string | null;
  chunkCount: number;
  vectorStore: string | null;
}

export interface CreateKnowledgeItemRequest {
  title: string;
  description: string;
  collection: KnowledgeCollection;
  sourceType: SourceType;
  sourceName: string;
  tags: string[];
  language: string;
}

export interface CollectionInfo {
  id: KnowledgeCollection;
  name: string;
  description: string;
  icon: string;
  itemCount: number;
}

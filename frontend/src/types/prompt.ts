export type PromptCategory =
  | "code-review"
  | "bug-explainer"
  | "sql-generator"
  | "blog-writer"
  | "meeting-summary"
  | "api-documentation"
  | "customer-support"
  | "release-notes";

export type PromptVisibility = "private" | "workspace" | "organization" | "public";

export type PromptTemplateStatus = "draft" | "published";

export interface PromptVersion {
  id: string;
  promptId: string;
  version: number;
  content: string;
  variables: string[];
  changelog: string;
  createdBy: string;
  createdAt: string;
}

export interface CreateVersionRequest {
  content: string;
  changelog: string;
}

export interface PromptTemplateValidation {
  valid: boolean;
  errors: string[];
  warnings: string[];
  variableCount: number;
  missingVariables: string[];
}

export interface RagCompatibility {
  enabled: boolean;
  maxContextLength: number;
  supportedEmbeddingModels: string[];
  chunkSize: number;
  chunkOverlap: number;
}

export interface Prompt {
  id: string;
  title: string;
  slug: string;
  description: string;
  content: string;
  category: PromptCategory;
  tags: string[];
  variables: string[];
  version: number;
  status: PromptTemplateStatus;
  favorite: boolean;
  visibility: PromptVisibility;
  organizationId: string;
  workspaceId: string;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  versionHistory: PromptVersion[];
}

export interface CreatePromptRequest {
  title: string;
  description: string;
  content: string;
  category: PromptCategory;
  tags: string[];
  visibility: PromptVisibility;
}

export interface UpdatePromptRequest {
  title: string;
  description: string;
  content: string;
  category: PromptCategory;
  tags: string[];
  visibility: PromptVisibility;
}

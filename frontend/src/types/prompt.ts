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
  favorite: boolean;
  visibility: PromptVisibility;
  organizationId: string;
  workspaceId: string;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
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

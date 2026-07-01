import type {
  Prompt,
  PromptCategory,
  PromptVersion,
  PromptTemplateValidation,
  CreatePromptRequest,
  UpdatePromptRequest,
  CreateVersionRequest,
} from "../../types/prompt";
import { mockPrompts } from "../../mocks/prompts";

function extractVariables(content: string): string[] {
  const regex = /\{\{(\w+)\}\}/g;
  const matches = new Set<string>();
  let match: RegExpExecArray | null;
  while ((match = regex.exec(content)) !== null) {
    matches.add(match[1]);
  }
  return Array.from(matches);
}

function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

class PromptService {
  private prompts: Prompt[] = [...mockPrompts];

  listPrompts(): Prompt[] {
    return [...this.prompts];
  }

  createPrompt(request: CreatePromptRequest): Prompt {
    const now = new Date().toISOString();
    const variables = extractVariables(request.content);
    const versionEntry: PromptVersion = {
      id: `pv-${Date.now()}`,
      promptId: `prompt-${Date.now()}`,
      version: 1,
      content: request.content,
      variables,
      changelog: "Initial version",
      createdBy: "Current User",
      createdAt: now,
    };
    const prompt: Prompt = {
      id: `prompt-${Date.now()}`,
      title: request.title,
      slug: generateSlug(request.title),
      description: request.description,
      content: request.content,
      category: request.category,
      tags: request.tags,
      variables,
      version: 1,
      status: "draft",
      favorite: false,
      visibility: request.visibility,
      organizationId: "org-1",
      workspaceId: "ws-1",
      createdBy: "Current User",
      createdAt: now,
      updatedAt: now,
      versionHistory: [versionEntry],
    };
    this.prompts.unshift(prompt);
    return prompt;
  }

  updatePrompt(id: string, request: UpdatePromptRequest): Prompt | null {
    const index = this.prompts.findIndex((p) => p.id === id);
    if (index === -1) return null;

    const existing = this.prompts[index];
    const variables = extractVariables(request.content);
    const now = new Date().toISOString();
    const contentChanged = existing.content !== request.content;
    const newVersion = contentChanged ? existing.version + 1 : existing.version;

    const versionEntry: PromptVersion | null = contentChanged
      ? {
          id: `pv-${Date.now()}`,
          promptId: id,
          version: newVersion,
          content: request.content,
          variables,
          changelog: `Updated via editor`,
          createdBy: "Current User",
          createdAt: now,
        }
      : null;

    const updated: Prompt = {
      ...existing,
      title: request.title,
      slug: generateSlug(request.title),
      description: request.description,
      content: request.content,
      category: request.category,
      tags: request.tags,
      variables,
      version: newVersion,
      visibility: request.visibility,
      updatedAt: now,
      versionHistory: versionEntry
        ? [...existing.versionHistory, versionEntry]
        : existing.versionHistory,
    };
    this.prompts[index] = updated;
    return updated;
  }

  createVersion(id: string, request: CreateVersionRequest): Prompt | null {
    const index = this.prompts.findIndex((p) => p.id === id);
    if (index === -1) return null;

    const prompt = this.prompts[index];
    const variables = extractVariables(request.content);
    const now = new Date().toISOString();
    const versionEntry: PromptVersion = {
      id: `pv-${Date.now()}`,
      promptId: id,
      version: prompt.version + 1,
      content: request.content,
      variables,
      changelog: request.changelog,
      createdBy: "Current User",
      createdAt: now,
    };

    const updated: Prompt = {
      ...prompt,
      content: request.content,
      variables,
      version: prompt.version + 1,
      updatedAt: now,
      versionHistory: [...prompt.versionHistory, versionEntry],
    };
    this.prompts[index] = updated;
    return updated;
  }

  publishPrompt(id: string): Prompt | null {
    const index = this.prompts.findIndex((p) => p.id === id);
    if (index === -1) return null;
    const updated = {
      ...this.prompts[index],
      status: "published" as const,
      updatedAt: new Date().toISOString(),
    };
    this.prompts[index] = updated;
    return updated;
  }

  draftPrompt(id: string): Prompt | null {
    const index = this.prompts.findIndex((p) => p.id === id);
    if (index === -1) return null;
    const updated = {
      ...this.prompts[index],
      status: "draft" as const,
      updatedAt: new Date().toISOString(),
    };
    this.prompts[index] = updated;
    return updated;
  }

  validateTemplate(content: string): PromptTemplateValidation {
    const variables = extractVariables(content);
    const errors: string[] = [];
    const warnings: string[] = [];

    if (content.trim().length === 0) {
      errors.push("Template content is empty.");
    }
    if (content.length > 10000) {
      warnings.push("Template content exceeds 10,000 characters. Consider splitting into smaller templates.");
    }
    if (variables.length === 0 && content.trim().length > 0) {
      warnings.push("No template variables found. Add {{variable}} placeholders for dynamic content.");
    }

    return {
      valid: errors.length === 0,
      errors,
      warnings,
      variableCount: variables.length,
      missingVariables: [],
    };
  }

  previewTemplate(content: string, values: Record<string, string>): string {
    let result = content;
    for (const [key, value] of Object.entries(values)) {
      result = result.replace(new RegExp(`\\{\\{${key}\\}\\}`, "g"), () => value);
    }
    return result;
  }

  getVersionHistory(id: string): PromptVersion[] {
    const prompt = this.prompts.find((p) => p.id === id);
    return prompt?.versionHistory ?? [];
  }

  deletePrompt(id: string): boolean {
    const index = this.prompts.findIndex((p) => p.id === id);
    if (index === -1) return false;
    this.prompts.splice(index, 1);
    return true;
  }

  favoritePrompt(id: string): Prompt | null {
    const index = this.prompts.findIndex((p) => p.id === id);
    if (index === -1) return null;
    this.prompts[index] = {
      ...this.prompts[index],
      favorite: !this.prompts[index].favorite,
    };
    return this.prompts[index];
  }

  searchPrompts(query: string): Prompt[] {
    const q = query.toLowerCase();
    return this.prompts.filter(
      (p) =>
        p.title.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.content.toLowerCase().includes(q) ||
        p.tags.some((t) => t.toLowerCase().includes(q)),
    );
  }

  filterPrompts(options: {
    category?: PromptCategory | null;
    favorites?: boolean;
  }): Prompt[] {
    let result = [...this.prompts];
    if (options.category) {
      result = result.filter((p) => p.category === options.category);
    }
    if (options.favorites) {
      result = result.filter((p) => p.favorite);
    }
    return result;
  }

  duplicatePrompt(id: string): Prompt | null {
    const original = this.prompts.find((p) => p.id === id);
    if (!original) return null;

    const now = new Date().toISOString();
    const prompt: Prompt = {
      ...original,
      id: `prompt-${Date.now()}`,
      title: `${original.title} (Copy)`,
      slug: generateSlug(`${original.title} (Copy)`),
      favorite: false,
      version: 1,
      status: "draft",
      createdAt: now,
      updatedAt: now,
      versionHistory: [],
    };
    this.prompts.unshift(prompt);
    return prompt;
  }
}

export const promptService = new PromptService();
export { extractVariables };

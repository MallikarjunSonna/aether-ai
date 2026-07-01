import type { Prompt, PromptCategory, CreatePromptRequest, UpdatePromptRequest } from "../../types/prompt";
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
    const prompt: Prompt = {
      id: `prompt-${Date.now()}`,
      title: request.title,
      slug: generateSlug(request.title),
      description: request.description,
      content: request.content,
      category: request.category,
      tags: request.tags,
      variables: extractVariables(request.content),
      version: 1,
      favorite: false,
      visibility: request.visibility,
      organizationId: "org-1",
      workspaceId: "ws-1",
      createdBy: "Current User",
      createdAt: now,
      updatedAt: now,
    };
    this.prompts.unshift(prompt);
    return prompt;
  }

  updatePrompt(id: string, request: UpdatePromptRequest): Prompt | null {
    const index = this.prompts.findIndex((p) => p.id === id);
    if (index === -1) return null;

    const existing = this.prompts[index];
    const updated: Prompt = {
      ...existing,
      title: request.title,
      slug: generateSlug(request.title),
      description: request.description,
      content: request.content,
      category: request.category,
      tags: request.tags,
      variables: extractVariables(request.content),
      visibility: request.visibility,
      updatedAt: new Date().toISOString(),
    };
    this.prompts[index] = updated;
    return updated;
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
      createdAt: now,
      updatedAt: now,
    };
    this.prompts.unshift(prompt);
    return prompt;
  }
}

export const promptService = new PromptService();
export { extractVariables };

import { FileText, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";

import type { PromptCategory, PromptVisibility, CreatePromptRequest } from "../../types/prompt";

const categoryOptions: { value: PromptCategory; label: string }[] = [
  { value: "code-review", label: "Code Review" },
  { value: "bug-explainer", label: "Bug Explainer" },
  { value: "sql-generator", label: "SQL Generator" },
  { value: "blog-writer", label: "Blog Writer" },
  { value: "meeting-summary", label: "Meeting Summary" },
  { value: "api-documentation", label: "API Documentation" },
  { value: "customer-support", label: "Customer Support" },
  { value: "release-notes", label: "Release Notes" },
];

const visibilityOptions: { value: PromptVisibility; label: string }[] = [
  { value: "private", label: "Private" },
  { value: "workspace", label: "Workspace" },
  { value: "organization", label: "Organization" },
  { value: "public", label: "Public" },
];

interface CreatePromptModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (request: CreatePromptRequest) => void;
}

interface FormErrors {
  title?: string;
  content?: string;
}

export function CreatePromptModal({ open, onClose, onSubmit }: CreatePromptModalProps) {
  const overlayRef = useRef<HTMLDivElement>(null);
  const firstFieldRef = useRef<HTMLInputElement>(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState<PromptCategory>("code-review");
  const [tagsInput, setTagsInput] = useState("");
  const [visibility, setVisibility] = useState<PromptVisibility>("workspace");
  const [errors, setErrors] = useState<FormErrors>({});

  useEffect(() => {
    if (open) {
      firstFieldRef.current?.focus();
    }
  }, [open]);

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") onClose();
    }
    if (open) {
      document.addEventListener("keydown", handleKeyDown);
      return () => document.removeEventListener("keydown", handleKeyDown);
    }
  }, [open, onClose]);

  function validate(): boolean {
    const next: FormErrors = {};
    if (!title.trim()) next.title = "Title is required.";
    if (!content.trim()) next.content = "Prompt content is required.";
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (!validate()) return;

    const tags = tagsInput
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);

    onSubmit({
      title: title.trim(),
      description: description.trim(),
      content: content.trim(),
      category,
      tags,
      visibility,
    });

    setTitle("");
    setDescription("");
    setContent("");
    setCategory("code-review");
    setTagsInput("");
    setVisibility("workspace");
    setErrors({});
    onClose();
  }

  if (!open) return null;

  return (
    <div
      ref={overlayRef}
      role="dialog"
      aria-modal="true"
      aria-label="Create prompt"
      className="fixed inset-0 z-modal flex items-center justify-center bg-black/60 p-4"
      onClick={(e) => {
        if (e.target === overlayRef.current) onClose();
      }}
    >
      <div className="w-full max-w-2xl rounded-xl border border-line bg-surface shadow-lg max-h-[90vh] flex flex-col">
        <div className="flex items-center justify-between border-b border-line/60 px-6 py-4 shrink-0">
          <div className="flex items-center gap-3">
            <span className="flex h-9 w-9 items-center justify-center rounded-lg border border-primary/20 bg-primary/10 text-primary">
              <FileText className="h-5 w-5" aria-hidden="true" />
            </span>
            <h2 className="text-base font-semibold text-ink">Create Prompt</h2>
          </div>
          <button
            onClick={onClose}
            aria-label="Close modal"
            className="flex h-8 w-8 items-center justify-center rounded text-muted transition-colors duration-fast hover:bg-neutral-800 hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50"
          >
            <X className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5 px-6 py-5 overflow-y-auto flex-1">
          <div>
            <label htmlFor="prompt-title" className="block text-sm font-medium text-ink">
              Title <span className="text-error">*</span>
            </label>
            <input
              ref={firstFieldRef}
              id="prompt-title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              aria-invalid={!!errors.title}
              aria-describedby={errors.title ? "prompt-title-error" : undefined}
              placeholder="Code Review Assistant"
              className="mt-1.5 block h-10 w-full rounded-md border border-line bg-canvas px-3 text-sm text-ink placeholder:text-muted transition-colors duration-fast focus:border-primary/50 focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
            {errors.title && (
              <p id="prompt-title-error" className="mt-1.5 text-xs text-error">
                {errors.title}
              </p>
            )}
          </div>

          <div>
            <label htmlFor="prompt-description" className="block text-sm font-medium text-ink">
              Description
            </label>
            <input
              id="prompt-description"
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Analyzes pull request diffs for code quality and security issues."
              className="mt-1.5 block h-10 w-full rounded-md border border-line bg-canvas px-3 text-sm text-ink placeholder:text-muted transition-colors duration-fast focus:border-primary/50 focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
          </div>

          <div>
            <label htmlFor="prompt-content" className="block text-sm font-medium text-ink">
              Prompt Content <span className="text-error">*</span>
            </label>
            <textarea
              id="prompt-content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              aria-invalid={!!errors.content}
              aria-describedby={errors.content ? "prompt-content-error" : undefined}
              placeholder="You are a senior engineer reviewing code for {{company}}..."
              rows={8}
              className="mt-1.5 block w-full rounded-md border border-line bg-canvas px-3 py-2 text-sm text-ink placeholder:text-muted transition-colors duration-fast focus:border-primary/50 focus:outline-none focus:ring-2 focus:ring-primary/20 font-mono resize-none"
            />
            {errors.content && (
              <p id="prompt-content-error" className="mt-1.5 text-xs text-error">
                {errors.content}
              </p>
            )}
            <p className="mt-1 text-xs text-muted">
              Use {"{{variable}}"} syntax for template variables. Variables are detected automatically.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="prompt-category" className="block text-sm font-medium text-ink">
                Category
              </label>
              <select
                id="prompt-category"
                value={category}
                onChange={(e) => setCategory(e.target.value as PromptCategory)}
                className="mt-1.5 block h-10 w-full rounded-md border border-line bg-canvas px-3 text-sm text-ink transition-colors duration-fast focus:border-primary/50 focus:outline-none focus:ring-2 focus:ring-primary/20"
              >
                {categoryOptions.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="prompt-visibility" className="block text-sm font-medium text-ink">
                Visibility
              </label>
              <select
                id="prompt-visibility"
                value={visibility}
                onChange={(e) => setVisibility(e.target.value as PromptVisibility)}
                className="mt-1.5 block h-10 w-full rounded-md border border-line bg-canvas px-3 text-sm text-ink transition-colors duration-fast focus:border-primary/50 focus:outline-none focus:ring-2 focus:ring-primary/20"
              >
                {visibilityOptions.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label htmlFor="prompt-tags" className="block text-sm font-medium text-ink">
              Tags
            </label>
            <input
              id="prompt-tags"
              type="text"
              value={tagsInput}
              onChange={(e) => setTagsInput(e.target.value)}
              placeholder="code-review, security, best-practices"
              className="mt-1.5 block h-10 w-full rounded-md border border-line bg-canvas px-3 text-sm text-ink placeholder:text-muted transition-colors duration-fast focus:border-primary/50 focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
            <p className="mt-1 text-xs text-muted">Comma-separated list of tags.</p>
          </div>

          <div className="flex items-center justify-end gap-3 border-t border-line/60 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="rounded-md border border-line bg-surface px-4 py-2 text-sm font-medium text-ink transition-colors duration-fast hover:bg-neutral-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="rounded-md bg-primary px-5 py-2 text-sm font-medium text-white transition-colors duration-fast hover:bg-blue-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50"
            >
              Create
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

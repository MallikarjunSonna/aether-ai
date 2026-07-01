import { X } from "lucide-react";
import { useEffect, useRef, useState } from "react";

import type { CreateKnowledgeItemRequest, KnowledgeCollection, SourceType } from "../../types/knowledge";

const collectionOptions: { value: KnowledgeCollection; label: string }[] = [
  { value: "engineering", label: "Engineering" },
  { value: "product", label: "Product" },
  { value: "hr", label: "HR" },
  { value: "legal", label: "Legal" },
  { value: "marketing", label: "Marketing" },
  { value: "customer-support", label: "Customer Support" },
  { value: "security", label: "Security" },
  { value: "operations", label: "Operations" },
];

const sourceTypeOptions: { value: SourceType; label: string }[] = [
  { value: "pdf", label: "PDF" },
  { value: "markdown", label: "Markdown" },
  { value: "docx", label: "DOCX" },
  { value: "website", label: "Website" },
  { value: "github", label: "GitHub" },
  { value: "notion", label: "Notion" },
  { value: "confluence", label: "Confluence" },
  { value: "google-drive", label: "Google Drive" },
  { value: "sharepoint", label: "SharePoint" },
  { value: "csv", label: "CSV" },
];

interface CreateKnowledgeModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (request: CreateKnowledgeItemRequest) => void;
}

export function CreateKnowledgeModal({ open, onClose, onSubmit }: CreateKnowledgeModalProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [collection, setCollection] = useState<KnowledgeCollection>("engineering");
  const [sourceType, setSourceType] = useState<SourceType>("markdown");
  const [sourceName, setSourceName] = useState("");
  const [tagsInput, setTagsInput] = useState("");
  const [language, setLanguage] = useState("en");
  const [submitting, setSubmitting] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open && inputRef.current) {
      inputRef.current.focus();
    }
  }, [open]);

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape" && open) onClose();
    }
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [open, onClose]);

  if (!open) return null;

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim()) return;

    setSubmitting(true);

    const tags = tagsInput
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);

    onSubmit({
      title: title.trim(),
      description: description.trim(),
      collection,
      sourceType,
      sourceName: sourceName.trim() || sourceTypeOptions.find((o) => o.value === sourceType)?.label || "",
      tags,
      language,
    });

    setTitle("");
    setDescription("");
    setCollection("engineering");
    setSourceType("markdown");
    setSourceName("");
    setTagsInput("");
    setLanguage("en");
    setSubmitting(false);
    onClose();
  }

  return (
    <>
      <div
        className="fixed inset-0 z-overlay bg-black/40"
        aria-hidden="true"
        onClick={onClose}
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Create knowledge item"
        className="fixed left-1/2 top-1/2 z-modal w-full max-w-lg -translate-x-1/2 -translate-y-1/2 rounded-xl border border-line bg-canvas shadow-xl"
      >
        <div className="flex items-center justify-between border-b border-line px-6 py-4">
          <h2 className="text-lg font-semibold text-ink">Create Knowledge Item</h2>
          <button
            onClick={onClose}
            aria-label="Close"
            className="flex h-8 w-8 items-center justify-center rounded-md text-muted transition-colors duration-fast hover:bg-neutral-800 hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50"
          >
            <X className="h-5 w-5" aria-hidden="true" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          <div>
            <label htmlFor="knowledge-title" className="block text-sm font-medium text-ink mb-1.5">
              Title
            </label>
            <input
              ref={inputRef}
              id="knowledge-title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              placeholder="Enter a descriptive title"
              className="h-10 w-full rounded-md border border-line bg-surface px-3 text-sm text-ink placeholder:text-muted transition-colors duration-fast focus:border-primary/50 focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
          </div>

          <div>
            <label htmlFor="knowledge-description" className="block text-sm font-medium text-ink mb-1.5">
              Description
            </label>
            <textarea
              id="knowledge-description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              placeholder="Brief description of the knowledge item"
              className="w-full rounded-md border border-line bg-surface px-3 py-2 text-sm text-ink placeholder:text-muted transition-colors duration-fast focus:border-primary/50 focus:outline-none focus:ring-2 focus:ring-primary/20 resize-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="knowledge-collection" className="block text-sm font-medium text-ink mb-1.5">
                Collection
              </label>
              <select
                id="knowledge-collection"
                value={collection}
                onChange={(e) => setCollection(e.target.value as KnowledgeCollection)}
                className="h-10 w-full rounded-md border border-line bg-surface px-3 text-sm text-ink transition-colors duration-fast focus:border-primary/50 focus:outline-none focus:ring-2 focus:ring-primary/20"
              >
                {collectionOptions.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="knowledge-source-type" className="block text-sm font-medium text-ink mb-1.5">
                Source Type
              </label>
              <select
                id="knowledge-source-type"
                value={sourceType}
                onChange={(e) => setSourceType(e.target.value as SourceType)}
                className="h-10 w-full rounded-md border border-line bg-surface px-3 text-sm text-ink transition-colors duration-fast focus:border-primary/50 focus:outline-none focus:ring-2 focus:ring-primary/20"
              >
                {sourceTypeOptions.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label htmlFor="knowledge-source-name" className="block text-sm font-medium text-ink mb-1.5">
              Source Name
            </label>
            <input
              id="knowledge-source-name"
              type="text"
              value={sourceName}
              onChange={(e) => setSourceName(e.target.value)}
              placeholder="e.g. Confluence, GitHub Wiki"
              className="h-10 w-full rounded-md border border-line bg-surface px-3 text-sm text-ink placeholder:text-muted transition-colors duration-fast focus:border-primary/50 focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="knowledge-tags" className="block text-sm font-medium text-ink mb-1.5">
                Tags (comma-separated)
              </label>
              <input
                id="knowledge-tags"
                type="text"
                value={tagsInput}
                onChange={(e) => setTagsInput(e.target.value)}
                placeholder="e.g. architecture, backend"
                className="h-10 w-full rounded-md border border-line bg-surface px-3 text-sm text-ink placeholder:text-muted transition-colors duration-fast focus:border-primary/50 focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
            </div>

            <div>
              <label htmlFor="knowledge-language" className="block text-sm font-medium text-ink mb-1.5">
                Language
              </label>
              <select
                id="knowledge-language"
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="h-10 w-full rounded-md border border-line bg-surface px-3 text-sm text-ink transition-colors duration-fast focus:border-primary/50 focus:outline-none focus:ring-2 focus:ring-primary/20"
              >
                <option value="en">English</option>
                <option value="es">Spanish</option>
                <option value="fr">French</option>
                <option value="de">German</option>
                <option value="ja">Japanese</option>
                <option value="zh">Chinese</option>
              </select>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded-md px-4 py-2 text-sm font-medium text-muted transition-colors duration-fast hover:bg-neutral-800 hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!title.trim() || submitting}
              className="rounded-md bg-primary px-5 py-2 text-sm font-medium text-white transition-colors duration-fast hover:bg-blue-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {submitting ? "Creating..." : "Create"}
            </button>
          </div>
        </form>
      </div>
    </>
  );
}

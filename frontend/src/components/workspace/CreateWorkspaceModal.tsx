import { Layers, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";

import { mockOrganizations } from "../../mocks/organizations";

interface CreateWorkspaceModalProps {
  open: boolean;
  onClose: () => void;
}

interface FormErrors {
  organizationId?: string;
  name?: string;
  slug?: string;
}

export function CreateWorkspaceModal({ open, onClose }: CreateWorkspaceModalProps) {
  const overlayRef = useRef<HTMLDivElement>(null);
  const firstFieldRef = useRef<HTMLSelectElement>(null);
  const [organizationId, setOrganizationId] = useState("");
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [description, setDescription] = useState("");
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
    if (!organizationId) next.organizationId = "Organization is required.";
    if (!name.trim()) next.name = "Name is required.";
    if (!slug.trim()) next.slug = "Slug is required.";
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (validate()) {
      setOrganizationId("");
      setName("");
      setSlug("");
      setDescription("");
      setErrors({});
      onClose();
    }
  }

  function handleSlugChange(value: string) {
    setSlug(value.toLowerCase().replace(/[^a-z0-9-]/g, ""));
  }

  if (!open) return null;

  return (
    <div
      ref={overlayRef}
      role="dialog"
      aria-modal="true"
      aria-label="Create workspace"
      className="fixed inset-0 z-modal flex items-center justify-center bg-black/60 p-4"
      onClick={(e) => {
        if (e.target === overlayRef.current) onClose();
      }}
    >
      <div className="w-full max-w-md rounded-xl border border-line bg-surface shadow-lg">
        <div className="flex items-center justify-between border-b border-line/60 px-6 py-4">
          <div className="flex items-center gap-3">
            <span className="flex h-9 w-9 items-center justify-center rounded-lg border border-primary/20 bg-primary/10 text-primary">
              <Layers className="h-5 w-5" aria-hidden="true" />
            </span>
            <h2 className="text-base font-semibold text-ink">Create Workspace</h2>
          </div>
          <button
            onClick={onClose}
            aria-label="Close modal"
            className="flex h-8 w-8 items-center justify-center rounded text-muted transition-colors duration-fast hover:bg-neutral-800 hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50"
          >
            <X className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5 px-6 py-5">
          <div>
            <label htmlFor="ws-org" className="block text-sm font-medium text-ink">
              Organization
            </label>
            <select
              ref={firstFieldRef}
              id="ws-org"
              value={organizationId}
              onChange={(e) => setOrganizationId(e.target.value)}
              aria-invalid={!!errors.organizationId}
              aria-describedby={errors.organizationId ? "ws-org-error" : undefined}
              className="mt-1.5 block h-10 w-full rounded-md border border-line bg-canvas px-3 text-sm text-ink transition-colors duration-fast focus:border-primary/50 focus:outline-none focus:ring-2 focus:ring-primary/20"
            >
              <option value="" disabled>
                Select an organization
              </option>
              {mockOrganizations.map((org) => (
                <option key={org.id} value={org.id}>
                  {org.name}
                </option>
              ))}
            </select>
            {errors.organizationId && (
              <p id="ws-org-error" className="mt-1.5 text-xs text-error">
                {errors.organizationId}
              </p>
            )}
          </div>

          <div>
            <label htmlFor="ws-name" className="block text-sm font-medium text-ink">
              Name
            </label>
            <input
              id="ws-name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              aria-invalid={!!errors.name}
              aria-describedby={errors.name ? "ws-name-error" : undefined}
              placeholder="My Workspace"
              className="mt-1.5 block h-10 w-full rounded-md border border-line bg-canvas px-3 text-sm text-ink placeholder:text-muted transition-colors duration-fast focus:border-primary/50 focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
            {errors.name && (
              <p id="ws-name-error" className="mt-1.5 text-xs text-error">
                {errors.name}
              </p>
            )}
          </div>

          <div>
            <label htmlFor="ws-slug" className="block text-sm font-medium text-ink">
              Slug
            </label>
            <div className="mt-1.5 flex items-center rounded-md border border-line bg-canvas transition-colors duration-fast focus-within:border-primary/50 focus-within:ring-2 focus-within:ring-primary/20">
              <span className="shrink-0 pl-3 text-sm text-muted">/</span>
              <input
                id="ws-slug"
                type="text"
                value={slug}
                onChange={(e) => handleSlugChange(e.target.value)}
                aria-invalid={!!errors.slug}
                aria-describedby={errors.slug ? "ws-slug-error" : undefined}
                placeholder="my-workspace"
                className="h-10 flex-1 bg-transparent px-2 text-sm text-ink placeholder:text-muted focus:outline-none"
              />
            </div>
            {errors.slug && (
              <p id="ws-slug-error" className="mt-1.5 text-xs text-error">
                {errors.slug}
              </p>
            )}
          </div>

          <div>
            <label htmlFor="ws-description" className="block text-sm font-medium text-ink">
              Description
            </label>
            <textarea
              id="ws-description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Optional description"
              rows={3}
              className="mt-1.5 block w-full rounded-md border border-line bg-canvas px-3 py-2 text-sm text-ink placeholder:text-muted transition-colors duration-fast focus:border-primary/50 focus:outline-none focus:ring-2 focus:ring-primary/20 resize-none"
            />
            <p className="mt-1 text-xs text-muted">Brief description of your workspace.</p>
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

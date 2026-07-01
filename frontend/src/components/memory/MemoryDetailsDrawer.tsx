import {
  Calendar,
  ExternalLink,
  FileText,
  Hash,
  Heart,
  MessageSquare,
  X,
} from "lucide-react";
import { useEffect, useRef } from "react";

import type { Memory } from "../../types/memory";

interface MemoryDetailsDrawerProps {
  memory: Memory | null;
  onClose: () => void;
  onToggleFavorite: (id: string) => void;
  onArchive: (id: string) => void;
  onDelete: (id: string) => void;
}

export function MemoryDetailsDrawer({
  memory,
  onClose,
  onToggleFavorite,
  onArchive,
  onDelete,
}: MemoryDetailsDrawerProps) {
  const drawerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!memory) return;
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [memory, onClose]);

  useEffect(() => {
    if (!memory) return;
    drawerRef.current?.focus();
  }, [memory]);

  if (!memory) return null;

  const createdDate = new Date(memory.createdAt).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
  const updatedDate = new Date(memory.updatedAt).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  return (
    <>
      <div
        className="fixed inset-0 z-overlay bg-black/40"
        aria-hidden="true"
        onClick={onClose}
      />

      <div
        ref={drawerRef}
        role="dialog"
        aria-modal="true"
        aria-label="Memory details"
        tabIndex={-1}
        className="fixed inset-y-0 right-0 z-drawer w-full max-w-lg border-l border-line bg-canvas shadow-lg focus:outline-none"
      >
        <div className="flex h-full flex-col">
          <div className="flex items-center justify-between border-b border-line/60 px-5 py-4">
            <h2 className="text-sm font-semibold text-ink">Memory Details</h2>
            <button
              onClick={onClose}
              aria-label="Close drawer"
              className="flex h-7 w-7 items-center justify-center rounded text-muted transition-colors duration-fast hover:bg-neutral-800 hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50"
            >
              <X className="h-4 w-4" aria-hidden="true" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto px-5 py-5">
            <div className="mb-5">
              <h3 className="text-base font-semibold text-ink">{memory.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted">{memory.summary}</p>
            </div>

            <div className="mb-5 space-y-3 text-sm">
              <div className="flex items-center gap-3 text-muted">
                <Calendar className="h-4 w-4 shrink-0" aria-hidden="true" />
                <span>Created {createdDate} by {memory.createdBy}</span>
              </div>
              <div className="flex items-center gap-3 text-muted">
                <Calendar className="h-4 w-4 shrink-0" aria-hidden="true" />
                <span>Updated {updatedDate}</span>
              </div>
              <div className="flex items-center gap-3 text-muted">
                <MessageSquare className="h-4 w-4 shrink-0" aria-hidden="true" />
                <span>{memory.messageCount} messages in conversation</span>
              </div>
              <div className="flex items-center gap-3 text-muted">
                <Hash className="h-4 w-4 shrink-0" aria-hidden="true" />
                <span>
                  {memory.tokenUsage.totalTokens.toLocaleString()} total tokens
                </span>
              </div>
            </div>

            <div className="mb-5 flex flex-wrap gap-2">
              <span className="rounded-md bg-neutral-800 px-2.5 py-1 text-xs font-medium text-ink">
                {memory.provider}
              </span>
              <span className="rounded-md bg-neutral-800 px-2.5 py-1 text-xs text-muted">
                {memory.model}
              </span>
              {memory.favorite && (
                <span className="inline-flex items-center gap-1 rounded-md bg-amber-400/10 px-2.5 py-1 text-xs font-medium text-amber-400">
                  <Heart className="h-3 w-3 fill-amber-400" aria-hidden="true" />
                  Favorite
                </span>
              )}
            </div>

            {memory.tags.length > 0 && (
              <div className="mb-5">
                <h4 className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted">
                  Tags
                </h4>
                <div className="flex flex-wrap gap-1.5">
                  {memory.tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded bg-neutral-800/60 px-2 py-0.5 text-xs text-muted"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {memory.promptTitle && (
              <div className="mb-5">
                <h4 className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted">
                  Prompt Used
                </h4>
                <a
                  href={`/dashboard/prompts`}
                  className="inline-flex items-center gap-1.5 rounded-md bg-neutral-800 px-3 py-1.5 text-xs text-ink transition-colors duration-fast hover:bg-neutral-700"
                >
                  <FileText className="h-3 w-3" aria-hidden="true" />
                  {memory.promptTitle}
                  <ExternalLink className="h-3 w-3" aria-hidden="true" />
                </a>
              </div>
            )}

            <div className="mb-5">
              <h4 className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted">
                Documents Referenced
              </h4>
              <p className="text-xs text-muted">
                No documents linked yet. Document retrieval will be available with RAG integration.
              </p>
            </div>

            {memory.tokenUsage && (
              <div className="mb-5">
                <h4 className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted">
                  Token Usage
                </h4>
                <div className="grid grid-cols-3 gap-2">
                  <div className="rounded-md bg-neutral-800 p-3 text-center">
                    <div className="text-xs text-muted">Prompt</div>
                    <div className="mt-1 text-sm font-semibold text-ink">
                      {memory.tokenUsage.promptTokens.toLocaleString()}
                    </div>
                  </div>
                  <div className="rounded-md bg-neutral-800 p-3 text-center">
                    <div className="text-xs text-muted">Completion</div>
                    <div className="mt-1 text-sm font-semibold text-ink">
                      {memory.tokenUsage.completionTokens.toLocaleString()}
                    </div>
                  </div>
                  <div className="rounded-md bg-neutral-800 p-3 text-center">
                    <div className="text-xs text-muted">Total</div>
                    <div className="mt-1 text-sm font-semibold text-ink">
                      {memory.tokenUsage.totalTokens.toLocaleString()}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="flex items-center gap-2 border-t border-line/60 px-5 py-4">
            <button
              onClick={() => onToggleFavorite(memory.id)}
              className={`inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium transition-colors duration-fast focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 ${
                memory.favorite
                  ? "bg-amber-400/10 text-amber-400"
                  : "bg-neutral-800 text-muted hover:bg-neutral-700 hover:text-ink"
              }`}
            >
              <Heart className={`h-3.5 w-3.5 ${memory.favorite ? "fill-amber-400" : ""}`} aria-hidden="true" />
              {memory.favorite ? "Favorited" : "Favorite"}
            </button>
            <button
              onClick={() => onArchive(memory.id)}
              className="rounded-md bg-neutral-800 px-3 py-1.5 text-xs font-medium text-muted transition-colors duration-fast hover:bg-neutral-700 hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50"
            >
              {memory.status === "archived" ? "Restore" : "Archive"}
            </button>
            <button
              onClick={() => onDelete(memory.id)}
              className="ml-auto rounded-md bg-red-500/10 px-3 py-1.5 text-xs font-medium text-error transition-colors duration-fast hover:bg-red-500/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-error/50"
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

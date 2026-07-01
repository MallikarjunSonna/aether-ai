import {
  Calendar,
  Clock,
  FileText,
  HardDrive,
  Layers,
  Sparkles,
  Tag,
  User,
  X,
} from "lucide-react";
import { useEffect, useRef } from "react";

import type { KnowledgeItem } from "../../types/knowledge";
import { KnowledgeCollectionBadge } from "./KnowledgeCollectionBadge";
import { KnowledgeSourceBadge } from "./KnowledgeSourceBadge";

interface KnowledgeDetailsDrawerProps {
  item: KnowledgeItem;
  onClose: () => void;
}

export function KnowledgeDetailsDrawer({ item, onClose }: KnowledgeDetailsDrawerProps) {
  const drawerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  const sizeLabel =
    item.size >= 1000000
      ? `${(item.size / 1000000).toFixed(1)} MB`
      : item.size >= 1000
        ? `${(item.size / 1000).toFixed(0)} KB`
        : `${item.size} B`;

  const createdDate = new Date(item.createdAt).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const updatedDate = new Date(item.updatedAt).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const embeddingStatusLabel: Record<string, { label: string; color: string }> = {
    indexed: { label: "Indexed", color: "text-green-400" },
    pending: { label: "Pending", color: "text-amber-400" },
    failed: { label: "Failed", color: "text-red-400" },
    not_configured: { label: "Not Configured", color: "text-muted" },
  };

  const statusInfo = embeddingStatusLabel[item.embeddingStatus] || {
    label: item.embeddingStatus,
    color: "text-muted",
  };

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
        aria-label={`Details for ${item.title}`}
        className="fixed right-0 top-0 z-overlay h-full w-full max-w-lg border-l border-line bg-canvas shadow-xl overflow-y-auto"
      >
        <div className="sticky top-0 z-sticky flex items-center justify-between border-b border-line bg-canvas px-6 py-4">
          <h2 className="text-lg font-semibold text-ink truncate pr-4">{item.title}</h2>
          <button
            onClick={onClose}
            aria-label="Close details"
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md text-muted transition-colors duration-fast hover:bg-neutral-800 hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50"
          >
            <X className="h-5 w-5" aria-hidden="true" />
          </button>
        </div>

        <div className="space-y-6 p-6">
          <p className="text-sm leading-relaxed text-muted">{item.description}</p>

          <div className="flex flex-wrap gap-2">
            <KnowledgeCollectionBadge collection={item.collection} />
            <KnowledgeSourceBadge sourceType={item.sourceType} />
          </div>

          <section>
            <h3 className="mb-3 text-sm font-semibold text-ink">Metadata</h3>
            <div className="grid grid-cols-2 gap-4">
              <MetadataRow icon={User} label="Owner" value={item.owner} />
              <MetadataRow icon={Tag} label="Version" value={`v${item.version}`} />
              <MetadataRow icon={FileText} label="Source" value={item.sourceName} />
              <MetadataRow icon={HardDrive} label="Size" value={sizeLabel} />
              <MetadataRow icon={Layers} label="Documents" value={`${item.documentCount}`} />
              <MetadataRow icon={Calendar} label="Created" value={createdDate} />
              <MetadataRow icon={Clock} label="Updated" value={updatedDate} />
              <MetadataRow icon={User} label="Language" value={item.language.toUpperCase()} />
            </div>
          </section>

          {item.tags.length > 0 && (
            <section>
              <h3 className="mb-3 text-sm font-semibold text-ink">Tags</h3>
              <div className="flex flex-wrap gap-1.5">
                {item.tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded bg-neutral-800 px-2.5 py-1 text-xs text-muted"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </section>
          )}

          <section>
            <h3 className="mb-3 text-sm font-semibold text-ink">Index Status</h3>
            <div className="space-y-3 rounded-xl border border-line/60 bg-surface p-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted">Embedding</span>
                <span className={`text-sm font-medium ${statusInfo.color}`}>
                  {statusInfo.label}
                </span>
              </div>
              {item.vectorStore && (
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted">Vector Store</span>
                  <span className="text-sm text-ink">{item.vectorStore}</span>
                </div>
              )}
              {item.lastIndexedAt && (
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted">Last Indexed</span>
                  <span className="text-sm text-ink">
                    {new Date(item.lastIndexedAt).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
                  </span>
                </div>
              )}
              {item.chunkCount > 0 && (
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted">Chunks</span>
                  <span className="text-sm text-ink">{item.chunkCount}</span>
                </div>
              )}
            </div>
          </section>

          <section>
            <h3 className="mb-3 text-sm font-semibold text-ink">RAG & Agents</h3>
            <div className="space-y-3 rounded-xl border border-line/60 bg-surface p-4">
              <div className="flex items-center gap-3">
                <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <Sparkles className="h-4 w-4" />
                </span>
                <div>
                  <p className="text-sm font-medium text-ink">Retrieval Augmented Generation</p>
                  <p className="text-xs text-muted">
                    {item.embeddingStatus === "indexed"
                      ? "This item is indexed and available for RAG queries."
                      : "Index this item to enable RAG-powered search and AI agent integration."}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-purple-500/10 text-purple-400">
                  <Sparkles className="h-4 w-4" />
                </span>
                <div>
                  <p className="text-sm font-medium text-ink">AI Agents</p>
                  <p className="text-xs text-muted">
                    Agents will be able to reference this item once indexed and connected to a knowledge base.
                  </p>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </>
  );
}

function MetadataRow({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof User;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center gap-2.5">
      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-neutral-800 text-muted">
        <Icon className="h-4 w-4" aria-hidden="true" />
      </span>
      <div className="min-w-0">
        <p className="text-xs text-muted">{label}</p>
        <p className="truncate text-sm text-ink">{value}</p>
      </div>
    </div>
  );
}

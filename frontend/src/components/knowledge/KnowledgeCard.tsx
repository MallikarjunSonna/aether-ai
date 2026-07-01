import {
  Archive,
  Heart,
  MoreHorizontal,
  Star,
  Trash2,
} from "lucide-react";
import { useRef, useState } from "react";

import type { KnowledgeItem } from "../../types/knowledge";
import { useClickOutside } from "../../hooks/useClickOutside";
import { KnowledgeCollectionBadge } from "./KnowledgeCollectionBadge";
import { KnowledgeSourceBadge } from "./KnowledgeSourceBadge";

interface KnowledgeCardProps {
  item: KnowledgeItem;
  onSelect: (item: KnowledgeItem) => void;
  onToggleFavorite: (id: string) => void;
  onArchive: (id: string) => void;
  onDelete: (id: string) => void;
}

export function KnowledgeCard({
  item,
  onSelect,
  onToggleFavorite,
  onArchive,
  onDelete,
}: KnowledgeCardProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  useClickOutside([menuRef, buttonRef], () => setMenuOpen(false), menuOpen);

  const date = new Date(item.updatedAt).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

  const sizeLabel =
    item.size >= 1000000
      ? `${(item.size / 1000000).toFixed(1)} MB`
      : item.size >= 1000
        ? `${(item.size / 1000).toFixed(0)} KB`
        : `${item.size} B`;

  return (
    <article className="group relative rounded-xl border border-line/60 bg-surface p-5 transition-colors duration-fast hover:border-neutral-500">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0 flex-1">
          <button
            onClick={() => onSelect(item)}
            className="text-left focus-visible:outline-none"
          >
            <h3 className="truncate text-base font-semibold text-ink hover:text-primary transition-colors duration-fast">
              {item.title}
            </h3>
          </button>

          <div className="mt-1.5 flex flex-wrap items-center gap-2">
            <KnowledgeCollectionBadge collection={item.collection} />
            <KnowledgeSourceBadge sourceType={item.sourceType} />
            <span className="text-[11px] text-muted">v{item.version}</span>
          </div>

          {item.description && (
            <p className="mt-2 text-sm leading-relaxed text-muted line-clamp-2">
              {item.description}
            </p>
          )}

          {item.tags.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-1.5">
              {item.tags.slice(0, 3).map((tag) => (
                <span
                  key={tag}
                  className="rounded bg-neutral-800 px-2 py-0.5 text-[11px] text-muted"
                >
                  {tag}
                </span>
              ))}
              {item.tags.length > 3 && (
                <span className="rounded bg-neutral-800 px-2 py-0.5 text-[11px] text-muted">
                  +{item.tags.length - 3}
                </span>
              )}
            </div>
          )}

          <div className="mt-4 flex items-center gap-4 text-xs text-muted">
            <span>Updated {date}</span>
            <span>{sizeLabel}</span>
            <span>{item.owner}</span>
          </div>
        </div>

        <div className="flex flex-col items-center gap-1">
          {item.embeddingStatus === "indexed" && (
            <span className="flex h-5 w-5 items-center justify-center" title="Indexed for RAG">
              <SparkleIcon />
            </span>
          )}
          <button
            onClick={() => onToggleFavorite(item.id)}
            aria-label={item.favorite ? "Remove from favorites" : "Add to favorites"}
            className={`flex h-8 w-8 items-center justify-center rounded-md transition-colors duration-fast focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 ${
              item.favorite
                ? "text-amber-400 hover:bg-amber-400/10"
                : "text-muted opacity-0 group-hover:opacity-100 hover:bg-neutral-800 hover:text-ink focus-visible:opacity-100"
            }`}
          >
            <Heart
              className={`h-4 w-4 ${item.favorite ? "fill-amber-400" : ""}`}
              aria-hidden="true"
            />
          </button>

          <button
            ref={buttonRef}
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label={`Actions for ${item.title}`}
            aria-expanded={menuOpen}
            aria-haspopup="true"
            className="flex h-8 w-8 items-center justify-center rounded-md text-muted opacity-0 transition-opacity duration-fast group-hover:opacity-100 focus-visible:opacity-100 hover:bg-neutral-800 hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50"
          >
            <MoreHorizontal className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>
      </div>

      {menuOpen && (
        <div
          ref={menuRef}
          role="menu"
          aria-label={`${item.title} actions`}
          className="absolute right-4 top-14 z-dropdown w-40 overflow-hidden rounded-lg border border-line bg-surface shadow-lg"
        >
          {[
            {
              label: item.favorite ? "Unfavorite" : "Favorite",
              icon: Star,
              action: () => onToggleFavorite(item.id),
            },
            {
              label: item.status === "archived" ? "Restore" : "Archive",
              icon: Archive,
              action: () => onArchive(item.id),
            },
            { label: "Delete", icon: Trash2, action: () => onDelete(item.id) },
          ].map((menuItem) => (
            <button
              key={menuItem.label}
              role="menuitem"
              onClick={() => {
                setMenuOpen(false);
                menuItem.action();
              }}
              className="flex w-full items-center gap-2.5 px-4 py-2.5 text-sm text-muted transition-colors duration-fast hover:bg-neutral-800 hover:text-ink focus-visible:outline-none focus-visible:bg-neutral-800"
            >
              <menuItem.icon className="h-4 w-4" aria-hidden="true" />
              {menuItem.label}
            </button>
          ))}
        </div>
      )}
    </article>
  );
}

function SparkleIcon() {
  return (
    <svg
      className="h-3.5 w-3.5 text-primary"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-label="Indexed"
    >
      <path d="M12 3l1.5 5.5L19 10l-5.5 1.5L12 17l-1.5-5.5L5 10l5.5-1.5z" />
      <path d="M18 18l-1 3.5L13.5 20l3.5-1 1-3.5 1 3.5 3.5 1-3.5 1z" />
    </svg>
  );
}

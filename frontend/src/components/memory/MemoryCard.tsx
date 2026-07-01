import {
  Archive,
  Heart,
  MessageSquare,
  MoreHorizontal,
  Star,
  Trash2,
} from "lucide-react";
import { useRef, useState } from "react";

import type { Memory } from "../../types/memory";
import { useClickOutside } from "../../hooks/useClickOutside";

interface MemoryCardProps {
  memory: Memory;
  onSelect: (memory: Memory) => void;
  onToggleFavorite: (id: string) => void;
  onArchive: (id: string) => void;
  onDelete: (id: string) => void;
}

export function MemoryCard({
  memory,
  onSelect,
  onToggleFavorite,
  onArchive,
  onDelete,
}: MemoryCardProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  useClickOutside([menuRef, buttonRef], () => setMenuOpen(false), menuOpen);

  const date = new Date(memory.createdAt).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  return (
    <article
      role="button"
      tabIndex={0}
      onClick={() => onSelect(memory)}
      onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") onSelect(memory); }}
      className="group relative cursor-pointer rounded-xl border border-line/60 bg-surface p-4 transition-colors duration-fast hover:border-neutral-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <h3 className="truncate text-sm font-semibold text-ink">{memory.title}</h3>
            {memory.favorite && (
              <Star className="h-3.5 w-3.5 shrink-0 fill-amber-400 text-amber-400" aria-hidden="true" />
            )}
          </div>
          <p className="mt-1.5 line-clamp-2 text-xs leading-relaxed text-muted">
            {memory.summary}
          </p>
        </div>

        <button
          ref={buttonRef}
          onClick={(e) => { e.stopPropagation(); setMenuOpen(!menuOpen); }}
          aria-label="Card actions"
          aria-expanded={menuOpen}
          aria-haspopup="true"
          className="flex h-7 w-7 shrink-0 items-center justify-center rounded text-muted opacity-0 transition-opacity duration-fast group-hover:opacity-100 focus-visible:opacity-100 hover:bg-neutral-800 hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50"
        >
          <MoreHorizontal className="h-4 w-4" aria-hidden="true" />
        </button>
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-2 text-xs text-muted">
        <span className="rounded-md bg-neutral-800 px-2 py-0.5 font-medium text-ink">
          {memory.provider}
        </span>
        <span>{memory.model}</span>
        <span className="flex items-center gap-1">
          <MessageSquare className="h-3 w-3" aria-hidden="true" />
          {memory.messageCount}
        </span>
        <span className="ml-auto">{date}</span>
      </div>

      {memory.tags.length > 0 && (
        <div className="mt-2 flex flex-wrap gap-1.5">
          {memory.tags.slice(0, 3).map((tag) => (
            <span
              key={tag}
              className="rounded bg-neutral-800/60 px-1.5 py-0.5 text-[10px] text-muted"
            >
              {tag}
            </span>
          ))}
          {memory.tags.length > 3 && (
            <span className="rounded bg-neutral-800/60 px-1.5 py-0.5 text-[10px] text-muted">
              +{memory.tags.length - 3}
            </span>
          )}
        </div>
      )}

      {menuOpen && (
        <div
          ref={menuRef}
          role="menu"
          aria-label="Memory actions"
          className="absolute right-3 top-12 z-dropdown w-40 overflow-hidden rounded-lg border border-line bg-surface shadow-lg"
        >
          {[
            { label: "Favorite", icon: Heart, action: () => onToggleFavorite(memory.id) },
            { label: memory.status === "archived" ? "Restore" : "Archive", icon: Archive, action: () => onArchive(memory.id) },
            { label: "Delete", icon: Trash2, action: () => onDelete(memory.id) },
          ].map((item) => (
            <button
              key={item.label}
              role="menuitem"
              onClick={(e) => { e.stopPropagation(); setMenuOpen(false); item.action(); }}
              className="flex w-full items-center gap-2.5 px-4 py-2.5 text-sm text-muted transition-colors duration-fast hover:bg-neutral-800 hover:text-ink focus-visible:outline-none focus-visible:bg-neutral-800"
            >
              <item.icon className="h-4 w-4" aria-hidden="true" />
              {item.label}
            </button>
          ))}
        </div>
      )}
    </article>
  );
}

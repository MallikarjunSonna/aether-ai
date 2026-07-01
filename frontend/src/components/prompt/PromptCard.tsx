import {
  Copy,
  Edit3,
  Heart,
  MoreHorizontal,
  Star,
  Trash2,
} from "lucide-react";
import { useRef, useState } from "react";

import type { Prompt } from "../../types/prompt";
import { useClickOutside } from "../../hooks/useClickOutside";
import { PromptCategoryBadge } from "./PromptCategoryBadge";
import { PromptVariables } from "./PromptVariables";

interface PromptCardProps {
  prompt: Prompt;
  onEdit: (prompt: Prompt) => void;
  onDuplicate: (id: string) => void;
  onToggleFavorite: (id: string) => void;
  onDelete: (id: string) => void;
}

export function PromptCard({
  prompt,
  onEdit,
  onDuplicate,
  onToggleFavorite,
  onDelete,
}: PromptCardProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  useClickOutside([menuRef, buttonRef], () => setMenuOpen(false), menuOpen);

  const date = new Date(prompt.updatedAt).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

  return (
    <article className="group relative rounded-xl border border-line/60 bg-surface p-5 transition-colors duration-fast hover:border-neutral-500">
      <div className="flex items-start gap-4">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2.5">
            <h3 className="truncate text-base font-semibold text-ink">{prompt.title}</h3>
            {prompt.favorite && (
              <Star className="h-4 w-4 shrink-0 fill-amber-400 text-amber-400" aria-label="Favorite" />
            )}
          </div>

          <div className="mt-1.5 flex items-center gap-2">
            <PromptCategoryBadge category={prompt.category} />
            <span className="text-[11px] text-muted">v{prompt.version}</span>
          </div>

          {prompt.description && (
            <p className="mt-2 text-sm leading-relaxed text-muted line-clamp-2">
              {prompt.description}
            </p>
          )}

          {prompt.tags.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-1.5">
              {prompt.tags.slice(0, 3).map((tag) => (
                <span
                  key={tag}
                  className="rounded bg-neutral-800 px-2 py-0.5 text-[11px] text-muted"
                >
                  {tag}
                </span>
              ))}
              {prompt.tags.length > 3 && (
                <span className="rounded bg-neutral-800 px-2 py-0.5 text-[11px] text-muted">
                  +{prompt.tags.length - 3}
                </span>
              )}
            </div>
          )}

          <div className="mt-3">
            <PromptVariables variables={prompt.variables} />
          </div>

          <div className="mt-4 flex items-center gap-4 text-xs text-muted">
            <span>Updated {date}</span>
            <span>{prompt.variables.length} variables</span>
          </div>
        </div>

        <div className="flex flex-col items-center gap-1">
          <button
            onClick={() => onToggleFavorite(prompt.id)}
            aria-label={prompt.favorite ? "Remove from favorites" : "Add to favorites"}
            className={`flex h-8 w-8 items-center justify-center rounded-md transition-colors duration-fast focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 ${
              prompt.favorite
                ? "text-amber-400 hover:bg-amber-400/10"
                : "text-muted opacity-0 group-hover:opacity-100 hover:bg-neutral-800 hover:text-ink focus-visible:opacity-100"
            }`}
          >
            <Heart
              className={`h-4 w-4 ${prompt.favorite ? "fill-amber-400" : ""}`}
              aria-hidden="true"
            />
          </button>

          <button
            ref={buttonRef}
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label={`Actions for ${prompt.title}`}
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
          aria-label={`${prompt.title} actions`}
          className="absolute right-4 top-14 z-dropdown w-40 overflow-hidden rounded-lg border border-line bg-surface shadow-lg"
        >
          {[
            { label: "Edit", icon: Edit3, action: () => onEdit(prompt) },
            { label: "Duplicate", icon: Copy, action: () => onDuplicate(prompt.id) },
            { label: "Delete", icon: Trash2, action: () => onDelete(prompt.id) },
          ].map((item) => (
            <button
              key={item.label}
              role="menuitem"
              onClick={() => {
                setMenuOpen(false);
                item.action();
              }}
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

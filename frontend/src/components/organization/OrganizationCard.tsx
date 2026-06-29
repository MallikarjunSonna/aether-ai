import { Building2, Edit3, Eye, MoreHorizontal, Trash2 } from "lucide-react";
import { useState, useRef } from "react";

import type { Organization } from "../../types/organization";
import { useClickOutside } from "../../hooks/useClickOutside";

interface OrganizationCardProps {
  organization: Organization;
}

export function OrganizationCard({ organization }: OrganizationCardProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  useClickOutside([menuRef, buttonRef], () => setMenuOpen(false), menuOpen);

  const date = new Date(organization.createdAt).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

  return (
    <article className="group relative rounded-xl border border-line/60 bg-surface p-5 transition-colors duration-fast hover:border-neutral-500">
      <div className="flex items-start gap-4">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-primary/20 bg-primary/10 text-primary">
          <Building2 className="h-5 w-5" aria-hidden="true" />
        </span>

        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2.5">
            <h3 className="text-base font-semibold text-ink">{organization.name}</h3>
            {organization.isActive && (
              <span className="rounded-full bg-success/10 px-2 py-0.5 text-[11px] font-medium text-success">
                Active
              </span>
            )}
          </div>

          <p className="mt-1 text-xs text-muted">/{organization.slug}</p>

          {organization.description && (
            <p className="mt-2 text-sm leading-relaxed text-muted line-clamp-2">
              {organization.description}
            </p>
          )}

          <div className="mt-4 flex items-center gap-4 text-xs text-muted">
            <span>{organization.memberCount} members</span>
            <span>Created {date}</span>
          </div>
        </div>

        <button
          ref={buttonRef}
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label={`Actions for ${organization.name}`}
          aria-expanded={menuOpen}
          aria-haspopup="true"
          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md text-muted opacity-0 transition-opacity duration-fast group-hover:opacity-100 focus-visible:opacity-100 hover:bg-neutral-800 hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50"
        >
          <MoreHorizontal className="h-4 w-4" aria-hidden="true" />
        </button>
      </div>

      {menuOpen && (
        <div
          ref={menuRef}
          role="menu"
          aria-label={`${organization.name} actions`}
          className="absolute right-4 top-14 z-dropdown w-40 overflow-hidden rounded-lg border border-line bg-surface shadow-lg"
        >
          {[
            { label: "Open", icon: Eye },
            { label: "Edit", icon: Edit3 },
            { label: "Delete", icon: Trash2 },
          ].map((item) => (
            <button
              key={item.label}
              role="menuitem"
              onClick={() => setMenuOpen(false)}
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

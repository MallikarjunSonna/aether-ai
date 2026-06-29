import { Building2, Check, ChevronDown, Plus, Search } from "lucide-react";
import { useState, useRef, useEffect } from "react";

import type { Organization } from "../../types/organization";
import { mockOrganizations } from "../../mocks/organizations";

interface OrganizationSwitcherProps {
  onCreate: () => void;
}

export function OrganizationSwitcher({ onCreate }: OrganizationSwitcherProps) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [activeOrg, setActiveOrg] = useState<Organization>(mockOrganizations[0]);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setOpen(false);
        setQuery("");
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (open) {
      inputRef.current?.focus();
    }
  }, [open]);

  function handleKeyDown(event: React.KeyboardEvent) {
    if (event.key === "Escape") {
      setOpen(false);
      setQuery("");
    }
  }

  const filtered = mockOrganizations.filter(
    (org) =>
      org.name.toLowerCase().includes(query.toLowerCase()) ||
      org.slug.toLowerCase().includes(query.toLowerCase()),
  );

  return (
    <div ref={containerRef} className="relative">
      <button
        onClick={() => setOpen(!open)}
        aria-expanded={open}
        aria-haspopup="listbox"
        aria-label="Switch organization"
        className="flex w-full items-center gap-2.5 rounded-md px-3 py-2 text-sm text-muted transition-colors duration-fast hover:bg-neutral-800 hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50"
      >
        <Building2 className="h-4 w-4 shrink-0 text-primary" aria-hidden="true" />
        <span className="truncate font-medium text-ink">{activeOrg.name}</span>
        <ChevronDown
          className={`ml-auto h-4 w-4 shrink-0 transition-transform duration-fast ${open ? "rotate-180" : ""}`}
          aria-hidden="true"
        />
      </button>

      {open && (
        <div
          role="listbox"
          aria-label="Organizations"
          onKeyDown={handleKeyDown}
          className="absolute left-0 right-0 top-full mt-1 z-dropdown overflow-hidden rounded-lg border border-line bg-surface shadow-lg"
        >
          <div className="relative border-b border-line/60">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" aria-hidden="true" />
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search organizations..."
              aria-label="Search organizations"
              className="w-full bg-transparent py-2.5 pl-9 pr-3 text-sm text-ink placeholder:text-muted focus:outline-none"
            />
          </div>

          <div className="max-h-52 overflow-y-auto py-1">
            {filtered.map((org) => (
              <button
                key={org.id}
                role="option"
                aria-selected={org.id === activeOrg.id}
                onClick={() => {
                  setActiveOrg(org);
                  setOpen(false);
                  setQuery("");
                }}
                className="flex w-full items-center gap-3 px-3 py-2.5 text-sm text-muted transition-colors duration-fast hover:bg-neutral-800 hover:text-ink focus-visible:outline-none focus-visible:bg-neutral-800"
              >
                <Building2 className="h-4 w-4 shrink-0 text-primary" aria-hidden="true" />
                <div className="min-w-0 flex-1 text-left">
                  <div className="truncate font-medium text-ink">{org.name}</div>
                  <div className="truncate text-xs text-muted">/{org.slug}</div>
                </div>
                {org.id === activeOrg.id && (
                  <Check className="h-4 w-4 shrink-0 text-primary" aria-hidden="true" />
                )}
              </button>
            ))}
            {filtered.length === 0 && (
              <p className="px-3 py-4 text-center text-sm text-muted">No organizations found</p>
            )}
          </div>

          <div className="border-t border-line/60 p-1">
            <button
              onClick={() => {
                setOpen(false);
                setQuery("");
                onCreate();
              }}
              className="flex w-full items-center gap-2.5 rounded-md px-3 py-2 text-sm text-muted transition-colors duration-fast hover:bg-neutral-800 hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50"
            >
              <Plus className="h-4 w-4" aria-hidden="true" />
              Create organization
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

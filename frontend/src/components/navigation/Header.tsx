import { Bell, Menu, Search } from "lucide-react";

import { Breadcrumbs } from "./Breadcrumbs";
import { UserMenu } from "./UserMenu";

interface HeaderProps {
  onMenuToggle: () => void;
}

export function Header({ onMenuToggle }: HeaderProps) {
  return (
    <header className="sticky top-0 z-sticky border-b border-line/60 bg-canvas/80 backdrop-blur-xl">
      <div className="flex h-16 items-center gap-4 px-4 lg:px-6">
        <button
          onClick={onMenuToggle}
          aria-label="Toggle navigation menu"
          className="flex h-8 w-8 items-center justify-center rounded text-muted transition-colors duration-fast hover:bg-neutral-800 hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 lg:hidden"
        >
          <Menu className="h-4 w-4" aria-hidden="true" />
        </button>

        <div className="hidden sm:block">
          <Breadcrumbs />
        </div>

        <div className="ml-auto flex items-center gap-3">
          <div className="relative hidden md:block">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" aria-hidden="true" />
            <input
              type="search"
              placeholder="Search..."
              aria-label="Search"
              className="h-9 w-56 rounded-md border border-line bg-surface pl-9 pr-3 text-sm text-ink placeholder:text-muted transition-colors duration-fast focus:border-primary/50 focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
          </div>

          <div className="hidden items-center gap-2 sm:flex">
            <span className="rounded-md border border-line bg-surface px-3 py-1.5 text-xs text-muted">
              Workspace: Personal
            </span>
          </div>

          <button
            aria-label="Notifications"
            className="flex h-8 w-8 items-center justify-center rounded-md text-muted transition-colors duration-fast hover:bg-neutral-800 hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50"
          >
            <Bell className="h-4 w-4" aria-hidden="true" />
          </button>

          <UserMenu />
        </div>
      </div>

      <div className="border-t border-line/40 px-4 py-2 sm:hidden">
        <Breadcrumbs />
      </div>
    </header>
  );
}

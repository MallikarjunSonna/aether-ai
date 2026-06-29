import {
  BarChart3,
  Bot,
  Building2,
  ChevronLeft,
  File,
  FileText,
  FolderKanban,
  Layers,
  LayoutDashboard,
  Library,
  MessageSquare,
  Settings,
  X,
} from "lucide-react";
import { useCallback, useEffect, useRef } from "react";

interface NavItem {
  label: string;
  icon: typeof LayoutDashboard;
  href: string;
}

const navItems: NavItem[] = [
  { label: "Dashboard", icon: LayoutDashboard, href: "/dashboard" },
  { label: "AI Chat", icon: MessageSquare, href: "/dashboard/chat" },
  { label: "AI Agents", icon: Bot, href: "/dashboard/agents" },
  { label: "Prompt Library", icon: FileText, href: "/dashboard/prompts" },
  { label: "Knowledge Base", icon: Library, href: "/dashboard/knowledge" },
  { label: "Documents", icon: File, href: "/dashboard/documents" },
  { label: "Projects", icon: FolderKanban, href: "/dashboard/projects" },
  { label: "Workspaces", icon: Layers, href: "/dashboard/workspaces" },
  { label: "Organization", icon: Building2, href: "/dashboard/organizations" },
  { label: "Analytics", icon: BarChart3, href: "/dashboard/analytics" },
  { label: "Settings", icon: Settings, href: "/dashboard/settings" },
];

interface SidebarProps {
  collapsed: boolean;
  onToggle: () => void;
  mobileOpen: boolean;
  onMobileClose: () => void;
}

export function Sidebar({ collapsed, onToggle, mobileOpen, onMobileClose }: SidebarProps) {
  const drawerRef = useRef<HTMLDivElement>(null);

  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent) => {
      if (event.key === "Escape") {
        if (mobileOpen) onMobileClose();
      }
    },
    [mobileOpen, onMobileClose],
  );

  useEffect(() => {
    if (!mobileOpen) return;
    function handleClickOutside(event: MouseEvent) {
      if (drawerRef.current && !drawerRef.current.contains(event.target as Node)) {
        onMobileClose();
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [mobileOpen, onMobileClose]);

  const sidebarContent = (
    <nav
      aria-label="Dashboard navigation"
      className="flex h-full flex-col"
      onKeyDown={handleKeyDown}
    >
      <div className="flex h-16 items-center border-b border-line/60 px-4">
        <div className="flex items-center gap-3">
          <span className="flex h-8 w-8 items-center justify-center rounded-md border border-line bg-surface text-primary">
            <LayoutDashboard className="h-4 w-4" aria-hidden="true" />
          </span>
          {!collapsed && (
            <span className="text-sm font-semibold tracking-tight text-ink">Aether AI</span>
          )}
        </div>
        {!collapsed && (
          <button
            onClick={onToggle}
            aria-label="Collapse sidebar"
            className="ml-auto flex h-6 w-6 items-center justify-center rounded text-muted transition-colors duration-fast hover:bg-neutral-800 hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50"
          >
            <ChevronLeft className="h-4 w-4" aria-hidden="true" />
          </button>
        )}
      </div>

      <div className="flex-1 overflow-y-auto py-3 px-3">
        <ul className="space-y-1" role="list">
          {navItems.map((item) => (
            <li key={item.label}>
              <a
                href={item.href}
                className="flex items-center gap-3 rounded-md px-3 py-2 text-sm text-muted transition-colors duration-fast hover:bg-neutral-800 hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50"
                aria-label={item.label}
              >
                <item.icon className="h-4 w-4 shrink-0" aria-hidden="true" />
                {!collapsed && <span>{item.label}</span>}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );

  return (
    <>
      <aside
        className={`hidden border-r border-line/60 bg-canvas transition-all duration-normal lg:flex lg:flex-col ${
          collapsed ? "w-16" : "w-60"
        }`}
      >
        <div className="flex h-full flex-col">{sidebarContent}</div>
      </aside>

      {mobileOpen && (
        <div
          className="fixed inset-0 z-overlay bg-black/60 lg:hidden"
          aria-hidden="true"
          onClick={onMobileClose}
        />
      )}

      <aside
        ref={drawerRef}
        role="dialog"
        aria-modal="true"
        aria-label="Navigation menu"
        className={`fixed inset-y-0 left-0 z-overlay w-72 border-r border-line/60 bg-canvas transition-transform duration-normal lg:hidden ${
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex h-16 items-center justify-between border-b border-line/60 px-4">
          <div className="flex items-center gap-3">
            <span className="flex h-8 w-8 items-center justify-center rounded-md border border-line bg-surface text-primary">
              <LayoutDashboard className="h-4 w-4" aria-hidden="true" />
            </span>
            <span className="text-sm font-semibold tracking-tight text-ink">Aether AI</span>
          </div>
          <button
            onClick={onMobileClose}
            aria-label="Close navigation menu"
            className="flex h-8 w-8 items-center justify-center rounded text-muted transition-colors duration-fast hover:bg-neutral-800 hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50"
          >
            <X className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto py-3 px-3">{sidebarContent}</div>
      </aside>
    </>
  );
}

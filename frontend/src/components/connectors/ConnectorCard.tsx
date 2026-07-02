import { Github, BookOpen, Globe, HardDrive, MessageSquare, Bug, TrendingUp, Puzzle, FileText, Cable, RefreshCw, Power, PowerOff } from "lucide-react";
import { useState } from "react";

import type { Connector, ConnectorProvider } from "../../types/connector";
import { ConnectorHealthCard } from "./ConnectorHealthCard";
import { ConnectorStatusBadge } from "./ConnectorStatusBadge";

const providerIcons: Record<ConnectorProvider, typeof Github> = {
  github: Github,
  notion: FileText,
  confluence: BookOpen,
  google_drive: HardDrive,
  sharepoint: Globe,
  slack: MessageSquare,
  jira: Bug,
  linear: TrendingUp,
  custom: Puzzle,
};

const providerBgColors: Record<ConnectorProvider, string> = {
  github: "bg-neutral-800 text-neutral-100",
  notion: "bg-neutral-800 text-neutral-100",
  confluence: "bg-blue-900/30 text-blue-400",
  google_drive: "bg-green-900/30 text-green-400",
  sharepoint: "bg-blue-900/30 text-blue-400",
  slack: "bg-purple-900/30 text-purple-400",
  jira: "bg-blue-900/30 text-blue-400",
  linear: "bg-indigo-900/30 text-indigo-400",
  custom: "bg-neutral-800 text-neutral-100",
};

interface ConnectorCardProps {
  connector: Connector;
  onConnect: (id: string) => void;
  onDisconnect: (id: string) => void;
  onSync: (id: string) => void;
  syncing: boolean;
}

function formatLastSync(lastSync: string | null): string {
  if (!lastSync) return "Never";
  const date = new Date(lastSync);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMin = Math.floor(diffMs / 60000);
  if (diffMin < 1) return "Just now";
  if (diffMin < 60) return `${diffMin}m ago`;
  const diffHr = Math.floor(diffMin / 60);
  if (diffHr < 24) return `${diffHr}h ago`;
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

export function ConnectorCard({ connector, onConnect, onDisconnect, onSync, syncing }: ConnectorCardProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const Icon = providerIcons[connector.provider] ?? Puzzle;

  return (
    <article className="group relative rounded-xl border border-line/60 bg-surface p-5 transition-colors duration-fast hover:border-neutral-500">
      <div className="flex items-start gap-4">
        <span
          className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${providerBgColors[connector.provider] ?? "bg-neutral-800 text-neutral-100"}`}
        >
          <Icon className="h-5 w-5" aria-hidden="true" />
        </span>

        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2.5">
            <h3 className="text-base font-semibold text-ink">{connector.name}</h3>
            <ConnectorStatusBadge status={connector.status} />
          </div>

          <p className="mt-1 text-xs text-muted capitalize">{connector.provider.replace("_", " ")}</p>

          <div className="mt-3 flex items-center gap-3">
            <ConnectorHealthCard health={connector.health} />
          </div>

          <div className="mt-3 flex items-center gap-4 text-xs text-muted">
            <span>{connector.supportedSourceTypes.length} source types</span>
            <span>Last sync: {formatLastSync(connector.lastSync)}</span>
          </div>
        </div>

        <div className="relative shrink-0">
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label={`Actions for ${connector.name}`}
            aria-expanded={menuOpen}
            aria-haspopup="true"
            className="flex h-8 w-8 items-center justify-center rounded-md text-muted opacity-0 transition-opacity duration-fast group-hover:opacity-100 focus-visible:opacity-100 hover:bg-neutral-800 hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50"
          >
            <Cable className="h-4 w-4" aria-hidden="true" />
          </button>

          {menuOpen && (
            <>
              <div className="fixed inset-0 z-10" onClick={() => setMenuOpen(false)} />
              <div
                role="menu"
                aria-label={`${connector.name} actions`}
                className="absolute right-0 top-10 z-dropdown w-44 overflow-hidden rounded-lg border border-line bg-surface shadow-lg"
              >
                {connector.connected ? (
                  <button
                    role="menuitem"
                    onClick={() => { onDisconnect(connector.id); setMenuOpen(false); }}
                    className="flex w-full items-center gap-2.5 px-4 py-2.5 text-sm text-muted transition-colors duration-fast hover:bg-neutral-800 hover:text-ink"
                  >
                    <PowerOff className="h-4 w-4" aria-hidden="true" />
                    Disconnect
                  </button>
                ) : (
                  <button
                    role="menuitem"
                    onClick={() => { onConnect(connector.id); setMenuOpen(false); }}
                    className="flex w-full items-center gap-2.5 px-4 py-2.5 text-sm text-muted transition-colors duration-fast hover:bg-neutral-800 hover:text-ink"
                  >
                    <Power className="h-4 w-4" aria-hidden="true" />
                    Connect
                  </button>
                )}
                {connector.connected && (
                  <button
                    role="menuitem"
                    onClick={() => { onSync(connector.id); setMenuOpen(false); }}
                    disabled={syncing}
                    className="flex w-full items-center gap-2.5 px-4 py-2.5 text-sm text-muted transition-colors duration-fast hover:bg-neutral-800 hover:text-ink"
                  >
                    <RefreshCw className={`h-4 w-4 ${syncing ? "animate-spin" : ""}`} aria-hidden="true" />
                    {syncing ? "Syncing..." : "Sync Now"}
                  </button>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </article>
  );
}

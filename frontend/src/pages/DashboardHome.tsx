import { Sparkles } from "lucide-react";

import { DashboardGrid } from "../components/dashboard/DashboardGrid";
import { mockDashboardData } from "../mocks/dashboard";

export function DashboardHome() {
  return (
    <div className="mx-auto max-w-5xl">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold tracking-tight text-ink">Dashboard</h1>
          <p className="mt-1 text-sm text-muted">
            Overview of your AI workspace.
          </p>
        </div>
        <a
          href="/dashboard/chat"
          className="hidden items-center gap-2 rounded-md border border-line bg-surface px-4 py-2 text-sm font-medium text-ink transition-colors duration-fast hover:border-neutral-500 hover:bg-neutral-800 sm:flex"
        >
          <Sparkles className="h-4 w-4 text-primary" aria-hidden="true" />
          New Chat
        </a>
      </div>

      <DashboardGrid data={mockDashboardData} />
    </div>
  );
}

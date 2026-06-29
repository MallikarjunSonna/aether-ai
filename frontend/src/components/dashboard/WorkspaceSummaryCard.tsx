import { Layers } from "lucide-react";

import type { WorkspaceSummary } from "../../types/dashboard";
import { DashboardWidget } from "./DashboardWidget";

interface WorkspaceSummaryCardProps {
  summary: WorkspaceSummary;
}

export function WorkspaceSummaryCard({ summary }: WorkspaceSummaryCardProps) {
  return (
    <DashboardWidget title="Workspace" icon={Layers}>
      <div className="space-y-4">
        <div>
          <p className="text-sm font-medium text-ink">{summary.name}</p>
          <p className="mt-0.5 text-xs text-muted">Role: {summary.role}</p>
        </div>
        <div>
          <p className="text-xs text-muted">Active Projects</p>
          <p className="mt-0.5 text-lg font-semibold text-ink">{summary.activeProjects}</p>
        </div>
      </div>
    </DashboardWidget>
  );
}

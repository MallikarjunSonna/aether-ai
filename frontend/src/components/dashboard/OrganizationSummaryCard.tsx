import { Building2 } from "lucide-react";

import type { OrganizationSummary } from "../../types/dashboard";
import { DashboardWidget } from "./DashboardWidget";

interface OrganizationSummaryCardProps {
  summary: OrganizationSummary;
}

export function OrganizationSummaryCard({ summary }: OrganizationSummaryCardProps) {
  return (
    <DashboardWidget title="Organization" icon={Building2}>
      <div className="space-y-4">
        <div>
          <p className="text-sm font-medium text-ink">{summary.name}</p>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-xs text-muted">Members</p>
            <p className="mt-0.5 text-lg font-semibold text-ink">{summary.memberCount}</p>
          </div>
          <div>
            <p className="text-xs text-muted">Workspaces</p>
            <p className="mt-0.5 text-lg font-semibold text-ink">{summary.workspaceCount}</p>
          </div>
        </div>
      </div>
    </DashboardWidget>
  );
}

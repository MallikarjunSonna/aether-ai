import {
  Building2,
  Layers,
  Sparkles,
  Users,
} from "lucide-react";

import type { DashboardData } from "../../types/dashboard";
import { ActivityCard } from "./ActivityCard";
import { AIUsageCard } from "./AIUsageCard";
import { OrganizationSummaryCard } from "./OrganizationSummaryCard";
import { QuickActionsCard } from "./QuickActionsCard";
import { StatsCard } from "./StatsCard";
import { WorkspaceSummaryCard } from "./WorkspaceSummaryCard";

interface DashboardGridProps {
  data: DashboardData;
}

export function DashboardGrid({ data }: DashboardGridProps) {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          icon={Building2}
          title="Total Organizations"
          value={data.stats.totalOrganizations}
          trend="+1"
          description="this month"
        />
        <StatsCard
          icon={Layers}
          title="Total Workspaces"
          value={data.stats.totalWorkspaces}
          trend="+2"
          description="this month"
        />
        <StatsCard
          icon={Users}
          title="Active Members"
          value={data.stats.activeMembers}
          trend="+3"
          description="this week"
        />
        <StatsCard
          icon={Sparkles}
          title="AI Requests Today"
          value={data.stats.aiRequestsToday}
          trend="+12%"
          description="vs yesterday"
        />
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <ActivityCard activities={data.activities} />
        <QuickActionsCard />
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <OrganizationSummaryCard summary={data.organizationSummary} />
        <WorkspaceSummaryCard summary={data.workspaceSummary} />
        <AIUsageCard usage={data.aiUsage} />
      </div>
    </div>
  );
}

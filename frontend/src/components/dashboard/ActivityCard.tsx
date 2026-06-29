import {
  Activity,
  FileText,
  type LucideIcon,
  PlusCircle,
  Settings,
  UserPlus,
} from "lucide-react";

import type { Activity as ActivityType, ActivityType as TActivityType } from "../../types/dashboard";
import { DashboardWidget } from "./DashboardWidget";

interface ActivityCardProps {
  activities: ActivityType[];
}

const ACTIVITY_ICONS: Record<TActivityType, LucideIcon> = {
  workspace_created: PlusCircle,
  organization_updated: Settings,
  member_invited: UserPlus,
  prompt_published: FileText,
};

const ACTIVITY_COLORS: Record<TActivityType, string> = {
  workspace_created: "text-blue-400 bg-blue-500/10",
  organization_updated: "text-amber-400 bg-amber-500/10",
  member_invited: "text-green-400 bg-green-500/10",
  prompt_published: "text-purple-400 bg-purple-500/10",
};

function formatRelativeTime(isoString: string): string {
  const diffMs = Date.now() - new Date(isoString).getTime();
  const diffMinutes = Math.floor(diffMs / 60000);

  if (diffMinutes < 1) return "Just now";
  if (diffMinutes < 60) return `${diffMinutes} minute${diffMinutes === 1 ? "" : "s"} ago`;

  const diffHours = Math.floor(diffMinutes / 60);
  if (diffHours < 24) return `${diffHours} hour${diffHours === 1 ? "" : "s"} ago`;

  const diffDays = Math.floor(diffHours / 24);
  return `${diffDays} day${diffDays === 1 ? "" : "s"} ago`;
}

export function ActivityCard({ activities }: ActivityCardProps) {
  return (
    <DashboardWidget title="Recent Activity" icon={Activity}>
      {activities.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-8 text-center">
          <Activity className="h-8 w-8 text-muted/40" aria-hidden="true" />
          <p className="mt-3 text-sm text-muted/60">No recent activity</p>
        </div>
      ) : (
        <ul className="space-y-3" role="list" aria-label="Recent activity">
          {activities.map((act) => {
            const Icon = ACTIVITY_ICONS[act.type];
            const colorClass = ACTIVITY_COLORS[act.type];
            return (
              <li key={act.id} className="flex items-start gap-3">
                <span
                  className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${colorClass}`}
                >
                  <Icon className="h-4 w-4" aria-hidden="true" />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="text-sm text-ink">{act.description}</p>
                  <p className="mt-0.5 text-xs text-muted">
                    {formatRelativeTime(act.timestamp)}
                  </p>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </DashboardWidget>
  );
}

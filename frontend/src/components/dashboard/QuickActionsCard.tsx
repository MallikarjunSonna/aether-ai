import { ArrowRight, Bot, Building2, Layers, UserPlus, Zap } from "lucide-react";

import { DashboardWidget } from "./DashboardWidget";

const actions = [
  { label: "Create Organization", icon: Building2 },
  { label: "Create Workspace", icon: Layers },
  { label: "Invite Member", icon: UserPlus },
  { label: "Open AI Chat", icon: Bot },
];

export function QuickActionsCard() {
  return (
    <DashboardWidget title="Quick Actions" icon={Zap}>
      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
        {actions.map((action) => (
          <button
            key={action.label}
            type="button"
            className="flex items-center justify-between rounded-lg border border-line/50 bg-canvas px-4 py-3 text-sm text-muted transition-colors duration-fast hover:border-neutral-500 hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50"
          >
            <span className="flex items-center gap-2.5">
              <action.icon className="h-4 w-4 text-primary" aria-hidden="true" />
              {action.label}
            </span>
            <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
          </button>
        ))}
      </div>
    </DashboardWidget>
  );
}

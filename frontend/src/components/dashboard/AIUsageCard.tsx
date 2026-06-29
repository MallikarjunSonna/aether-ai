import { Sparkles } from "lucide-react";

import type { AIUsage } from "../../types/dashboard";
import { DashboardWidget } from "./DashboardWidget";

interface AIUsageCardProps {
  usage: AIUsage;
}

function formatNumber(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`;
  return n.toLocaleString();
}

export function AIUsageCard({ usage }: AIUsageCardProps) {
  return (
    <DashboardWidget title="AI Usage" icon={Sparkles}>
      <div className="grid grid-cols-3 gap-4">
        <div>
          <p className="text-xs text-muted">Tokens Today</p>
          <p className="mt-0.5 text-lg font-semibold text-ink">
            {formatNumber(usage.tokensUsedToday)}
          </p>
        </div>
        <div>
          <p className="text-xs text-muted">AI Requests</p>
          <p className="mt-0.5 text-lg font-semibold text-ink">
            {formatNumber(usage.aiRequests)}
          </p>
        </div>
        <div>
          <p className="text-xs text-muted">Agents</p>
          <p className="mt-0.5 text-lg font-semibold text-ink">
            {formatNumber(usage.agentsExecuted)}
          </p>
        </div>
      </div>
    </DashboardWidget>
  );
}

import { Coins, Cpu, DollarSign } from "lucide-react";

import type { TokenUsage } from "../../types/ops";

interface TokenUsageCardProps {
  usage: TokenUsage[];
}

export function TokenUsageCard({ usage }: TokenUsageCardProps) {
  const latest = usage[0];
  const weekly = usage[1];
  const monthly = usage[2];

  return (
    <div className="rounded-xl border border-line/60 bg-surface p-5">
      <h3 className="text-sm font-semibold text-ink mb-4">Token Usage & Cost</h3>

      <div className="grid grid-cols-3 gap-3 mb-4">
        <div className="rounded-lg bg-canvas/50 p-3 text-center">
          <p className="text-[11px] text-muted mb-1">24h</p>
          <p className="text-sm font-semibold text-ink">{(latest.totalTokens / 1_000_000).toFixed(1)}M</p>
        </div>
        <div className="rounded-lg bg-canvas/50 p-3 text-center">
          <p className="text-[11px] text-muted mb-1">7d</p>
          <p className="text-sm font-semibold text-ink">{(weekly.totalTokens / 1_000_000).toFixed(1)}M</p>
        </div>
        <div className="rounded-lg bg-canvas/50 p-3 text-center">
          <p className="text-[11px] text-muted mb-1">30d</p>
          <p className="text-sm font-semibold text-ink">{(monthly.totalTokens / 1_000_000).toFixed(1)}M</p>
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between text-sm">
          <span className="flex items-center gap-2 text-muted">
            <Cpu className="h-4 w-4 text-primary" />
            Prompt Tokens
          </span>
          <span className="font-medium text-ink">{(latest.promptTokens / 1_000_000).toFixed(1)}M</span>
        </div>
        <div className="flex items-center justify-between text-sm">
          <span className="flex items-center gap-2 text-muted">
            <Cpu className="h-4 w-4 text-amber-400" />
            Completion Tokens
          </span>
          <span className="font-medium text-ink">{(latest.completionTokens / 1_000_000).toFixed(1)}M</span>
        </div>
        <div className="flex items-center justify-between text-sm border-t border-line/60 pt-3">
          <span className="flex items-center gap-2 text-muted">
            <DollarSign className="h-4 w-4 text-green-400" />
            Estimated Cost (24h)
          </span>
          <span className="font-semibold text-ink">${latest.estimatedCost.toFixed(2)}</span>
        </div>
        <div className="flex items-center justify-between text-sm">
          <span className="flex items-center gap-2 text-muted">
            <Coins className="h-4 w-4 text-green-400" />
            Estimated Cost (30d)
          </span>
          <span className="font-semibold text-ink">${monthly.estimatedCost.toFixed(2)}</span>
        </div>
      </div>
    </div>
  );
}

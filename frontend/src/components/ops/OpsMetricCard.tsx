import type { ReactNode } from "react";

interface OpsMetricCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: ReactNode;
  trend?: "up" | "down" | "neutral";
  trendLabel?: string;
}

export function OpsMetricCard({ title, value, subtitle, icon, trend, trendLabel }: OpsMetricCardProps) {
  return (
    <div className="rounded-xl border border-line/60 bg-surface p-5 transition-colors duration-fast hover:border-neutral-500">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-medium text-muted uppercase tracking-wider">{title}</p>
          <p className="mt-1.5 text-2xl font-semibold text-ink">{value}</p>
          {subtitle && <p className="mt-0.5 text-xs text-muted">{subtitle}</p>}
        </div>
        <span className="flex h-10 w-10 items-center justify-center rounded-lg border border-line bg-canvas text-primary">
          {icon}
        </span>
      </div>
      {trend && trendLabel && (
        <div className="mt-3 flex items-center gap-1.5 border-t border-line/60 pt-3">
          <span
            className={`inline-flex h-2 w-2 rounded-full ${
              trend === "up" ? "bg-green-400" : trend === "down" ? "bg-error" : "bg-muted"
            }`}
          />
          <span className="text-xs text-muted">{trendLabel}</span>
        </div>
      )}
    </div>
  );
}

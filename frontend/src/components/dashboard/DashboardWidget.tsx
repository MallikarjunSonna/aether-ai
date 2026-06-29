import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";

interface DashboardWidgetProps {
  title: string;
  icon: LucideIcon;
  children: ReactNode;
  action?: ReactNode;
  footer?: ReactNode;
}

export function DashboardWidget({
  title,
  icon: Icon,
  children,
  action,
  footer,
}: DashboardWidgetProps) {
  return (
    <div className="flex h-full flex-col rounded-xl border border-line/60 bg-surface">
      <div className="flex items-center justify-between border-b border-line/60 px-5 py-4">
        <div className="flex items-center gap-2.5">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg border border-primary/20 bg-primary/10 text-primary">
            <Icon className="h-4 w-4" aria-hidden="true" />
          </span>
          <h2 className="text-sm font-semibold text-ink">{title}</h2>
        </div>
        {action && <div>{action}</div>}
      </div>
      <div className="flex-1 px-5 py-4">{children}</div>
      {footer && (
        <div className="border-t border-line/60 px-5 py-3">{footer}</div>
      )}
    </div>
  );
}

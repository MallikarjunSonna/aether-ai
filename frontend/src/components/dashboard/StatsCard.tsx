import type { LucideIcon } from "lucide-react";
import { motion } from "framer-motion";

interface StatsCardProps {
  icon: LucideIcon;
  title: string;
  value: string | number;
  trend?: string;
  description?: string;
}

export function StatsCard({
  icon: Icon,
  title,
  value,
  trend,
  description,
}: StatsCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="rounded-xl border border-line/60 bg-surface p-5"
    >
      <div className="flex items-center gap-3">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-primary/20 bg-primary/10 text-primary">
          <Icon className="h-5 w-5" aria-hidden="true" />
        </span>
        <div className="min-w-0 flex-1">
          <p className="text-xs font-medium text-muted">{title}</p>
          <p className="mt-0.5 text-2xl font-semibold tracking-tight text-ink">{value}</p>
        </div>
      </div>
      {(trend || description) && (
        <p className="mt-2 text-xs text-muted">
          {trend && <span className="font-medium text-success">{trend}</span>}
          {trend && description && " "}
          {description}
        </p>
      )}
    </motion.div>
  );
}

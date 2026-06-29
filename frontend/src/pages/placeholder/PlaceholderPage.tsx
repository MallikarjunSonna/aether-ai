import type { LucideIcon } from "lucide-react";
import { Construction } from "lucide-react";

interface PlaceholderPageProps {
  title: string;
  icon?: LucideIcon;
  description?: string;
}

export function PlaceholderPage({
  title,
  icon: Icon = Construction,
  description,
}: PlaceholderPageProps) {
  return (
    <div className="mx-auto max-w-5xl">
      <div className="mb-6">
        <h1 className="text-xl font-semibold tracking-tight text-ink">{title}</h1>
        <p className="mt-1 text-sm text-muted">
          {description ?? `Manage your ${title.toLowerCase()}.`}
        </p>
      </div>

      <div className="flex flex-col items-center justify-center rounded-xl border border-line/60 bg-surface py-20">
        <Icon className="h-12 w-12 text-muted/30" aria-hidden="true" />
        <h2 className="mt-4 text-lg font-semibold text-ink">Coming Soon</h2>
        <p className="mt-1 text-sm text-muted">This feature is under development.</p>
      </div>
    </div>
  );
}

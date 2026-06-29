import { ArrowLeft, ShieldBan } from "lucide-react";

interface AccessDeniedProps {
  title?: string;
  description?: string;
}

export function AccessDenied({
  title = "Access Denied",
  description = "You do not have permission to view this page. Contact your organization administrator to request access.",
}: AccessDeniedProps) {
  return (
    <div className="flex min-h-[50vh] flex-col items-center justify-center text-center">
      <span className="flex h-16 w-16 items-center justify-center rounded-2xl border border-error/20 bg-error/10 text-error">
        <ShieldBan className="h-8 w-8" aria-hidden="true" />
      </span>
      <h1 className="mt-6 text-lg font-semibold text-ink">{title}</h1>
      <p className="mt-2 max-w-md text-sm leading-relaxed text-muted">
        {description}
      </p>
      <button
        onClick={() => window.history.back()}
        className="mt-6 inline-flex items-center gap-2 rounded-md border border-line bg-surface px-4 py-2.5 text-sm font-medium text-ink transition-colors duration-fast hover:bg-neutral-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50"
      >
        <ArrowLeft className="h-4 w-4" aria-hidden="true" />
        Go Back
      </button>
    </div>
  );
}

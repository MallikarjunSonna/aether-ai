import { Boxes } from "lucide-react";

export function DashboardPlaceholder() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <div className="text-center">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-xl border border-line bg-surface text-primary shadow-sm">
          <Boxes className="h-7 w-7" aria-hidden="true" />
        </div>
        <h1 className="mt-6 text-2xl font-semibold tracking-tight text-ink">Aether AI</h1>
        <p className="mt-2 text-sm text-muted">Your workspace is ready.</p>
      </div>
    </div>
  );
}

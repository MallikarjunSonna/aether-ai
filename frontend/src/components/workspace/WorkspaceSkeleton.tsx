export function WorkspaceSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
      {Array.from({ length: 4 }).map((_, i) => (
        <div
          key={i}
          className="animate-pulse rounded-xl border border-line/60 bg-surface p-5"
          aria-hidden="true"
        >
          <div className="flex items-start gap-4">
            <div className="h-10 w-10 shrink-0 rounded-lg bg-neutral-800" />
            <div className="min-w-0 flex-1 space-y-3">
              <div className="h-4 w-1/3 rounded bg-neutral-800" />
              <div className="h-3 w-1/4 rounded bg-neutral-800" />
              <div className="h-3 w-2/3 rounded bg-neutral-800" />
              <div className="flex gap-4">
                <div className="h-3 w-16 rounded bg-neutral-800" />
                <div className="h-3 w-20 rounded bg-neutral-800" />
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

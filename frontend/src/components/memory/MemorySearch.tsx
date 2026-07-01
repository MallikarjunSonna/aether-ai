import { Search, X } from "lucide-react";

interface MemorySearchProps {
  value: string;
  onChange: (value: string) => void;
}

export function MemorySearch({ value, onChange }: MemorySearchProps) {
  return (
    <div className="relative">
      <Search
        className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted"
        aria-hidden="true"
      />
      <input
        type="search"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Search memory by title, summary, or tags..."
        aria-label="Search workspace memory"
        className="h-10 w-full rounded-md border border-line bg-surface pl-9 pr-9 text-sm text-ink placeholder:text-muted transition-colors duration-fast focus:border-primary/50 focus:outline-none focus:ring-2 focus:ring-primary/20"
      />
      {value && (
        <button
          onClick={() => onChange("")}
          aria-label="Clear search"
          className="absolute right-2 top-1/2 -translate-y-1/2 flex h-6 w-6 items-center justify-center rounded text-muted transition-colors duration-fast hover:bg-neutral-800 hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50"
        >
          <X className="h-4 w-4" aria-hidden="true" />
        </button>
      )}
    </div>
  );
}

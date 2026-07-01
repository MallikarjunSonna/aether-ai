import { BrainCircuit, Cpu, HardDrive } from "lucide-react";

interface MemoryStatsProps {
  total: number;
  totalTokens: number;
  providers: string[];
}

export function MemoryStats({ total, totalTokens, providers }: MemoryStatsProps) {
  return (
    <div className="flex flex-wrap items-center gap-4 text-xs text-muted">
      <span className="flex items-center gap-1.5">
        <BrainCircuit className="h-3.5 w-3.5" aria-hidden="true" />
        {total} entries
      </span>
      <span className="flex items-center gap-1.5">
        <HardDrive className="h-3.5 w-3.5" aria-hidden="true" />
        {totalTokens.toLocaleString()} tokens
      </span>
      <span className="flex items-center gap-1.5">
        <Cpu className="h-3.5 w-3.5" aria-hidden="true" />
        {providers.length} provider{providers.length !== 1 ? "s" : ""}
      </span>
    </div>
  );
}

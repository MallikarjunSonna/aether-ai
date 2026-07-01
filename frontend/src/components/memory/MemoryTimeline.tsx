import { motion } from "framer-motion";
import { Clock } from "lucide-react";

import type { Memory } from "../../types/memory";
import { MemoryCard } from "./MemoryCard";

interface MemoryTimelineProps {
  memories: Memory[];
  onSelect: (memory: Memory) => void;
  onToggleFavorite: (id: string) => void;
  onArchive: (id: string) => void;
  onDelete: (id: string) => void;
}

interface GroupedMemories {
  label: string;
  items: Memory[];
}

function groupMemoriesByDate(memories: Memory[]): GroupedMemories[] {
  const groups: Record<string, Memory[]> = {};
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  for (const mem of memories) {
    const date = new Date(mem.createdAt);
    let key: string;

    if (date.toDateString() === today.toDateString()) {
      key = "Today";
    } else if (date.toDateString() === yesterday.toDateString()) {
      key = "Yesterday";
    } else {
      key = date.toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
      });
    }

    if (!groups[key]) groups[key] = [];
    groups[key].push(mem);
  }

  const order = ["Today", "Yesterday"];
  return Object.entries(groups)
    .sort(([a], [b]) => {
      const ai = order.indexOf(a);
      const bi = order.indexOf(b);
      if (ai !== -1 && bi !== -1) return ai - bi;
      if (ai !== -1) return -1;
      if (bi !== -1) return 1;
      return new Date(b).getTime() - new Date(a).getTime();
    })
    .map(([label, items]) => ({ label, items }));
}

export function MemoryTimeline({
  memories,
  onSelect,
  onToggleFavorite,
  onArchive,
  onDelete,
}: MemoryTimelineProps) {
  const grouped = groupMemoriesByDate(memories);

  if (grouped.length === 0) return null;

  return (
    <div className="relative space-y-8">
      <div className="absolute bottom-0 left-[11px] top-0 w-px bg-line/40" aria-hidden="true" />

      {grouped.map((group) => (
        <div key={group.label}>
          <div className="sticky top-0 z-sticky mb-4 flex items-center gap-3 bg-canvas py-1">
            <span className="flex h-6 w-6 items-center justify-center rounded-full border border-line bg-surface">
              <Clock className="h-3 w-3 text-muted" aria-hidden="true" />
            </span>
            <h2 className="text-xs font-semibold uppercase tracking-wider text-muted">
              {group.label}
            </h2>
            <span className="h-px flex-1 bg-line/30" />
            <span className="text-[11px] text-muted">{group.items.length}</span>
          </div>

          <div className="space-y-3 pl-9">
            {group.items.map((memory, index) => (
              <motion.div
                key={memory.id}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.35, delay: index * 0.04, ease: "easeOut" }}
              >
                <MemoryCard
                  memory={memory}
                  onSelect={onSelect}
                  onToggleFavorite={onToggleFavorite}
                  onArchive={onArchive}
                  onDelete={onDelete}
                />
              </motion.div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

import { motion } from "framer-motion";

import type { KnowledgeItem } from "../../types/knowledge";
import { KnowledgeCard } from "./KnowledgeCard";

interface KnowledgeGridProps {
  items: KnowledgeItem[];
  onSelect: (item: KnowledgeItem) => void;
  onToggleFavorite: (id: string) => void;
  onArchive: (id: string) => void;
  onDelete: (id: string) => void;
}

export function KnowledgeGrid({
  items,
  onSelect,
  onToggleFavorite,
  onArchive,
  onDelete,
}: KnowledgeGridProps) {
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
      {items.map((item, index) => (
        <motion.div
          key={item.id}
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.4, delay: index * 0.05, ease: "easeOut" }}
        >
          <KnowledgeCard
            item={item}
            onSelect={onSelect}
            onToggleFavorite={onToggleFavorite}
            onArchive={onArchive}
            onDelete={onDelete}
          />
        </motion.div>
      ))}
    </div>
  );
}

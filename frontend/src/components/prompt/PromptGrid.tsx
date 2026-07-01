import { motion } from "framer-motion";

import type { Prompt } from "../../types/prompt";
import { PromptCard } from "./PromptCard";

interface PromptGridProps {
  prompts: Prompt[];
  onEdit: (prompt: Prompt) => void;
  onDuplicate: (id: string) => void;
  onToggleFavorite: (id: string) => void;
  onDelete: (id: string) => void;
}

export function PromptGrid({
  prompts,
  onEdit,
  onDuplicate,
  onToggleFavorite,
  onDelete,
}: PromptGridProps) {
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
      {prompts.map((prompt, index) => (
        <motion.div
          key={prompt.id}
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.4, delay: index * 0.05, ease: "easeOut" }}
        >
          <PromptCard
            prompt={prompt}
            onEdit={onEdit}
            onDuplicate={onDuplicate}
            onToggleFavorite={onToggleFavorite}
            onDelete={onDelete}
          />
        </motion.div>
      ))}
    </div>
  );
}

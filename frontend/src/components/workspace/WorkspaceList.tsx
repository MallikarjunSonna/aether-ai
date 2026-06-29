import { motion } from "framer-motion";

import type { Workspace } from "../../types/workspace";
import { WorkspaceCard } from "./WorkspaceCard";

interface WorkspaceListProps {
  workspaces: Workspace[];
}

export function WorkspaceList({ workspaces }: WorkspaceListProps) {
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
      {workspaces.map((ws, index) => (
        <motion.div
          key={ws.id}
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.4, delay: index * 0.05, ease: "easeOut" }}
        >
          <WorkspaceCard workspace={ws} />
        </motion.div>
      ))}
    </div>
  );
}

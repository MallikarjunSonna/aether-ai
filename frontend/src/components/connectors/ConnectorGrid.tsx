import { motion } from "framer-motion";

import type { Connector } from "../../types/connector";
import { ConnectorCard } from "./ConnectorCard";

interface ConnectorGridProps {
  connectors: Connector[];
  onConnect: (id: string) => void;
  onDisconnect: (id: string) => void;
  onSync: (id: string) => void;
  syncingId: string | null;
}

export function ConnectorGrid({ connectors, onConnect, onDisconnect, onSync, syncingId }: ConnectorGridProps) {
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
      {connectors.map((connector, index) => (
        <motion.div
          key={connector.id}
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.3, delay: index * 0.05 }}
        >
          <ConnectorCard
            connector={connector}
            onConnect={onConnect}
            onDisconnect={onDisconnect}
            onSync={onSync}
            syncing={syncingId === connector.id}
          />
        </motion.div>
      ))}
    </div>
  );
}

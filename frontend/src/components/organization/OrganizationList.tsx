import { motion } from "framer-motion";

import type { Organization } from "../../types/organization";
import { OrganizationCard } from "./OrganizationCard";

interface OrganizationListProps {
  organizations: Organization[];
}

export function OrganizationList({ organizations }: OrganizationListProps) {
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
      {organizations.map((org, index) => (
        <motion.div
          key={org.id}
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.4, delay: index * 0.05, ease: "easeOut" }}
        >
          <OrganizationCard organization={org} />
        </motion.div>
      ))}
    </div>
  );
}

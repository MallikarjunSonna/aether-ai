import type { KnowledgeCollection } from "../../types/knowledge";

const collectionLabels: Record<KnowledgeCollection, string> = {
  engineering: "Engineering",
  product: "Product",
  hr: "HR",
  legal: "Legal",
  marketing: "Marketing",
  "customer-support": "Customer Support",
  security: "Security",
  operations: "Operations",
};

const collectionColors: Record<KnowledgeCollection, string> = {
  engineering: "bg-blue-500/10 text-blue-400",
  product: "bg-purple-500/10 text-purple-400",
  hr: "bg-green-500/10 text-green-400",
  legal: "bg-red-500/10 text-red-400",
  marketing: "bg-amber-500/10 text-amber-400",
  "customer-support": "bg-emerald-500/10 text-emerald-400",
  security: "bg-cyan-500/10 text-cyan-400",
  operations: "bg-pink-500/10 text-pink-400",
};

interface KnowledgeCollectionBadgeProps {
  collection: KnowledgeCollection;
}

export function KnowledgeCollectionBadge({ collection }: KnowledgeCollectionBadgeProps) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-medium ${collectionColors[collection]}`}
    >
      {collectionLabels[collection]}
    </span>
  );
}

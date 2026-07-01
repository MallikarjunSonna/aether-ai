import {
  Headset,
  Lightbulb,
  Megaphone,
  Scale,
  Settings2,
  Shield,
  Terminal,
  Users,
} from "lucide-react";

import type { CollectionInfo, KnowledgeCollection } from "../../types/knowledge";

const collectionIcons: Record<KnowledgeCollection, typeof Terminal> = {
  engineering: Terminal,
  product: Lightbulb,
  hr: Users,
  legal: Scale,
  marketing: Megaphone,
  "customer-support": Headset,
  security: Shield,
  operations: Settings2,
};

interface KnowledgeCollectionCardProps {
  collection: CollectionInfo;
  active: boolean;
  onClick: (id: KnowledgeCollection) => void;
}

export function KnowledgeCollectionCard({
  collection,
  active,
  onClick,
}: KnowledgeCollectionCardProps) {
  const Icon = collectionIcons[collection.id];

  return (
    <button
      onClick={() => onClick(collection.id)}
      className={`group flex flex-col gap-2 rounded-xl border p-4 text-left transition-all duration-fast focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 ${
        active
          ? "border-primary/50 bg-primary/5"
          : "border-line/60 bg-surface hover:border-neutral-500"
      }`}
    >
      <span
        className={`flex h-10 w-10 items-center justify-center rounded-lg transition-colors duration-fast ${
          active
            ? "bg-primary/10 text-primary"
            : "bg-neutral-800 text-muted group-hover:bg-neutral-700"
        }`}
      >
        <Icon className="h-5 w-5" aria-hidden="true" />
      </span>
      <div>
        <p className="text-sm font-semibold text-ink">{collection.name}</p>
        <p className="mt-0.5 text-xs text-muted">{collection.description}</p>
      </div>
      <p className="text-xs text-muted">
        {collection.itemCount} {collection.itemCount === 1 ? "item" : "items"}
      </p>
    </button>
  );
}

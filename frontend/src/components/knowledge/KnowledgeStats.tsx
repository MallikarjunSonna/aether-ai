import {
  Archive,
  BookOpen,
  FileText,
  Heart,
} from "lucide-react";

interface KnowledgeStatsProps {
  totalItems: number;
  totalCollections: number;
  totalArchived: number;
  totalFavorites: number;
}

export function KnowledgeStats({
  totalItems,
  totalCollections,
  totalArchived,
  totalFavorites,
}: KnowledgeStatsProps) {
  const stats = [
    {
      label: "Total Items",
      value: totalItems,
      icon: BookOpen,
      color: "text-blue-400 bg-blue-400/10",
    },
    {
      label: "Collections",
      value: totalCollections,
      icon: FileText,
      color: "text-purple-400 bg-purple-400/10",
    },
    {
      label: "Favorites",
      value: totalFavorites,
      icon: Heart,
      color: "text-amber-400 bg-amber-400/10",
    },
    {
      label: "Archived",
      value: totalArchived,
      icon: Archive,
      color: "text-muted bg-neutral-800",
    },
  ];

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
      {stats.map((stat) => (
        <div
          key={stat.label}
          className="flex items-center gap-3 rounded-xl border border-line/60 bg-surface p-4"
        >
          <span className={`flex h-10 w-10 items-center justify-center rounded-lg ${stat.color}`}>
            <stat.icon className="h-5 w-5" aria-hidden="true" />
          </span>
          <div>
            <p className="text-2xl font-semibold text-ink">{stat.value}</p>
            <p className="text-xs text-muted">{stat.label}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

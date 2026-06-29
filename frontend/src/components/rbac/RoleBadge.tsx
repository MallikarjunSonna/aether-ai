import type { Role } from "../../types/rbac";
import { ROLE_LABELS } from "../../constants/permissions";

interface RoleBadgeProps {
  role: Role;
}

const BADGE_STYLES: Record<Role, string> = {
  owner: "bg-amber-500/10 text-amber-400 border-amber-500/20",
  admin: "bg-blue-500/10 text-blue-400 border-blue-500/20",
  manager: "bg-purple-500/10 text-purple-400 border-purple-500/20",
  member: "bg-green-500/10 text-green-400 border-green-500/20",
  viewer: "bg-neutral-500/10 text-neutral-400 border-neutral-500/20",
};

export function RoleBadge({ role }: RoleBadgeProps) {
  return (
    <span
      className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-[11px] font-medium ${BADGE_STYLES[role]}`}
      aria-label={`Role: ${ROLE_LABELS[role]}`}
    >
      {ROLE_LABELS[role]}
    </span>
  );
}

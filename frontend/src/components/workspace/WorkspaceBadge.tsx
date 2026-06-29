interface WorkspaceBadgeProps {
  isActive: boolean;
}

export function WorkspaceBadge({ isActive }: WorkspaceBadgeProps) {
  if (!isActive) return null;

  return (
    <span className="rounded-full bg-success/10 px-2 py-0.5 text-[11px] font-medium text-success">
      Active
    </span>
  );
}

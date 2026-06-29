import type { ReactNode } from "react";

import { usePermissions } from "../../hooks/usePermissions";
import type { Permission } from "../../types/rbac";
import { AccessDenied } from "./AccessDenied";

interface PermissionGuardProps {
  permission: Permission;
  permissions?: Permission[];
  mode?: "any" | "all";
  fallback?: ReactNode;
  children: ReactNode;
}

export function PermissionGuard({
  permission,
  permissions = [permission],
  mode = "all",
  fallback,
  children,
}: PermissionGuardProps) {
  const { canAny, canAll } = usePermissions();

  const hasAccess =
    mode === "any" ? canAny(permissions) : canAll(permissions);

  if (hasAccess) return <>{children}</>;

  if (fallback !== undefined) return <>{fallback}</>;

  return <AccessDenied />;
}

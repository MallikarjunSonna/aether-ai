import { useCallback, useMemo } from "react";

import { ROLE_PERMISSIONS } from "../mocks/permissions";
import { mockCurrentUserId, mockMemberships } from "../mocks/memberships";
import {
  getRoleForUser,
  hasAllPermissions,
  hasAnyPermission,
  hasPermission,
} from "../services/permissionService";
import type { Membership, Permission, Role } from "../types/rbac";

interface UsePermissionsOptions {
  userId?: string;
  organizationId?: string;
  workspaceId?: string;
  memberships?: Membership[];
}

interface UsePermissionsReturn {
  currentRole: Role | null;
  permissions: Permission[];
  can: (permission: Permission) => boolean;
  canAny: (permissions: Permission[]) => boolean;
  canAll: (permissions: Permission[]) => boolean;
}

export function usePermissions(
  options: UsePermissionsOptions = {},
): UsePermissionsReturn {
  const {
    userId = mockCurrentUserId,
    organizationId,
    workspaceId,
    memberships = mockMemberships,
  } = options;

  const currentRole = useMemo(
    () => getRoleForUser({ memberships, userId, organizationId, workspaceId }),
    [memberships, userId, organizationId, workspaceId],
  );

  const permissions = useMemo(() => {
    if (!currentRole) return [];
    return ROLE_PERMISSIONS[currentRole];
  }, [currentRole]);

  const can = useCallback(
    (permission: Permission) =>
      hasPermission({ memberships, userId, organizationId, workspaceId }, permission),
    [memberships, userId, organizationId, workspaceId],
  );

  const canAny = useCallback(
    (perms: Permission[]) =>
      hasAnyPermission({ memberships, userId, organizationId, workspaceId }, perms),
    [memberships, userId, organizationId, workspaceId],
  );

  const canAll = useCallback(
    (perms: Permission[]) =>
      hasAllPermissions({ memberships, userId, organizationId, workspaceId }, perms),
    [memberships, userId, organizationId, workspaceId],
  );

  return { currentRole, permissions, can, canAny, canAll };
}

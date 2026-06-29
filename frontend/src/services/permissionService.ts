import type { Membership, Permission, Role } from "../types/rbac";
import { ROLE_PERMISSIONS } from "../mocks/permissions";

export interface PermissionCheckParams {
  memberships: Membership[];
  userId: string;
  organizationId?: string;
  workspaceId?: string;
}

function getRole(
  memberships: Membership[],
  userId: string,
  organizationId?: string,
  workspaceId?: string,
): Role | null {
  const match = memberships.find(
    (m) =>
      m.userId === userId &&
      (organizationId ? m.organizationId === organizationId : true) &&
      (workspaceId ? m.workspaceId === workspaceId : true),
  );
  return match?.role ?? null;
}

function getPermissionsForRole(role: Role): Permission[] {
  return ROLE_PERMISSIONS[role] ?? [];
}

export function hasPermission(
  params: PermissionCheckParams,
  permission: Permission,
): boolean {
  const role = getRole(
    params.memberships,
    params.userId,
    params.organizationId,
    params.workspaceId,
  );
  if (!role) return false;
  return getPermissionsForRole(role).includes(permission);
}

export function hasAnyPermission(
  params: PermissionCheckParams,
  permissions: Permission[],
): boolean {
  const role = getRole(
    params.memberships,
    params.userId,
    params.organizationId,
    params.workspaceId,
  );
  if (!role) return false;
  const userPermissions = getPermissionsForRole(role);
  return permissions.some((p) => userPermissions.includes(p));
}

export function hasAllPermissions(
  params: PermissionCheckParams,
  permissions: Permission[],
): boolean {
  const role = getRole(
    params.memberships,
    params.userId,
    params.organizationId,
    params.workspaceId,
  );
  if (!role) return false;
  const userPermissions = getPermissionsForRole(role);
  return permissions.every((p) => userPermissions.includes(p));
}

export function getRoleForUser(
  params: PermissionCheckParams,
): Role | null {
  return getRole(
    params.memberships,
    params.userId,
    params.organizationId,
    params.workspaceId,
  );
}

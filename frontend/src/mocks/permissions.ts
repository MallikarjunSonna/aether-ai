import type { Permission, Role } from "../types/rbac";
import { ALL_PERMISSIONS } from "../constants/permissions";

export const ROLE_PERMISSIONS: Record<Role, Permission[]> = {
  owner: [...ALL_PERMISSIONS],
  admin: ALL_PERMISSIONS.filter(
    (p) => p !== "organization.delete",
  ),
  manager: ALL_PERMISSIONS.filter(
    (p) =>
      p !== "organization.delete" &&
      p !== "organization.update" &&
      p !== "workspace.delete" &&
      p !== "settings.update",
  ),
  member: ["workspace.read", "members.read", "ai.chat"],
  viewer: ["workspace.read", "members.read"],
};

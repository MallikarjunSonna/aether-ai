import type { Permission, Role } from "../types/rbac";

export const ALL_PERMISSIONS: readonly Permission[] = [
  "organization.read",
  "organization.update",
  "organization.delete",
  "workspace.read",
  "workspace.create",
  "workspace.update",
  "workspace.delete",
  "members.read",
  "members.invite",
  "members.remove",
  "ai.chat",
  "ai.agents",
  "ai.prompts",
  "settings.read",
  "settings.update",
] as const;

export const ROLE_HIERARCHY: readonly Role[] = [
  "owner",
  "admin",
  "manager",
  "member",
  "viewer",
] as const;

export const ROLE_LABELS: Record<Role, string> = {
  owner: "Owner",
  admin: "Admin",
  manager: "Manager",
  member: "Member",
  viewer: "Viewer",
};

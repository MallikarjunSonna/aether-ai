export type Role = "owner" | "admin" | "manager" | "member" | "viewer";

export type Permission =
  | "organization.read"
  | "organization.update"
  | "organization.delete"
  | "workspace.read"
  | "workspace.create"
  | "workspace.update"
  | "workspace.delete"
  | "members.read"
  | "members.invite"
  | "members.remove"
  | "ai.chat"
  | "ai.agents"
  | "ai.prompts"
  | "settings.read"
  | "settings.update";

export interface Membership {
  userId: string;
  organizationId: string;
  workspaceId: string;
  role: Role;
}

export interface PermissionCheckResult {
  granted: boolean;
  role: Role;
  missingPermissions: Permission[];
}

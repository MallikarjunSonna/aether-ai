import type { Membership } from "../types/rbac";

export const mockMemberships: Membership[] = [
  {
    userId: "user-1",
    organizationId: "org-1",
    workspaceId: "ws-1",
    role: "owner",
  },
  {
    userId: "user-1",
    organizationId: "org-1",
    workspaceId: "ws-3",
    role: "owner",
  },
  {
    userId: "user-2",
    organizationId: "org-1",
    workspaceId: "ws-1",
    role: "admin",
  },
  {
    userId: "user-3",
    organizationId: "org-1",
    workspaceId: "ws-1",
    role: "manager",
  },
  {
    userId: "user-4",
    organizationId: "org-1",
    workspaceId: "ws-1",
    role: "member",
  },
  {
    userId: "user-5",
    organizationId: "org-1",
    workspaceId: "ws-1",
    role: "viewer",
  },
  {
    userId: "user-2",
    organizationId: "org-2",
    workspaceId: "ws-2",
    role: "admin",
  },
  {
    userId: "user-1",
    organizationId: "org-4",
    workspaceId: "ws-4",
    role: "owner",
  },
];

export const mockCurrentUserId = "user-1";

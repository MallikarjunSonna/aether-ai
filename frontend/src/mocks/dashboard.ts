import type { DashboardData } from "../types/dashboard";

export const mockDashboardData: DashboardData = {
  stats: {
    totalOrganizations: 4,
    totalWorkspaces: 4,
    activeMembers: 24,
    aiRequestsToday: 1283,
  },
  activities: [
    {
      id: "act-1",
      type: "workspace_created",
      description: "Customer Success workspace was created.",
      timestamp: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
    },
    {
      id: "act-2",
      type: "organization_updated",
      description: "Aether AI organization settings were updated.",
      timestamp: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
    },
    {
      id: "act-3",
      type: "member_invited",
      description: "Sarah Chen was invited to Engineering workspace.",
      timestamp: new Date(Date.now() - 60 * 60 * 1000).toISOString(),
    },
    {
      id: "act-4",
      type: "prompt_published",
      description: "Code Review Assistant prompt was published.",
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: "act-5",
      type: "workspace_created",
      description: "Marketing workspace was created.",
      timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    },
  ],
  organizationSummary: {
    id: "org-1",
    name: "Aether AI",
    memberCount: 24,
    workspaceCount: 2,
  },
  workspaceSummary: {
    id: "ws-1",
    name: "Engineering",
    role: "Owner",
    activeProjects: 6,
  },
  aiUsage: {
    tokensUsedToday: 284750,
    aiRequests: 1283,
    agentsExecuted: 47,
  },
};

export interface DashboardStats {
  totalOrganizations: number;
  totalWorkspaces: number;
  activeMembers: number;
  aiRequestsToday: number;
}

export type ActivityType =
  | "workspace_created"
  | "organization_updated"
  | "member_invited"
  | "prompt_published";

export interface Activity {
  id: string;
  type: ActivityType;
  description: string;
  timestamp: string;
}

export interface OrganizationSummary {
  id: string;
  name: string;
  memberCount: number;
  workspaceCount: number;
}

export interface WorkspaceSummary {
  id: string;
  name: string;
  role: string;
  activeProjects: number;
}

export interface AIUsage {
  tokensUsedToday: number;
  aiRequests: number;
  agentsExecuted: number;
}

export interface DashboardData {
  stats: DashboardStats;
  activities: Activity[];
  organizationSummary: OrganizationSummary;
  workspaceSummary: WorkspaceSummary;
  aiUsage: AIUsage;
}

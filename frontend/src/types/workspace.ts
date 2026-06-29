export interface Workspace {
  id: string;
  name: string;
  slug: string;
  description: string;
  organizationId: string;
  organizationName: string;
  isActive: boolean;
  createdAt: string;
  memberCount: number;
}

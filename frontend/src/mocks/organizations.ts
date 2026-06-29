import type { Organization } from "../types/organization";

export const mockOrganizations: Organization[] = [
  {
    id: "org-1",
    name: "Aether AI",
    slug: "aether-ai",
    description: "Primary organization for Aether AI development and operations.",
    isActive: true,
    createdAt: "2025-09-15T08:00:00Z",
    memberCount: 24,
  },
  {
    id: "org-2",
    name: "Nexus Labs",
    slug: "nexus-labs",
    description: "Research and experimentation division for emerging AI models.",
    isActive: false,
    createdAt: "2025-11-01T10:30:00Z",
    memberCount: 12,
  },
  {
    id: "org-3",
    name: "Open Research",
    slug: "open-research",
    description: "Open-source AI research initiatives and community contributions.",
    isActive: false,
    createdAt: "2026-01-20T14:00:00Z",
    memberCount: 8,
  },
  {
    id: "org-4",
    name: "Enterprise Demo",
    slug: "enterprise-demo",
    description: "Demo environment for enterprise prospect evaluations.",
    isActive: false,
    createdAt: "2026-03-10T09:15:00Z",
    memberCount: 5,
  },
];

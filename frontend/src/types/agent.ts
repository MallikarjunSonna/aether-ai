export interface AgentConfig {
  id: string;
  name: string;
  description: string;
  model: string;
  provider: string;
  status: "idle" | "running" | "error" | "paused";
  capabilities: string[];
  maxSteps: number;
  temperature: number;
}

export interface PlanStep {
  id: string;
  type: "reason" | "retrieve" | "generate" | "transform" | "observe";
  description: string;
  status: "pending" | "running" | "completed" | "failed";
  dependsOn: string[];
  result?: string;
  startedAt?: string;
  completedAt?: string;
  duration?: number;
}

export interface AgentPlan {
  id: string;
  goal: string;
  steps: PlanStep[];
  status: "draft" | "running" | "completed" | "failed";
  createdAt: string;
  completedAt?: string;
}

export interface MemoryEntry {
  id: string;
  type: "context" | "conversation" | "working" | "observation";
  content: string;
  timestamp: string;
  metadata: Record<string, string>;
  ttl?: number;
}

export interface ToolParameter {
  name: string;
  type: "string" | "number" | "boolean" | "array";
  required: boolean;
  description: string;
}

export interface ToolDefinition {
  id: string;
  name: string;
  description: string;
  category: "retrieval" | "transformation" | "search" | "computation" | "integration";
  parameters: ToolParameter[];
  enabled: boolean;
}

export interface ExecutionTrace {
  id: string;
  stepId: string;
  type: "llm_call" | "tool_call" | "memory_access" | "planning";
  input: string;
  output: string;
  duration: number;
  timestamp: string;
  status: "success" | "error";
  error?: string;
}

export interface AgentExecution {
  id: string;
  agentId: string;
  plan: AgentPlan;
  traces: ExecutionTrace[];
  status: "pending" | "running" | "completed" | "failed";
  startedAt: string;
  completedAt?: string;
  totalDuration?: number;
}

export interface AgentRuntimeState {
  config: AgentConfig;
  currentPlan?: AgentPlan;
  memory: MemoryEntry[];
  tools: ToolDefinition[];
  executions: AgentExecution[];
  updatedAt: string;
}

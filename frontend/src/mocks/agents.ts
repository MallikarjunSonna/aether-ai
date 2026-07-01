import type { AgentConfig, AgentExecution, ExecutionTrace, MemoryEntry, ToolDefinition } from "../types/agent";

export const mockAgents: AgentConfig[] = [
  { id: "agent-1", name: "Research Analyst", description: "Researches topics and generates comprehensive summaries from multiple sources.", model: "gpt-4o", provider: "OpenAI", status: "idle", capabilities: ["web-research", "summarization", "source-citation"], maxSteps: 10, temperature: 0.3 },
  { id: "agent-2", name: "Code Reviewer", description: "Reviews code changes for quality, security, and best practices.", model: "claude-3-opus", provider: "Anthropic", status: "running", capabilities: ["code-review", "security-analysis", "refactoring-suggestions"], maxSteps: 8, temperature: 0.1 },
  { id: "agent-3", name: "Data Analyst", description: "Analyzes datasets and creates visual insights with statistical rigor.", model: "gemini-1.5-pro", provider: "Google AI", status: "idle", capabilities: ["data-analysis", "visualization", "statistical-testing"], maxSteps: 12, temperature: 0.2 },
  { id: "agent-4", name: "Content Writer", description: "Creates engaging content across formats with consistent brand voice.", model: "mistral-large", provider: "Mistral", status: "paused", capabilities: ["content-generation", "brand-voice", "seo-optimization"], maxSteps: 6, temperature: 0.7 },
];

export const mockMemory: MemoryEntry[] = [
  { id: "mem-1", type: "context", content: "Project context: Building enterprise AI platform with React frontend and FastAPI backend.", timestamp: new Date(Date.now() - 86400000).toISOString(), metadata: { project: "aether-ai" } },
  { id: "mem-2", type: "conversation", content: "User requested code review for PR #127 with focus on security vulnerabilities.", timestamp: new Date(Date.now() - 3600000).toISOString(), metadata: { pr: "#127", priority: "high" } },
  { id: "mem-3", type: "working", content: "Current task: Analyzing authentication flow for potential race conditions.", timestamp: new Date().toISOString(), metadata: { task: "auth-review" } },
  { id: "mem-4", type: "observation", content: "Detected rate limiting issue in API gateway. 429 errors increased 15%.", timestamp: new Date(Date.now() - 1800000).toISOString(), metadata: { severity: "warning" } },
];

export const mockTools: ToolDefinition[] = [
  { id: "tool-1", name: "web_search", description: "Search the web for current information on a topic.", category: "search", parameters: [{ name: "query", type: "string", required: true, description: "Search query" }, { name: "max_results", type: "number", required: false, description: "Max results (default: 5)" }], enabled: true },
  { id: "tool-2", name: "code_analyzer", description: "Analyze source code for issues, complexity, and security vulnerabilities.", category: "transformation", parameters: [{ name: "code", type: "string", required: true, description: "Source code to analyze" }, { name: "language", type: "string", required: true, description: "Programming language" }], enabled: true },
  { id: "tool-3", name: "data_query", description: "Query structured data using natural language.", category: "retrieval", parameters: [{ name: "query", type: "string", required: true, description: "Natural language query" }, { name: "dataset", type: "string", required: true, description: "Dataset name" }], enabled: true },
  { id: "tool-4", name: "vector_search", description: "Search vector embeddings for semantically similar content.", category: "retrieval", parameters: [{ name: "query", type: "string", required: true, description: "Search text" }, { name: "collection", type: "string", required: true, description: "Vector collection name" }, { name: "top_k", type: "number", required: false, description: "Number of results" }], enabled: false },
  { id: "tool-5", name: "content_optimizer", description: "Optimize content for SEO, readability, and brand voice.", category: "transformation", parameters: [{ name: "content", type: "string", required: true, description: "Content to optimize" }, { name: "style", type: "string", required: false, description: "Style guide" }], enabled: true },
];

function makeTrace(id: string, stepId: string, type: ExecutionTrace["type"], input: string, output: string, duration: number): ExecutionTrace {
  return { id, stepId, type, input, output, duration, timestamp: new Date().toISOString(), status: "success" };
}

export const mockRunningExecution: AgentExecution = {
  id: "exec-1",
  agentId: "agent-2",
  plan: {
    id: "plan-code-1",
    goal: "Review PR #127 for security vulnerabilities and code quality issues",
    steps: [
      { id: "cs1", type: "retrieve", description: "Fetch PR diff from repository", status: "completed", dependsOn: [], result: "Fetched diff (342 lines changed across 8 files)", startedAt: new Date(Date.now() - 30000).toISOString(), completedAt: new Date(Date.now() - 25000).toISOString(), duration: 5000 },
      { id: "cs2", type: "reason", description: "Analyze diff for security vulnerabilities", status: "completed", dependsOn: ["cs1"], result: "Found 2 potential XSS vulnerabilities in user input handling", startedAt: new Date(Date.now() - 25000).toISOString(), completedAt: new Date(Date.now() - 15000).toISOString(), duration: 10000 },
      { id: "cs3", type: "reason", description: "Evaluate code quality and best practices", status: "running", dependsOn: ["cs1"], startedAt: new Date(Date.now() - 15000).toISOString() },
      { id: "cs4", type: "generate", description: "Generate review summary with severity levels", status: "pending", dependsOn: ["cs2", "cs3"] },
    ],
    status: "running",
    createdAt: new Date(Date.now() - 60000).toISOString(),
  },
  traces: [
    makeTrace("tr-1", "cs1", "tool_call", "Fetch PR #127 diff from repository", "Successfully retrieved diff: 342 lines changed across 8 files", 5000),
    makeTrace("tr-2", "cs2", "llm_call", "Analyze diff for: SQL injection, XSS, CSRF, authentication bypass", "Analysis complete: 2 XSS vulnerabilities identified", 10000),
  ],
  status: "running",
  startedAt: new Date(Date.now() - 60000).toISOString(),
};

export const mockAgentRuntimeStates = mockAgents.map((config) => ({
  config,
  currentPlan: config.id === "agent-2" ? mockRunningExecution.plan : undefined,
  memory: mockMemory,
  tools: mockTools,
  executions: config.id === "agent-2" ? [mockRunningExecution] : [],
  updatedAt: new Date().toISOString(),
}));

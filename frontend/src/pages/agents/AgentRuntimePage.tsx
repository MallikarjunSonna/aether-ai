import { useState } from "react";

import { AgentCard } from "../../components/agents/AgentCard";
import { AgentExecutionViewer } from "../../components/agents/AgentExecutionViewer";
import { AgentMemoryPanel } from "../../components/agents/AgentMemoryPanel";
import { AgentPlanViewer } from "../../components/agents/AgentPlanViewer";
import { AgentToolRegistry } from "../../components/agents/AgentToolRegistry";
import { mockAgentRuntimeStates } from "../../mocks/agents";

export function AgentRuntimePage() {
  const [selectedId, setSelectedId] = useState(mockAgentRuntimeStates[0].config.id);
  const selected = mockAgentRuntimeStates.find((s) => s.config.id === selectedId);

  return (
    <div className="mx-auto max-w-6xl">
      <div className="mb-6">
        <h1 className="text-xl font-semibold tracking-tight text-ink">AI Agent Runtime</h1>
        <p className="mt-1 text-sm text-muted">
          Manage agent configurations, execution plans, memory, and tools.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {mockAgentRuntimeStates.map((state) => (
          <AgentCard
            key={state.config.id}
            agent={state.config}
            isSelected={selectedId === state.config.id}
            onSelect={setSelectedId}
          />
        ))}
      </div>

      {selected && (
        <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div className="space-y-6 lg:col-span-2">
            {selected.currentPlan && <AgentPlanViewer plan={selected.currentPlan} />}
            {selected.executions.length > 0 && (
              <AgentExecutionViewer execution={selected.executions[0]} />
            )}
            {!selected.currentPlan && !selected.executions.length && (
              <div className="rounded-xl border border-line/60 bg-surface p-8 text-center">
                <p className="text-sm text-muted">Select an agent with an active execution to view details.</p>
              </div>
            )}
          </div>
          <div className="space-y-6">
            <AgentMemoryPanel entries={selected.memory} />
            <AgentToolRegistry tools={selected.tools} />
          </div>
        </div>
      )}
    </div>
  );
}

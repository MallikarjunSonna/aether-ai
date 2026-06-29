import { useState } from "react";

import { CreateWorkspaceModal } from "../../components/workspace/CreateWorkspaceModal";
import { EmptyWorkspaces } from "../../components/workspace/EmptyWorkspaces";
import { WorkspaceError } from "../../components/workspace/WorkspaceError";
import { WorkspaceList } from "../../components/workspace/WorkspaceList";
import { WorkspaceSkeleton } from "../../components/workspace/WorkspaceSkeleton";
import { WorkspaceSwitcher } from "../../components/workspace/WorkspaceSwitcher";
import { mockWorkspaces } from "../../mocks/workspaces";

export function WorkspacesPage() {
  const [createOpen, setCreateOpen] = useState(false);
  const [loading] = useState(false);
  const [error, setError] = useState(false);

  const workspaces = mockWorkspaces;

  function handleCreate() {
    setCreateOpen(true);
  }

  return (
    <div className="mx-auto max-w-5xl">
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-semibold tracking-tight text-ink">Workspaces</h1>
          <p className="mt-1 text-sm text-muted">Organize your AI projects into workspaces.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="w-56">
            <WorkspaceSwitcher onCreate={handleCreate} />
          </div>
          <button
            onClick={handleCreate}
            className="inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-white transition-colors duration-fast hover:bg-blue-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50"
          >
            New Workspace
          </button>
        </div>
      </div>

      {loading && <WorkspaceSkeleton />}

      {!loading && error && (
        <WorkspaceError onRetry={() => setError(false)} />
      )}

      {!loading && !error && workspaces.length === 0 && (
        <EmptyWorkspaces onCreate={handleCreate} />
      )}

      {!loading && !error && workspaces.length > 0 && (
        <WorkspaceList workspaces={workspaces} />
      )}

      <CreateWorkspaceModal open={createOpen} onClose={() => setCreateOpen(false)} />
    </div>
  );
}

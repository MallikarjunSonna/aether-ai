import { useState } from "react";

import { CreateOrganizationModal } from "../../components/organization/CreateOrganizationModal";
import { EmptyOrganizations } from "../../components/organization/EmptyOrganizations";
import { OrganizationList } from "../../components/organization/OrganizationList";
import { OrganizationSwitcher } from "../../components/organization/OrganizationSwitcher";
import { mockOrganizations } from "../../mocks/organizations";

export function OrganizationsPage() {
  const [createOpen, setCreateOpen] = useState(false);

  return (
    <div className="mx-auto max-w-5xl">
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-semibold tracking-tight text-ink">Organizations</h1>
          <p className="mt-1 text-sm text-muted">Manage your organizations and teams.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="w-56">
            <OrganizationSwitcher onCreate={() => setCreateOpen(true)} />
          </div>
          <button
            onClick={() => setCreateOpen(true)}
            className="inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-white transition-colors duration-fast hover:bg-blue-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50"
          >
            New Organization
          </button>
        </div>
      </div>

      {mockOrganizations.length === 0 ? (
        <EmptyOrganizations onCreate={() => setCreateOpen(true)} />
      ) : (
        <OrganizationList organizations={mockOrganizations} />
      )}

      <CreateOrganizationModal open={createOpen} onClose={() => setCreateOpen(false)} />
    </div>
  );
}

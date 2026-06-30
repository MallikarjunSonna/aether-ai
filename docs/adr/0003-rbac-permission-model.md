# 0003 — Permission-Based RBAC

**Status:** Accepted

**Date:** 2026-06-28

## Context

Aether AI requires fine-grained access control across organizations, workspaces, and features. Early approaches considered role-name checks (e.g., `if (role === "admin")`) but these couple authorization logic to role hierarchy — adding a new permission requires finding every role-name check and deciding whether to include the new role.

The project needed an authorization model that:

- Decouples permission logic from role names
- Supports granular feature-level access (e.g., "can update workspace settings" independent of role)
- Works across organization and workspace scopes
- Can be synchronized with a backend authority without restructuring the frontend

## Decision

Use permission strings (e.g., `"workspace.update"`, `"members.invite"`) as the atomic unit of authorization. Roles are defined as collections of permissions. The frontend checks permissions rather than role names.

### Permission model

```
Permission = "resource.action"
Example: "workspace.update"
```

Each permission represents a single capability. Permissions are grouped by resource type:

| Resource      | Permissions                                             |
|---------------|---------------------------------------------------------|
| `organization`| `read`, `update`, `delete`                              |
| `workspace`   | `read`, `create`, `update`, `delete`                    |
| `members`     | `read`, `invite`, `remove`                              |
| `ai`          | `chat`, `agents`, `prompts`                             |
| `settings`    | `read`, `update`                                        |

### Role hierarchy

Roles are ordered from most permissive to least permissive:

```
owner > admin > manager > member > viewer
```

Each role maps to a set of permissions. Higher roles inherit all permissions of lower roles plus additional ones. The mapping is defined in `mocks/permissions.ts` (frontend) and will be mirrored in the backend database.

### Frontend implementation

**PermissionGuard** — A component that conditionally renders children based on required permissions. Usage:

```tsx
<PermissionGuard permission="workspace.update">
  <EditButton />
</PermissionGuard>
```

**PermissionService** — Pure functions for checking permissions against a user's role:

- `hasPermission(params, permission)` — single permission check
- `hasAnyPermission(params, permissions)` — any-of check
- `hasAllPermissions(params, permissions)` — all-of check
- `getRoleForUser(params)` — role resolution

**usePermissions hook** — React hook wrapping `PermissionService` for use in components. Returns:

- `can(permission)` — shorthand for `hasPermission`
- `canAny(permissions)` — shorthand for `hasAnyPermission`
- `canAll(permissions)` — shorthand for `hasAllPermissions`
- `role` — current user's resolved role

The hook accepts `currentUserId` and an array of `Membership` objects (from `AuthContext`), resolving the role by finding the matching membership for the active organization or workspace.

**RoleBadge** — A display component that renders a styled badge for a given role name.

### Future backend synchronization

The permission set and role-permission mapping will be stored in the backend database and exposed via an API endpoint. The frontend will fetch the mapping on login and cache it. This allows administrators to customize role permissions without a frontend deployment.

## Alternatives Considered

### Role-name checks

Direct role comparisons (`if (role === "admin")`) are the simplest approach and require no permission mapping. However, they scatter role knowledge across the codebase. Adding a new role (e.g., "auditor") requires finding every role-name check site and deciding whether the new role should be included. Role-name checks also make it impossible to grant specific permissions without assigning a full role.

**Rejected** because it does not scale past a few roles and makes permission audits impossible without reading every component.

### Casbin / OPA integration

Full policy engine integration (Casbin, Open Policy Agent) provides sophisticated policy evaluation with support for hierarchical policies, resource-level rules, and external data. However, these tools add significant complexity, require learning a policy language, and are overkill for the current stage of the project.

**Deferred** until the permission model proves insufficient for production requirements.

### Backend-only authorization

All authorization decisions are made on the server. The frontend never checks permissions and relies on the backend to return 403 responses. This is the most secure approach but provides a poor user experience — users see buttons that lead to error pages and must wait for a round trip to discover they lack access. It also increases backend load from unauthorized requests.

**Rejected** for the frontend layer because it degrades UX. The frontend checks are a UX optimization; backend authorization remains the security enforcement point.

## Consequences

### Positive

- Adding a new permission requires adding one string constant and assigning it to roles. No component changes are needed.
- Permission checks are self-documenting — `can("workspace.update")` clearly expresses intent without referencing role hierarchy.
- The same permission model works for feature flags — a permission like `"ai.chat"` can gate an entire UI section.
- Role-to-permission mapping can be changed independently of component code.
- The permission string format naturally extends to resource-specific checks (e.g., `"workspace:ws-1.update"` for object-level authorization).

### Negative

- Permission strings are not type-safe across the entire system. A typo in a permission name silently grants or denies access. The `mockCurrentUserId` and hardcoded memberships in development mean this may not be caught until backend integration.
- The frontend permission mapping is duplicated in `mocks/permissions.ts` until the backend API is available. Changes must be made in both places.
- Role resolution requires the caller to know the current organization and workspace context. Nested or cross-organization permission checks are not well-supported by the current model.

### Neutral

- The permission model is inspired by AWS IAM action strings and Kubernetes RBAC verb-resource patterns. Developers familiar with these systems will recognize the convention.
- The `PermissionGuard` component and `usePermissions` hook are frontend-only. The backend will implement its own authorization layer with the same permission strings, maintaining the enforcement boundary.

## Future Work

- Backend API endpoint for permission definitions (`GET /api/v1/permissions`)
- Backend authorization middleware using the same permission string model
- Object-level permissions (`workspace:ws-1.update`)
- Permission caching and invalidation strategy
- Admin UI for custom role-permission mapping
- Permission audit log for compliance tracking

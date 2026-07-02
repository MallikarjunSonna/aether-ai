import {
  BarChart3,
  FolderKanban,
  Settings,
} from "lucide-react";
import { createBrowserRouter } from "react-router-dom";

import { AgentRuntimePage } from "./pages/agents/AgentRuntimePage";
import { AuthLayout } from "./layouts/AuthLayout";
import { DashboardLayout } from "./layouts/DashboardLayout";
import { RootLayout } from "./layouts/RootLayout";
import { AIChatPage } from "./pages/chat/AIChatPage";
import { ConnectorHubPage } from "./pages/connectors/ConnectorHubPage";
import { DashboardHome } from "./pages/DashboardHome";
import { DashboardPage } from "./pages/DashboardPage";
import { KnowledgeHubPage } from "./pages/knowledge/KnowledgeHubPage";
import { OpsCenterPage } from "./pages/ops/OpsCenterPage";
import { OrganizationsPage } from "./pages/organizations/OrganizationsPage";
import { PlaceholderPage } from "./pages/placeholder/PlaceholderPage";
import { PromptLibraryPage } from "./pages/prompts/PromptLibraryPage";
import { RAGExplorerPage } from "./pages/rag/RAGExplorerPage";
import { WorkspacesPage } from "./pages/workspaces/WorkspacesPage";
import { ForgotPasswordPage } from "./pages/auth/ForgotPasswordPage";
import { LoginPage } from "./pages/auth/LoginPage";
import { RegisterPage } from "./pages/auth/RegisterPage";
import { GuestRoute } from "./routes/GuestRoute";
import { ProtectedRoute } from "./routes/ProtectedRoute";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    children: [
      {
        index: true,
        element: <DashboardPage />,
      },
      {
        path: "dashboard",
        element: (
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        ),
        children: [
          { index: true, element: <DashboardHome /> },
          { path: "chat", element: <AIChatPage /> },
          { path: "agents", element: <AgentRuntimePage /> },
          { path: "prompts", element: <PromptLibraryPage /> },
          { path: "knowledge", element: <KnowledgeHubPage /> },
          { path: "documents", element: <RAGExplorerPage /> },
          { path: "ops", element: <OpsCenterPage /> },
          { path: "projects", element: <PlaceholderPage title="Projects" icon={FolderKanban} /> },
          { path: "organizations", element: <OrganizationsPage /> },
          { path: "workspaces", element: <WorkspacesPage /> },
          { path: "analytics", element: <PlaceholderPage title="Analytics" icon={BarChart3} /> },
          { path: "connectors", element: <ConnectorHubPage /> },
          { path: "settings", element: <PlaceholderPage title="Settings" icon={Settings} /> },
        ],
      },
    ],
  },
  {
    path: "/login",
    element: (
      <GuestRoute>
        <AuthLayout>
          <LoginPage />
        </AuthLayout>
      </GuestRoute>
    ),
  },
  {
    path: "/register",
    element: (
      <GuestRoute>
        <AuthLayout>
          <RegisterPage />
        </AuthLayout>
      </GuestRoute>
    ),
  },
  {
    path: "/forgot-password",
    element: (
      <AuthLayout>
        <ForgotPasswordPage />
      </AuthLayout>
    ),
  },
]);

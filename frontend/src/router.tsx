import {
  BarChart3,
  Bot,
  File,
  FileText,
  FolderKanban,
  Library,
  Settings,
} from "lucide-react";
import { createBrowserRouter } from "react-router-dom";

import { AuthLayout } from "./layouts/AuthLayout";
import { DashboardLayout } from "./layouts/DashboardLayout";
import { RootLayout } from "./layouts/RootLayout";
import { AIChatPage } from "./pages/chat/AIChatPage";
import { DashboardHome } from "./pages/DashboardHome";
import { DashboardPage } from "./pages/DashboardPage";
import { OrganizationsPage } from "./pages/organizations/OrganizationsPage";
import { PlaceholderPage } from "./pages/placeholder/PlaceholderPage";
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
          { path: "agents", element: <PlaceholderPage title="AI Agents" icon={Bot} /> },
          { path: "prompts", element: <PlaceholderPage title="Prompt Library" icon={FileText} /> },
          { path: "knowledge", element: <PlaceholderPage title="Knowledge Base" icon={Library} /> },
          { path: "documents", element: <PlaceholderPage title="Documents" icon={File} /> },
          { path: "projects", element: <PlaceholderPage title="Projects" icon={FolderKanban} /> },
          { path: "organizations", element: <OrganizationsPage /> },
          { path: "workspaces", element: <WorkspacesPage /> },
          { path: "analytics", element: <PlaceholderPage title="Analytics" icon={BarChart3} /> },
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

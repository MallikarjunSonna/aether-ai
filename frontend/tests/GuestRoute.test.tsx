import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";

import { GuestRoute } from "../src/routes/GuestRoute";

vi.mock("../src/hooks/useAuth", () => ({
  useAuth: vi.fn(),
}));

import { useAuth } from "../src/hooks/useAuth";
const mockUseAuth = vi.mocked(useAuth);

function renderWithRouter(children: React.ReactNode, initialRoute = "/") {
  return render(
    <MemoryRouter initialEntries={[initialRoute]}>
      <Routes>
        <Route path="/" element={children} />
        <Route path="/dashboard" element={<div>Dashboard Page</div>} />
      </Routes>
    </MemoryRouter>,
  );
}

describe("GuestRoute", () => {
  it("renders children when user is not authenticated", () => {
    mockUseAuth.mockReturnValue({
      isAuthenticated: false,
      isLoading: false,
      user: null,
      login: vi.fn(),
      register: vi.fn(),
      logout: vi.fn(),
    });

    renderWithRouter(
      <GuestRoute>
        <div>Guest Content</div>
      </GuestRoute>,
    );

    expect(screen.getByText("Guest Content")).toBeInTheDocument();
  });

  it("redirects to /dashboard when user is authenticated", () => {
    mockUseAuth.mockReturnValue({
      isAuthenticated: true,
      isLoading: false,
      user: { id: "user-1" },
      login: vi.fn(),
      register: vi.fn(),
      logout: vi.fn(),
    });

    renderWithRouter(
      <GuestRoute>
        <div>Guest Content</div>
      </GuestRoute>,
    );

    expect(screen.getByText("Dashboard Page")).toBeInTheDocument();
    expect(screen.queryByText("Guest Content")).not.toBeInTheDocument();
  });

  it("renders nothing while loading", () => {
    mockUseAuth.mockReturnValue({
      isAuthenticated: false,
      isLoading: true,
      user: null,
      login: vi.fn(),
      register: vi.fn(),
      logout: vi.fn(),
    });

    const { container } = renderWithRouter(
      <GuestRoute>
        <div>Guest Content</div>
      </GuestRoute>,
    );

    expect(container.innerHTML).toBe("");
  });

  it("renders nothing while loading even if user is authenticated", () => {
    mockUseAuth.mockReturnValue({
      isAuthenticated: true,
      isLoading: true,
      user: { id: "user-1" },
      login: vi.fn(),
      register: vi.fn(),
      logout: vi.fn(),
    });

    const { container } = renderWithRouter(
      <GuestRoute>
        <div>Guest Content</div>
      </GuestRoute>,
    );

    expect(container.innerHTML).toBe("");
  });
});

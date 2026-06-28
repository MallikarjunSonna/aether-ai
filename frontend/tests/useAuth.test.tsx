import { describe, it, expect, vi } from "vitest";
import { render, renderHook } from "@testing-library/react";

import { AuthContext } from "../src/contexts/AuthContext";
import type { AuthContextValue } from "../src/contexts/AuthContext";
import { useAuth } from "../src/hooks/useAuth";

function createWrapper(value: AuthContextValue) {
  return function Wrapper({ children }: { children: React.ReactNode }) {
    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
  };
}

const dummyContext: AuthContextValue = {
  user: { id: "user-1" },
  isAuthenticated: true,
  isLoading: false,
  login: async () => {},
  register: async () => {},
  logout: async () => {},
};

describe("useAuth", () => {
  it("returns the auth context when used inside AuthProvider", () => {
    const { result } = renderHook(() => useAuth(), {
      wrapper: createWrapper(dummyContext),
    });

    expect(result.current).toBe(dummyContext);
  });

  it("returns the user from context", () => {
    const { result } = renderHook(() => useAuth(), {
      wrapper: createWrapper(dummyContext),
    });

    expect(result.current.user).toEqual({ id: "user-1" });
  });

  it("returns isAuthenticated from context", () => {
    const { result } = renderHook(() => useAuth(), {
      wrapper: createWrapper(dummyContext),
    });

    expect(result.current.isAuthenticated).toBe(true);
  });

  it("throws an error when used outside AuthProvider", () => {
    const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});

    expect(() => renderHook(() => useAuth())).toThrow(
      "useAuth must be used within an AuthProvider.",
    );

    consoleSpy.mockRestore();
  });

  it("throws on render when no provider wraps the component", () => {
    const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});

    function TestComponent() {
      useAuth();
      return null;
    }

    expect(() => render(<TestComponent />)).toThrow("useAuth must be used within an AuthProvider.");

    consoleSpy.mockRestore();
  });
});

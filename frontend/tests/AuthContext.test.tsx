import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, waitFor, act } from "@testing-library/react";

import { AuthProvider } from "../src/contexts/AuthContext";
import { useAuth } from "../src/hooks/useAuth";
import { tokenStorage } from "../src/services/tokenStorage";

const fakeToken =
  btoa(JSON.stringify({ alg: "HS256" })) +
  "." +
  btoa(JSON.stringify({ sub: "user-123" })) +
  ".fakesig";

const fakeTokens = {
  access_token: fakeToken,
  refresh_token: "refresh-token-456",
  token_type: "bearer",
};

vi.mock("../src/api/auth", () => ({
  login: vi.fn(),
  register: vi.fn(),
  refresh: vi.fn(),
  logout: vi.fn(),
}));

import * as authApi from "../src/api/auth";
const mockLogin = vi.mocked(authApi.login);
const mockRegister = vi.mocked(authApi.register);
const mockLogout = vi.mocked(authApi.logout);

beforeEach(() => {
  localStorage.clear();
  vi.clearAllMocks();
});

function renderAuthHook() {
  return renderHook(() => useAuth(), { wrapper: AuthProvider });
}

describe("AuthContext", () => {
  describe("initial state", () => {
    it("has null user when no token is stored", async () => {
      const { result } = renderAuthHook();

      await waitFor(() => expect(result.current.isLoading).toBe(false));

      expect(result.current.user).toBeNull();
      expect(result.current.isAuthenticated).toBe(false);
    });

    it("restores user from stored access token", async () => {
      tokenStorage.setAccessToken(fakeToken);

      const { result } = renderAuthHook();

      await waitFor(() => expect(result.current.isLoading).toBe(false));

      expect(result.current.user).toEqual({ id: "user-123" });
      expect(result.current.isAuthenticated).toBe(true);
    });

    it("completes loading after initialization", () => {
      const { result } = renderAuthHook();

      expect(result.current.isLoading).toBe(false);
    });
  });

  describe("login", () => {
    it("sets user on successful login", async () => {
      mockLogin.mockResolvedValue(fakeTokens);
      const { result } = renderAuthHook();

      await waitFor(() => expect(result.current.isLoading).toBe(false));

      await act(async () => {
        await result.current.login("user@test.com", "password123");
      });

      expect(result.current.user).toEqual({ id: "user-123" });
      expect(result.current.isAuthenticated).toBe(true);
    });

    it("stores tokens after successful login", async () => {
      mockLogin.mockResolvedValue(fakeTokens);
      const { result } = renderAuthHook();

      await waitFor(() => expect(result.current.isLoading).toBe(false));

      await act(async () => {
        await result.current.login("user@test.com", "password123");
      });

      expect(tokenStorage.getAccessToken()).toBe(fakeToken);
      expect(tokenStorage.getRefreshToken()).toBe("refresh-token-456");
    });

    it("calls login API with email and password", async () => {
      mockLogin.mockResolvedValue(fakeTokens);
      const { result } = renderAuthHook();

      await waitFor(() => expect(result.current.isLoading).toBe(false));

      await act(async () => {
        await result.current.login("alice@test.com", "secret");
      });

      expect(mockLogin).toHaveBeenCalledWith({
        email: "alice@test.com",
        password: "secret",
      });
    });

    it("preserves logged-in user across re-renders", async () => {
      mockLogin.mockResolvedValue(fakeTokens);
      const { result, rerender } = renderAuthHook();

      await waitFor(() => expect(result.current.isLoading).toBe(false));

      await act(async () => {
        await result.current.login("user@test.com", "password123");
      });

      rerender();

      expect(result.current.user).toEqual({ id: "user-123" });
      expect(result.current.isAuthenticated).toBe(true);
    });
  });

  describe("register", () => {
    it("sets user on successful registration", async () => {
      mockRegister.mockResolvedValue(fakeTokens);
      const { result } = renderAuthHook();

      await waitFor(() => expect(result.current.isLoading).toBe(false));

      await act(async () => {
        await result.current.register({
          email: "new@test.com",
          username: "newuser",
          password: "password123",
        });
      });

      expect(result.current.user).toEqual({ id: "user-123" });
      expect(result.current.isAuthenticated).toBe(true);
    });

    it("stores tokens after successful registration", async () => {
      mockRegister.mockResolvedValue(fakeTokens);
      const { result } = renderAuthHook();

      await waitFor(() => expect(result.current.isLoading).toBe(false));

      await act(async () => {
        await result.current.register({
          email: "new@test.com",
          username: "newuser",
          password: "password123",
        });
      });

      expect(tokenStorage.getAccessToken()).toBe(fakeToken);
      expect(tokenStorage.getRefreshToken()).toBe("refresh-token-456");
    });

    it("calls register API with registration data", async () => {
      mockRegister.mockResolvedValue(fakeTokens);
      const { result } = renderAuthHook();
      const registrationData = {
        email: "bob@test.com",
        username: "bob",
        password: "secure",
        full_name: "Bob Smith",
      };

      await waitFor(() => expect(result.current.isLoading).toBe(false));

      await act(async () => {
        await result.current.register(registrationData);
      });

      expect(mockRegister).toHaveBeenCalledWith(registrationData);
    });
  });

  describe("logout", () => {
    it("clears user on logout", async () => {
      mockLogin.mockResolvedValue(fakeTokens);
      const { result } = renderAuthHook();

      await waitFor(() => expect(result.current.isLoading).toBe(false));

      await act(async () => {
        await result.current.login("user@test.com", "password123");
      });

      expect(result.current.isAuthenticated).toBe(true);

      await act(async () => {
        await result.current.logout();
      });

      expect(result.current.user).toBeNull();
      expect(result.current.isAuthenticated).toBe(false);
    });

    it("clears stored tokens on logout", async () => {
      tokenStorage.setTokens(fakeToken, "refresh-token-456");
      const { result } = renderAuthHook();

      await waitFor(() => expect(result.current.isLoading).toBe(false));

      await act(async () => {
        await result.current.logout();
      });

      expect(tokenStorage.getAccessToken()).toBeNull();
      expect(tokenStorage.getRefreshToken()).toBeNull();
    });

    it("calls logout API", async () => {
      tokenStorage.setTokens(fakeToken, "refresh-token-456");
      const { result } = renderAuthHook();

      await waitFor(() => expect(result.current.isLoading).toBe(false));

      await act(async () => {
        await result.current.logout();
      });

      expect(mockLogout).toHaveBeenCalledOnce();
    });

    it("still clears local state if logout API call fails", async () => {
      mockLogout.mockRejectedValue(new Error("Network error"));
      tokenStorage.setTokens(fakeToken, "refresh-token-456");
      const { result } = renderAuthHook();

      await waitFor(() => expect(result.current.isLoading).toBe(false));

      await act(async () => {
        await result.current.logout();
      });

      expect(result.current.user).toBeNull();
      expect(result.current.isAuthenticated).toBe(false);
    });
  });
});

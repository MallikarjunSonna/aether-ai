import { createContext, useCallback, useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";

import * as authApi from "../api/auth";
import { tokenStorage } from "../services/tokenStorage";

export interface User {
  id: string;
}

function decodeUserFromToken(token: string): User | null {
  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    if (typeof payload.sub === "string" && payload.sub.length > 0) {
      return { id: payload.sub };
    }
    return null;
  } catch {
    return null;
  }
}

function getInitialUser(): User | null {
  const token = tokenStorage.getAccessToken();
  if (!token) return null;
  return decodeUserFromToken(token);
}

export interface AuthContextValue {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (data: authApi.RegisterBody) => Promise<void>;
  logout: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(getInitialUser);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsLoading(false);
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    const tokens = await authApi.login({ email, password });
    tokenStorage.setTokens(tokens.access_token, tokens.refresh_token);
    const decoded = decodeUserFromToken(tokens.access_token);
    setUser(decoded);
  }, []);

  const register = useCallback(async (data: authApi.RegisterBody) => {
    const tokens = await authApi.register(data);
    tokenStorage.setTokens(tokens.access_token, tokens.refresh_token);
    const decoded = decodeUserFromToken(tokens.access_token);
    setUser(decoded);
  }, []);

  const logout = useCallback(async () => {
    try {
      await authApi.logout();
    } catch {
      // Proceed with local logout even if the API call fails
    }
    tokenStorage.clear();
    setUser(null);
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      isAuthenticated: user !== null,
      isLoading,
      login,
      register,
      logout,
    }),
    [user, isLoading, login, register, logout],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

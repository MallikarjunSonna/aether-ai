import { apiRequest } from "./client";
import { tokenStorage } from "../services/tokenStorage";

export interface TokenData {
  access_token: string;
  refresh_token: string;
  token_type: string;
}

interface AuthResponse {
  success: boolean;
  data: TokenData;
  message?: string;
}

interface MessageResponse {
  success: boolean;
  message: string;
}

export interface RegisterBody {
  email: string;
  username: string;
  password: string;
  full_name?: string;
}

export interface LoginBody {
  email: string;
  password: string;
}

export async function login(body: LoginBody): Promise<TokenData> {
  const res = await apiRequest<AuthResponse>("/api/v1/auth/login", {
    method: "POST",
    body,
  });
  return res.data;
}

export async function register(body: RegisterBody): Promise<TokenData> {
  const res = await apiRequest<AuthResponse>("/api/v1/auth/register", {
    method: "POST",
    body,
  });
  return res.data;
}

export async function refresh(refreshToken: string): Promise<TokenData> {
  const res = await apiRequest<AuthResponse>("/api/v1/auth/refresh", {
    method: "POST",
    body: { refresh_token: refreshToken },
  });
  return res.data;
}

export async function logout(): Promise<void> {
  const refreshToken = tokenStorage.getRefreshToken();
  await apiRequest<MessageResponse>("/api/v1/auth/logout", {
    method: "POST",
    body: { refresh_token: refreshToken ?? "" },
    authenticated: true,
  });
}

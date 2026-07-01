import { apiRequest } from "./client";
import type { ProviderType } from "../types/ai";

interface ApiSuccessResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

interface ApiProviderInfo {
  type: ProviderType;
  name: string;
  models: ApiModel[];
}

interface ApiModel {
  id: string;
  provider: ProviderType;
  name: string;
  capabilities: string[];
  description?: string;
  max_tokens?: number;
  supports_streaming: boolean;
}

interface ApiChatResponse {
  id: string;
  model: string;
  provider: ProviderType;
  message: { role: string; content: string };
  usage: { prompt_tokens: number; completion_tokens: number; total_tokens: number };
  finish_reason?: string | null;
}

interface ApiHealthStatus {
  provider: ProviderType;
  status: string;
  available: boolean;
}

export async function fetchProviders(): Promise<ApiProviderInfo[]> {
  const res = await apiRequest<ApiSuccessResponse<ApiProviderInfo[]>>("/api/v1/ai/providers");
  return res.data;
}

export async function fetchProviderModels(provider: ProviderType): Promise<ApiModel[]> {
  const res = await apiRequest<ApiSuccessResponse<ApiModel[]>>(`/api/v1/ai/models/${provider}`);
  return res.data;
}

export async function sendChatMessage(body: {
  provider: ProviderType;
  model: string;
  messages: Array<{ role: string; content: string }>;
}): Promise<ApiChatResponse> {
  const res = await apiRequest<ApiSuccessResponse<ApiChatResponse>>("/api/v1/ai/chat", {
    method: "POST",
    body,
  });
  return res.data;
}

export async function fetchHealthStatus(): Promise<ApiHealthStatus[]> {
  const res = await apiRequest<ApiSuccessResponse<ApiHealthStatus[]>>("/api/v1/ai/health");
  return res.data;
}

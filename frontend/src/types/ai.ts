export type AIErrorCode = "invalid_api_key" | "rate_limited" | "network_error" | "unknown";

export class AIProviderError extends Error {
  constructor(
    message: string,
    public readonly code: AIErrorCode,
    public readonly provider: ProviderType,
  ) {
    super(message);
    this.name = "AIProviderError";
  }
}

export type ProviderType =
  | "mock"
  | "openai"
  | "anthropic"
  | "gemini"
  | "ollama"
  | "azure-openai";

export type ProviderCapability = "chat" | "completion" | "embedding" | "streaming";

export type FinishReason = "stop" | "length" | "error";

export interface StreamingCapability {
  supported: boolean;
  maxConcurrentStreams?: number;
}

export interface TokenUsage {
  promptTokens: number;
  completionTokens: number;
  totalTokens: number;
}

export interface GenerationOptions {
  temperature?: number;
  maxTokens?: number;
  topP?: number;
  frequencyPenalty?: number;
  presencePenalty?: number;
  stop?: string[];
}

export interface ChatMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

export interface ChatRequest {
  model: string;
  messages: ChatMessage[];
  options?: GenerationOptions;
}

export interface ChatResponse {
  id: string;
  model: string;
  provider: ProviderType;
  message: ChatMessage;
  usage: TokenUsage;
  finishReason?: FinishReason;
}

export interface AIModel {
  id: string;
  provider: ProviderType;
  name: string;
  capabilities: ProviderCapability[];
  description?: string;
  maxTokens?: number;
  supportsStreaming: boolean;
}

export interface AIProvider {
  readonly type: ProviderType;
  readonly name: string;
  generate(request: ChatRequest, options?: GenerationOptions): Promise<ChatResponse>;
  stream(request: ChatRequest, options?: GenerationOptions): AsyncIterable<ChatResponse>;
  listModels(): Promise<AIModel[]>;
  healthCheck(): Promise<boolean>;
}

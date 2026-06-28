/**
 * LLM provider abstraction.
 * - Claude  (Anthropic API, primary, requires ANTHROPIC_API_KEY)
 * - Z.ai    (z-ai-web-dev-sdk, sandbox-friendly fallback)
 * - Demo    (no network, deterministic canned responses)
 */

import type {
  ChatCompletionRequest,
  ChatCompletionResponse,
  LLMModel,
  LLMProvider,
  LLMProviderId,
} from "@/types";

export const CLAUDE_MODELS: LLMModel[] = [
  {
    id: "claude-sonnet-4-5-20250929",
    label: "Claude Sonnet 4.5",
    provider: "claude",
    contextWindow: 200000,
    inputCostPer1M: 3,
    outputCostPer1M: 15,
    reasoning: true,
    maxOutput: 64000,
  },
  {
    id: "claude-opus-4-1-20250805",
    label: "Claude Opus 4.1",
    provider: "claude",
    contextWindow: 200000,
    inputCostPer1M: 15,
    outputCostPer1M: 75,
    reasoning: true,
    maxOutput: 32000,
  },
  {
    id: "claude-haiku-4-5-20251001",
    label: "Claude Haiku 4.5",
    provider: "claude",
    contextWindow: 200000,
    inputCostPer1M: 1,
    outputCostPer1M: 5,
    reasoning: false,
    maxOutput: 8192,
  },
];

export const ZAI_MODELS: LLMModel[] = [
  {
    id: "glm-4.6",
    label: "GLM-4.6",
    provider: "zai",
    contextWindow: 128000,
    reasoning: true,
    maxOutput: 8192,
  },
  {
    id: "glm-4.5",
    label: "GLM-4.5",
    provider: "zai",
    contextWindow: 128000,
    reasoning: false,
    maxOutput: 8192,
  },
];

export const ALL_MODELS: LLMModel[] = [...CLAUDE_MODELS, ...ZAI_MODELS];

export function getModelById(id: string): LLMModel | undefined {
  return ALL_MODELS.find((m) => m.id === id);
}

export interface LLMProviderConfig {
  provider: LLMProviderId;
  apiKey?: string;
  baseUrl?: string;
}

export type { ChatCompletionRequest, ChatCompletionResponse, LLMProvider };

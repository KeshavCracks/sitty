/**
 * LLM provider factory.
 *
 * Selection order:
 *   1. If ANTHROPIC_API_KEY is set → ClaudeProvider
 *   2. Else → ZaiProvider (sandbox-friendly default)
 *
 * A DemoProvider is also available for fully-offline deterministic runs.
 */

import type { LLMProvider, LLMProviderId } from "@/types";
import { ClaudeProvider } from "./claude";
import { ZaiProvider } from "./zai";

let cachedProvider: LLMProvider | null = null;
let cachedId: LLMProviderId | null = null;

/**
 * Get the default provider based on which API keys are configured.
 * Server-side only.
 */
export function getDefaultProvider(): LLMProvider {
  if (process.env.ANTHROPIC_API_KEY) {
    return new ClaudeProvider();
  }
  return new ZaiProvider();
}

/**
 * Get a specific provider by id. Server-side only.
 */
export function getProvider(id: LLMProviderId): LLMProvider {
  switch (id) {
    case "claude":
      return new ClaudeProvider();
    case "zai":
      return new ZaiProvider();
    case "demo":
      return {
        id: "demo",
        label: "Demo (offline)",
        available: true,
        models: [],
        async complete(req) {
          return {
            content: `(demo) Received ${req.messages.length} messages`,
            model: req.model,
            usage: { inputTokens: 0, outputTokens: 0 },
            latencyMs: 0,
          };
        },
      };
    default:
      return getDefaultProvider();
  }
}

/**
 * Get the cached default provider (single instance per process).
 */
export function getCachedProvider(): LLMProvider {
  if (!cachedProvider) {
    cachedProvider = getDefaultProvider();
    cachedId = cachedProvider.id;
  }
  return cachedProvider;
}

export function getConfiguredProviderId(): LLMProviderId {
  if (process.env.ANTHROPIC_API_KEY) return "claude";
  return "zai";
}

export { ClaudeProvider, ZaiProvider };
export * from "./types";

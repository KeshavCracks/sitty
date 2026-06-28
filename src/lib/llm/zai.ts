/**
 * Z.ai provider — uses the z-ai-web-dev-sdk (sandbox-friendly).
 *
 * This is the default fallback when no ANTHROPIC_API_KEY is set, so the
 * hosted demo can still perform real LLM-powered planning without
 * requiring the user to bring their own key.
 */

import type {
  ChatCompletionRequest,
  ChatCompletionResponse,
  LLMProvider,
} from "@/types";
import { ZAI_MODELS } from "./types";

export class ZaiProvider implements LLMProvider {
  id = "zai" as const;
  label = "Z.ai (GLM)";
  available = true;
  private zaiPromise: Promise<unknown> | null = null;

  get models() {
    return ZAI_MODELS;
  }

  private async getZai() {
    if (!this.zaiPromise) {
      // Lazy-load so this file can be imported in any context.
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      const ZAI = require("z-ai-web-dev-sdk").default;
      this.zaiPromise = ZAI.create();
    }
    return this.zaiPromise;
  }

  async complete(req: ChatCompletionRequest): Promise<ChatCompletionResponse> {
    const started = Date.now();
    const zai = await this.getZai();

    // z-ai-web-dev-sdk uses the OpenAI-style shape but with the
    // `assistant` role for system prompts (per their convention).
    const messages = req.messages.map((m) => ({
      role: m.role === "system" ? "assistant" : m.role,
      content: m.content,
    }));

    const completion = await (zai as { chat: { completions: { create: (args: Record<string, unknown>) => Promise<{ choices?: Array<{ message?: { content?: string } }>; usage?: { prompt_tokens?: number; completion_tokens?: number } }> } } }).chat.completions.create({
      messages,
      thinking: { type: req.thinking ? "enabled" : "disabled" },
      temperature: req.temperature ?? 0.2,
      max_tokens: req.maxTokens ?? 4096,
    });

    const content =
      completion?.choices?.[0]?.message?.content ??
      "(empty response from model)";

    return {
      content,
      model: req.model,
      usage: {
        inputTokens: completion?.usage?.prompt_tokens ?? 0,
        outputTokens: completion?.usage?.completion_tokens ?? 0,
      },
      latencyMs: Date.now() - started,
    };
  }
}

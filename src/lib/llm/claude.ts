/**
 * Anthropic Claude provider — Messages API.
 * https://docs.anthropic.com/en/api/messages
 *
 * Requires ANTHROPIC_API_KEY in the server environment. If absent,
 * `available` is false and `complete()` throws a typed error.
 */

import type {
  ChatCompletionRequest,
  ChatCompletionResponse,
  LLMProvider,
} from "@/types";
import { CLAUDE_MODELS } from "./types";

const ANTHROPIC_API_VERSION = "2023-06-01";

interface AnthropicMessage {
  role: "user" | "assistant";
  content: string;
}

interface AnthropicResponse {
  id: string;
  type: "message";
  role: "assistant";
  model: string;
  content: Array<{ type: "text"; text: string }>;
  stop_reason: string | null;
  usage: { input_tokens: number; output_tokens: number };
}

export class ClaudeProvider implements LLMProvider {
  id = "claude" as const;
  label = "Anthropic Claude";
  available: boolean;
  private apiKey?: string;
  private baseUrl: string;

  constructor() {
    this.apiKey = process.env.ANTHROPIC_API_KEY;
    this.baseUrl =
      process.env.ANTHROPIC_BASE_URL ?? "https://api.anthropic.com";
    this.available = Boolean(this.apiKey);
  }

  get models() {
    return CLAUDE_MODELS;
  }

  async complete(req: ChatCompletionRequest): Promise<ChatCompletionResponse> {
    if (!this.apiKey) {
      throw new Error(
        "ANTHROPIC_API_KEY is not configured. Set it in your environment or switch to the Z.ai / Demo provider."
      );
    }

    const systemMessages = req.messages.filter((m) => m.role === "system");
    const conversation: AnthropicMessage[] = req.messages
      .filter((m) => m.role === "user" || m.role === "assistant")
      .map((m) => ({ role: m.role as "user" | "assistant", content: m.content }));

    const system = systemMessages.map((m) => m.content).join("\n\n");
    const started = Date.now();

    const body: Record<string, unknown> = {
      model: req.model,
      max_tokens: req.maxTokens ?? 4096,
      messages: conversation,
      temperature: req.temperature ?? 0.2,
    };
    if (system) body.system = system;
    if (req.thinking) {
      body.thinking = { type: "enabled", budget_tokens: 4096 };
    }

    const res = await fetch(`${this.baseUrl}/v1/messages`, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "x-api-key": this.apiKey,
        "anthropic-version": ANTHROPIC_API_VERSION,
      },
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      const text = await res.text();
      throw new Error(`Claude API error ${res.status}: ${text.slice(0, 400)}`);
    }

    const data = (await res.json()) as AnthropicResponse;
    const content = data.content
      .filter((c) => c.type === "text")
      .map((c) => c.text)
      .join("\n");

    return {
      content,
      model: data.model,
      usage: {
        inputTokens: data.usage.input_tokens,
        outputTokens: data.usage.output_tokens,
      },
      latencyMs: Date.now() - started,
    };
  }
}

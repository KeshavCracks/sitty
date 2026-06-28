/**
 * GET /api/llm/models
 * Returns the list of available LLM models and which provider is active.
 */

import { NextResponse } from "next/server";
import { ALL_MODELS, getConfiguredProviderId } from "@/lib/llm";
import { CLAUDE_MODELS, ZAI_MODELS } from "@/lib/llm/types";

export const runtime = "nodejs";

export async function GET() {
  const activeProvider = getConfiguredProviderId();
  const hasClaudeKey = Boolean(process.env.ANTHROPIC_API_KEY);

  return NextResponse.json({
    activeProvider,
    providers: [
      {
        id: "claude" as const,
        label: "Anthropic Claude",
        available: hasClaudeKey,
        models: CLAUDE_MODELS,
      },
      {
        id: "zai" as const,
        label: "Z.ai (GLM)",
        available: true,
        models: ZAI_MODELS,
      },
    ],
    models: ALL_MODELS,
  });
}

/**
 * GET /api/health
 * Lightweight health-check endpoint.
 */

import { NextResponse } from "next/server";
import { getConfiguredProviderId } from "@/lib/llm";
import { resolveRuntimeMode } from "@/lib/agent";

export const runtime = "nodejs";

export async function GET() {
  return NextResponse.json({
    ok: true,
    service: "forge-ai-software-engineer",
    version: "1.0.0",
    timestamp: new Date().toISOString(),
    runtime: resolveRuntimeMode(),
    provider: getConfiguredProviderId(),
    claude: Boolean(process.env.ANTHROPIC_API_KEY),
    github: Boolean(process.env.GITHUB_TOKEN),
  });
}

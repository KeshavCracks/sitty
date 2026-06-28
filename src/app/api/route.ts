/**
 * GET /api
 * API root — lists available endpoints.
 */

import { NextResponse } from "next/server";

export const runtime = "nodejs";

export async function GET() {
  return NextResponse.json({
    name: "Forge — AI Software Engineer API",
    version: "1.0.0",
    endpoints: {
      health: "/api/health",
      agent: {
        plan: "/api/agent/plan",
        runtime: "/api/agent/runtime",
      },
      github: {
        connection: "/api/github/connection",
        repos: "/api/github/repos",
      },
      llm: {
        models: "/api/llm/models",
      },
    },
    docs: "https://github.com/KeshavCracks/sitty#readme",
  });
}

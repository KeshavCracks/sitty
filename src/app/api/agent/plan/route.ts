/**
 * POST /api/agent/plan
 *
 * Generates a plan for the given task description. Uses the LLM
 * planner when an API key is configured; otherwise falls back to a
 * scenario-based plan that always succeeds.
 *
 * Body: { taskId, description, repository, branch, baseBranch }
 * Returns: { plan, source: "llm" | "scenario" }
 */

import { NextRequest, NextResponse } from "next/server";
import { planTask } from "@/lib/agent";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { taskId, description, repository, branch, baseBranch } = body as {
      taskId?: string;
      description?: string;
      repository?: string;
      branch?: string;
      baseBranch?: string;
    };

    if (!taskId || !description) {
      return NextResponse.json(
        { error: "taskId and description are required" },
        { status: 400 }
      );
    }

    const result = await planTask({
      taskId,
      description,
      repository: repository ?? "acme/webapp",
      branch: branch ?? "forge/feature",
      baseBranch: baseBranch ?? "main",
      useLlm: true,
    });

    return NextResponse.json(result);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

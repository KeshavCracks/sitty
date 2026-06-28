/**
 * GET /api/agent/runtime
 * Returns information about the active agent runtime.
 */

import { NextResponse } from "next/server";
import { resolveRuntimeMode, getRuntimeInfo } from "@/lib/agent";

export const runtime = "nodejs";

export async function GET() {
  const mode = resolveRuntimeMode();
  const info = getRuntimeInfo(mode);
  return NextResponse.json(info);
}

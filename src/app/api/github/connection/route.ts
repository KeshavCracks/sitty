/**
 * GET /api/github/connection
 * Returns the current GitHub connection state.
 */

import { NextResponse } from "next/server";
import { getGitHubClient } from "@/lib/github";

export const runtime = "nodejs";

export async function GET() {
  const client = getGitHubClient();
  try {
    const conn = await client.getConnection();
    return NextResponse.json(conn);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json(
      {
        connected: false,
        username: null,
        avatarUrl: null,
        scopes: [],
        connectedAt: null,
        error: message,
      },
      { status: 200 }
    );
  }
}

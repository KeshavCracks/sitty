/**
 * GET /api/github/repos
 * Lists the authenticated user's repositories (most recently updated first).
 */

import { NextRequest, NextResponse } from "next/server";
import { getGitHubClient } from "@/lib/github";

export const runtime = "nodejs";

export async function GET(req: NextRequest) {
  const client = getGitHubClient();
  if (!client.available) {
    return NextResponse.json(
      {
        error:
          "GITHUB_TOKEN is not configured. Add a personal access token with `repo` scope to list repositories.",
        repos: [],
      },
      { status: 200 }
    );
  }
  try {
    const perPage = Number(req.nextUrl.searchParams.get("perPage") ?? "30");
    const repos = await client.listRepositories(
      Math.min(Math.max(perPage, 1), 100)
    );
    return NextResponse.json({ repos });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error: message, repos: [] }, { status: 500 });
  }
}

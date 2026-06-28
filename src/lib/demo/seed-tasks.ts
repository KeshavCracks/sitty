/**
 * Seed task history — realistic-looking past tasks so the dashboard
 * and history view are populated on first load instead of looking empty.
 */

import type { Task } from "@/types";

const now = Date.now();
const hoursAgo = (h: number) => new Date(now - h * 3600_000).toISOString();
const daysAgo = (d: number) => new Date(now - d * 86_400_000).toISOString();

export function seedTasks(): Task[] {
  return [
    {
      id: "task-seed-1",
      title: "Add dark/light theme toggle to header",
      description:
        "Add a persistent dark/light theme toggle to the site header. Respect the user's system preference on first visit and persist their choice in localStorage.",
      status: "completed",
      priority: "medium",
      repository: "acme/webapp",
      branch: "forge/dark-mode-toggle",
      baseBranch: "main",
      model: "claude-sonnet-4-5-20250929",
      provider: "claude",
      createdAt: daysAgo(2),
      updatedAt: daysAgo(2),
      progress: 100,
      totalSteps: 8,
      completedSteps: 8,
      pullRequestNumber: 142,
      headSha: "7a3f9c2b4e",
      summary:
        "Added a ThemeToggle component wired to next-themes, mounted it in the header, and gated it behind a mounted flag to avoid hydration mismatches.",
      tags: ["frontend", "ui", "theme"],
    },
    {
      id: "task-seed-2",
      title: "Fix 'remember me' being ignored on login",
      description:
        "Users are logged out on page refresh despite selecting 'remember me' on the login form.",
      status: "completed",
      priority: "high",
      repository: "acme/webapp",
      branch: "forge/auth-remember-fix",
      baseBranch: "main",
      model: "claude-sonnet-4-5-20250929",
      provider: "claude",
      createdAt: daysAgo(4),
      updatedAt: daysAgo(4),
      progress: 100,
      totalSteps: 7,
      completedSteps: 7,
      pullRequestNumber: 143,
      headSha: "9c4e1a8f3d",
      summary:
        "Root cause: the `remember` flag was read but never forwarded to setSession(). Fixed by threading the flag through and defaulting to 30-day maxAge when true. Added a regression test.",
      tags: ["bug", "auth", "backend"],
    },
    {
      id: "task-seed-3",
      title: "Add unit tests for UserService",
      description:
        "Add unit tests for the UserService class to bring coverage above 80%.",
      status: "completed",
      priority: "low",
      repository: "acme/webapp",
      branch: "forge/user-service-tests",
      baseBranch: "main",
      model: "glm-4.6",
      provider: "zai",
      createdAt: daysAgo(6),
      updatedAt: daysAgo(6),
      progress: 100,
      totalSteps: 6,
      completedSteps: 6,
      pullRequestNumber: 144,
      headSha: "b2d7f4491c",
      summary:
        "Added 14 unit tests covering all 4 UserService methods. Mocked the Prisma client. Coverage for user-service.ts went from 0% to 92%.",
      tags: ["tests", "coverage"],
    },
    {
      id: "task-seed-4",
      title: "Migrate /api/projects to Server Action",
      description:
        "Migrate the projects POST handler from a route handler to a typed Next.js Server Action.",
      status: "completed",
      priority: "medium",
      repository: "acme/webapp",
      branch: "forge/projects-server-action",
      baseBranch: "main",
      model: "claude-opus-4-1-20250805",
      provider: "claude",
      createdAt: daysAgo(9),
      updatedAt: daysAgo(9),
      progress: 100,
      totalSteps: 7,
      completedSteps: 7,
      pullRequestNumber: 145,
      headSha: "4f8c2b17e2",
      summary:
        "Migrated the projects POST endpoint to a Server Action with the same validation and error shape. Added revalidatePath so the list updates instantly. Deleted the old route handler.",
      tags: ["refactor", "backend"],
    },
    {
      id: "task-seed-5",
      title: "Add loading skeletons to dashboard",
      description:
        "Replace the empty 'loading...' text in the dashboard with proper skeleton placeholders that match the final layout.",
      status: "failed",
      priority: "low",
      repository: "acme/webapp",
      branch: "forge/dashboard-skeletons",
      baseBranch: "main",
      model: "glm-4.6",
      provider: "zai",
      createdAt: daysAgo(11),
      updatedAt: daysAgo(11),
      progress: 42,
      totalSteps: 6,
      completedSteps: 2,
      pullRequestNumber: null,
      headSha: null,
      summary: null,
      tags: ["frontend", "ux"],
    },
    {
      id: "task-seed-6",
      title: "Optimize N+1 query in /api/feed",
      description:
        "The /api/feed endpoint issues ~30 queries per request because it loads author data one-by-one for each post. Switch to a single join.",
      status: "completed",
      priority: "critical",
      repository: "acme/api",
      branch: "forge/feed-n1-fix",
      baseBranch: "main",
      model: "claude-sonnet-4-5-20250929",
      provider: "claude",
      createdAt: daysAgo(14),
      updatedAt: daysAgo(14),
      progress: 100,
      totalSteps: 5,
      completedSteps: 5,
      pullRequestNumber: 88,
      headSha: "1f3e8a9b2c",
      summary:
        "Replaced the per-post author lookup with a single Prisma include. Feed endpoint now issues 1 query instead of 30. P95 latency dropped from 420ms to 78ms.",
      tags: ["performance", "backend", "database"],
    },
    {
      id: "task-seed-7",
      title: "Add OpenTelemetry tracing to checkout flow",
      description:
        "Instrument the checkout flow with OpenTelemetry spans so we can see where time is spent end-to-end.",
      status: "completed",
      priority: "medium",
      repository: "acme/api",
      branch: "forge/otel-checkout",
      baseBranch: "main",
      model: "claude-sonnet-4-5-20250929",
      provider: "claude",
      createdAt: daysAgo(18),
      updatedAt: daysAgo(18),
      progress: 100,
      totalSteps: 6,
      completedSteps: 6,
      pullRequestNumber: 81,
      headSha: "8a4b2c1d3e",
      summary:
        "Added OTel spans for each checkout step (cart validation, payment intent, fulfillment, confirmation). Exported via OTLP to our collector. Verified in Grafana.",
      tags: ["observability", "backend"],
    },
  ];
}

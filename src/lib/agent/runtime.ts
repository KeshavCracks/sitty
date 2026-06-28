/**
 * Agent runtime — abstracts WHERE tools actually execute.
 *
 * - "local"  : a long-lived worker process (Docker / local node) with a
 *              real working tree. Mutating tools run for real.
 * - "cloud"  : Vercel serverless. Read-only tools work; mutating tools
 *              are simulated and the UI shows a "would run" preview.
 * - "demo"   : fully client-side simulated flow with canned outputs.
 *
 * The UI never branches on runtime mode directly — it asks the runtime
 * for an ExecutionResult and renders whatever comes back.
 */

import type { RuntimeInfo, RuntimeMode, ToolId } from "@/types";

export interface ToolExecutionRequest {
  tool: ToolId;
  input: Record<string, unknown>;
  workingTree?: string;
}

export interface ToolExecutionResult {
  ok: boolean;
  stdout?: string;
  stderr?: string;
  exitCode?: number;
  /** For write/edit tools: the resulting file diff (patch-style lines) */
  diff?: { path: string; additions: number; deletions: number; lines: string[] };
  /** Whether this was actually executed or just simulated */
  simulated: boolean;
  durationMs: number;
  error?: string;
}

export interface AgentRuntime {
  mode: RuntimeMode;
  info: RuntimeInfo;
  execute(req: ToolExecutionRequest): Promise<ToolExecutionResult>;
}

export const CLOUD_RUNTIME_INFO: RuntimeInfo = {
  mode: "cloud",
  canExecute: false,
  description:
    "Vercel serverless runtime. Read-only tools run live; mutating tools are simulated and previewed for you to run locally.",
  caveats: [
    "No persistent filesystem across requests",
    "No long-running background workers (Vercel free tier timeout)",
    "Mutating tools produce diffs but do not commit",
  ],
};

export const LOCAL_RUNTIME_INFO: RuntimeInfo = {
  mode: "local",
  canExecute: true,
  description:
    "Local worker runtime with a real working tree. All tools execute against your repository.",
  caveats: [
    "Requires the local worker process to be running",
    "See docs/LOCAL_RUNTIME.md for setup",
  ],
};

export const DEMO_RUNTIME_INFO: RuntimeInfo = {
  mode: "demo",
  canExecute: false,
  description:
    "Fully simulated runtime. No network, no filesystem. Perfect for exploring the UX without credentials.",
  caveats: [
    "All tool outputs are illustrative",
    "No real code is written or committed",
  ],
};

/**
 * Resolve the runtime mode for the current process.
 * Server-side helper.
 */
export function resolveRuntimeMode(): RuntimeMode {
  const env = process.env.FORGE_RUNTIME_MODE;
  if (env === "local" || env === "cloud" || env === "demo") return env;
  // Default: demo on Vercel (no ANTHROPIC/GITHUB keys configured)
  if (process.env.VERCEL) return "demo";
  if (process.env.ANTHROPIC_API_KEY || process.env.GITHUB_TOKEN) return "cloud";
  return "demo";
}

export function getRuntimeInfo(mode: RuntimeMode): RuntimeInfo {
  switch (mode) {
    case "local":
      return LOCAL_RUNTIME_INFO;
    case "cloud":
      return CLOUD_RUNTIME_INFO;
    case "demo":
      return DEMO_RUNTIME_INFO;
  }
}

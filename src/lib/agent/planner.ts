/**
 * Task planner — converts a natural-language task description into a
 * structured plan with ordered steps.
 *
 * In live mode it asks the configured LLM to produce a JSON plan.
 * In demo mode (or on any LLM error) it falls back to one of the
 * predefined scenarios in /lib/demo/scenarios.ts that best matches
 * the task description by keyword.
 */

import type { Plan, PlanStep, StepKind, ToolId } from "@/types";
import { getCachedProvider } from "@/lib/llm";
import { matchScenario } from "@/lib/demo";

const PLANNER_SYSTEM_PROMPT = `You are the planner of an autonomous software engineering agent.
Given a task description and repository context, produce a focused, executable plan.

Output STRICT JSON only (no prose, no markdown fences) with this shape:
{
  "objective": "one-sentence restatement of the goal",
  "assumptions": ["..."],
  "risks": ["..."],
  "steps": [
    {
      "kind": "exploration" | "implementation" | "testing" | "review" | "commit" | "pr",
      "title": "short imperative title",
      "description": "one-sentence detail",
      "tool": "read_file" | "write_file" | "edit_file" | "list_directory" | "run_command" | "search_code" | "git_commit" | "git_push" | "open_pr" | "run_tests" | "http_request" | "llm_reason",
      "toolInput": "human-readable summary of the tool call",
      "files": ["paths/that/will/be/touched"]
    }
  ]
}

Rules:
- Always end with a commit step and an open_pr step.
- Keep plans between 5 and 9 steps.
- Be specific about file paths based on the repository context.`;

export interface PlannerInput {
  taskId: string;
  description: string;
  repository: string;
  branch: string;
  baseBranch: string;
  useLlm?: boolean;
}

export interface PlannerResult {
  plan: Plan;
  source: "llm" | "scenario";
}

export async function planTask(input: PlannerInput): Promise<PlannerResult> {
  const useLlm = input.useLlm ?? true;

  if (useLlm) {
    try {
      const provider = getCachedProvider();
      const userPrompt = `Task: ${input.description}\nRepository: ${input.repository}\nBranch: ${input.branch} (base: ${input.baseBranch})`;
      const res = await provider.complete({
        messages: [
          { role: "system", content: PLANNER_SYSTEM_PROMPT },
          { role: "user", content: userPrompt },
        ],
        model: provider.models[0]?.id ?? "glm-4.6",
        temperature: 0.3,
        maxTokens: 4096,
      });

      const plan = parseLlmPlan(res.content, input.taskId);
      if (plan) {
        return { plan, source: "llm" };
      }
    } catch (err) {
      // Fall through to scenario-based planning
      console.warn("[planner] LLM planning failed, using scenario:", err);
    }
  }

  const scenario = matchScenario(input.description);
  const plan: Plan = {
    taskId: input.taskId,
    objective: scenario.objective,
    assumptions: scenario.assumptions,
    risks: scenario.risks,
    steps: scenario.steps.map((s, i) => ({
      ...s,
      id: `${input.taskId}-step-${i + 1}`,
      order: i,
      status: "pending",
    })),
  };
  return { plan, source: "scenario" };
}

function parseLlmPlan(raw: string, taskId: string): Plan | null {
  // Extract JSON even if surrounded by stray text
  const match = raw.match(/\{[\s\S]*\}/);
  if (!match) return null;
  try {
    const parsed = JSON.parse(match[0]);
    if (!parsed.steps || !Array.isArray(parsed.steps)) return null;

    const steps: PlanStep[] = parsed.steps.map(
      (s: Record<string, unknown>, i: number) => ({
        id: `${taskId}-step-${i + 1}`,
        order: i,
        kind: (s.kind as StepKind) ?? "implementation",
        title: String(s.title ?? `Step ${i + 1}`),
        description: String(s.description ?? ""),
        status: "pending" as const,
        tool: (s.tool as ToolId) ?? "llm_reason",
        toolInput: String(s.toolInput ?? ""),
        files: Array.isArray(s.files) ? (s.files as string[]) : [],
      })
    );

    return {
      taskId,
      objective: String(parsed.objective ?? ""),
      assumptions: Array.isArray(parsed.assumptions)
        ? (parsed.assumptions as string[])
        : [],
      risks: Array.isArray(parsed.risks)
        ? (parsed.risks as string[])
        : [],
      steps,
    };
  } catch {
    return null;
  }
}

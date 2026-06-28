/**
 * Agent execution store — drives the simulated agent run.
 *
 * On `startTask`:
 *   1. Create a Task record and add it to the task store
 *   2. Resolve a scenario (LLM-backed planning is optional via /api/agent/plan)
 *   3. Walk through each step in real-time:
 *        - mark in_progress → stream terminal lines → add file diffs → mark completed
 *   4. Update the Task record in the task store as progress changes
 *   5. On completion: set summary, PR number, headSha
 *
 * The simulation is fully client-side so it works on Vercel free tier
 * without any backend compute. When `useLlmPlanner` is true, we POST
 * the task description to /api/agent/plan and use the returned plan
 * (still stepping through it client-side).
 */

import { create } from "zustand";
import type {
  DiffLine,
  FileChange,
  LogEntry,
  LogLevel,
  Plan,
  PlanStep,
  Task,
  TaskPriority,
} from "@/types";
import { matchScenario, type Scenario, type ScenarioDiff } from "@/lib/demo";
import { useTaskStore } from "./task-store";
import { useAppStore } from "./app-store";
import { useSettingsStore } from "./settings-store";

export interface TerminalLine {
  stepId: string;
  text: string;
  /** Optional CSS class hint for color (e.g. "success", "warn", "muted") */
  tone?: "default" | "success" | "warn" | "error" | "muted" | "command";
  timestamp: string;
}

export interface StartTaskInput {
  title: string;
  description: string;
  repository: string;
  branch: string;
  baseBranch: string;
  priority: TaskPriority;
  tags: string[];
}

interface AgentState {
  /** The task currently loaded into the execution view (may differ from active) */
  currentTaskId: string | null;
  plan: Plan | null;
  steps: PlanStep[];
  logs: LogEntry[];
  fileChanges: FileChange[];
  terminal: TerminalLine[];
  isRunning: boolean;
  cancelRequested: boolean;
  /** Active step id (for the timeline highlight) */
  activeStepId: string | null;
  /** Brief status line shown in the topbar */
  statusLine: string;

  startTask: (input: StartTaskInput) => Promise<string>;
  cancelTask: () => void;
  reset: () => void;
  /** Load a completed task's scenario back into the execution view for inspection */
  loadTask: (taskId: string) => void;
}

const uid = (prefix: string) =>
  `${prefix}-${Math.random().toString(36).slice(2, 10)}`;

const wait = (ms: number) =>
  new Promise<void>((resolve) => {
    setTimeout(resolve, ms);
  });

function diffLinesFromScenario(d: ScenarioDiff): DiffLine[] {
  let oldNum = 0;
  let newNum = 0;
  return d.lines.map((raw) => {
    const type =
      raw.startsWith("@@") ? "hunk" :
      raw.startsWith("+") ? "add" :
      raw.startsWith("-") ? "del" : "context";
    if (type === "context") { oldNum++; newNum++; }
    else if (type === "add") { newNum++; }
    else if (type === "del") { oldNum++; }
    return {
      type,
      content: raw.replace(/^[+\- ]/, ""),
      oldNumber: type === "add" ? undefined : oldNum,
      newNumber: type === "del" ? undefined : newNum,
    };
  });
}

function fileChangesFromScenario(
  scenario: Scenario,
  taskId: string,
  stepId: string,
  stepIndex: number
): FileChange[] {
  const step = scenario.steps[stepIndex];
  if (!step.diffs) return [];
  return step.diffs.map((d) => {
    const lines = diffLinesFromScenario(d);
    return {
      id: uid("fc"),
      taskId,
      stepId,
      path: d.path,
      status: d.status,
      additions: lines.filter((l) => l.type === "add").length,
      deletions: lines.filter((l) => l.type === "del").length,
      diff: lines,
    };
  });
}

export const useAgentStore = create<AgentState>((set, get) => {
  /** Append a log entry */
  const log = (
    taskId: string,
    level: LogLevel,
    source: string,
    message: string,
    stepId?: string
  ) => {
    const entry: LogEntry = {
      id: uid("log"),
      taskId,
      stepId,
      timestamp: new Date().toISOString(),
      level,
      source,
      message,
    };
    set((s) => ({ logs: [...s.logs, entry] }));
  };

  /** Append a terminal line */
  const term = (
    stepId: string,
    text: string,
    tone: TerminalLine["tone"] = "default"
  ) => {
    set((s) => ({
      terminal: [
        ...s.terminal,
        { stepId, text, tone, timestamp: new Date().toISOString() },
      ],
    }));
  };

  /** The main execution loop */
  async function runExecution(
    taskId: string,
    input: StartTaskInput,
    scenario: Scenario,
    plan: Plan
  ) {
    const taskStore = useTaskStore.getState();
    const appStore = useAppStore.getState();

    log(taskId, "info", "orchestrator", `Task received: "${input.title}"`);
    log(taskId, "info", "orchestrator", `Repository: ${input.repository}`);
    log(
      taskId,
      "info",
      "orchestrator",
      `Branch: ${input.branch} (base: ${input.baseBranch})`
    );
    await wait(400);

    // ---- Planning phase ----
    taskStore.updateTask(taskId, { status: "planning" });
    set({ statusLine: "Planning the approach…" });
    log(taskId, "info", "planner", "Decomposing task into steps…");
    term(taskId, "$ forge plan --task \"" + input.title + "\"", "command");
    await wait(800);
    term(taskId, "→ objective: " + scenario.objective, "muted");
    await wait(300);
    term(taskId, `→ ${plan.steps.length} steps generated`, "success");
    log(
      taskId,
      "success",
      "planner",
      `Plan ready: ${plan.steps.length} steps`
    );
    await wait(600);

    // ---- Execution phase ----
    taskStore.updateTask(taskId, { status: "executing" });
    set({ statusLine: "Executing plan…" });

    for (let i = 0; i < plan.steps.length; i++) {
      if (get().cancelRequested) {
        log(taskId, "warn", "orchestrator", "Cancellation requested — aborting");
        taskStore.updateTask(taskId, { status: "cancelled" });
        set({ isRunning: false, statusLine: "Cancelled" });
        return;
      }

      const step = plan.steps[i];
      const stepId = step.id;
      set((s) => ({
        activeStepId: stepId,
        steps: s.steps.map((st) =>
          st.id === stepId
            ? {
                ...st,
                status: "in_progress",
                startedAt: new Date().toISOString(),
              }
            : st
        ),
      }));

      log(
        taskId,
        "info",
        step.tool,
        `Step ${i + 1}/${plan.steps.length}: ${step.title}`
      );

      if (step.reasoning) {
        log(taskId, "debug", "agent", step.reasoning);
      }

      // Stream the scenario's terminal lines
      const scenarioStep = scenario.steps[i];
      for (const line of scenarioStep.terminal) {
        if (get().cancelRequested) break;
        // Heuristic: lines starting with "$" are commands, "✓" are success, "⚠" are warn
        let tone: TerminalLine["tone"] = "default";
        if (line.startsWith("$")) tone = "command";
        else if (line.startsWith("✓")) tone = "success";
        else if (line.startsWith("⚠")) tone = "warn";
        else if (line.startsWith("→") || line.startsWith("  ")) tone = "muted";
        term(stepId, line, tone);
        await wait(140 + Math.random() * 240);
      }

      if (get().cancelRequested) {
        log(taskId, "warn", "orchestrator", "Cancellation requested — aborting");
        taskStore.updateTask(taskId, { status: "cancelled" });
        set({ isRunning: false, statusLine: "Cancelled" });
        return;
      }

      // Add file changes for this step
      const changes = fileChangesFromScenario(scenario, taskId, stepId, i);
      if (changes.length > 0) {
        set((s) => ({ fileChanges: [...s.fileChanges, ...changes] }));
        for (const c of changes) {
          log(
            taskId,
            "info",
            "vcs",
            `${c.status} ${c.path} (+${c.additions} −${c.deletions})`,
            stepId
          );
        }
      }

      // Mark step complete
      set((s) => ({
        steps: s.steps.map((st) =>
          st.id === stepId
            ? {
                ...st,
                status: "completed",
                completedAt: new Date().toISOString(),
                toolOutput: scenarioStep.terminal.join("\n"),
              }
            : st
        ),
      }));

      const completedSteps = i + 1;
      const progress = Math.round((completedSteps / plan.steps.length) * 100);
      taskStore.updateTask(taskId, {
        progress,
        completedSteps,
      });

      log(
        taskId,
        "success",
        step.tool,
        `Step ${i + 1} complete (${progress}%)`
      );

      await wait(300);
    }

    // ---- Review phase ----
    set({ statusLine: "Reviewing changes…" });
    taskStore.updateTask(taskId, { status: "reviewing" });
    log(taskId, "info", "reviewer", "Reviewing diff summary…");
    await wait(700);

    const totalAdditions = get().fileChanges.reduce((a, c) => a + c.additions, 0);
    const totalDeletions = get().fileChanges.reduce((a, c) => a + c.deletions, 0);
    log(
      taskId,
      "success",
      "reviewer",
      `Diff: +${totalAdditions} −${totalDeletions} across ${get().fileChanges.length} files`
    );
    await wait(500);

    // ---- Completion ----
    const prNumber = 100 + Math.floor(Math.random() * 200);
    const headSha = Math.random().toString(16).slice(2, 12);
    taskStore.updateTask(taskId, {
      status: "completed",
      progress: 100,
      pullRequestNumber: prNumber,
      headSha,
      summary: scenario.summary,
    });

    log(taskId, "success", "orchestrator", `Pull request #${prNumber} opened`);
    log(
      taskId,
      "success",
      "orchestrator",
      `Task complete. Head SHA: ${headSha}`
    );
    set({
      isRunning: false,
      statusLine: `Completed — PR #${prNumber}`,
      activeStepId: null,
    });
  }

  return {
    currentTaskId: null,
    plan: null,
    steps: [],
    logs: [],
    fileChanges: [],
    terminal: [],
    isRunning: false,
    cancelRequested: false,
    activeStepId: null,
    statusLine: "Idle",

    startTask: async (input) => {
      const taskId = uid("task");
      const nowIso = new Date().toISOString();
      const settings = useSettingsStore.getState();

      const task: Task = {
        id: taskId,
        title: input.title,
        description: input.description,
        status: "queued",
        priority: input.priority,
        repository: input.repository,
        branch: input.branch,
        baseBranch: input.baseBranch,
        model: settings.model,
        provider: settings.provider,
        createdAt: nowIso,
        updatedAt: nowIso,
        progress: 0,
        totalSteps: 0,
        completedSteps: 0,
        pullRequestNumber: null,
        headSha: null,
        summary: null,
        tags: input.tags,
      };

      // Reset state and register the task
      set({
        currentTaskId: taskId,
        plan: null,
        steps: [],
        logs: [],
        fileChanges: [],
        terminal: [],
        isRunning: true,
        cancelRequested: false,
        activeStepId: null,
        statusLine: "Queued",
      });
      useTaskStore.getState().upsertTask(task);
      useAppStore.getState().setActiveTaskId(taskId);
      useAppStore.getState().setView("execution");

      // Optional: ask the server for an LLM-generated plan
      let plan: Plan | null = null;
      if (settings.useLlmPlanner) {
        try {
          const res = await fetch("/api/agent/plan", {
            method: "POST",
            headers: { "content-type": "application/json" },
            body: JSON.stringify({
              taskId,
              description: input.description,
              repository: input.repository,
              branch: input.branch,
              baseBranch: input.baseBranch,
            }),
          });
          if (res.ok) {
            const data = (await res.json()) as { plan: Plan };
            if (data?.plan?.steps?.length) plan = data.plan;
          }
        } catch (err) {
          console.warn("[agent] LLM plan failed, using scenario:", err);
        }
      }

      // Fallback / default: scenario-based plan
      const scenario = matchScenario(input.description);
      if (!plan) {
        plan = {
          taskId,
          objective: scenario.objective,
          assumptions: scenario.assumptions,
          risks: scenario.risks,
          steps: scenario.steps.map((s, i) => ({
            id: `${taskId}-step-${i + 1}`,
            order: i,
            kind: s.kind,
            title: s.title,
            description: s.description,
            status: "pending",
            tool: s.tool,
            toolInput: s.toolInput,
            files: s.files,
            reasoning: s.reasoning,
          })),
        };
      }

      set({ plan, steps: plan.steps });
      useTaskStore.getState().updateTask(taskId, { totalSteps: plan.steps.length });

      // Kick off execution (do not await — caller doesn't need to)
      void runExecution(taskId, input, scenario, plan);
      return taskId;
    },

    cancelTask: () => {
      if (!get().isRunning) return;
      set({ cancelRequested: true });
      log(get().currentTaskId ?? "", "warn", "orchestrator", "Cancel requested");
    },

    reset: () => {
      set({
        currentTaskId: null,
        plan: null,
        steps: [],
        logs: [],
        fileChanges: [],
        terminal: [],
        isRunning: false,
        cancelRequested: false,
        activeStepId: null,
        statusLine: "Idle",
      });
    },

    loadTask: (taskId) => {
      const task = useTaskStore.getState().getTask(taskId);
      if (!task) return;
      const scenario = matchScenario(task.description);
      const plan: Plan = {
        taskId,
        objective: scenario.objective,
        assumptions: scenario.assumptions,
        risks: scenario.risks,
        steps: scenario.steps.map((s, i) => ({
          id: `${taskId}-step-${i + 1}`,
          order: i,
          kind: s.kind,
          title: s.title,
          description: s.description,
          status: task.status === "completed" ? "completed" : "pending",
          tool: s.tool,
          toolInput: s.toolInput,
          files: s.files,
          reasoning: s.reasoning,
          completedAt: task.status === "completed" ? task.updatedAt : undefined,
        })),
      };
      set({
        currentTaskId: taskId,
        plan,
        steps: plan.steps,
        logs: [],
        fileChanges: [],
        terminal: [],
        isRunning: false,
        activeStepId: null,
        statusLine: task.status === "completed" ? "Completed" : "Idle",
      });
      useAppStore.getState().setActiveTaskId(taskId);
      useAppStore.getState().setView("execution");
    },
  };
});

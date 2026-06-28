"use client";

/**
 * Execution view — the real-time agent observability dashboard.
 *
 * Layout:
 *   ┌─────────────────────────────────────────────────────────┐
 *   │ Status bar (title, status, progress, cancel)            │
 *   ├──────────────┬──────────────────────────────────────────┤
 *   │              │  Tabs: Terminal | Diffs | Logs           │
 *   │  Plan +      │                                          │
 *   │  Timeline    │  (active content)                        │
 *   │              │                                          │
 *   └──────────────┴──────────────────────────────────────────┘
 */

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  AlertTriangle,
  Bot,
  CheckCircle2,
  Circle,
  Clock,
  FileCode2,
  GitPullRequest,
  Lightbulb,
  Loader2,
  Terminal as TerminalIcon,
  XCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { TaskStatusBadge, StepStatusBadge } from "@/components/forge/status-badge";
import { useAgentStore } from "@/store/agent-store";
import { useTaskStore } from "@/store/task-store";
import { useAppStore } from "@/store/app-store";
import type { FileChange, PlanStep, Task } from "@/types";

export function ExecutionView() {
  const currentTaskId = useAgentStore((s) => s.currentTaskId);
  const plan = useAgentStore((s) => s.plan);
  const steps = useAgentStore((s) => s.steps);
  const logs = useAgentStore((s) => s.logs);
  const fileChanges = useAgentStore((s) => s.fileChanges);
  const terminal = useAgentStore((s) => s.terminal);
  const isRunning = useAgentStore((s) => s.isRunning);
  const cancelTask = useAgentStore((s) => s.cancelTask);
  const statusLine = useAgentStore((s) => s.statusLine);
  const activeStepId = useAgentStore((s) => s.activeStepId);

  const task = useTaskStore((s) =>
    currentTaskId ? s.tasks.find((t) => t.id === currentTaskId) : undefined
  );

  if (!currentTaskId || !task) {
    return <EmptyState />;
  }

  const completedSteps = steps.filter((s) => s.status === "completed").length;
  const progress = task.progress;

  return (
    <div className="flex h-[calc(100vh-4rem)] flex-col">
      {/* Status bar */}
      <div className="border-b border-border bg-background/80 px-4 py-3 backdrop-blur sm:px-6">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <h2 className="truncate text-sm font-semibold sm:text-base">
                {task.title}
              </h2>
              <TaskStatusBadge status={task.status} />
            </div>
            <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground">
              <span className="font-mono">{task.repository}</span>
              <span className="flex items-center gap-1">
                <GitPullRequest className="size-3" />
                {task.branch} → {task.baseBranch}
              </span>
              <span className="flex items-center gap-1">
                <Bot className="size-3" />
                {task.model}
              </span>
              <span className="flex items-center gap-1">
                <Clock className="size-3" />
                {statusLine}
              </span>
              {task.pullRequestNumber && (
                <Badge
                  variant="outline"
                  className="border-emerald-500/30 bg-emerald-500/10 text-[10px] text-emerald-600 dark:text-emerald-400"
                >
                  PR #{task.pullRequestNumber}
                </Badge>
              )}
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <Progress value={progress} className="h-2 w-32" />
              <span className="w-10 text-right text-xs tabular-nums text-muted-foreground">
                {progress}%
              </span>
            </div>
            {isRunning && (
              <Button variant="outline" size="sm" onClick={cancelTask}>
                <XCircle className="mr-1.5 size-3.5" />
                Cancel
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="grid flex-1 grid-cols-1 overflow-hidden lg:grid-cols-[minmax(320px,360px)_1fr]">
        {/* Plan + timeline */}
        <div className="hidden flex-col border-r border-border lg:flex">
          <PlanPanel
            plan={plan}
            steps={steps}
            activeStepId={activeStepId}
            task={task}
            completedSteps={completedSteps}
          />
        </div>

        {/* Right: tabs */}
        <div className="flex min-w-0 flex-col">
          <Tabs defaultValue="terminal" className="flex h-full flex-col">
            <div className="flex items-center justify-between border-b border-border px-3 py-2">
              <TabsList className="bg-transparent p-0">
                <TabsTrigger value="terminal" className="gap-1.5 text-xs">
                  <TerminalIcon className="size-3.5" />
                  Terminal
                  {terminal.length > 0 && (
                    <Badge variant="secondary" className="ml-1 h-4 px-1 text-[10px]">
                      {terminal.length}
                    </Badge>
                  )}
                </TabsTrigger>
                <TabsTrigger value="diffs" className="gap-1.5 text-xs">
                  <FileCode2 className="size-3.5" />
                  Diffs
                  {fileChanges.length > 0 && (
                    <Badge variant="secondary" className="ml-1 h-4 px-1 text-[10px]">
                      {fileChanges.length}
                    </Badge>
                  )}
                </TabsTrigger>
                <TabsTrigger value="logs" className="gap-1.5 text-xs">
                  <Clock className="size-3.5" />
                  Logs
                  {logs.length > 0 && (
                    <Badge variant="secondary" className="ml-1 h-4 px-1 text-[10px]">
                      {logs.length}
                    </Badge>
                  )}
                </TabsTrigger>
              </TabsList>

              {/* Mobile plan toggle */}
              <MobilePlanToggle
                plan={plan}
                steps={steps}
                activeStepId={activeStepId}
                task={task}
                completedSteps={completedSteps}
              />
            </div>

            <TabsContent value="terminal" className="mt-0 flex-1 overflow-hidden">
              <TerminalPanel terminal={terminal} activeStepId={activeStepId} />
            </TabsContent>
            <TabsContent value="diffs" className="mt-0 flex-1 overflow-hidden">
              <DiffsPanel fileChanges={fileChanges} />
            </TabsContent>
            <TabsContent value="logs" className="mt-0 flex-1 overflow-hidden">
              <LogsPanel logs={logs} />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Empty state                                                        */
/* ------------------------------------------------------------------ */

function EmptyState() {
  const setView = useAppStore((s) => s.setView);
  return (
    <div className="flex h-[calc(100vh-4rem)] flex-col items-center justify-center p-8 text-center">
      <div className="mb-6 flex size-16 items-center justify-center rounded-2xl border border-border/60 bg-card/40">
        <Bot className="size-8 text-muted-foreground" />
      </div>
      <h2 className="text-lg font-semibold">No active task</h2>
      <p className="mt-1 max-w-sm text-sm text-muted-foreground">
        Start a new task and the agent's plan, terminal output, file diffs,
        and logs will stream here in real time.
      </p>
      <Button className="mt-6" onClick={() => setView("new-task")}>
        <Bot className="mr-2 size-4" />
        Start a task
      </Button>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Plan + timeline panel                                              */
/* ------------------------------------------------------------------ */

function PlanPanel({
  plan,
  steps,
  activeStepId,
  task,
  completedSteps,
}: {
  plan: { objective: string; assumptions: string[]; risks: string[] } | null;
  steps: PlanStep[];
  activeStepId: string | null;
  task: Task;
  completedSteps: number;
}) {
  return (
    <ScrollArea className="h-full">
      <div className="space-y-4 p-4">
        {/* Objective */}
        {plan && (
          <div>
            <div className="mb-1.5 flex items-center gap-1.5 text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
              <Lightbulb className="size-3" />
              Objective
            </div>
            <p className="text-xs leading-relaxed text-foreground">
              {plan.objective}
            </p>
          </div>
        )}

        {/* Assumptions */}
        {plan && plan.assumptions.length > 0 && (
          <div>
            <div className="mb-1.5 text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
              Assumptions
            </div>
            <ul className="space-y-1">
              {plan.assumptions.map((a, i) => (
                <li key={i} className="flex items-start gap-1.5 text-xs text-muted-foreground">
                  <span className="mt-1 size-1 shrink-0 rounded-full bg-muted-foreground/50" />
                  <span>{a}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Risks */}
        {plan && plan.risks.length > 0 && (
          <div>
            <div className="mb-1.5 flex items-center gap-1.5 text-[10px] font-medium uppercase tracking-wider text-amber-600 dark:text-amber-400">
              <AlertTriangle className="size-3" />
              Risks
            </div>
            <ul className="space-y-1">
              {plan.risks.map((r, i) => (
                <li key={i} className="flex items-start gap-1.5 text-xs text-muted-foreground">
                  <span className="mt-1 size-1 shrink-0 rounded-full bg-amber-500/60" />
                  <span>{r}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Steps timeline */}
        <div>
          <div className="mb-3 flex items-center justify-between">
            <span className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
              Steps
            </span>
            <span className="text-[10px] tabular-nums text-muted-foreground">
              {completedSteps}/{steps.length}
            </span>
          </div>

          <ol className="relative space-y-3 border-l border-border pl-4">
            <AnimatePresence>
              {steps.map((step, i) => (
                <motion.li
                  key={step.id}
                  initial={{ opacity: 0, x: -6 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.2 }}
                  className="relative"
                >
                  {/* Step marker */}
                  <span
                    className={cn(
                      "absolute -left-[1.4rem] flex size-3 items-center justify-center rounded-full border-2 border-background",
                      step.status === "completed" && "bg-emerald-500",
                      step.status === "in_progress" && "bg-emerald-500/30 ring-2 ring-emerald-500/40 pulse-ring",
                      step.status === "pending" && "bg-muted-foreground/30",
                      step.status === "failed" && "bg-red-500",
                      step.status === "skipped" && "bg-muted-foreground/20"
                    )}
                  >
                    {step.status === "completed" && (
                      <CheckCircle2 className="size-2 text-background" />
                    )}
                    {step.status === "in_progress" && (
                      <Loader2 className="size-2 animate-spin text-emerald-500" />
                    )}
                  </span>

                  <div
                    className={cn(
                      "rounded-md border p-2.5 transition-colors",
                      activeStepId === step.id
                        ? "border-emerald-500/40 bg-emerald-500/5"
                        : "border-border/60 bg-card/30"
                    )}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-1.5">
                          <span className="text-[10px] font-mono text-muted-foreground">
                            {String(i + 1).padStart(2, "0")}
                          </span>
                          <span className="text-xs font-medium">
                            {step.title}
                          </span>
                        </div>
                        <p className="mt-0.5 text-[11px] text-muted-foreground">
                          {step.description}
                        </p>
                        <div className="mt-1.5 flex items-center gap-2">
                          <Badge
                            variant="outline"
                            className="h-4 px-1 font-mono text-[9px] uppercase"
                          >
                            {step.tool}
                          </Badge>
                          {step.files.length > 0 && (
                            <span className="text-[10px] text-muted-foreground">
                              {step.files.length} file{step.files.length > 1 ? "s" : ""}
                            </span>
                          )}
                        </div>
                      </div>
                      <StepStatusBadge status={step.status} />
                    </div>

                    {/* Reasoning (only for in-progress or completed) */}
                    {step.reasoning && step.status !== "pending" && (
                      <div className="mt-2 rounded border border-border/60 bg-muted/30 p-2">
                        <div className="mb-1 flex items-center gap-1 text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
                          <Lightbulb className="size-2.5" />
                          Agent thoughts
                        </div>
                        <p className="text-[11px] leading-relaxed text-muted-foreground">
                          {step.reasoning}
                        </p>
                      </div>
                    )}
                  </div>
                </motion.li>
              ))}
            </AnimatePresence>
          </ol>
        </div>

        {/* Summary (when complete) */}
        {task.status === "completed" && task.summary && (
          <div className="rounded-md border border-emerald-500/30 bg-emerald-500/5 p-3">
            <div className="mb-1.5 flex items-center gap-1.5 text-[10px] font-medium uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
              <CheckCircle2 className="size-3" />
              Summary
            </div>
            <p className="text-xs leading-relaxed">{task.summary}</p>
            {task.pullRequestNumber && (
              <a
                href={`https://github.com/${task.repository}/pull/${task.pullRequestNumber}`}
                target="_blank"
                rel="noreferrer"
                className="mt-2 inline-flex items-center gap-1 text-[11px] font-medium text-emerald-600 dark:text-emerald-400 hover:underline"
              >
                <GitPullRequest className="size-3" />
                View PR #{task.pullRequestNumber}
              </a>
            )}
          </div>
        )}
      </div>
    </ScrollArea>
  );
}

/* ------------------------------------------------------------------ */
/* Terminal panel                                                     */
/* ------------------------------------------------------------------ */

function TerminalPanel({
  terminal,
  activeStepId,
}: {
  terminal: { stepId: string; text: string; tone?: string; timestamp: string }[];
  activeStepId: string | null;
}) {
  const scrollRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [terminal]);

  if (terminal.length === 0) {
    return (
      <div className="flex h-full items-center justify-center p-8 text-center">
        <div>
          <TerminalIcon className="mx-auto mb-3 size-8 text-muted-foreground/50" />
          <p className="text-sm text-muted-foreground">
            Terminal output will stream here as the agent executes.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div
      ref={scrollRef}
      className="code-block h-full overflow-y-auto bg-[oklch(0.10_0.008_250)] p-4"
    >
      {terminal.map((line, i) => (
        <div
          key={i}
          className={cn(
            "whitespace-pre-wrap break-all",
            line.tone === "command" && "text-emerald-500",
            line.tone === "success" && "text-emerald-400",
            line.tone === "warn" && "text-amber-400",
            line.tone === "error" && "text-red-400",
            line.tone === "muted" && "text-muted-foreground",
            (!line.tone || line.tone === "default") && "text-foreground/90"
          )}
        >
          {line.text}
        </div>
      ))}
      <div className="terminal-cursor text-emerald-500" />
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Diffs panel                                                        */
/* ------------------------------------------------------------------ */

function DiffsPanel({ fileChanges }: { fileChanges: FileChange[] }) {
  if (fileChanges.length === 0) {
    return (
      <div className="flex h-full items-center justify-center p-8 text-center">
        <div>
          <FileCode2 className="mx-auto mb-3 size-8 text-muted-foreground/50" />
          <p className="text-sm text-muted-foreground">
            File changes will appear here as the agent edits files.
          </p>
        </div>
      </div>
    );
  }

  return (
    <ScrollArea className="h-full">
      <div className="space-y-4 p-4">
        {fileChanges.map((fc) => (
          <div
            key={fc.id}
            className="overflow-hidden rounded-lg border border-border/60 bg-card/40"
          >
            <div className="flex items-center justify-between border-b border-border/60 bg-muted/30 px-3 py-2">
              <div className="flex items-center gap-2 min-w-0">
                <FileStatusIcon status={fc.status} />
                <span className="truncate font-mono text-xs">{fc.path}</span>
              </div>
              <div className="flex items-center gap-2 text-[10px]">
                <span className="text-emerald-600 dark:text-emerald-400">
                  +{fc.additions}
                </span>
                <span className="text-red-600 dark:text-red-400">
                  −{fc.deletions}
                </span>
              </div>
            </div>
            <div className="code-block overflow-x-auto bg-[oklch(0.10_0.008_250)] p-3 text-xs">
              {fc.diff.map((line, i) => (
                <div
                  key={i}
                  className={cn(
                    "whitespace-pre",
                    line.type === "add" && "bg-emerald-500/10 text-emerald-300",
                    line.type === "del" && "bg-red-500/10 text-red-300",
                    line.type === "context" && "text-muted-foreground",
                    line.type === "hunk" && "text-sky-400"
                  )}
                >
                  <span className="inline-block w-6 select-none text-right text-muted-foreground/50">
                    {line.type === "add" ? "+" : line.type === "del" ? "-" : " "}
                  </span>
                  {line.content}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </ScrollArea>
  );
}

function FileStatusIcon({ status }: { status: FileChange["status"] }) {
  const map = {
    added: { icon: "+", className: "text-emerald-500" },
    modified: { icon: "M", className: "text-amber-500" },
    deleted: { icon: "−", className: "text-red-500" },
    renamed: { icon: "R", className: "text-sky-500" },
  };
  const s = map[status];
  return (
    <span
      className={cn(
        "flex size-4 items-center justify-center rounded-sm border border-current text-[9px] font-bold",
        s.className
      )}
    >
      {s.icon}
    </span>
  );
}

/* ------------------------------------------------------------------ */
/* Logs panel                                                         */
/* ------------------------------------------------------------------ */

function LogsPanel({
  logs,
}: {
  logs: { id: string; level: string; source: string; message: string; timestamp: string }[];
}) {
  if (logs.length === 0) {
    return (
      <div className="flex h-full items-center justify-center p-8 text-center">
        <div>
          <Clock className="mx-auto mb-3 size-8 text-muted-foreground/50" />
          <p className="text-sm text-muted-foreground">
            Structured logs will appear here.
          </p>
        </div>
      </div>
    );
  }

  return (
    <ScrollArea className="h-full">
      <div className="code-block divide-y divide-border/30">
        {logs.map((log) => (
          <div
            key={log.id}
            className="flex items-start gap-3 px-4 py-1.5 hover:bg-muted/20"
          >
            <span className="shrink-0 text-[10px] tabular-nums text-muted-foreground">
              {new Date(log.timestamp).toLocaleTimeString("en-US", {
                hour12: false,
                hour: "2-digit",
                minute: "2-digit",
                second: "2-digit",
              })}
            </span>
            <span
              className={cn(
                "shrink-0 rounded px-1 text-[9px] font-bold uppercase",
                log.level === "info" && "bg-sky-500/10 text-sky-500",
                log.level === "success" && "bg-emerald-500/10 text-emerald-500",
                log.level === "warn" && "bg-amber-500/10 text-amber-500",
                log.level === "error" && "bg-red-500/10 text-red-500",
                log.level === "debug" && "bg-muted text-muted-foreground"
              )}
            >
              {log.level}
            </span>
            <span className="shrink-0 font-mono text-[10px] text-muted-foreground">
              [{log.source}]
            </span>
            <span className="text-xs text-foreground/90">{log.message}</span>
          </div>
        ))}
      </div>
    </ScrollArea>
  );
}

/* ------------------------------------------------------------------ */
/* Mobile plan toggle (sheet)                                         */
/* ------------------------------------------------------------------ */

function MobilePlanToggle({
  plan,
  steps,
  activeStepId,
  task,
  completedSteps,
}: {
  plan: { objective: string; assumptions: string[]; risks: string[] } | null;
  steps: PlanStep[];
  activeStepId: string | null;
  task: Task;
  completedSteps: number;
}) {
  return (
    <Button
      variant="outline"
      size="sm"
      className="lg:hidden"
      onClick={() => {
        // Toggle a class on the parent to show plan (simplified for mobile)
      }}
    >
      Plan ({completedSteps}/{steps.length})
    </Button>
  );
}

"use client";

/**
 * Status badges for tasks and steps — colored pill + optional dot.
 */

import * as React from "react";
import { cn } from "@/lib/utils";
import type { StepStatus, TaskStatus } from "@/types";

const TASK_STATUS_STYLES: Record<
  TaskStatus,
  { label: string; className: string; dot: string }
> = {
  queued: {
    label: "Queued",
    className:
      "bg-muted/40 text-muted-foreground border-border",
    dot: "bg-muted-foreground",
  },
  planning: {
    label: "Planning",
    className:
      "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/30",
    dot: "bg-amber-500",
  },
  executing: {
    label: "Executing",
    className:
      "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30",
    dot: "bg-emerald-500 pulse-ring",
  },
  reviewing: {
    label: "Reviewing",
    className:
      "bg-sky-500/10 text-sky-600 dark:text-sky-400 border-sky-500/30",
    dot: "bg-sky-500",
  },
  completed: {
    label: "Completed",
    className:
      "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/30",
    dot: "bg-emerald-500",
  },
  failed: {
    label: "Failed",
    className:
      "bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/30",
    dot: "bg-red-500",
  },
  cancelled: {
    label: "Cancelled",
    className:
      "bg-muted/40 text-muted-foreground border-border",
    dot: "bg-muted-foreground",
  },
};

const STEP_STATUS_STYLES: Record<
  StepStatus,
  { label: string; className: string; dot: string }
> = {
  pending: {
    label: "Pending",
    className: "bg-muted/30 text-muted-foreground border-border",
    dot: "bg-muted-foreground/50",
  },
  in_progress: {
    label: "Running",
    className:
      "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30",
    dot: "bg-emerald-500 pulse-ring",
  },
  completed: {
    label: "Done",
    className:
      "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/30",
    dot: "bg-emerald-500",
  },
  failed: {
    label: "Failed",
    className:
      "bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/30",
    dot: "bg-red-500",
  },
  skipped: {
    label: "Skipped",
    className: "bg-muted/30 text-muted-foreground border-border",
    dot: "bg-muted-foreground/30",
  },
};

export function TaskStatusBadge({
  status,
  className,
}: {
  status: TaskStatus;
  className?: string;
}) {
  const s = TASK_STATUS_STYLES[status];
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-medium",
        s.className,
        className
      )}
    >
      <span className={cn("size-1.5 rounded-full", s.dot)} />
      {s.label}
    </span>
  );
}

export function StepStatusBadge({
  status,
  className,
}: {
  status: StepStatus;
  className?: string;
}) {
  const s = STEP_STATUS_STYLES[status];
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2 py-0.5 text-[11px] font-medium",
        s.className,
        className
      )}
    >
      <span className={cn("size-1.5 rounded-full", s.dot)} />
      {s.label}
    </span>
  );
}

export function PriorityBadge({
  priority,
}: {
  priority: "low" | "medium" | "high" | "critical";
}) {
  const map = {
    low: "bg-muted/40 text-muted-foreground border-border",
    medium:
      "bg-sky-500/10 text-sky-600 dark:text-sky-400 border-sky-500/30",
    high:
      "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/30",
    critical:
      "bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/30",
  };
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-md border px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide",
        map[priority]
      )}
    >
      {priority}
    </span>
  );
}

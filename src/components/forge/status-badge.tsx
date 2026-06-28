"use client";

/**
 * Status badges for tasks and steps — rig.ai palette.
 * Black + orange only. Orange signals active/success, muted for other states.
 */

import * as React from "react";
import { cn } from "@/lib/utils";
import type { StepStatus, TaskStatus } from "@/types";

const TASK_STATUS_STYLES: Record<
  TaskStatus,
  { label: string; className: string; dot: string }
> = {
  queued: {
    label: "QUEUED",
    className: "bg-muted/30 text-muted-foreground border-border",
    dot: "bg-muted-foreground",
  },
  planning: {
    label: "PLANNING",
    className: "bg-primary/10 text-primary border-primary/40",
    dot: "bg-primary",
  },
  executing: {
    label: "EXECUTING",
    className: "bg-primary/10 text-primary border-primary/40",
    dot: "bg-primary pulse-ring",
  },
  reviewing: {
    label: "REVIEWING",
    className: "bg-primary/10 text-primary border-primary/40",
    dot: "bg-primary",
  },
  completed: {
    label: "COMPLETED",
    className: "bg-primary/15 text-primary border-primary/40",
    dot: "bg-primary",
  },
  failed: {
    label: "FAILED",
    className: "bg-muted/30 text-muted-foreground border-border",
    dot: "bg-muted-foreground",
  },
  cancelled: {
    label: "CANCELLED",
    className: "bg-muted/30 text-muted-foreground border-border",
    dot: "bg-muted-foreground",
  },
};

const STEP_STATUS_STYLES: Record<
  StepStatus,
  { label: string; className: string; dot: string }
> = {
  pending: {
    label: "PENDING",
    className: "bg-muted/30 text-muted-foreground border-border",
    dot: "bg-muted-foreground/50",
  },
  in_progress: {
    label: "RUNNING",
    className: "bg-primary/10 text-primary border-primary/40",
    dot: "bg-primary pulse-ring",
  },
  completed: {
    label: "DONE",
    className: "bg-primary/15 text-primary border-primary/40",
    dot: "bg-primary",
  },
  failed: {
    label: "FAILED",
    className: "bg-muted/30 text-muted-foreground border-border",
    dot: "bg-muted-foreground",
  },
  skipped: {
    label: "SKIPPED",
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
        "inline-flex items-center gap-1.5 border px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-[0.06em]",
        s.className,
        className
      )}
      style={{ fontFamily: "var(--font-rig-mono), monospace", borderRadius: "0" }}
    >
      <span className={cn("size-1.5", s.dot)} />
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
        "inline-flex items-center gap-1.5 border px-2 py-0.5 text-[10px] font-bold uppercase tracking-[0.06em]",
        s.className,
        className
      )}
      style={{ fontFamily: "var(--font-rig-mono), monospace", borderRadius: "0" }}
    >
      <span className={cn("size-1.5", s.dot)} />
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
    low: "bg-muted/30 text-muted-foreground border-border",
    medium: "bg-muted/30 text-foreground border-border",
    high: "bg-primary/10 text-primary border-primary/40",
    critical: "bg-primary/15 text-primary border-primary/50",
  };
  return (
    <span
      className={cn(
        "inline-flex items-center border px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-[0.08em]",
        map[priority]
      )}
      style={{ fontFamily: "var(--font-rig-mono), monospace", borderRadius: "0" }}
    >
      {priority}
    </span>
  );
}

"use client";

/**
 * History view — searchable table of all past tasks.
 */

import * as React from "react";
import { motion } from "framer-motion";
import {
  Bot,
  CheckCircle2,
  GitPullRequest,
  Search,
  Trash2,
  XCircle,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { TaskStatusBadge, PriorityBadge } from "@/components/forge/status-badge";
import { useTaskStore } from "@/store/task-store";
import { useAgentStore } from "@/store/agent-store";
import type { TaskStatus } from "@/types";
import { formatDistanceToNow } from "date-fns";
import { toast } from "sonner";

const STATUS_FILTERS: { value: TaskStatus | "all"; label: string }[] = [
  { value: "all", label: "All statuses" },
  { value: "completed", label: "Completed" },
  { value: "executing", label: "Executing" },
  { value: "planning", label: "Planning" },
  { value: "failed", label: "Failed" },
  { value: "cancelled", label: "Cancelled" },
];

export function HistoryView() {
  const tasks = useTaskStore((s) => s.tasks);
  const removeTask = useTaskStore((s) => s.removeTask);
  const loadTask = useAgentStore((s) => s.loadTask);

  const [query, setQuery] = React.useState("");
  const [status, setStatus] = React.useState<TaskStatus | "all">("all");

  const filtered = React.useMemo(() => {
    return tasks
      .filter((t) => {
        if (status !== "all" && t.status !== status) return false;
        if (!query.trim()) return true;
        const q = query.toLowerCase();
        return (
          t.title.toLowerCase().includes(q) ||
          t.description.toLowerCase().includes(q) ||
          t.repository.toLowerCase().includes(q) ||
          t.tags.some((tag) => tag.toLowerCase().includes(q))
        );
      })
      .sort(
        (a, b) =>
          new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
      );
  }, [tasks, query, status]);

  return (
    <div className="space-y-6 p-4 sm:p-6 lg:p-8">
      <div className="flex flex-col items-start justify-between gap-3 sm:flex-row sm:items-center">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight">History</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            {tasks.length} task{tasks.length === 1 ? "" : "s"} total
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col gap-3 sm:flex-row">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by title, description, repo, or tag…"
            className="pl-9"
          />
        </div>
        <Select
          value={status}
          onValueChange={(v) => setStatus(v as TaskStatus | "all")}
        >
          <SelectTrigger className="w-full sm:w-44">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {STATUS_FILTERS.map((f) => (
              <SelectItem key={f.value} value={f.value}>
                {f.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Table */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead className="w-8"></TableHead>
                <TableHead>Task</TableHead>
                <TableHead className="hidden md:table-cell">Repository</TableHead>
                <TableHead className="hidden sm:table-cell">Priority</TableHead>
                <TableHead className="hidden lg:table-cell">Updated</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="w-10"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="h-32 text-center text-sm text-muted-foreground">
                    No tasks match your filters.
                  </TableCell>
                </TableRow>
              ) : (
                filtered.map((t, i) => (
                  <motion.tr
                    key={t.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.2, delay: Math.min(i * 0.02, 0.2) }}
                    className="group cursor-pointer border-b border-border/60 transition-colors hover:bg-muted/30"
                    onClick={() => loadTask(t.id)}
                  >
                    <TableCell className="pl-4">
                      <div className="flex size-7 items-center justify-center rounded-md bg-muted/40 text-muted-foreground">
                        {t.status === "completed" ? (
                          <CheckCircle2 className="size-3.5 text-primary" />
                        ) : t.status === "failed" ? (
                          <XCircle className="size-3.5 text-muted-foreground" />
                        ) : (
                          <Bot className="size-3.5" />
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="max-w-xs">
                      <div className="truncate text-sm font-medium">
                        {t.title}
                      </div>
                      <div className="mt-0.5 flex items-center gap-2 text-xs text-muted-foreground">
                        {t.pullRequestNumber && (
                          <span className="flex items-center gap-0.5">
                            <GitPullRequest className="size-3" />
                            #{t.pullRequestNumber}
                          </span>
                        )}
                        <span className="font-mono">{t.branch}</span>
                      </div>
                    </TableCell>
                    <TableCell className="hidden font-mono text-xs md:table-cell">
                      {t.repository}
                    </TableCell>
                    <TableCell className="hidden sm:table-cell">
                      <PriorityBadge priority={t.priority} />
                    </TableCell>
                    <TableCell className="hidden text-xs text-muted-foreground lg:table-cell">
                      {formatDistanceToNow(new Date(t.updatedAt), {
                        addSuffix: true,
                      })}
                    </TableCell>
                    <TableCell>
                      <TaskStatusBadge status={t.status} />
                    </TableCell>
                    <TableCell className="pr-4">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="size-7 opacity-0 transition-opacity group-hover:opacity-100"
                        onClick={(e) => {
                          e.stopPropagation();
                          removeTask(t.id);
                          toast.success("Task removed");
                        }}
                      >
                        <Trash2 className="size-3.5" />
                      </Button>
                    </TableCell>
                  </motion.tr>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Tags summary */}
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-xs text-muted-foreground">Common tags:</span>
        {Array.from(new Set(tasks.flatMap((t) => t.tags)))
          .slice(0, 12)
          .map((tag) => (
            <Badge
              key={tag}
              variant="outline"
              className="cursor-pointer text-xs"
              onClick={() => setQuery(tag)}
            >
              {tag}
            </Badge>
          ))}
      </div>
    </div>
  );
}

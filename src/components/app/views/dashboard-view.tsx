"use client";

/**
 * Dashboard view — stats overview, activity chart, recent tasks.
 */

import * as React from "react";
import { motion } from "framer-motion";
import {
  Activity,
  ArrowUpRight,
  Bot,
  CheckCircle2,
  Clock,
  FileCode2,
  GitPullRequest,
  PlusCircle,
  TrendingUp,
  Zap,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { TaskStatusBadge, PriorityBadge } from "@/components/forge/status-badge";
import { useTaskStore } from "@/store/task-store";
import { useAppStore } from "@/store/app-store";
import { useAgentStore } from "@/store/agent-store";
import type { Task } from "@/types";
import { formatDistanceToNow } from "date-fns";

function StatCard({
  icon: Icon,
  label,
  value,
  sub,
  accent,
  delay,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string | number;
  sub?: string;
  accent: string;
  delay: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay }}
    >
      <Card>
        <CardContent className="p-5">
          <div className="flex items-start justify-between">
            <div className="flex flex-col gap-1">
              <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                {label}
              </span>
              <span className="text-2xl font-semibold tabular-nums">
                {value}
              </span>
              {sub && (
                <span className="text-xs text-muted-foreground">{sub}</span>
              )}
            </div>
            <div
              className={`flex size-9 items-center justify-center rounded-md ${accent}`}
            >
              <Icon className="size-4" />
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

export function DashboardView() {
  const tasks = useTaskStore((s) => s.tasks);
  const enterApp = useAppStore.getState().enterApp;
  const loadTask = useAgentStore((s) => s.loadTask);

  const completed = tasks.filter((t) => t.status === "completed");
  const active = tasks.filter(
    (t) =>
      t.status === "queued" ||
      t.status === "planning" ||
      t.status === "executing" ||
      t.status === "reviewing"
  );
  const successRate = tasks.length
    ? Math.round((completed.length / tasks.length) * 100)
    : 0;
  const totalFiles = tasks.reduce(
    (a, t) => a + (t.status === "completed" ? t.totalSteps : 0),
    0
  );
  const totalPRs = completed.filter((t) => t.pullRequestNumber).length;

  // Activity chart: tasks per day for last 14 days
  const chartData = React.useMemo(() => {
    const days: { date: string; count: number; label: string }[] = [];
    const now = new Date();
    for (let i = 13; i >= 0; i--) {
      const d = new Date(now);
      d.setDate(d.getDate() - i);
      const key = d.toISOString().slice(0, 10);
      const count = tasks.filter((t) => t.createdAt.slice(0, 10) === key).length;
      days.push({
        date: key,
        count,
        label: d.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
      });
    }
    return days;
  }, [tasks]);

  const recentTasks = [...tasks]
    .sort(
      (a, b) =>
        new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
    )
    .slice(0, 6);

  return (
    <div className="space-y-6 p-4 sm:p-6 lg:p-8">
      {/* Welcome header */}
      <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight">
            Welcome back
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Here's what your agent has been up to.
          </p>
        </div>
        <Button onClick={() => enterApp("new-task")}>
          <PlusCircle className="mr-2 size-4" />
          New task
        </Button>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          icon={Bot}
          label="Total tasks"
          value={tasks.length}
          sub={`${active.length} active`}
          accent="bg-primary/10 text-primary dark:text-primary"
          delay={0}
        />
        <StatCard
          icon={CheckCircle2}
          label="Completed"
          value={completed.length}
          sub={`${successRate}% success rate`}
          accent="bg-muted-foreground/10 text-muted-foreground dark:text-muted-foreground"
          delay={0.05}
        />
        <StatCard
          icon={GitPullRequest}
          label="Pull requests"
          value={totalPRs}
          sub={`across ${new Set(completed.map((t) => t.repository)).size} repos`}
          accent="bg-primary/10 text-primary dark:text-primary"
          delay={0.1}
        />
        <StatCard
          icon={FileCode2}
          label="Steps executed"
          value={tasks.reduce((a, t) => a + t.completedSteps, 0)}
          sub="across all tasks"
          accent="bg-primary/10 text-primary dark:text-primary"
          delay={0.15}
        />
      </div>

      {/* Activity chart + Quick start */}
      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">
              Activity — last 14 days
            </CardTitle>
            <Badge variant="outline" className="gap-1 text-xs">
              <TrendingUp className="size-3" />
              {chartData.reduce((a, d) => a + d.count, 0)} tasks
            </Badge>
          </CardHeader>
          <CardContent className="pl-2">
            <ResponsiveContainer width="100%" height={240}>
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="activityFill" x1="0" y1="0" x2="0" y2="1">
                    <stop
                      offset="0%"
                      stopColor="oklch(0.72 0.18 165)"
                      stopOpacity={0.4}
                    />
                    <stop
                      offset="100%"
                      stopColor="oklch(0.72 0.18 165)"
                      stopOpacity={0}
                    />
                  </linearGradient>
                </defs>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="oklch(1 0 0 / 0.06)"
                  vertical={false}
                />
                <XAxis
                  dataKey="label"
                  stroke="oklch(0.65 0.008 250)"
                  fontSize={11}
                  tickLine={false}
                  axisLine={false}
                  interval={2}
                />
                <YAxis
                  stroke="oklch(0.65 0.008 250)"
                  fontSize={11}
                  tickLine={false}
                  axisLine={false}
                  allowDecimals={false}
                  width={24}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "oklch(0.17 0.01 250)",
                    border: "1px solid oklch(1 0 0 / 0.1)",
                    borderRadius: "8px",
                    fontSize: "12px",
                  }}
                  labelStyle={{ color: "oklch(0.96 0.005 75)" }}
                  itemStyle={{ color: "oklch(0.72 0.18 165)" }}
                />
                <Area
                  type="monotone"
                  dataKey="count"
                  stroke="oklch(0.72 0.18 165)"
                  strokeWidth={2}
                  fill="url(#activityFill)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Quick start card */}
        <Card className="flex flex-col">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              Try a sample task
            </CardTitle>
          </CardHeader>
          <CardContent className="flex-1 space-y-2">
            {SAMPLE_TASKS.map((t) => (
              <button
                key={t.title}
                onClick={() => {
                  enterApp("new-task");
                  // Pre-fill the form via a custom event
                  setTimeout(() => {
                    window.dispatchEvent(
                      new CustomEvent("forge:prefill-task", {
                        detail: t,
                      })
                    );
                  }, 100);
                }}
                className="group flex w-full items-start gap-3 rounded-md border border-border/60 bg-card/40 p-3 text-left transition-colors hover:border-primary/40 hover:bg-card"
              >
                <div className="mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-md bg-primary/10 text-primary dark:text-primary">
                  <Zap className="size-3.5" />
                </div>
                <div className="flex-1">
                  <div className="text-sm font-medium">{t.title}</div>
                  <div className="mt-0.5 text-xs text-muted-foreground">
                    {t.description}
                  </div>
                </div>
                <ArrowUpRight className="size-3.5 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" />
              </button>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Recent tasks */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-3">
          <CardTitle className="text-sm font-medium">Recent tasks</CardTitle>
          <Button
            variant="ghost"
            size="sm"
            className="text-xs"
            onClick={() => enterApp("history")}
          >
            View all
            <ArrowUpRight className="ml-1 size-3" />
          </Button>
        </CardHeader>
        <CardContent className="p-0">
          <div className="divide-y divide-border/60">
            {recentTasks.map((t) => (
              <TaskRow key={t.id} task={t} onClick={() => loadTask(t.id)} />
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

const SAMPLE_TASKS = [
  {
    title: "Add dark mode toggle",
    description: "Add a persistent theme toggle to the site header",
    repository: "acme/webapp",
    tags: ["frontend", "ui"],
  },
  {
    title: "Fix auth remember-me bug",
    description: "Users get logged out on refresh despite 'remember me'",
    repository: "acme/webapp",
    tags: ["bug", "auth"],
  },
  {
    title: "Add unit tests for UserService",
    description: "Bring coverage above 80% with mocked Prisma client",
    repository: "acme/webapp",
    tags: ["tests"],
  },
];

function TaskRow({ task, onClick }: { task: Task; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="flex w-full items-center gap-3 px-6 py-3 text-left transition-colors hover:bg-muted/30"
    >
      <div className="flex size-8 shrink-0 items-center justify-center rounded-md bg-muted/40 text-muted-foreground">
        {task.status === "completed" ? (
          <CheckCircle2 className="size-4 text-primary" />
        ) : task.status === "failed" ? (
          <Activity className="size-4 text-muted-foreground" />
        ) : (
          <Bot className="size-4" />
        )}
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <span className="truncate text-sm font-medium">{task.title}</span>
          <PriorityBadge priority={task.priority} />
        </div>
        <div className="mt-0.5 flex items-center gap-3 text-xs text-muted-foreground">
          <span className="font-mono">{task.repository}</span>
          <span className="flex items-center gap-1">
            <Clock className="size-3" />
            {formatDistanceToNow(new Date(task.updatedAt), { addSuffix: true })}
          </span>
          {task.pullRequestNumber && (
            <span className="flex items-center gap-1">
              <GitPullRequest className="size-3" />
              #{task.pullRequestNumber}
            </span>
          )}
        </div>
      </div>
      <TaskStatusBadge status={task.status} />
    </button>
  );
}

"use client";

/**
 * New task view — form for submitting a task to the agent.
 *
 * On submit, calls agentStore.startTask which kicks off the simulated
 * execution flow and navigates to the execution view.
 */

import * as React from "react";
import { motion } from "framer-motion";
import { Bot, GitBranch, Github, Sparkles, Wand2, Zap } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAgentStore } from "@/store/agent-store";
import { useSettingsStore } from "@/store/settings-store";
import { ALL_MODELS } from "@/lib/llm/types";
import type { TaskPriority } from "@/types";
import { toast } from "sonner";

const REPO_OPTIONS = [
  { value: "acme/webapp", label: "acme/webapp — Next.js monorepo" },
  { value: "acme/api", label: "acme/api — Hono + Drizzle backend" },
  { value: "acme/design-system", label: "acme/design-system — shadcn-based DS" },
  { value: "acme/mobile", label: "acme/mobile — React Native app" },
];

const PRIORITY_OPTIONS: { value: TaskPriority; label: string }[] = [
  { value: "low", label: "Low" },
  { value: "medium", label: "Medium" },
  { value: "high", label: "High" },
  { value: "critical", label: "Critical" },
];

const SAMPLE_PROMPTS = [
  {
    title: "Add dark/light theme toggle",
    description:
      "Add a persistent dark/light theme toggle to the site header. Respect the user's system preference on first visit and persist their choice in localStorage.",
    repository: "acme/webapp",
    tags: ["frontend", "ui"],
  },
  {
    title: "Fix 'remember me' being ignored on login",
    description:
      "Users are logged out on page refresh despite selecting 'remember me' on the login form. Investigate the session cookie handling and fix the bug.",
    repository: "acme/webapp",
    tags: ["bug", "auth"],
  },
  {
    title: "Add unit tests for UserService",
    description:
      "Add unit tests for the UserService class to bring coverage above 80%. Mock the Prisma client so tests are fast and deterministic.",
    repository: "acme/webapp",
    tags: ["tests", "coverage"],
  },
  {
    title: "Migrate /api/projects to Server Action",
    description:
      "Migrate the projects POST handler from a route handler to a typed Next.js Server Action. Preserve the same validation and error shape.",
    repository: "acme/webapp",
    tags: ["refactor", "backend"],
  },
];

export function NewTaskView() {
  const startTask = useAgentStore((s) => s.startTask);
  const isRunning = useAgentStore((s) => s.isRunning);
  const model = useSettingsStore((s) => s.model);
  const setModel = useSettingsStore((s) => s.setModel);
  const useLlmPlanner = useSettingsStore((s) => s.useLlmPlanner);
  const setUseLlmPlanner = useSettingsStore((s) => s.setUseLlmPlanner);

  const [title, setTitle] = React.useState("");
  const [description, setDescription] = React.useState("");
  const [repository, setRepository] = React.useState(REPO_OPTIONS[0].value);
  const [branch, setBranch] = React.useState("forge/feature");
  const [baseBranch, setBaseBranch] = React.useState("main");
  const [priority, setPriority] = React.useState<TaskPriority>("medium");
  const [tags, setTags] = React.useState("");

  // Listen for prefill events from the dashboard quick-start
  React.useEffect(() => {
    const handler = (e: Event) => {
      const detail = (e as CustomEvent).detail as {
        title?: string;
        description?: string;
        repository?: string;
        tags?: string[];
      };
      if (detail.title) setTitle(detail.title);
      if (detail.description) setDescription(detail.description);
      if (detail.repository) setRepository(detail.repository);
      if (detail.tags) setTags(detail.tags.join(", "));
    };
    window.addEventListener("forge:prefill-task", handler);
    return () => window.removeEventListener("forge:prefill-task", handler);
  }, []);

  const handleSubmit = async () => {
    if (!title.trim() || !description.trim()) {
      toast.error("Title and description are required");
      return;
    }
    if (!branch.trim()) {
      toast.error("Branch name is required");
      return;
    }

    toast.success("Task queued — agent starting…");
    await startTask({
      title: title.trim(),
      description: description.trim(),
      repository,
      branch: branch.trim(),
      baseBranch: baseBranch.trim(),
      priority,
      tags: tags
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean),
    });
  };

  const handleSample = (s: (typeof SAMPLE_PROMPTS)[number]) => {
    setTitle(s.title);
    setDescription(s.description);
    setRepository(s.repository);
    setTags(s.tags.join(", "));
    setBranch(
      "forge/" +
        s.title
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/(^-|-$)/g, "")
          .slice(0, 40)
    );
    toast.info("Sample loaded — review and click Start");
  };

  return (
    <div className="mx-auto max-w-5xl space-y-6 p-4 sm:p-6 lg:p-8">
      {/* Header */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="gap-1.5 border-primary/40 bg-primary/5 text-primary dark:text-primary">
            <Sparkles className="size-3" />
            New task
          </Badge>
        </div>
        <h2 className="text-2xl font-semibold tracking-tight">
          What should the agent build?
        </h2>
        <p className="text-sm text-muted-foreground">
          Describe the task in plain English. The agent will plan, implement,
          test, and open a pull request.
        </p>
      </div>

      {/* Sample prompts */}
      <div>
        <div className="mb-2 flex items-center gap-2 text-xs font-medium uppercase tracking-wider text-muted-foreground">
          <Zap className="size-3.5" />
          Try a sample
        </div>
        <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
          {SAMPLE_PROMPTS.map((s) => (
            <button
              key={s.title}
              onClick={() => handleSample(s)}
              className="group rounded-md border border-border/60 bg-card/40 p-3 text-left transition-colors hover:border-primary/40 hover:bg-card"
            >
              <div className="text-sm font-medium">{s.title}</div>
              <div className="mt-1 line-clamp-2 text-xs text-muted-foreground">
                {s.description}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Form */}
      <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
        {/* Main form */}
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Task details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Add dark mode toggle to header"
                className="font-medium"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">
                Description{" "}
                <span className="text-xs font-normal text-muted-foreground">
                  (be specific about expected behavior)
                </span>
              </Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe the task in detail. What's the current behavior? What should it be? Any constraints?"
                rows={6}
                className="resize-y"
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="repo" className="flex items-center gap-1.5">
                  <Github className="size-3.5" />
                  Repository
                </Label>
                <Select value={repository} onValueChange={setRepository}>
                  <SelectTrigger id="repo">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {REPO_OPTIONS.map((r) => (
                      <SelectItem key={r.value} value={r.value}>
                        {r.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="priority">Priority</Label>
                <Select
                  value={priority}
                  onValueChange={(v) => setPriority(v as TaskPriority)}
                >
                  <SelectTrigger id="priority">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {PRIORITY_OPTIONS.map((p) => (
                      <SelectItem key={p.value} value={p.value}>
                        {p.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="branch" className="flex items-center gap-1.5">
                  <GitBranch className="size-3.5" />
                  Branch
                </Label>
                <Input
                  id="branch"
                  value={branch}
                  onChange={(e) => setBranch(e.target.value)}
                  placeholder="forge/feature"
                  className="font-mono text-sm"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="baseBranch">Base branch</Label>
                <Input
                  id="baseBranch"
                  value={baseBranch}
                  onChange={(e) => setBaseBranch(e.target.value)}
                  className="font-mono text-sm"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="tags">
                Tags{" "}
                <span className="text-xs font-normal text-muted-foreground">
                  (comma-separated)
                </span>
              </Label>
              <Input
                id="tags"
                value={tags}
                onChange={(e) => setTags(e.target.value)}
                placeholder="frontend, ui, theme"
              />
            </div>
          </CardContent>
        </Card>

        {/* Sidebar: model + actions */}
        <div className="space-y-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm">Model</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="space-y-2">
                <Label className="text-xs text-muted-foreground">
                  Reasoning model
                </Label>
                <Select value={model} onValueChange={setModel}>
                  <SelectTrigger className="font-mono text-xs">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {ALL_MODELS.map((m) => (
                      <SelectItem key={m.id} value={m.id}>
                        <div className="flex flex-col gap-0.5">
                          <span className="font-sans text-sm">{m.label}</span>
                          <span className="text-[10px] text-muted-foreground">
                            {m.provider} · {m.contextWindow / 1000}k ctx
                            {m.reasoning ? " · reasoning" : ""}
                          </span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center justify-between rounded-md border border-border/60 bg-muted/20 p-2.5">
                <div>
                  <div className="flex items-center gap-1.5 text-xs font-medium">
                    <Wand2 className="size-3 text-primary" />
                    LLM planner
                  </div>
                  <div className="mt-0.5 text-[10px] text-muted-foreground">
                    {useLlmPlanner
                      ? "Server will call the LLM"
                      : "Scenario-based plan (offline)"}
                  </div>
                </div>
                <Button
                  variant={useLlmPlanner ? "default" : "outline"}
                  size="sm"
                  className="h-7 px-2 text-xs"
                  onClick={() => setUseLlmPlanner(!useLlmPlanner)}
                >
                  {useLlmPlanner ? "ON" : "OFF"}
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <Button
                className="w-full"
                size="lg"
                onClick={handleSubmit}
                disabled={isRunning}
              >
                <Bot className="mr-2 size-4" />
                {isRunning ? "Agent running…" : "Start agent"}
              </Button>
              <p className="mt-3 text-center text-[11px] text-muted-foreground">
                The agent will plan, implement, test, and open a PR — all
                observable in real time.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

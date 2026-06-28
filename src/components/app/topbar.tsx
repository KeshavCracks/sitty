"use client";

/**
 * App topbar — current view title, runtime badge, model selector,
 * theme toggle, GitHub status, mobile menu trigger, "Back to site" button.
 */

import * as React from "react";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Bot,
  Check,
  ChevronDown,
  Github,
  Menu,
  Moon,
  Sun,
} from "lucide-react";
import { useTheme } from "next-themes";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { SidebarContent } from "./sidebar";
import { useAppStore } from "@/store/app-store";
import { useSettingsStore } from "@/store/settings-store";
import { useAgentStore } from "@/store/agent-store";
import { ALL_MODELS } from "@/lib/llm/types";
import type { AppView } from "@/types";

const VIEW_TITLES: Record<AppView, { title: string; subtitle: string }> = {
  landing: { title: "Forge", subtitle: "AI Software Engineer" },
  dashboard: {
    title: "Dashboard",
    subtitle: "Overview of your agent's activity and recent tasks",
  },
  "new-task": {
    title: "New task",
    subtitle: "Describe what you want the agent to build",
  },
  execution: {
    title: "Execution",
    subtitle: "Watch the agent plan, code, and ship in real time",
  },
  history: {
    title: "History",
    subtitle: "All tasks the agent has worked on",
  },
  github: {
    title: "GitHub",
    subtitle: "Connection, repositories, and pull requests",
  },
  settings: {
    title: "Settings",
    subtitle: "Model, runtime, and integration configuration",
  },
};

export function Topbar() {
  const view = useAppStore((s) => s.view);
  const exitToLanding = useAppStore((s) => s.exitToLanding);
  const setSidebarOpen = useAppStore((s) => s.setSidebarOpen);
  const sidebarOpen = useAppStore((s) => s.sidebarOpen);
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);
  React.useEffect(() => setMounted(true), []);

  const model = useSettingsStore((s) => s.model);
  const setModel = useSettingsStore((s) => s.setModel);
  const provider = useSettingsStore((s) => s.provider);
  const githubConnected = useSettingsStore((s) => s.githubConnected);
  const githubUsername = useSettingsStore((s) => s.githubUsername);
  const isRunning = useAgentStore((s) => s.isRunning);
  const statusLine = useAgentStore((s) => s.statusLine);

  const meta = VIEW_TITLES[view];

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-3 border-b border-border bg-background/80 px-4 backdrop-blur sm:px-6">
      {/* Mobile menu */}
      <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
        <SheetTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden"
            aria-label="Open menu"
          >
            <Menu className="size-5" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-72 p-0">
          <SheetHeader className="sr-only">
            <SheetTitle>Navigation</SheetTitle>
          </SheetHeader>
          <SidebarContent />
        </SheetContent>
      </Sheet>

      {/* Back to site */}
      <Button
        variant="ghost"
        size="sm"
        className="text-muted-foreground"
        onClick={exitToLanding}
      >
        <ArrowLeft className="mr-1.5 size-3.5" />
        <span className="hidden sm:inline">Site</span>
      </Button>

      <div className="hidden h-6 w-px bg-border sm:block" />

      {/* Title */}
      <div className="flex flex-1 flex-col">
        <div className="flex items-center gap-2">
          <h1 className="text-sm font-semibold sm:text-base">{meta.title}</h1>
          {isRunning && (
            <Badge
              variant="outline"
              className="border-emerald-500/30 bg-emerald-500/10 text-[10px] text-emerald-600 dark:text-emerald-400"
            >
              <span className="mr-1 size-1.5 rounded-full bg-emerald-500 pulse-ring" />
              {statusLine}
            </Badge>
          )}
        </div>
        <p className="hidden text-xs text-muted-foreground sm:block">
          {meta.subtitle}
        </p>
      </div>

      {/* Model selector */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="sm" className="gap-1.5">
            <Bot className="size-3.5 text-emerald-500" />
            <span className="hidden font-mono text-xs sm:inline">
              {ALL_MODELS.find((m) => m.id === model)?.label ?? model}
            </span>
            <ChevronDown className="size-3 opacity-50" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-64">
          <DropdownMenuLabel className="text-xs text-muted-foreground">
            Model
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          {ALL_MODELS.map((m) => (
            <DropdownMenuItem
              key={m.id}
              onClick={() => setModel(m.id)}
              className="flex flex-col items-start gap-0.5 py-2"
            >
              <div className="flex w-full items-center justify-between">
                <span className="text-sm font-medium">{m.label}</span>
                {model === m.id && (
                  <Check className="size-3.5 text-emerald-500" />
                )}
              </div>
              <div className="flex items-center gap-2 text-[10px] text-muted-foreground">
                <span className="rounded-sm bg-muted px-1 py-0.5 uppercase">
                  {m.provider}
                </span>
                <span>{(m.contextWindow / 1000).toFixed(0)}k ctx</span>
                {m.reasoning && (
                  <span className="text-amber-600 dark:text-amber-400">
                    reasoning
                  </span>
                )}
              </div>
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>

      {/* GitHub status */}
      <Button
        variant="outline"
        size="sm"
        className="gap-1.5"
        onClick={() => useAppStore.getState().setView("github")}
      >
        <Github className="size-3.5" />
        <span className="hidden sm:inline">
          {githubConnected ? (githubUsername ?? "Connected") : "Connect"}
        </span>
        <span
          className={cn(
            "size-1.5 rounded-full",
            githubConnected
              ? "bg-emerald-500"
              : "bg-muted-foreground/40"
          )}
        />
      </Button>

      {/* Theme toggle */}
      <Button
        variant="ghost"
        size="icon"
        aria-label="Toggle theme"
        onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
        disabled={!mounted}
      >
        {mounted && theme === "dark" ? (
          <Sun className="size-4" />
        ) : (
          <Moon className="size-4" />
        )}
      </Button>
    </header>
  );
}

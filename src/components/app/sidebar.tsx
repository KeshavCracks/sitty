"use client";

/**
 * App sidebar — navigation between views + runtime status card.
 *
 * Desktop: fixed left sidebar.
 * Mobile: rendered inside a Sheet (drawer) controlled by app store.
 */

import * as React from "react";
import {
  Bot,
  Github,
  History,
  LayoutDashboard,
  PlusCircle,
  Settings,
  Terminal,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ForgeLogo } from "@/components/forge/icons";
import { useAppStore } from "@/store/app-store";
import { useSettingsStore } from "@/store/settings-store";
import { useAgentStore } from "@/store/agent-store";
import type { AppView } from "@/types";

interface NavItem {
  view: AppView;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}

const NAV_ITEMS: NavItem[] = [
  { view: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { view: "new-task", label: "New task", icon: PlusCircle },
  { view: "execution", label: "Execution", icon: Terminal },
  { view: "history", label: "History", icon: History },
  { view: "github", label: "GitHub", icon: Github },
  { view: "settings", label: "Settings", icon: Settings },
];

const RUNTIME_BADGE_STYLES: Record<string, string> = {
  demo: "border-amber-500/30 bg-amber-500/10 text-amber-600 dark:text-amber-400",
  cloud: "border-sky-500/30 bg-sky-500/10 text-sky-600 dark:text-sky-400",
  local: "border-emerald-500/30 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
};

export function SidebarContent() {
  const view = useAppStore((s) => s.view);
  const setView = useAppStore((s) => s.setView);
  const setSidebarOpen = useAppStore((s) => s.setSidebarOpen);
  const runtimeMode = useSettingsStore((s) => s.runtimeMode);
  const githubConnected = useSettingsStore((s) => s.githubConnected);
  const isRunning = useAgentStore((s) => s.isRunning);
  const statusLine = useAgentStore((s) => s.statusLine);
  const currentTaskId = useAgentStore((s) => s.currentTaskId);

  return (
    <div className="flex h-full flex-col">
      {/* Logo */}
      <div className="flex h-16 items-center gap-2 border-b border-sidebar-border px-5">
        <ForgeLogo size={26} />
        <div className="flex flex-col leading-tight">
          <span className="text-sm font-semibold">Forge</span>
          <span className="text-[10px] text-muted-foreground">
            AI Software Engineer
          </span>
        </div>
      </div>

      {/* New task CTA */}
      <div className="p-3">
        <Button
          className="w-full justify-start"
          variant="default"
          size="sm"
          onClick={() => {
            setView("new-task");
            setSidebarOpen(false);
          }}
        >
          <PlusCircle className="mr-2 size-4" />
          New task
        </Button>
      </div>

      {/* Nav */}
      <nav className="flex-1 space-y-0.5 px-3">
        {NAV_ITEMS.map((item) => {
          const active = view === item.view;
          return (
            <button
              key={item.view}
              onClick={() => {
                setView(item.view);
                setSidebarOpen(false);
              }}
              className={cn(
                "flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors",
                active
                  ? "bg-sidebar-accent text-sidebar-accent-foreground font-medium"
                  : "text-muted-foreground hover:bg-sidebar-accent/50 hover:text-foreground"
              )}
            >
              <item.icon className="size-4" />
              <span className="flex-1 text-left">{item.label}</span>
              {item.view === "execution" && isRunning && (
                <span className="size-1.5 rounded-full bg-emerald-500 pulse-ring" />
              )}
              {item.view === "execution" && !isRunning && currentTaskId && (
                <span className="size-1.5 rounded-full bg-muted-foreground/50" />
              )}
            </button>
          );
        })}
      </nav>

      {/* Runtime status card */}
      <div className="m-3 rounded-lg border border-sidebar-border bg-sidebar-accent/30 p-3">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
            Runtime
          </span>
          <Badge
            variant="outline"
            className={cn(
              "text-[10px]",
              RUNTIME_BADGE_STYLES[runtimeMode] ?? RUNTIME_BADGE_STYLES.demo
            )}
          >
            {runtimeMode}
          </Badge>
        </div>
        <div className="mt-2 flex items-center justify-between text-xs">
          <span className="flex items-center gap-1.5 text-muted-foreground">
            <Github className="size-3" />
            GitHub
          </span>
          <span
            className={cn(
              "font-medium",
              githubConnected
                ? "text-emerald-600 dark:text-emerald-400"
                : "text-muted-foreground"
            )}
          >
            {githubConnected ? "Connected" : "Not connected"}
          </span>
        </div>
        {isRunning && (
          <div className="mt-2 flex items-center gap-1.5 border-t border-sidebar-border pt-2 text-xs">
            <Bot className="size-3 shrink-0 text-emerald-500" />
            <span className="truncate text-muted-foreground">{statusLine}</span>
          </div>
        )}
      </div>
    </div>
  );
}

export function Sidebar() {
  return (
    <aside className="hidden h-screen w-64 shrink-0 border-r border-border bg-sidebar lg:sticky lg:top-0 lg:block">
      <SidebarContent />
    </aside>
  );
}

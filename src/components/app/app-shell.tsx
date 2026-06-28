"use client";

/**
 * App shell — sidebar + topbar + active view router.
 *
 * Renders the appropriate view based on the app store's `view` field.
 * All views live under the `/` route — switching is purely client-side.
 */

import * as React from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Sidebar } from "./sidebar";
import { Topbar } from "./topbar";
import { DashboardView } from "./views/dashboard-view";
import { NewTaskView } from "./views/new-task-view";
import { ExecutionView } from "./views/execution-view";
import { HistoryView } from "./views/history-view";
import { GitHubView } from "./views/github-view";
import { SettingsView } from "./views/settings-view";
import { useAppStore } from "@/store/app-store";

export function AppShell() {
  const view = useAppStore((s) => s.view);

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      <div className="flex min-w-0 flex-1 flex-col">
        <Topbar />
        <main className="flex-1">
          <AnimatePresence mode="wait">
            <motion.div
              key={view}
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.18, ease: "easeOut" }}
              className={view === "execution" ? undefined : "min-h-[calc(100vh-4rem)]"}
            >
              {view === "dashboard" && <DashboardView />}
              {view === "new-task" && <NewTaskView />}
              {view === "execution" && <ExecutionView />}
              {view === "history" && <HistoryView />}
              {view === "github" && <GitHubView />}
              {view === "settings" && <SettingsView />}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}

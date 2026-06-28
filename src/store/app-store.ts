/**
 * App-level UI state: which view is currently shown, the active task id,
 * theme preference, command palette open state, etc.
 */

import { create } from "zustand";
import type { AppView } from "@/types";

interface AppState {
  /** Currently active view. Landing is the default. */
  view: AppView;
  /** The task currently being executed or inspected (drives the execution view). */
  activeTaskId: string | null;
  /** Command palette (cmd+k) visibility */
  commandPaletteOpen: boolean;
  /** Mobile sidebar visibility */
  sidebarOpen: boolean;

  setView: (view: AppView) => void;
  setActiveTaskId: (id: string | null) => void;
  setCommandPaletteOpen: (open: boolean) => void;
  setSidebarOpen: (open: boolean) => void;
  /** Convenience: enter the app shell on a specific view */
  enterApp: (view?: AppView, taskId?: string | null) => void;
  /** Go back to the landing page */
  exitToLanding: () => void;
}

export const useAppStore = create<AppState>((set) => ({
  view: "landing",
  activeTaskId: null,
  commandPaletteOpen: false,
  sidebarOpen: false,

  setView: (view) => set({ view }),
  setActiveTaskId: (id) => set({ activeTaskId: id }),
  setCommandPaletteOpen: (open) => set({ commandPaletteOpen: open }),
  setSidebarOpen: (open) => set({ sidebarOpen: open }),

  enterApp: (view = "dashboard", taskId = null) =>
    set({ view, activeTaskId: taskId, sidebarOpen: false }),

  exitToLanding: () => set({ view: "landing", activeTaskId: null }),
}));

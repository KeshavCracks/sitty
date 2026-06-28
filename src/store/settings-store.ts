/**
 * Settings store: model + provider selection, GitHub connection state,
 * runtime mode. Persisted to localStorage.
 */

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { LLMProviderId, RuntimeMode } from "@/types";

interface SettingsState {
  provider: LLMProviderId;
  model: string;
  runtimeMode: RuntimeMode;
  /** GitHub connection (mirrored from /api/github/connection for the UI) */
  githubConnected: boolean;
  githubUsername: string | null;
  /** Default repository when creating a new task */
  defaultRepo: string | null;
  /** Whether to use the live LLM for planning (false = always demo) */
  useLlmPlanner: boolean;

  setProvider: (p: LLMProviderId) => void;
  setModel: (m: string) => void;
  setRuntimeMode: (m: RuntimeMode) => void;
  setGithub: (connected: boolean, username: string | null) => void;
  setDefaultRepo: (repo: string | null) => void;
  setUseLlmPlanner: (v: boolean) => void;
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      provider: "zai",
      model: "glm-4.6",
      runtimeMode: "demo",
      githubConnected: false,
      githubUsername: null,
      defaultRepo: null,
      useLlmPlanner: false,

      setProvider: (p) => set({ provider: p }),
      setModel: (m) => set({ model: m }),
      setRuntimeMode: (m) => set({ runtimeMode: m }),
      setGithub: (connected, username) =>
        set({ githubConnected: connected, githubUsername: username }),
      setDefaultRepo: (repo) => set({ defaultRepo: repo }),
      setUseLlmPlanner: (v) => set({ useLlmPlanner: v }),
    }),
    { name: "forge-settings" }
  )
);

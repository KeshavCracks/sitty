/**
 * Task history store — list of all tasks (in-progress and past).
 *
 * Persisted to localStorage so the dashboard and history view have
 * data on first load. Seeded with a few realistic-looking past tasks
 * via `seedTasks()` on first run.
 */

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Task } from "@/types";
import { seedTasks } from "@/lib/demo/seed-tasks";

interface TaskState {
  tasks: Task[];
  upsertTask: (task: Task) => void;
  updateTask: (id: string, patch: Partial<Task>) => void;
  removeTask: (id: string) => void;
  getTask: (id: string) => Task | undefined;
  clearCompleted: () => void;
}

export const useTaskStore = create<TaskState>()(
  persist(
    (set, get) => ({
      tasks: seedTasks(),
      upsertTask: (task) =>
        set((state) => {
          const idx = state.tasks.findIndex((t) => t.id === task.id);
          if (idx >= 0) {
            const next = [...state.tasks];
            next[idx] = task;
            return { tasks: next };
          }
          return { tasks: [task, ...state.tasks] };
        }),
      updateTask: (id, patch) =>
        set((state) => ({
          tasks: state.tasks.map((t) =>
            t.id === id ? { ...t, ...patch, updatedAt: new Date().toISOString() } : t
          ),
        })),
      removeTask: (id) =>
        set((state) => ({ tasks: state.tasks.filter((t) => t.id !== id) })),
      getTask: (id) => get().tasks.find((t) => t.id === id),
      clearCompleted: () =>
        set((state) => ({
          tasks: state.tasks.filter((t) => t.status !== "completed"),
        })),
    }),
    { name: "forge-tasks" }
  )
);

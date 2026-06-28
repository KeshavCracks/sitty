# Architecture

This document is the engineering deep-dive behind Forge. It's written for a senior reviewer who wants to understand not just *what* the code does, but *why* it's structured this way.

## Table of contents

1. [High-level diagram](#high-level-diagram)
2. [Layer-by-layer](#layer-by-layer)
3. [The agent state machine](#the-agent-state-machine)
4. [LLM provider abstraction](#llm-provider-abstraction)
5. [Runtime abstraction](#runtime-abstraction)
6. [GitHub integration](#github-integration)
7. [Persistence](#persistence)
8. [Design decisions and tradeoffs](#design-decisions-and-tradeoffs)

---

## High-level diagram

```
┌────────────────────────────────────────────────────────────────────┐
│                          Browser (single page)                     │
│                                                                    │
│   Landing page              App Shell                              │
│   (marketing)        ┌──────┴───────────────────────────────┐      │
│                      │ Sidebar │ Topbar │ View Router        │      │
│                      │         │        │                    │      │
│                      │ Dashboard  New Task  Execution        │      │
│                      │ History    GitHub    Settings         │      │
│                      └──────┬───────────────────────────────┘      │
│                             │                                      │
│                             ▼                                      │
│              ┌──────────────────────────────┐                     │
│              │   Zustand stores             │                     │
│              │   • app-store     (nav)      │                     │
│              │   • agent-store   (exec)     │                     │
│              │   • task-store    (history)  │                     │
│              │   • settings-store(config)   │                     │
│              └──────────────┬───────────────┘                     │
│                             │                                      │
│              ┌──────────────┴───────────────┐                     │
│              │   fetch() to /api/*          │                     │
│              └──────────────┬───────────────┘                     │
└─────────────────────────────┼──────────────────────────────────────┘
                              │
                              ▼
┌────────────────────────────────────────────────────────────────────┐
│                         Next.js server                              │
│                                                                    │
│   /api/agent/plan      /api/agent/runtime                          │
│   /api/github/*        /api/llm/models    /api/health              │
│                             │                                      │
│                             ▼                                      │
│              ┌──────────────────────────────┐                     │
│              │   /lib  (typed services)     │                     │
│              │                              │                     │
│              │   agent/   planner           │                     │
│              │            executor          │                     │
│              │            tools             │                     │
│              │            runtime           │                     │
│              │                              │                     │
│              │   llm/     claude            │                     │
│              │            zai               │                     │
│              │            factory           │                     │
│              │                              │                     │
│              │   github/  REST v3 client    │                     │
│              │   demo/    scenarios         │                     │
│              └──────────────┬───────────────┘                     │
└─────────────────────────────┼──────────────────────────────────────┘
                              │
                              ▼
┌────────────────────────────────────────────────────────────────────┐
│                         External services                          │
│                                                                    │
│   Anthropic API     GitHub REST API     SQLite (Prisma)            │
└────────────────────────────────────────────────────────────────────┘
```

## Layer-by-layer

### 1. UI (`src/components/`)

Pure presentation. Components read from Zustand stores and emit user intents (start a task, change view, cancel). No `fetch` calls live here — that's the rule. The only network-aware components are the GitHub and Settings views, which fetch from `/api/*` and are explicitly server-state-driven.

**Why**: keeps components testable, avoids prop-drilling, and makes the API surface explicit. If you want to swap the data layer, you change `/lib`, not 30 components.

### 2. State (`src/store/`)

Four Zustand stores, each with a single responsibility:

| Store | Purpose | Persistence |
|-------|---------|-------------|
| `app-store` | Current view, active task id, sidebar/command palette state | In-memory |
| `agent-store` | The active execution: plan, steps, logs, file changes, terminal | In-memory (intentional — execution is ephemeral) |
| `task-store` | Task history list (all past and current tasks) | localStorage (survives refresh) |
| `settings-store` | Model, provider, runtime mode, GitHub connection state | localStorage |

**Why Zustand over Redux/Context**: no boilerplate, no provider tree, survives HMR cleanly, and the `persist` middleware gives us localStorage for free.

### 3. API (`src/app/api/`)

Thin route handlers. Each handler:

1. Validates the request.
2. Delegates to a typed function in `/lib`.
3. Returns a typed JSON response.

Handlers contain **zero** business logic. They exist only to translate HTTP into function calls and back.

**Why**: if you ever want to swap Next.js for Hono or Express, you rewrite the handlers — the `/lib` layer is unchanged.

### 4. Services (`src/lib/`)

The typed business core. Four sub-modules:

#### `agent/`

- **`planner.ts`** — `planTask(input)`: returns `{ plan, source }`. Calls the LLM with a strict-JSON system prompt; falls back to scenario matching on any error.
- **`tools.ts`** — the typed tool registry. Each tool declares `readOnly` and `cloudSafe` flags that the runtime uses to decide whether to actually execute.
- **`runtime.ts`** — the `AgentRuntime` interface and three implementations (`cloud`, `local`, `demo`). The `RuntimeInfo` type carries caveats the UI surfaces.
- **`executor.ts`** — (planned) the real executor. Currently the execution loop lives in `agent-store` (client-side) for the demo, but the interface is designed so the same loop can run server-side in a worker.

#### `llm/`

- **`types.ts`** — model definitions for Claude and Z.ai.
- **`claude.ts`** — `ClaudeProvider`: thin wrapper around the Anthropic Messages API. Uses `ANTHROPIC_API_KEY` from env. Supports `thinking` (extended reasoning) for Sonnet/Opus.
- **`zai.ts`** — `ZaiProvider`: wraps the `z-ai-web-dev-sdk`. Always available in the sandbox; used as the default when no Anthropic key is configured.
- **`index.ts`** — the factory. `getDefaultProvider()` picks based on env; `getCachedProvider()` reuses a single instance per process.

#### `github/`

- **`client.ts`** — `GitHubClient`: thin REST v3 wrapper. Methods: `getConnection`, `listRepositories`, `listBranches`, `listPullRequests`, `listCommits`, `createBranch`, `createPullRequest`. Uses `GITHUB_TOKEN` from env.
- Returns typed shapes from `@/types`; never leaks the raw GitHub API response.

#### `demo/`

- **`scenarios.ts`** — five complete scenarios (dark mode toggle, auth bug fix, add tests, refactor to server action, generic). Each has objective, assumptions, risks, 6–8 steps with terminal output and file diffs.
- **`seed-tasks.ts`** — seven pre-populated tasks for the dashboard so it looks alive on first load.
- **`matchScenario(description)`** — keyword-based matcher. Picks the closest scenario; falls back to the generic one.

### 5. Types (`src/types/`)

The shared contract. Every layer imports from here; no layer defines its own duplicate types. This is what makes the codebase refactorable.

### 6. Persistence (`prisma/`)

SQLite via Prisma. Four models: `Task`, `Step`, `LogEntry`, `FileChange`. The schema is ready for production use; the demo currently uses localStorage for tasks to avoid the Vercel SQLite caveat, but the Prisma client is wired up and ready.

---

## The agent state machine

```
            ┌─────────┐
            │ queued  │
            └────┬────┘
                 │  startTask()
                 ▼
            ┌──────────┐
            │ planning │  ◄── planner.generatePlan()
            └────┬─────┘
                 │  plan ready
                 ▼
            ┌───────────┐
            │ executing │  ◄── for each step:
            └────┬──────┘       in_progress → stream → diffs → completed
                 │  all steps done
                 ▼
            ┌───────────┐
            │ reviewing │  ◄── diff summary, final checks
            └────┬──────┘
                 │
                 ▼
            ┌───────────┐
            │ completed │  ◄── summary + PR number
            └───────────┘

       (any state) ──── cancel ────► cancelled
       (any state) ──── error  ────► failed
```

The state machine lives in the `agent-store`. Each transition emits structured logs that the UI renders in the Logs tab. Cancellation is cooperative: the loop checks a `cancelRequested` flag between steps.

---

## LLM provider abstraction

```typescript
// src/types/index.ts
export interface LLMProvider {
  id: LLMProviderId;
  label: string;
  available: boolean;
  models: LLMModel[];
  complete(req: ChatCompletionRequest): Promise<ChatCompletionResponse>;
}
```

Three implementations:

| Provider | When it's used | Notes |
|----------|---------------|-------|
| `ClaudeProvider` | `ANTHROPIC_API_KEY` is set | Primary. Supports extended thinking. |
| `ZaiProvider` | No Anthropic key, in the Z.ai sandbox | Default fallback. Uses `z-ai-web-dev-sdk`. |
| `DemoProvider` | `FORGE_RUNTIME_MODE=demo` | No network. Deterministic canned responses. |

The factory `getCachedProvider()` returns a singleton based on env. The `/api/agent/plan` handler uses this; the planner doesn't care which provider it got.

**Why this matters**: the demo works out-of-the-box without requiring the user to bring a key, but the moment you add `ANTHROPIC_API_KEY`, the same code path uses real Claude. No feature flags, no code changes.

---

## Runtime abstraction

```typescript
// src/lib/agent/runtime.ts
export interface AgentRuntime {
  mode: RuntimeMode;
  info: RuntimeInfo;
  execute(req: ToolExecutionRequest): Promise<ToolExecutionResult>;
}
```

Three modes:

| Mode | What it does | When to use |
|------|-------------|-------------|
| `demo` | Simulates everything. No network, no filesystem. | First run, demos, recruiting. |
| `cloud` | Read-only tools run live; mutating tools are simulated and previewed. | Vercel deployment with keys configured. |
| `local` | All tools execute against a real working tree via a local worker. | Local development with the worker running. |

The `cloudSafe` flag on each tool definition determines whether it actually runs in cloud mode. The UI never branches on mode — it asks the runtime for a result and renders it.

---

## GitHub integration

`GitHubClient` is a thin wrapper around the REST v3 API. It returns typed shapes and never throws on "not configured" — instead, `available` is `false` and every method throws a typed error that the UI surfaces as "Connect your GitHub account".

The GitHub view calls `/api/github/connection` and `/api/github/repos`. Both endpoints degrade gracefully:

- No `GITHUB_TOKEN` → connection is `{ connected: false }`, repos endpoint returns `{ repos: [], error: "..." }`.
- Bad token → same shape, with the error message.
- Valid token → real connection and repo list.

This means the UI never crashes; it always shows either real data or actionable setup instructions.

---

## Persistence

Prisma + SQLite. The schema models the full agent state:

```prisma
model Task {
  id              String   @id @default(cuid())
  title           String
  description     String
  status          String
  // ... (see prisma/schema.prisma)
  steps    Step[]
  logs     LogEntry[]
  changes  FileChange[]
}
```

The Prisma client is wired up at `src/lib/db.ts`. To use it server-side:

```typescript
import { db } from "@/lib/db";
const tasks = await db.task.findMany({ orderBy: { createdAt: "desc" } });
```

For the demo, task history is also mirrored to localStorage via Zustand's `persist` middleware so the UI works without a database round-trip. In production, swap to Vercel Postgres by changing `DATABASE_URL` and the Prisma datasource provider.

---

## Design decisions and tradeoffs

### Why a single-page app on `/`?

- Vercel routing stays trivial — one route, one deployment.
- View transitions are instant (no server round-trip).
- The entire UX lives behind one URL, which is friendlier for demos and recruiting.

The tradeoff: no deep-linking to specific views. This is acceptable for a portfolio app; for a real product, you'd add real routes.

### Why client-side simulated execution?

- Vercel free tier has no persistent filesystem and a 10s function timeout.
- A real agent loop would need a long-running worker, which means a separate service.
- The simulation is good enough to demonstrate the UX and the architecture — and the runtime abstraction means the same UI works when real execution is added.

### Why Zustand over Redux?

- 90% less boilerplate.
- No provider tree.
- The `persist` middleware is one line.
- Survives HMR without losing state.

### Why scenario-based planning as a fallback?

- The LLM call can fail (network, bad JSON, rate limit, missing key).
- Without a fallback, the demo breaks.
- With a fallback, the demo *always* tells a complete story, even offline.
- The scenarios are realistic enough that the UX is indistinguishable from a real LLM-generated plan.

### Why not just use the OpenAI SDK?

- Claude is the primary target (per the brief).
- The Anthropic API is OpenAI-shaped enough that the abstraction is trivial.
- The Z.ai SDK is included as a sandbox-friendly default so the demo works without any user-provided key.

### Why split `/lib` from `/api`?

- `/lib` is pure TypeScript — importable from server components, route handlers, server actions, and tests.
- `/api` is Next.js-specific — HTTP translation only.
- This split means the business logic is portable to any runtime.

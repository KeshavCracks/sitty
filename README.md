# Forge — AI Software Engineer

> An autonomous software engineering agent that plans, codes, tests, and ships pull requests. Inspired by **OpenHands** (formerly OpenDevin) and the **Devin** paradigm. Claude-powered reasoning, GitHub-native workflows, and a polished developer experience — deployable on the Vercel free tier.

<p align="center">
  <strong>
    <a href="#quick-start">Quick Start</a> ·
    <a href="#architecture">Architecture</a> ·
    <a href="#deployment">Deployment</a> ·
    <a href="#vercel-free-tier-constraints--tradeoffs">Tradeoffs</a> ·
    <a href="docs/ARCHITECTURE.md">Deep Dive</a>
  </strong>
</p>

---

## Why this exists

Most "AI coding agent" demos either (a) only run in a notebook with hardcoded prompts, or (b) require a Kubernetes cluster and a Stripe plan before they'll say hello. **Forge** is the middle path: a production-quality Next.js app that demonstrates the *full* Devin-style workflow — task intake, planning, step-by-step execution with live terminal output, file diffs, and a pull request — while being honest about what can and cannot run on Vercel's free tier.

The result is a project that's equally useful as:

- **A portfolio piece** — recruiters and clients can clone, deploy, and click through it in 60 seconds.
- **An architecture reference** — clean typed modules for the planner, executor, runtime, tools, and integrations.
- **A starting point** — fork it, wire in real execution, ship your own Devin.

---

## What it does

Describe a task in plain English. Forge:

1. **Plans** — decomposes the task into 5–9 ordered steps with explicit tool calls, assumptions, and risks.
2. **Executes** — walks the plan step by step, streaming terminal output, file diffs, and structured logs in real time.
3. **Tests** — runs lint, typecheck, and the test suite as part of the flow.
4. **Ships** — commits with a conventional message and opens a pull request with a summary.

Every stage is observable in a polished UI. You can cancel mid-run, inspect any past task, and switch models without losing context.

---

## Screenshots

> Place screenshots in `docs/screenshots/` and they'll render here.

| Landing | Dashboard | Execution |
|---------|-----------|-----------|
| _Hero, features, architecture, workflow_ | _Stats, activity chart, recent tasks_ | _Plan timeline, terminal, diffs, logs_ |

```
docs/screenshots/
├── landing.png
├── dashboard.png
├── execution.png
├── new-task.png
└── github.png
```

---

## Architecture

```
┌──────────────────────────────────────────────────────────────────┐
│                        Browser (single page)                     │
│  Landing  ←→  App Shell (sidebar + topbar + view router)         │
│      │           │                                                │
│      │           ├─ Dashboard   ├─ New Task                       │
│      │           ├─ Execution   ├─ History                        │
│      │           ├─ GitHub      └─ Settings                       │
│      ▼           ▼                                                │
│  Zustand stores (app · agent · task · settings)                  │
│      │           │                                                │
│      │           └─ agent-store drives the simulated execution    │
│      ▼                  loop (plan → stream → diff → commit)     │
└──────┼─────────────────┼──────────────────────────────────────────┘
       │                 │
       ▼                 ▼
┌──────────────┐  ┌──────────────────────────────────────────────┐
│ /api/*       │  │ /lib/*  (typed service layer)                │
│              │  │                                              │
│ /agent/plan  │◄─┤  agent/  planner · executor · tools · runtime│
│ /agent/runtime│  │  llm/    claude · zai · provider factory     │
│ /llm/models  │  │  github/ REST v3 client                      │
│ /github/*    │  │  demo/   scenario library + seed data        │
│ /health      │  │  types/  shared domain types                 │
└──────────────┘  └──────────────────────────────────────────────┘
       │
       ▼
┌──────────────────────────────────────────────┐
│  External services (optional, env-driven)    │
│  Anthropic API · GitHub REST API · SQLite    │
└──────────────────────────────────────────────┘
```

### Layer responsibilities

| Layer | Path | Responsibility |
|-------|------|----------------|
| **UI** | `src/components/` | Landing page + app shell + views. Pure presentation; reads from stores. |
| **State** | `src/store/` | Zustand stores for app nav, agent execution, task history, settings. |
| **API** | `src/app/api/` | Thin route handlers — proxy to the service layer. |
| **Services** | `src/lib/` | Typed business logic: agent, llm, github, demo. No React, no Next. |
| **Types** | `src/types/` | Shared domain contracts between every layer. |
| **Persistence** | `prisma/` | SQLite schema for tasks, steps, logs, file changes. |

> See [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md) for the full deep-dive.

---

## Tech stack

| Concern | Choice | Why |
|---------|--------|-----|
| Framework | **Next.js 16** (App Router) | Server components, route handlers, server actions, Vercel-native. |
| Language | **TypeScript 5** (strict) | End-to-end type safety across UI → API → services. |
| Styling | **Tailwind CSS 4** + **shadcn/ui** | Design tokens, consistent components, dark-mode-first. |
| State | **Zustand** (+ persist) | Lightweight, no boilerplate, survives HMR. |
| Data fetching | **TanStack Query** | Available for server-state; not required for the demo. |
| Animation | **Framer Motion** | Tasteful entrance / hover / page transitions. |
| Icons | **lucide-react** | Tree-shakeable, consistent stroke. |
| Charts | **Recharts** | Activity sparkline on the dashboard. |
| Database | **Prisma** + SQLite | Zero-config persistence; portable to Postgres later. |
| LLM (primary) | **Anthropic Claude** | Sonnet 4.5 / Opus 4.1 / Haiku 4.5. |
| LLM (fallback) | **Z.ai (GLM)** via `z-ai-web-dev-sdk` | Sandbox-friendly; works without a user-provided key. |
| Theme | **next-themes** | Class-based dark/light with no hydration mismatch. |

---

## Folder structure

```
.
├── src/
│   ├── app/
│   │   ├── api/                  # Route handlers (server-side)
│   │   │   ├── agent/
│   │   │   │   ├── plan/         # POST  generate a plan via LLM
│   │   │   │   └── runtime/      # GET   current runtime info
│   │   │   ├── github/
│   │   │   │   ├── connection/   # GET   GitHub connection status
│   │   │   │   └── repos/        # GET   list user's repositories
│   │   │   ├── llm/
│   │   │   │   └── models/       # GET   available models + providers
│   │   │   └── health/           # GET   health check
│   │   ├── globals.css           # Obsidian Forge design system
│   │   ├── layout.tsx            # Root layout + ThemeProvider
│   │   └── page.tsx              # The only user-visible route
│   ├── components/
│   │   ├── ui/                   # shadcn/ui components (pre-installed)
│   │   ├── forge/                # Forge-specific primitives (logo, badges)
│   │   ├── landing/              # Landing page sections
│   │   └── app/                  # App shell + views
│   │       └── views/            # dashboard, new-task, execution, etc.
│   ├── lib/
│   │   ├── agent/                # Planner · executor · tools · runtime
│   │   ├── llm/                  # Claude · Z.ai · provider factory
│   │   ├── github/               # GitHub REST v3 client
│   │   ├── demo/                 # Scenario library + seed data
│   │   ├── db.ts                 # Prisma client
│   │   └── utils.ts              # cn() helper
│   ├── store/                    # Zustand stores
│   ├── types/                    # Shared domain types
│   └── hooks/                    # use-mobile, use-toast
├── prisma/
│   └── schema.prisma             # Task · Step · LogEntry · FileChange
├── docs/
│   ├── ARCHITECTURE.md           # Layer-by-layer deep dive
│   ├── DEPLOYMENT.md             # Step-by-step Vercel guide
│   └── LOCAL_RUNTIME.md          # Optional local worker setup
├── public/                       # Static assets
├── .env.example                  # Env var template
└── package.json
```

---

## Quick start

### Prerequisites

- **Node.js 20+** or **Bun** (recommended)
- A GitHub account (for cloning; optional for running)
- An Anthropic API key (optional — Forge falls back to Z.ai / demo mode)

### Install & run

```bash
# 1. Clone
git clone https://github.com/KeshavCracks/sitty.git
cd sitty

# 2. Install dependencies
bun install        # or: npm install

# 3. Configure environment (all optional — Forge runs in demo mode without any)
cp .env.example .env.local
# Edit .env.local to add ANTHROPIC_API_KEY and/or GITHUB_TOKEN

# 4. Set up the database (SQLite, local file)
bun run db:push

# 5. Start the dev server
bun run dev
```

Open **http://localhost:3000** — you'll land on the marketing page. Click **Launch App** to enter the dashboard.

> **No keys? No problem.** Without `ANTHROPIC_API_KEY` or `GITHUB_TOKEN`, Forge runs in demo mode: planning uses scenario templates, execution is fully simulated, and the GitHub view shows setup instructions instead of an error.

### Available scripts

| Script | What it does |
|--------|-------------|
| `bun run dev` | Start the Next.js dev server on port 3000 |
| `bun run lint` | Run ESLint (Next.js + TypeScript rules) |
| `bun run build` | Production build |
| `bun run start` | Run the production build |
| `bun run db:push` | Push the Prisma schema to SQLite |
| `bun run db:generate` | Regenerate the Prisma client |
| `bun run db:migrate` | Create a migration |

---

## Environment variables

All variables are **optional**. Forge gracefully degrades when any are missing.

| Variable | Purpose | Required? |
|----------|---------|-----------|
| `DATABASE_URL` | SQLite path. Defaults to `file:./dev.db`. | No |
| `ANTHROPIC_API_KEY` | Enables Claude as the primary reasoning model. | No |
| `ANTHROPIC_BASE_URL` | Override the API endpoint (e.g. for a proxy). | No |
| `GITHUB_TOKEN` | Enables repository browsing, branch creation, PR automation. Scope: `repo`. | No |
| `FORGE_RUNTIME_MODE` | `demo` · `cloud` · `local`. Auto-detected if unset. | No |
| `VERCEL` | Set automatically by Vercel. Used for runtime detection. | Auto |

See [`.env.example`](.env.example) for the full template.

---

## Deployment

Forge is designed for the **Vercel free tier**. The deployment story is intentionally boring:

### One-click deploy

> _Coming soon: a Deploy button linking to Vercel's import flow._

### Manual deploy

1. **Push to GitHub** — the repo is already at `KeshavCracks/sitty`.
2. **Import into Vercel** — go to [vercel.com/new](https://vercel.com/new), select the repo.
3. **Add environment variables** (all optional):
   - `ANTHROPIC_API_KEY` — if you want Claude-powered planning
   - `GITHUB_TOKEN` — if you want real GitHub integration
   - `DATABASE_URL` — leave as the default; Vercel will use an in-memory ephemeral SQLite (or pair with Vercel Postgres for persistence)
4. **Deploy.** Vercel auto-detects Next.js 16 and uses the correct build settings.

> See [`docs/DEPLOYMENT.md`](docs/DEPLOYMENT.md) for the full walkthrough including Postgres migration.

---

## Vercel free tier constraints & tradeoffs

This project is explicit about what runs where — no fantasy architecture.

### What runs on Vercel free tier

| Capability | Status | How |
|------------|--------|-----|
| Landing page + app UI | ✅ Full | Static + client-rendered. |
| Model selection, settings, history | ✅ Full | Client-side state (Zustand + localStorage). |
| Real LLM planning (Claude / Z.ai) | ✅ Full | Serverless route handler, < 5s timeout. |
| GitHub connection check + repo list | ✅ Full | Serverless, lightweight REST calls. |
| Live agent execution UX | ✅ Full | Client-side simulated timeline with realistic streaming. |
| Health check, model list | ✅ Full | Trivial serverless endpoints. |

### What doesn't run on Vercel free tier (and why)

| Capability | Status | Why |
|------------|--------|-----|
| Actually writing files to a repo | 🟡 Simulated | Vercel serverless has no persistent filesystem. |
| Running shell commands (tests, build) | 🟡 Simulated | No long-running processes; 10s function timeout. |
| Cloning a repo and working on a real branch | 🟡 Simulated | Same as above. |
| Opening a real PR | 🟡 Simulated | Would require the above + a worker. |

### The escape hatch: local runtime

The architecture is split so the **exact same UI** works in two modes:

- **Cloud / demo** (default): mutating tools produce diffs in the UI but don't touch a real repo. Perfect for demos and the hosted version.
- **Local worker** (opt-in): run a small Node process locally that holds a real working tree and executes tools for real. The frontend talks to it via HTTP.

See [`docs/LOCAL_RUNTIME.md`](docs/LOCAL_RUNTIME.md) for the worker setup. The frontend never branches on mode — it asks the runtime for an `ExecutionResult` and renders whatever comes back.

---

## How the agent works

### Planning

Given a task description, the planner asks the configured LLM to produce a structured plan:

```typescript
// src/lib/agent/planner.ts
const result = await planTask({
  taskId,
  description,
  repository,
  branch,
  baseBranch,
  useLlm: true, // falls back to scenario matching on any error
});
```

The LLM is prompted to return strict JSON with an objective, assumptions, risks, and 5–9 ordered steps — each with a `kind`, `tool`, `toolInput`, and `files`. If the LLM call fails (network, bad JSON, missing key), the planner falls back to one of five predefined scenarios matched by keyword.

### Execution

The `agent-store` walks the plan one step at a time:

1. Marks the step `in_progress`, emits a log entry.
2. Streams the step's terminal output line-by-line with realistic delays.
3. Applies the step's file diffs to the store.
4. Marks the step `completed`, updates task progress.
5. Repeats until all steps are done, then opens a "pull request" and writes a summary.

Every state change flows through Zustand, so the UI updates in real time. The user can cancel mid-run; the loop checks a cancel flag between steps.

### Tools

The tool layer is a typed registry:

```typescript
// src/lib/agent/tools.ts
export const TOOLS: Record<ToolId, ToolDefinition> = {
  read_file:     { /* ... */ readOnly: true,  cloudSafe: true  },
  write_file:    { /* ... */ readOnly: false, cloudSafe: false },
  run_command:   { /* ... */ readOnly: false, cloudSafe: false },
  git_commit:    { /* ... */ readOnly: false, cloudSafe: false },
  open_pr:       { /* ... */ readOnly: false, cloudSafe: false },
  // ...12 tools total
};
```

Each tool declares whether it's read-only and whether it's safe to run on Vercel. The runtime uses these flags to decide whether to actually execute or to simulate.

---

## What's fully working vs. abstracted

### ✅ Fully working

- **Landing page** — polished, responsive, animated.
- **App shell** — sidebar, topbar, view router, mobile drawer.
- **Dashboard** — stats, 14-day activity chart, recent tasks, quick-start prompts.
- **New task** — form with sample prompts, model picker, LLM planner toggle.
- **Execution** — real-time plan timeline, terminal streaming, file diffs, structured logs.
- **History** — searchable, filterable table of all past tasks.
- **GitHub view** — real connection check, real repo listing (when `GITHUB_TOKEN` is set).
- **Settings** — model/provider selection, runtime mode, theme, integration status.
- **LLM planning** — real Claude / Z.ai calls via `/api/agent/plan`.
- **Persistence** — Prisma schema ready; client-side localStorage for demo.

### 🟡 Intentionally abstracted / mocked

- **Tool execution** — mutating tools (write_file, run_command, git_commit) produce realistic diffs in the UI but don't touch a real repo. This is a deliberate Vercel-tier decision, not a bug.
- **PR creation** — the agent "opens" a PR with a fake number; the diff and summary are real.
- **Branch creation** — same as above.

### 🔌 Designed for extension

- **Local worker runtime** — the `AgentRuntime` interface is ready; implementing `LocalRuntime` is a few hundred lines. See `docs/LOCAL_RUNTIME.md`.
- **Additional LLM providers** — implement the `LLMProvider` interface and register in the factory.
- **Real GitHub PRs** — `GitHubClient.createPullRequest` is already implemented; wire it into the runtime to make PRs real.

---

## Roadmap

- [ ] **Local worker runtime** — a small Node process that executes tools against a real working tree.
- [ ] **Real PR creation** — wire `GitHubClient.createPullRequest` into the runtime.
- [ ] **Streaming LLM output** — server-sent events for token-by-token planner output.
- [ ] **Tool call approval** — pause before mutating tools for sensitive repos.
- [ ] **Multi-file search** — `search_code` tool backed by ripgrep.
- [ ] **Vercel Postgres adapter** — swap SQLite for Postgres with one env var.
- [ ] **Audit log export** — download the full log stream as JSONL.

---

## Why this architecture

> The full reasoning is in [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md). Short version:

1. **Single-page app on `/`** — keeps the Vercel routing trivial, makes view transitions instant, and lets the entire UX live behind one deploy.
2. **Typed service layer in `/lib`** — UI never imports `fetch` directly; everything goes through a typed function. Makes the codebase testable and swappable.
3. **Provider abstraction** — Claude is primary, but the abstraction means the project still runs in a sandbox without a user-provided key. This is what makes the demo work out-of-the-box.
4. **Runtime abstraction** — the same UI code path handles demo / cloud / local. No `if (isDemo)` branches scattered through components.
5. **Scenario library** — guarantees the demo always tells a complete, polished story even when the LLM is unreachable. Every scenario has realistic terminal output, file diffs, and a summary.
6. **Honest documentation** — the README explicitly says what doesn't run on Vercel free tier. Recruiters and reviewers respect honesty over vaporware.

---

## License

MIT — see [`LICENSE`](LICENSE) (or just assume MIT; this is a portfolio project).

## Credits

- **Inspiration**: [OpenHands](https://github.com/All-Hands-AI/OpenHands) (formerly OpenDevin), the Devin product, and the broader autonomous-agent community.
- **Design**: Obsidian Forge palette, hand-tuned. shadcn/ui New York style as the component base.
- **Built by**: [KeshavCracks](https://github.com/KeshavCracks)

---

<p align="center">
  <sub>If this project helped you, consider giving it a ⭐ on GitHub.</sub>
</p>

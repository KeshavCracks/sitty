# Local Runtime

Forge's runtime abstraction is designed so the **same UI** works in three modes:

- `demo` — fully simulated, no network, no filesystem.
- `cloud` — Vercel serverless. Read-only tools live; mutating tools are simulated.
- `local` — real execution against a local working tree via a worker process.

This document explains how to set up the local runtime so the agent actually writes files, runs commands, and opens real pull requests.

> **Status**: the `AgentRuntime` interface is fully designed and the cloud/demo modes are implemented. The local worker is the next milestone — the interface is ready for it.

---

## Architecture

```
┌─────────────────────────┐         ┌──────────────────────────────┐
│  Browser (Next.js app)  │         │  Local worker (Node process) │
│                         │         │                              │
│  agent-store            │  HTTP   │  LocalRuntime                │
│    │                    ◄───────► │    ├─ working tree (git)     │
│    │  POST /api/agent/  │  JSON   │    ├─ tool executor          │
│    │       execute      │         │    │    ├─ read_file         │
│    ▼                    │         │    │    ├─ write_file        │
│  ToolExecutionResult    │         │    │    ├─ run_command       │
│                         │         │    │    └─ git_commit        │
└─────────────────────────┘         │    └─ event stream           │
                                    └──────────────────────────────┘
```

The browser never talks to the worker directly — it goes through the Next.js API, which proxies to the worker. This keeps the worker's HTTP port internal and lets the Next.js app enforce auth/rate limits.

---

## Setup (planned)

### 1. Start the worker

```bash
# From the repo root
bun run worker:dev    # starts the worker on port 3030
```

The worker:

- Listens on `http://localhost:3030`
- Holds a working tree at `~/forge-workspace/<task-id>/`
- Exposes `POST /execute` (run a tool) and `GET /health`
- Streams events back via server-sent events

### 2. Configure the app

Set `FORGE_RUNTIME_MODE=local` in `.env.local`. The app will route mutating tool calls through `/api/agent/execute`, which proxies to the worker.

### 3. Use it

Start a task as usual. The execution view will show:

- Real terminal output from actual shell commands
- Real file diffs from actual edits
- Real commit SHAs and PR numbers

---

## Implementing `LocalRuntime`

The interface is already defined in `src/lib/agent/runtime.ts`:

```typescript
export interface AgentRuntime {
  mode: RuntimeMode;
  info: RuntimeInfo;
  execute(req: ToolExecutionRequest): Promise<ToolExecutionResult>;
}
```

To add the local runtime:

1. **Create `src/lib/agent/local-runtime.ts`**:

   ```typescript
   import type { AgentRuntime, ToolExecutionRequest, ToolExecutionResult } from "./runtime";

   export class LocalRuntime implements AgentRuntime {
     mode = "local" as const;
     info = LOCAL_RUNTIME_INFO;
     private workerUrl: string;

     constructor(workerUrl = "http://localhost:3030") {
       this.workerUrl = workerUrl;
     }

     async execute(req: ToolExecutionRequest): Promise<ToolExecutionResult> {
       const res = await fetch(`${this.workerUrl}/execute`, {
         method: "POST",
         headers: { "content-type": "application/json" },
         body: JSON.stringify(req),
       });
       return res.json();
     }
   }
   ```

2. **Create the worker** in `mini-services/worker/index.ts`:

   ```typescript
   import { exec } from "node:child_process";
   import { promises as fs } from "node:fs";
   import path from "node:path";

   // POST /execute — runs a tool against a working tree
   // GET /health — returns ok
   ```

   The worker should:
   - Clone the repo into a workspace dir on first task
   - Create the requested branch
   - Execute the tool (read_file → fs.readFile, run_command → exec, etc.)
   - Return a `ToolExecutionResult` with stdout/stderr/diff

3. **Wire it into the executor**: when `runtimeMode === "local"`, the `agent-store` should POST each step's tool call to `/api/agent/execute` instead of using the scenario's canned output.

---

## Security considerations

The local worker executes arbitrary shell commands. Treat it like a CI runner:

- **Never expose the worker port to the public internet.** Keep it on `localhost`.
- **Run it in a container** if you're going to run untrusted tasks. Dockerfile example:

  ```dockerfile
  FROM node:20-slim
  WORKDIR /workspace
  # Install git, ripgrep, etc.
  # Run as non-root user
  ```

- **Add an auth token** between the Next.js app and the worker. Set `FORGE_WORKER_TOKEN` in both and verify it on every request.

- **Sandbox the working tree**. Don't let `run_command` escape the workspace dir.

---

## Why not just use Vercel's filesystem?

Vercel serverless functions:

- Have no persistent filesystem across invocations.
- Time out at 10s (free) / 60s (Pro).
- Don't allow long-running processes.
- Can't clone a repo and work on a branch.

A local worker sidesteps all of these. The tradeoff is that you have to run something yourself — but that's the only way to get real execution, and the architecture is designed so you only do it when you need it.

"use client";

/**
 * Forge — Landing Page
 *
 * Premium dark-mode-first marketing page. Sections:
 *   1. Sticky glass navbar
 *   2. Hero with animated terminal preview
 *   3. "Trusted by" strip
 *   4. Feature grid (6 capabilities)
 *   5. Architecture / workflow diagram
 *   6. How it works (4 steps)
 *   7. Code-quality / engineering pitch
 *   8. Final CTA
 *   9. Footer
 */

import * as React from "react";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Bot,
  GitBranch,
  CheckCircle2,
  Code2,
  Cpu,
  FileCode2,
  Github,
  GitPullRequest,
  Layers,
  Play,
  ShieldCheck,
  Sparkles,
  Terminal,
  Workflow,
  Zap,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ForgeLogo, ForgeWordmark, TerminalCursor } from "@/components/forge/icons";
import { useAppStore } from "@/store/app-store";

/* ------------------------------------------------------------------ */
/* Navbar                                                             */
/* ------------------------------------------------------------------ */

function Navbar() {
  const enterApp = useAppStore((s) => s.enterApp);
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 glass">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <ForgeWordmark />
        <nav className="hidden items-center gap-6 text-sm text-muted-foreground md:flex">
          <a href="#features" className="transition-colors hover:text-foreground">
            Features
          </a>
          <a href="#architecture" className="transition-colors hover:text-foreground">
            Architecture
          </a>
          <a href="#workflow" className="transition-colors hover:text-foreground">
            Workflow
          </a>
          <a
            href="https://github.com/KeshavCracks/sitty"
            target="_blank"
            rel="noreferrer"
            className="transition-colors hover:text-foreground"
          >
            GitHub
          </a>
        </nav>
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            className="hidden sm:inline-flex"
            onClick={() => enterApp("dashboard")}
          >
            Docs
          </Button>
          <Button size="sm" onClick={() => enterApp("dashboard")}>
            Launch App
            <ArrowRight className="ml-1.5 size-3.5" />
          </Button>
        </div>
      </div>
    </header>
  );
}

/* ------------------------------------------------------------------ */
/* Hero                                                               */
/* ------------------------------------------------------------------ */

function Hero() {
  const enterApp = useAppStore((s) => s.enterApp);
  return (
    <section className="relative overflow-hidden">
      {/* Background layers */}
      <div className="absolute inset-0 bg-grid opacity-60" />
      <div className="absolute inset-0 bg-radial-fade" />
      <div className="absolute inset-0 bg-radial-amber" />
      <div className="pointer-events-none absolute -left-32 top-20 size-96 rounded-full bg-emerald-500/10 blur-3xl aurora-blob" />
      <div className="pointer-events-none absolute -right-32 top-40 size-96 rounded-full bg-amber-500/10 blur-3xl aurora-blob" style={{ animationDelay: "5s" }} />

      <div className="relative mx-auto max-w-7xl px-4 pb-20 pt-20 sm:px-6 lg:px-8 lg:pt-28">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="mx-auto max-w-4xl text-center"
        >
          <Badge variant="outline" className="mb-6 gap-1.5 border-emerald-500/30 bg-emerald-500/5 text-emerald-600 dark:text-emerald-400">
            <Sparkles className="size-3" />
            Inspired by OpenHands &amp; Devin
          </Badge>

          <h1 className="text-balance text-4xl font-semibold tracking-tight sm:text-5xl lg:text-6xl">
            <span className="text-foreground">The autonomous</span>
            <br />
            <span className="text-gradient-primary">software engineer</span>
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-pretty text-base text-muted-foreground sm:text-lg">
            Forge accepts a task, breaks it into a plan, writes and edits code,
            runs your tests, and opens a pull request — all observable in real
            time. Claude-powered reasoning. GitHub-native. Deployable on Vercel.
          </p>

          <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Button size="lg" className="h-12 px-6" onClick={() => enterApp("new-task")}>
              <Bot className="mr-2 size-4" />
              Start a task
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="h-12 px-6"
              onClick={() => enterApp("dashboard")}
            >
              <Play className="mr-2 size-4" />
              See it in action
            </Button>
          </div>

          <div className="mt-6 flex items-center justify-center gap-6 text-xs text-muted-foreground">
            <span className="inline-flex items-center gap-1.5">
              <CheckCircle2 className="size-3.5 text-emerald-500" />
              No setup required
            </span>
            <span className="inline-flex items-center gap-1.5">
              <CheckCircle2 className="size-3.5 text-emerald-500" />
              Works on Vercel free tier
            </span>
            <span className="inline-flex items-center gap-1.5">
              <CheckCircle2 className="size-3.5 text-emerald-500" />
              Bring your own Claude key
            </span>
          </div>
        </motion.div>

        {/* Animated terminal preview */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2, ease: "easeOut" }}
          className="mx-auto mt-16 max-w-4xl"
        >
          <HeroTerminal />
        </motion.div>
      </div>
    </section>
  );
}

function HeroTerminal() {
  return (
    <div className="glow-border overflow-hidden rounded-xl border border-border/60 bg-card/80 shadow-2xl backdrop-blur">
      {/* Title bar */}
      <div className="flex items-center justify-between border-b border-border/60 bg-muted/30 px-4 py-2.5">
        <div className="flex items-center gap-2">
          <span className="size-3 rounded-full bg-red-500/70" />
          <span className="size-3 rounded-full bg-amber-500/70" />
          <span className="size-3 rounded-full bg-emerald-500/70" />
          <span className="ml-2 font-mono text-xs text-muted-foreground">
            forge — agent session
          </span>
        </div>
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <span className="size-1.5 rounded-full bg-emerald-500 pulse-ring" />
          <span>claude-sonnet-4.5</span>
        </div>
      </div>

      {/* Body */}
      <div className="grid gap-0 md:grid-cols-[1fr_1.4fr]">
        {/* Plan column */}
        <div className="border-b border-border/60 p-4 md:border-b-0 md:border-r">
          <div className="mb-3 flex items-center gap-2 text-xs font-medium uppercase tracking-wider text-muted-foreground">
            <Workflow className="size-3.5" />
            Plan
          </div>
          <ol className="space-y-2.5">
            {[
              { t: "Explore repository", d: true },
              { t: "Read auth/session.ts", d: true },
              { t: "Edit login route", d: true },
              { t: "Add regression test", d: false, active: true },
              { t: "Run test suite", d: false },
              { t: "Commit & open PR", d: false },
            ].map((step, i) => (
              <li key={i} className="flex items-start gap-2.5">
                <span
                  className={`mt-0.5 flex size-4 shrink-0 items-center justify-center rounded-full text-[10px] ${
                    step.d
                      ? "bg-emerald-500 text-emerald-950"
                      : step.active
                      ? "bg-emerald-500/20 text-emerald-500 pulse-ring"
                      : "bg-muted text-muted-foreground"
                  }`}
                >
                  {step.d ? "✓" : i + 1}
                </span>
                <span
                  className={`text-xs ${
                    step.d
                      ? "text-muted-foreground line-through"
                      : step.active
                      ? "text-foreground"
                      : "text-muted-foreground"
                  }`}
                >
                  {step.t}
                </span>
              </li>
            ))}
          </ol>
        </div>

        {/* Terminal column */}
        <div className="code-block space-y-1 p-4 text-xs">
          <div className="text-muted-foreground">$ forge read src/lib/auth/session.ts</div>
          <div className="text-muted-foreground">→ 50 lines read</div>
          <div className="text-amber-500">⚠ line 38: maxAge ignores `persistent` flag</div>
          <div className="mt-2 text-muted-foreground">$ forge edit src/app/api/auth/login/route.ts</div>
          <div className="text-emerald-500">+ await setSession(user.id, remember)</div>
          <div className="text-red-500">- await setSession(user.id, false)</div>
          <div className="mt-2 text-muted-foreground">$ forge exec bun run test</div>
          <div className="text-emerald-500">✓ 2 passed</div>
          <div className="mt-2 text-muted-foreground">$ forge gh pr create</div>
          <div className="text-emerald-500">✓ PR #143 opened</div>
          <div className="text-muted-foreground">
            https://github.com/acme/webapp/pull/143
            <TerminalCursor />
          </div>
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Trusted by strip                                                   */
/* ------------------------------------------------------------------ */

function TrustedBy() {
  const names = [
    "Northwind",
    "Quanta Labs",
    "Helix",
    "Foundry",
    "Aperture",
    "Lumen",
  ];
  return (
    <section className="border-y border-border/40 bg-muted/20">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <p className="text-center text-xs font-medium uppercase tracking-widest text-muted-foreground">
          Built for the workflows of modern engineering teams
        </p>
        <div className="mt-6 flex flex-wrap items-center justify-center gap-x-10 gap-y-4 opacity-60">
          {names.map((n) => (
            <span
              key={n}
              className="font-mono text-sm font-medium text-muted-foreground"
            >
              {n}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Features                                                           */
/* ------------------------------------------------------------------ */

const FEATURES = [
  {
    icon: Bot,
    title: "Agentic planning",
    body:
      "Every task is decomposed into an ordered, observable plan. The agent reasons about each step before touching a file, so you always know what it's about to do and why.",
  },
  {
    icon: Code2,
    title: "Code generation & editing",
    body:
      "Reads, writes, and edits files with surgical search-and-replace. Real diffs stream into the UI as they happen — no opaque 'magic' edits.",
  },
  {
    icon: Terminal,
    title: "Live terminal & logs",
    body:
      "Watch every shell command, test run, and git operation stream in real time. Filterable log levels, syntax-highlighted output, no surprises.",
  },
  {
    icon: GitPullRequest,
    title: "GitHub-native workflow",
    body:
      "Connects to your repositories, creates feature branches, commits with conventional messages, and opens pull requests with full context for reviewers.",
  },
  {
    icon: Cpu,
    title: "Claude-first, pluggable models",
    body:
      "Anthropic Claude is the primary reasoning engine. A clean provider abstraction means you can swap in any LLM — including a sandbox-friendly default.",
  },
  {
    icon: ShieldCheck,
    title: "Cloud-safe by design",
    body:
      "Mutating tools are simulated on Vercel's read-only runtime and executed for real in a local worker. The same UI works in both modes — no broken demos.",
  },
];

function Features() {
  return (
    <section id="features" className="py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <Badge variant="outline" className="mb-4 gap-1.5">
            <Layers className="size-3" />
            Capabilities
          </Badge>
          <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">
            Everything an autonomous engineer needs
          </h2>
          <p className="mt-4 text-muted-foreground">
            Each capability is a clean, typed module — not a monolithic agent loop.
            That's what makes Forge portable across runtimes and trustworthy in
            production.
          </p>
        </div>

        <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.4, delay: i * 0.05 }}
              className="group relative overflow-hidden rounded-xl border border-border/60 bg-card/50 p-6 transition-all hover:border-emerald-500/30 hover:bg-card"
            >
              <div className="mb-4 inline-flex size-10 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 transition-colors group-hover:bg-emerald-500/20">
                <f.icon className="size-5" />
              </div>
              <h3 className="text-base font-semibold">{f.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{f.body}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Architecture                                                       */
/* ------------------------------------------------------------------ */

function Architecture() {
  const layers = [
    {
      icon: Bot,
      name: "Orchestrator",
      desc: "Holds the task state machine, sequences planner → executor → reviewer.",
      tag: "agent",
    },
    {
      icon: Workflow,
      name: "Planner",
      desc: "Asks the LLM to decompose the task into ordered, typed steps with tool bindings.",
      tag: "llm",
    },
    {
      icon: Cpu,
      name: "Executor",
      desc: "Walks the plan, invokes tools, streams events, captures diffs and logs.",
      tag: "agent",
    },
    {
      icon: Terminal,
      name: "Runtime",
      desc: "Abstracts WHERE tools run — local worker, cloud serverless, or demo mode.",
      tag: "runtime",
    },
    {
      icon: FileCode2,
      name: "Tools",
      desc: "Typed tool definitions: read_file, edit_file, run_command, git_commit, open_pr.",
      tag: "agent",
    },
    {
      icon: Github,
      name: "GitHub layer",
      desc: "REST v3 client for repos, branches, commits, and pull requests.",
      tag: "github",
    },
  ];

  return (
    <section id="architecture" className="border-y border-border/40 bg-muted/20 py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <Badge variant="outline" className="mb-4 gap-1.5">
            <Workflow className="size-3" />
            Architecture
          </Badge>
          <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">
            Clean layers, not a black box
          </h2>
          <p className="mt-4 text-muted-foreground">
            Forge is built like a real product, not a notebook. Each layer has a
            single responsibility and a typed contract — so it's safe to extend
            and pleasant to debug.
          </p>
        </div>

        <div className="mt-16 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {layers.map((l, i) => (
            <motion.div
              key={l.name}
              initial={{ opacity: 0, y: 8 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.35, delay: i * 0.04 }}
              className="relative rounded-xl border border-border/60 bg-background/60 p-5"
            >
              <div className="flex items-start justify-between">
                <div className="flex size-9 items-center justify-center rounded-md bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                  <l.icon className="size-4" />
                </div>
                <span className="rounded-md border border-border/60 bg-muted/40 px-1.5 py-0.5 font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
                  {l.tag}
                </span>
              </div>
              <h3 className="mt-3 text-sm font-semibold">{l.name}</h3>
              <p className="mt-1 text-xs text-muted-foreground">{l.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* How it works                                                       */
/* ------------------------------------------------------------------ */

function HowItWorks() {
  const steps = [
    {
      n: "01",
      icon: Bot,
      title: "Describe the task",
      body:
        "Tell Forge what you want in plain English. Pick a repository, a branch, and a model. The orchestrator takes it from there.",
    },
    {
      n: "02",
      icon: Workflow,
      title: "Watch the plan form",
      body:
        "The planner decomposes your task into 5–9 ordered steps with explicit tool calls. You see assumptions and risks before any code is written.",
    },
    {
      n: "03",
      icon: Terminal,
      title: "Follow execution live",
      body:
        "Terminal output, file diffs, and a step timeline stream in real time. Cancel anytime. Every action is logged for audit.",
    },
    {
      n: "04",
      icon: GitPullRequest,
      title: "Review the PR",
      body:
        "Forge commits with conventional messages and opens a pull request with a full summary. You review, merge, ship.",
    },
  ];

  return (
    <section id="workflow" className="py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <Badge variant="outline" className="mb-4 gap-1.5">
            <Zap className="size-3" />
            Workflow
          </Badge>
          <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">
            From prompt to pull request
          </h2>
          <p className="mt-4 text-muted-foreground">
            Four observable stages. No magic, no hidden state.
          </p>
        </div>

        <div className="mt-16 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {steps.map((s, i) => (
            <motion.div
              key={s.n}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.4, delay: i * 0.06 }}
              className="relative"
            >
              <div className="mb-4 flex items-center gap-3">
                <span className="font-mono text-xs text-emerald-600 dark:text-emerald-400">
                  {s.n}
                </span>
                <div className="h-px flex-1 bg-gradient-to-r from-emerald-500/40 to-transparent" />
              </div>
              <div className="mb-3 inline-flex size-10 items-center justify-center rounded-lg border border-border/60 bg-card text-foreground">
                <s.icon className="size-5" />
              </div>
              <h3 className="text-base font-semibold">{s.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{s.body}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Engineering pitch                                                  */
/* ------------------------------------------------------------------ */

function EngineeringPitch() {
  const points = [
    "Strict TypeScript end-to-end — no anys in the agent layer",
    "Server Actions and route handlers with explicit 'use server' boundaries",
    "Tailwind 4 + shadcn/ui design tokens, fully theme-able",
    "Prisma schema for task persistence, SQLite for portability",
    "Provider abstraction — Claude, Z.ai, or your own backend",
    "Documented Vercel free-tier tradeoffs, not hand-waved",
  ];
  return (
    <section className="border-t border-border/40 bg-muted/20 py-24">
      <div className="mx-auto grid max-w-7xl gap-12 px-4 sm:px-6 lg:grid-cols-2 lg:px-8">
        <div>
          <Badge variant="outline" className="mb-4 gap-1.5">
            <Code2 className="size-3" />
            Engineering quality
          </Badge>
          <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">
            Built like a product, not a prototype
          </h2>
          <p className="mt-4 text-muted-foreground">
            Every file in Forge is written to be read by a senior engineer. The
            architecture is honest about what runs on Vercel free tier and what
            doesn't — and the codebase is structured so the heavier pieces can
            move to a separate worker without rewriting the app.
          </p>
          <ul className="mt-8 space-y-3">
            {points.map((p) => (
              <li key={p} className="flex items-start gap-3 text-sm">
                <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-emerald-500" />
                <span>{p}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="overflow-hidden rounded-xl border border-border/60 bg-card/80 shadow-xl">
          <div className="flex items-center gap-2 border-b border-border/60 bg-muted/30 px-4 py-2.5">
            <span className="size-3 rounded-full bg-red-500/70" />
            <span className="size-3 rounded-full bg-amber-500/70" />
            <span className="size-3 rounded-full bg-emerald-500/70" />
            <span className="ml-2 font-mono text-xs text-muted-foreground">
              src/lib/agent/planner.ts
            </span>
          </div>
          <pre className="code-block overflow-x-auto p-4 text-xs leading-relaxed">
            <code>
              <span className="text-muted-foreground">{`// Decompose a task into an ordered, typed plan.`}</span>
              {"\n"}
              <span className="text-emerald-600 dark:text-emerald-400">{`export async function`}</span>
              <span>{` planTask(`}</span>
              <span className="text-amber-600 dark:text-amber-400">{`input`}</span>
              <span>{`: PlannerInput): Promise<`}</span>
              <span className="text-sky-600 dark:text-sky-400">{`PlannerResult`}</span>
              <span>{`> {`}</span>
              {"\n"}
              <span>{`  `}</span>
              <span className="text-emerald-600 dark:text-emerald-400">{`if`}</span>
              <span>{` (input.useLlm) {`}</span>
              {"\n"}
              <span>{`    `}</span>
              <span className="text-emerald-600 dark:text-emerald-400">{`try`}</span>
              <span>{` {`}</span>
              {"\n"}
              <span>{`      `}</span>
              <span className="text-emerald-600 dark:text-emerald-400">{`const`}</span>
              <span>{` provider = `}</span>
              <span className="text-sky-600 dark:text-sky-400">{`getCachedProvider`}</span>
              <span>{`();`}</span>
              {"\n"}
              <span>{`      `}</span>
              <span className="text-emerald-600 dark:text-emerald-400">{`const`}</span>
              <span>{` res = `}</span>
              <span className="text-emerald-600 dark:text-emerald-400">{`await`}</span>
              <span>{` provider.complete({`}</span>
              {"\n"}
              <span>{`        messages: [{ role: `}</span>
              <span className="text-amber-300">{`"system"`}</span>
              <span>{`, content: PLANNER_SYSTEM_PROMPT }, `}</span>
              {"\n"}
              <span>{`                  { role: `}</span>
              <span className="text-amber-300">{`"user"`}</span>
              <span>{`, content: input.description }],`}</span>
              {"\n"}
              <span>{`        model: provider.models[0]?.id,`}</span>
              {"\n"}
              <span>{`      });`}</span>
              {"\n"}
              <span>{`      `}</span>
              <span className="text-emerald-600 dark:text-emerald-400">{`const`}</span>
              <span>{` plan = `}</span>
              <span className="text-sky-600 dark:text-sky-400">{`parseLlmPlan`}</span>
              <span>{`(res.content, input.taskId);`}</span>
              {"\n"}
              <span>{`      `}</span>
              <span className="text-emerald-600 dark:text-emerald-400">{`if`}</span>
              <span>{` (plan) `}</span>
              <span className="text-emerald-600 dark:text-emerald-400">{`return`}</span>
              <span>{` { plan, source: `}</span>
              <span className="text-amber-300">{`"llm"`}</span>
              <span>{` };`}</span>
              {"\n"}
              <span>{`    } `}</span>
              <span className="text-emerald-600 dark:text-emerald-400">{`catch`}</span>
              <span>{` (err) {`}</span>
              {"\n"}
              <span>{`      `}</span>
              <span className="text-muted-foreground">{`// fall through to scenario planning`}</span>
              {"\n"}
              <span>{`    }`}</span>
              {"\n"}
              <span>{`  }`}</span>
              {"\n"}
              <span>{`  `}</span>
              <span className="text-emerald-600 dark:text-emerald-400">{`return`}</span>
              <span>{` { plan: scenarioPlan(input), source: `}</span>
              <span className="text-amber-300">{`"scenario"`}</span>
              <span>{` };`}</span>
              {"\n"}
              <span>{`}`}</span>
            </code>
          </pre>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Final CTA                                                          */
/* ------------------------------------------------------------------ */

function FinalCTA() {
  const enterApp = useAppStore((s) => s.enterApp);
  return (
    <section className="relative overflow-hidden py-24">
      <div className="absolute inset-0 bg-grid opacity-40" />
      <div className="absolute inset-0 bg-radial-fade" />
      <div className="relative mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
        <h2 className="text-balance text-3xl font-semibold tracking-tight sm:text-4xl">
          <span className="text-foreground">Ship your next PR</span>
          <br />
          <span className="text-gradient-primary">with an AI pair engineer</span>
        </h2>
        <p className="mx-auto mt-4 max-w-xl text-muted-foreground">
          Launch the app, describe a task, and watch Forge plan, code, test, and
          open a pull request — all in real time.
        </p>
        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Button size="lg" className="h-12 px-6" onClick={() => enterApp("new-task")}>
            <Bot className="mr-2 size-4" />
            Start a task
          </Button>
          <Button
            size="lg"
            variant="outline"
            className="h-12 px-6"
            onClick={() => enterApp("dashboard")}
          >
            View dashboard
          </Button>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Footer                                                             */
/* ------------------------------------------------------------------ */

function Footer() {
  return (
    <footer className="border-t border-border/40 bg-background">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-8 md:grid-cols-4">
          <div className="md:col-span-2">
            <ForgeWordmark />
            <p className="mt-3 max-w-xs text-sm text-muted-foreground">
              An autonomous software engineering agent. Claude-powered,
              GitHub-native, deployable on Vercel.
            </p>
            <div className="mt-4 flex items-center gap-2">
              <a
                href="https://github.com/KeshavCracks/sitty"
                target="_blank"
                rel="noreferrer"
                className="inline-flex size-8 items-center justify-center rounded-md border border-border/60 text-muted-foreground transition-colors hover:text-foreground"
              >
                <Github className="size-4" />
              </a>
            </div>
          </div>
          <div>
            <h4 className="text-sm font-medium">Product</h4>
            <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
              <li>
                <button
                  className="transition-colors hover:text-foreground"
                  onClick={() => useAppStore.getState().enterApp("dashboard")}
                >
                  Dashboard
                </button>
              </li>
              <li>
                <button
                  className="transition-colors hover:text-foreground"
                  onClick={() => useAppStore.getState().enterApp("new-task")}
                >
                  New task
                </button>
              </li>
              <li>
                <button
                  className="transition-colors hover:text-foreground"
                  onClick={() => useAppStore.getState().enterApp("history")}
                >
                  History
                </button>
              </li>
              <li>
                <button
                  className="transition-colors hover:text-foreground"
                  onClick={() => useAppStore.getState().enterApp("settings")}
                >
                  Settings
                </button>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="text-sm font-medium">Resources</h4>
            <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
              <li>
                <a
                  href="https://github.com/KeshavCracks/sitty#readme"
                  target="_blank"
                  rel="noreferrer"
                  className="transition-colors hover:text-foreground"
                >
                  README
                </a>
              </li>
              <li>
                <a
                  href="https://github.com/KeshavCracks/sitty/blob/main/docs/ARCHITECTURE.md"
                  target="_blank"
                  rel="noreferrer"
                  className="transition-colors hover:text-foreground"
                >
                  Architecture
                </a>
              </li>
              <li>
                <a
                  href="https://github.com/KeshavCracks/sitty/blob/main/docs/DEPLOYMENT.md"
                  target="_blank"
                  rel="noreferrer"
                  className="transition-colors hover:text-foreground"
                >
                  Deployment
                </a>
              </li>
              <li>
                <a
                  href="https://vercel.com"
                  target="_blank"
                  rel="noreferrer"
                  className="transition-colors hover:text-foreground"
                >
                  Deploy on Vercel
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-border/40 pt-6 text-xs text-muted-foreground sm:flex-row">
          <p>© {new Date().getFullYear()} Forge. Built by KeshavCracks.</p>
          <p className="flex items-center gap-1.5">
            <GitBranch className="size-3" />
            Inspired by OpenHands &amp; Devin
          </p>
        </div>
      </div>
    </footer>
  );
}

/* ------------------------------------------------------------------ */
/* Page                                                               */
/* ------------------------------------------------------------------ */

export function LandingPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1">
        <Hero />
        <TrustedBy />
        <Features />
        <Architecture />
        <HowItWorks />
        <EngineeringPitch />
        <FinalCTA />
      </main>
      <Footer />
    </div>
  );
}

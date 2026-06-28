"use client";

/**
 * Forge — Landing Page
 *
 * Clean, light, SaaS-style design inspired by render.com:
 *   - White backgrounds, violet/purple primary accent
 *   - Centered hero with headline + subtext + CTAs + code block
 *   - Social proof strip, feature card grid, workflow section
 *   - Code/terminal showcase, final CTA, multi-column footer
 *
 * Uses explicit light colors (bg-white, text-slate-900, violet-600)
 * so the landing renders light regardless of the dark class on <html>.
 * The app shell remains dark — standard SaaS pattern (light marketing,
 * dark app).
 */

import * as React from "react";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Bot,
  Check,
  CheckCircle2,
  ChevronRight,
  Code2,
  Cpu,
  FileCode2,
  GitBranch,
  Github,
  GitPullRequest,
  Layers,
  Shield,
  ShieldCheck,
  Sparkles,
  Terminal,
  Workflow,
  Zap,
} from "lucide-react";
import { useAppStore } from "@/store/app-store";

/* ===================================================================
   Navbar
   =================================================================== */

function Navbar() {
  const enterApp = useAppStore((s) => s.enterApp);
  const [scrolled, setScrolled] = React.useState(false);

  React.useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-200 ${
        scrolled
          ? "bg-white/90 backdrop-blur-md border-b border-slate-200/80 shadow-sm"
          : "bg-transparent"
      }`}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="flex items-center gap-2"
          >
            <div className="flex size-8 items-center justify-center rounded-lg bg-gradient-to-br from-violet-600 to-purple-600">
              <Bot className="size-5 text-white" />
            </div>
            <span className="text-lg font-semibold text-slate-900 tracking-tight">
              Forge
            </span>
          </button>

          {/* Center nav */}
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-600">
            <a href="#features" className="hover:text-slate-900 transition-colors">
              Features
            </a>
            <a href="#how-it-works" className="hover:text-slate-900 transition-colors">
              How it works
            </a>
            <a href="#architecture" className="hover:text-slate-900 transition-colors">
              Architecture
            </a>
            <a
              href="https://github.com/KeshavCracks/sitty"
              target="_blank"
              rel="noreferrer"
              className="hover:text-slate-900 transition-colors"
            >
              GitHub
            </a>
          </nav>

          {/* Right CTAs */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => enterApp("dashboard")}
              className="hidden sm:inline-flex text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors"
            >
              Sign in
            </button>
            <button
              onClick={() => enterApp("new-task")}
              className="inline-flex items-center gap-1.5 rounded-lg bg-violet-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-violet-700 transition-colors"
            >
              Get started
              <ArrowRight className="size-3.5" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}

/* ===================================================================
   Hero
   =================================================================== */

function Hero() {
  const enterApp = useAppStore((s) => s.enterApp);

  return (
    <section className="relative overflow-hidden bg-white pt-32 pb-20 sm:pt-40 sm:pb-28">
      {/* Subtle background gradient */}
      <div
        className="absolute inset-0 -z-10"
        style={{
          background:
            "radial-gradient(ellipse 80% 50% at 50% -10%, rgba(139, 92, 246, 0.12), transparent 70%)",
        }}
      />
      {/* Grid pattern */}
      <div
        className="absolute inset-0 -z-10 opacity-[0.4]"
        style={{
          backgroundImage:
            "linear-gradient(to right, rgb(241 245 249) 1px, transparent 1px), linear-gradient(to bottom, rgb(241 245 249) 1px, transparent 1px)",
          backgroundSize: "48px 48px",
          maskImage:
            "radial-gradient(ellipse 60% 50% at 50% 30%, black, transparent 80%)",
          WebkitMaskImage:
            "radial-gradient(ellipse 60% 50% at 50% 30%, black, transparent 80%)",
        }}
      />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="mb-6 inline-flex items-center gap-2 rounded-full border border-violet-200 bg-violet-50 px-3 py-1 text-xs font-medium text-violet-700"
          >
            <Sparkles className="size-3" />
            Inspired by OpenHands &amp; Devin
          </motion.div>

          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.05 }}
            className="text-balance text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl lg:text-6xl"
          >
            Deploy code with an{" "}
            <span className="bg-gradient-to-r from-violet-600 to-purple-600 bg-clip-text text-transparent">
              autonomous AI engineer
            </span>
          </motion.h1>

          {/* Subtext */}
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="mx-auto mt-6 max-w-2xl text-pretty text-lg text-slate-600 sm:text-xl"
          >
            Forge accepts a task, breaks it into a plan, writes and edits
            code, runs your tests, and opens a pull request — all observable
            in real time. Claude-powered. GitHub-native. Deployable on Vercel.
          </motion.p>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.15 }}
            className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row"
          >
            <button
              onClick={() => enterApp("new-task")}
              className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-violet-600 px-6 py-3 text-base font-semibold text-white shadow-lg shadow-violet-600/25 hover:bg-violet-700 transition-colors sm:w-auto"
            >
              <Bot className="size-4" />
              Start a task
            </button>
            <button
              onClick={() => enterApp("dashboard")}
              className="inline-flex w-full items-center justify-center gap-2 rounded-lg border border-slate-300 bg-white px-6 py-3 text-base font-semibold text-slate-700 shadow-sm hover:bg-slate-50 transition-colors sm:w-auto"
            >
              View dashboard
              <ArrowRight className="size-4" />
            </button>
          </motion.div>

          {/* Micro proof */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="mt-8 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm text-slate-500"
          >
            <span className="inline-flex items-center gap-1.5">
              <CheckCircle2 className="size-4 text-violet-600" />
              No setup required
            </span>
            <span className="inline-flex items-center gap-1.5">
              <CheckCircle2 className="size-4 text-violet-600" />
              Works on Vercel free tier
            </span>
            <span className="inline-flex items-center gap-1.5">
              <CheckCircle2 className="size-4 text-violet-600" />
              Bring your own Claude key
            </span>
          </motion.div>
        </div>

        {/* Code / terminal block */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.25 }}
          className="mx-auto mt-16 max-w-3xl"
        >
          <HeroCodeBlock />
        </motion.div>
      </div>
    </section>
  );
}

function HeroCodeBlock() {
  return (
    <div className="overflow-hidden rounded-xl border border-slate-200 shadow-2xl shadow-slate-900/10">
      {/* Title bar */}
      <div className="flex items-center justify-between border-b border-slate-200 bg-slate-50 px-4 py-2.5">
        <div className="flex items-center gap-2">
          <span className="size-3 rounded-full bg-red-400" />
          <span className="size-3 rounded-full bg-amber-400" />
          <span className="size-3 rounded-full bg-emerald-400" />
          <span className="ml-2 text-xs font-medium text-slate-500">
            forge — agent session
          </span>
        </div>
        <span className="inline-flex items-center gap-1 text-xs text-slate-400">
          <span className="size-1.5 rounded-full bg-emerald-500" />
          claude-sonnet-4.5
        </span>
      </div>
      {/* Body */}
      <div className="grid gap-0 sm:grid-cols-[200px_1fr]">
        {/* Plan sidebar */}
        <div className="border-b border-slate-200 bg-slate-50/50 p-4 sm:border-b-0 sm:border-r">
          <div className="mb-3 text-[10px] font-semibold uppercase tracking-wider text-slate-400">
            Plan
          </div>
          <ol className="space-y-2">
            {[
              { t: "Explore repository", done: true },
              { t: "Read auth/session.ts", done: true },
              { t: "Edit login route", done: true },
              { t: "Add regression test", done: false, active: true },
              { t: "Run test suite", done: false },
              { t: "Commit & open PR", done: false },
            ].map((step, i) => (
              <li key={i} className="flex items-center gap-2 text-xs">
                <span
                  className={`flex size-4 shrink-0 items-center justify-center rounded-full text-[9px] ${
                    step.done
                      ? "bg-violet-600 text-white"
                      : step.active
                      ? "bg-violet-100 text-violet-600 ring-2 ring-violet-400"
                      : "bg-slate-200 text-slate-400"
                  }`}
                >
                  {step.done ? <Check className="size-2.5" /> : i + 1}
                </span>
                <span
                  className={
                    step.done
                      ? "text-slate-400 line-through"
                      : step.active
                      ? "text-slate-900 font-medium"
                      : "text-slate-500"
                  }
                >
                  {step.t}
                </span>
              </li>
            ))}
          </ol>
        </div>
        {/* Terminal */}
        <div className="bg-slate-900 p-4 font-mono text-xs leading-relaxed">
          <div className="text-slate-400">$ forge read src/lib/auth/session.ts</div>
          <div className="text-slate-400">→ 50 lines read</div>
          <div className="text-amber-400">⚠ line 38: maxAge ignores `persistent` flag</div>
          <div className="mt-2 text-slate-400">$ forge edit src/app/api/auth/login/route.ts</div>
          <div className="text-emerald-400">+ await setSession(user.id, remember)</div>
          <div className="text-red-400">- await setSession(user.id, false)</div>
          <div className="mt-2 text-slate-400">$ forge exec bun run test</div>
          <div className="text-emerald-400">✓ 2 passed</div>
          <div className="mt-2 text-slate-400">$ forge gh pr create</div>
          <div className="text-emerald-400">✓ PR #143 opened</div>
          <div className="text-slate-400">
            https://github.com/acme/webapp/pull/143
            <span className="ml-1 inline-block h-3.5 w-1.5 animate-pulse bg-violet-400 align-middle" />
          </div>
        </div>
      </div>
    </div>
  );
}

/* ===================================================================
   Social proof strip
   =================================================================== */

function SocialProof() {
  const names = ["Northwind", "Quanta Labs", "Helix", "Foundry", "Aperture", "Lumen"];
  return (
    <section className="border-y border-slate-200 bg-slate-50/50 py-10">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <p className="text-center text-xs font-semibold uppercase tracking-widest text-slate-400">
          Built for the workflows of modern engineering teams
        </p>
        <div className="mt-6 flex flex-wrap items-center justify-center gap-x-10 gap-y-4">
          {names.map((n) => (
            <span
              key={n}
              className="text-base font-semibold text-slate-400"
            >
              {n}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ===================================================================
   Features
   =================================================================== */

const FEATURES = [
  {
    icon: Bot,
    title: "Agentic planning",
    body: "Every task is decomposed into an ordered, observable plan. The agent reasons about each step before touching a file, so you always know what it's about to do and why.",
    color: "violet",
  },
  {
    icon: Code2,
    title: "Code generation & editing",
    body: "Reads, writes, and edits files with surgical search-and-replace. Real diffs stream into the UI as they happen — no opaque magic edits.",
    color: "purple",
  },
  {
    icon: Terminal,
    title: "Live terminal & logs",
    body: "Watch every shell command, test run, and git operation stream in real time. Filterable log levels, syntax-highlighted output, no surprises.",
    color: "fuchsia",
  },
  {
    icon: GitPullRequest,
    title: "GitHub-native workflow",
    body: "Connects to your repositories, creates feature branches, commits with conventional messages, and opens pull requests with full context for reviewers.",
    color: "violet",
  },
  {
    icon: Cpu,
    title: "Claude-first, pluggable models",
    body: "Anthropic Claude is the primary reasoning engine. A clean provider abstraction means you can swap in any LLM — including a sandbox-friendly default.",
    color: "purple",
  },
  {
    icon: ShieldCheck,
    title: "Cloud-safe by design",
    body: "Mutating tools are simulated on Vercel's read-only runtime and executed for real in a local worker. The same UI works in both modes — no broken demos.",
    color: "fuchsia",
  },
];

const COLOR_MAP: Record<string, { bg: string; text: string; ring: string }> = {
  violet: { bg: "bg-violet-50", text: "text-violet-600", ring: "ring-violet-100" },
  purple: { bg: "bg-purple-50", text: "text-purple-600", ring: "ring-purple-100" },
  fuchsia: { bg: "bg-fuchsia-50", text: "text-fuchsia-600", ring: "ring-fuchsia-100" },
};

function Features() {
  return (
    <section id="features" className="bg-white py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-violet-200 bg-violet-50 px-3 py-1 text-xs font-semibold text-violet-700">
            <Layers className="size-3" />
            Capabilities
          </span>
          <h2 className="mt-6 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
            Everything an autonomous engineer needs
          </h2>
          <p className="mt-4 text-lg text-slate-600">
            Each capability is a clean, typed module — not a monolithic agent
            loop. That's what makes Forge portable across runtimes and
            trustworthy in production.
          </p>
        </div>

        <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map((f, i) => {
            const c = COLOR_MAP[f.color];
            return (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.4, delay: i * 0.05 }}
                className="group rounded-2xl border border-slate-200 bg-white p-6 transition-all hover:border-violet-200 hover:shadow-lg hover:shadow-violet-100/50"
              >
                <div
                  className={`mb-4 inline-flex size-11 items-center justify-center rounded-xl ${c.bg} ${c.text} ring-1 ${c.ring}`}
                >
                  <f.icon className="size-5" />
                </div>
                <h3 className="text-lg font-semibold text-slate-900">
                  {f.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-600">
                  {f.body}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* ===================================================================
   How it works
   =================================================================== */

const STEPS = [
  {
    n: "1",
    icon: Bot,
    title: "Describe the task",
    body: "Tell Forge what you want in plain English. Pick a repository, a branch, and a model. The orchestrator takes it from there.",
  },
  {
    n: "2",
    icon: Workflow,
    title: "Watch the plan form",
    body: "The planner decomposes your task into 5–9 ordered steps with explicit tool calls. You see assumptions and risks before any code is written.",
  },
  {
    n: "3",
    icon: Terminal,
    title: "Follow execution live",
    body: "Terminal output, file diffs, and a step timeline stream in real time. Cancel anytime. Every action is logged for audit.",
  },
  {
    n: "4",
    icon: GitPullRequest,
    title: "Review the pull request",
    body: "Forge commits with conventional messages and opens a pull request with a full summary. You review, merge, ship.",
  },
];

function HowItWorks() {
  return (
    <section id="how-it-works" className="bg-slate-50 py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-violet-200 bg-violet-50 px-3 py-1 text-xs font-semibold text-violet-700">
            <Zap className="size-3" />
            Workflow
          </span>
          <h2 className="mt-6 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
            From prompt to pull request
          </h2>
          <p className="mt-4 text-lg text-slate-600">
            Four observable stages. No magic, no hidden state.
          </p>
        </div>

        <div className="mt-16 grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {STEPS.map((s, i) => (
            <motion.div
              key={s.n}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.4, delay: i * 0.06 }}
              className="relative"
            >
              {/* Connector line */}
              {i < STEPS.length - 1 && (
                <div className="absolute left-12 top-12 hidden h-px w-full bg-gradient-to-r from-violet-200 to-transparent lg:block" />
              )}
              <div className="relative flex size-12 items-center justify-center rounded-xl bg-white shadow-md ring-1 ring-slate-200">
                <s.icon className="size-5 text-violet-600" />
                <span className="absolute -right-1 -top-1 flex size-5 items-center justify-center rounded-full bg-violet-600 text-[10px] font-bold text-white">
                  {s.n}
                </span>
              </div>
              <h3 className="mt-4 text-base font-semibold text-slate-900">
                {s.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-600">
                {s.body}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ===================================================================
   Architecture
   =================================================================== */

const LAYERS = [
  {
    icon: Bot,
    name: "Orchestrator",
    desc: "Holds the task state machine, sequences planner → executor → reviewer.",
  },
  {
    icon: Workflow,
    name: "Planner",
    desc: "Asks the LLM to decompose the task into ordered, typed steps with tool bindings.",
  },
  {
    icon: Cpu,
    name: "Executor",
    desc: "Walks the plan, invokes tools, streams events, captures diffs and logs.",
  },
  {
    icon: Terminal,
    name: "Runtime",
    desc: "Abstracts where tools run — local worker, cloud serverless, or demo mode.",
  },
  {
    icon: FileCode2,
    name: "Tools",
    desc: "12 typed tool definitions: read_file, edit_file, run_command, git_commit, open_pr.",
  },
  {
    icon: Github,
    name: "GitHub layer",
    desc: "REST v3 client for repos, branches, commits, and pull requests.",
  },
];

function Architecture() {
  return (
    <section id="architecture" className="bg-white py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-violet-200 bg-violet-50 px-3 py-1 text-xs font-semibold text-violet-700">
            <Layers className="size-3" />
            Architecture
          </span>
          <h2 className="mt-6 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
            Clean layers, not a black box
          </h2>
          <p className="mt-4 text-lg text-slate-600">
            Forge is built like a real product, not a notebook. Each layer has
            a single responsibility and a typed contract — so it's safe to
            extend and pleasant to debug.
          </p>
        </div>

        <div className="mt-16 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {LAYERS.map((l, i) => (
            <motion.div
              key={l.name}
              initial={{ opacity: 0, y: 8 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.35, delay: i * 0.04 }}
              className="flex items-start gap-4 rounded-xl border border-slate-200 bg-white p-5 transition-colors hover:border-violet-200"
            >
              <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-violet-50 text-violet-600">
                <l.icon className="size-5" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-slate-900">
                  {l.name}
                </h3>
                <p className="mt-1 text-sm text-slate-600">{l.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ===================================================================
   Code showcase
   =================================================================== */

function CodeShowcase() {
  const commands = [
    { cmd: "forge plan", desc: "Generate a plan" },
    { cmd: "forge read", desc: "Read a file" },
    { cmd: "forge edit", desc: "Edit a file" },
    { cmd: "forge exec", desc: "Run a command" },
    { cmd: "forge test", desc: "Run the test suite" },
    { cmd: "forge commit", desc: "Commit changes" },
    { cmd: "forge push", desc: "Push the branch" },
    { cmd: "forge pr", desc: "Open a pull request" },
  ];

  return (
    <section className="bg-slate-50 py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-violet-200 bg-violet-50 px-3 py-1 text-xs font-semibold text-violet-700">
            <Code2 className="size-3" />
            Under the hood
          </span>
          <h2 className="mt-6 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
            Real commands. Real code. No magic.
          </h2>
          <p className="mt-4 text-lg text-slate-600">
            The agent's planner is a typed function with a clean fallback —
            exactly the kind of code you'd want in a production codebase.
          </p>
        </div>

        <div className="mt-16 grid gap-6 lg:grid-cols-2">
          {/* Source code */}
          <div className="overflow-hidden rounded-xl border border-slate-200 shadow-lg shadow-slate-900/5">
            <div className="flex items-center gap-2 border-b border-slate-200 bg-slate-50 px-4 py-2.5">
              <span className="text-xs font-medium text-slate-500">
                src/lib/agent/planner.ts
              </span>
            </div>
            <pre className="bg-slate-900 p-5 text-xs leading-relaxed text-slate-300 overflow-x-auto">
              <code>{`// Decompose a task into an ordered, typed plan.
export async function planTask(
  input: PlannerInput
): Promise<PlannerResult> {
  if (input.useLlm) {
    try {
      const provider = getCachedProvider();
      const res = await provider.complete({
        messages: [
          { role: "system", content: PLANNER_SYSTEM_PROMPT },
          { role: "user", content: input.description },
        ],
        model: provider.models[0]?.id,
      });
      const plan = parseLlmPlan(res.content, input.taskId);
      if (plan) return { plan, source: "llm" };
    } catch {
      // fall through to scenario planning
    }
  }
  return { plan: scenarioPlan(input), source: "scenario" };
}`}</code>
            </pre>
          </div>

          {/* Command reference */}
          <div className="grid grid-cols-2 gap-3">
            {commands.map((c) => (
              <div
                key={c.cmd}
                className="rounded-lg border border-slate-200 bg-white p-4 transition-colors hover:border-violet-200"
              >
                <div className="font-mono text-sm font-semibold text-slate-900">
                  <span className="text-violet-600">$</span> {c.cmd}
                </div>
                <div className="mt-1 text-xs text-slate-500">{c.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ===================================================================
   Final CTA
   =================================================================== */

function FinalCTA() {
  const enterApp = useAppStore((s) => s.enterApp);
  return (
    <section className="bg-white py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-violet-600 to-purple-700 px-6 py-16 sm:px-16 sm:py-20 text-center shadow-2xl shadow-violet-600/30">
          {/* Decorative grid */}
          <div
            className="absolute inset-0 opacity-10"
            style={{
              backgroundImage:
                "linear-gradient(to right, white 1px, transparent 1px), linear-gradient(to bottom, white 1px, transparent 1px)",
              backgroundSize: "40px 40px",
            }}
          />
          <div className="relative">
            <h2 className="text-balance text-3xl font-bold tracking-tight text-white sm:text-4xl lg:text-5xl">
              Ship your next PR with an AI pair engineer
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-lg text-violet-100">
              Launch the app, describe a task, and watch Forge plan, code,
              test, and open a pull request — all in real time.
            </p>
            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <button
                onClick={() => enterApp("new-task")}
                className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-white px-6 py-3 text-base font-semibold text-violet-700 shadow-lg hover:bg-violet-50 transition-colors sm:w-auto"
              >
                <Bot className="size-4" />
                Start a task
              </button>
              <button
                onClick={() => enterApp("dashboard")}
                className="inline-flex w-full items-center justify-center gap-2 rounded-lg border border-white/30 bg-white/10 px-6 py-3 text-base font-semibold text-white backdrop-blur hover:bg-white/20 transition-colors sm:w-auto"
              >
                View dashboard
                <ArrowRight className="size-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ===================================================================
   Footer
   =================================================================== */

function Footer() {
  const enterApp = useAppStore((s) => s.enterApp);
  return (
    <footer className="border-t border-slate-200 bg-slate-50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid gap-8 md:grid-cols-4">
          <div className="md:col-span-1">
            <div className="flex items-center gap-2">
              <div className="flex size-8 items-center justify-center rounded-lg bg-gradient-to-br from-violet-600 to-purple-600">
                <Bot className="size-5 text-white" />
              </div>
              <span className="text-lg font-semibold text-slate-900">
                Forge
              </span>
            </div>
            <p className="mt-3 text-sm text-slate-500">
              An autonomous software engineering agent. Claude-powered,
              GitHub-native, deployable on Vercel.
            </p>
          </div>
          <div>
            <h4 className="text-sm font-semibold text-slate-900">Product</h4>
            <ul className="mt-3 space-y-2 text-sm text-slate-500">
              <li>
                <button
                  className="hover:text-slate-900 transition-colors"
                  onClick={() => enterApp("dashboard")}
                >
                  Dashboard
                </button>
              </li>
              <li>
                <button
                  className="hover:text-slate-900 transition-colors"
                  onClick={() => enterApp("new-task")}
                >
                  New task
                </button>
              </li>
              <li>
                <button
                  className="hover:text-slate-900 transition-colors"
                  onClick={() => enterApp("history")}
                >
                  History
                </button>
              </li>
              <li>
                <button
                  className="hover:text-slate-900 transition-colors"
                  onClick={() => enterApp("settings")}
                >
                  Settings
                </button>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="text-sm font-semibold text-slate-900">Resources</h4>
            <ul className="mt-3 space-y-2 text-sm text-slate-500">
              <li>
                <a
                  href="https://github.com/KeshavCracks/sitty#readme"
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-slate-900 transition-colors"
                >
                  README
                </a>
              </li>
              <li>
                <a
                  href="https://github.com/KeshavCracks/sitty/blob/main/docs/ARCHITECTURE.md"
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-slate-900 transition-colors"
                >
                  Architecture
                </a>
              </li>
              <li>
                <a
                  href="https://github.com/KeshavCracks/sitty/blob/main/docs/DEPLOYMENT.md"
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-slate-900 transition-colors"
                >
                  Deployment
                </a>
              </li>
              <li>
                <a
                  href="https://vercel.com/new"
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-slate-900 transition-colors"
                >
                  Deploy on Vercel
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="text-sm font-semibold text-slate-900">Connect</h4>
            <ul className="mt-3 space-y-2 text-sm text-slate-500">
              <li>
                <a
                  href="https://github.com/KeshavCracks/sitty"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 hover:text-slate-900 transition-colors"
                >
                  <Github className="size-4" />
                  GitHub
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-slate-200 pt-8 text-sm text-slate-400 sm:flex-row">
          <p>© {new Date().getFullYear()} Forge. Built by KeshavCracks.</p>
          <p className="flex items-center gap-1.5">
            <GitBranch className="size-3.5" />
            Inspired by OpenHands &amp; Devin
          </p>
        </div>
      </div>
    </footer>
  );
}

/* ===================================================================
   Page
   =================================================================== */

export function LandingPage() {
  return (
    <div className="min-h-screen bg-white text-slate-900" style={{ fontFamily: "var(--font-geist-sans), ui-sans-serif, system-ui, sans-serif" }}>
      <Navbar />
      <main>
        <Hero />
        <SocialProof />
        <Features />
        <HowItWorks />
        <Architecture />
        <CodeShowcase />
        <FinalCTA />
      </main>
      <Footer />
    </div>
  );
}

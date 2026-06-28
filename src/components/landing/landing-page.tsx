"use client";

/**
 * Forge — Landing Page
 *
 * Design language cloned from render.com:
 *   - True dark background (near-black, not slate-950)
 *   - Signature render.com dark-mode gradient: purple → green → lime
 *   - Monospace technical labels (uppercase, tracked)
 *   - Border-heavy, minimal cards with scale-x hover effects
 *   - Gradient banner strip at top
 *   - Large bold headlines, code-forward hero
 *   - Montreal/sans-serif body, mono for code/labels
 *
 * Forge data substituted throughout. App shell unchanged.
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
   Gradient banner strip (render.com signature)
   =================================================================== */

function GradientBanner() {
  return (
    <div className="relative w-full bg-gradient-to-r from-purple-900 via-green-500 to-lime-200 py-2.5 text-center text-[13px] font-medium text-white">
      <span className="inline-flex items-center gap-2">
        <Sparkles className="size-3.5" />
        Forge is now powered by Claude Sonnet 4.5
        <ChevronRight className="size-3.5 opacity-70" />
      </span>
    </div>
  );
}

/* ===================================================================
   Navbar — render.com style: sticky, border-bottom, minimal
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
      className={`sticky top-0 z-50 border-b transition-colors duration-200 ${
        scrolled
          ? "border-white/10 bg-[#06060a]/90 backdrop-blur-md"
          : "border-transparent bg-[#06060a]"
      }`}
    >
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4 text-[15px] sm:px-6 lg:px-8">
        {/* Logo */}
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="flex items-center gap-2 text-white"
        >
          <div className="flex size-7 items-center justify-center rounded-md bg-gradient-to-br from-purple-500 to-green-400">
            <Bot className="size-4 text-black" />
          </div>
          <span className="text-[17px] font-semibold tracking-tight">
            Forge
          </span>
        </button>

        {/* Center nav */}
        <nav className="hidden items-center gap-1 md:flex">
          {[
            { label: "Features", href: "#features" },
            { label: "How it works", href: "#how-it-works" },
            { label: "Architecture", href: "#architecture" },
            { label: "Docs", href: "#code" },
          ].map((item) => (
            <a
              key={item.label}
              href={item.href}
              className="group relative px-3 py-2 text-white/70 transition-colors hover:text-white"
            >
              {item.label}
              <span className="absolute inset-x-3 -bottom-px h-px origin-right scale-x-0 bg-gradient-to-r from-purple-400 to-green-400 transition-transform duration-300 group-hover:origin-left group-hover:scale-x-100" />
            </a>
          ))}
          <a
            href="https://github.com/KeshavCracks/sitty"
            target="_blank"
            rel="noreferrer"
            className="group relative px-3 py-2 text-white/70 transition-colors hover:text-white"
          >
            GitHub
            <span className="absolute inset-x-3 -bottom-px h-px origin-right scale-x-0 bg-gradient-to-r from-purple-400 to-green-400 transition-transform duration-300 group-hover:origin-left group-hover:scale-x-100" />
          </a>
        </nav>

        {/* Right CTAs */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => enterApp("dashboard")}
            className="hidden text-[15px] text-white/70 transition-colors hover:text-white sm:block"
          >
            Sign in
          </button>
          <button
            onClick={() => enterApp("new-task")}
            className="group relative inline-flex items-center gap-1.5 overflow-hidden rounded-md bg-white px-4 py-1.5 text-[15px] font-semibold text-black transition-transform hover:scale-[1.02]"
          >
            Get started
            <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-0.5" />
          </button>
        </div>
      </div>
    </header>
  );
}

/* ===================================================================
   Hero — render.com style: dark, large headline, code preview
   =================================================================== */

function Hero() {
  const enterApp = useAppStore((s) => s.enterApp);

  return (
    <section className="relative overflow-hidden bg-[#06060a] pt-20 pb-24 sm:pt-28">
      {/* Background glow + grid */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 70% 50% at 50% 0%, rgba(124, 58, 237, 0.18), transparent 60%), radial-gradient(ellipse 50% 40% at 80% 20%, rgba(34, 197, 94, 0.10), transparent 60%)",
        }}
      />
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.15]"
        style={{
          backgroundImage:
            "linear-gradient(to right, rgba(255,255,255,0.06) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.06) 1px, transparent 1px)",
          backgroundSize: "56px 56px",
          maskImage:
            "radial-gradient(ellipse 70% 50% at 50% 30%, black, transparent 75%)",
          WebkitMaskImage:
            "radial-gradient(ellipse 70% 50% at 50% 30%, black, transparent 75%)",
        }}
      />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Eyebrow */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="mb-6 flex justify-center"
        >
          <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3 py-1 font-mono text-[11px] uppercase tracking-[0.15em] text-white/60 backdrop-blur">
            <span className="size-1.5 rounded-full bg-green-400" />
            Autonomous · Claude-powered · GitHub-native
          </span>
        </motion.div>

        {/* Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.05 }}
          className="mx-auto max-w-4xl text-balance text-center text-5xl font-semibold leading-[1.05] tracking-tight text-white sm:text-6xl lg:text-7xl"
        >
          Ship code with an{" "}
          <span className="bg-gradient-to-r from-purple-400 via-green-300 to-lime-200 bg-clip-text text-transparent">
            autonomous engineer
          </span>
        </motion.h1>

        {/* Subhead */}
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="mx-auto mt-6 max-w-2xl text-balance text-center text-lg text-white/60 sm:text-xl"
        >
          Forge accepts a task, plans the work, writes and edits code, runs
          your tests, and opens a pull request — all observable in real time.
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
            className="group inline-flex w-full items-center justify-center gap-2 rounded-md bg-white px-6 py-3 text-base font-semibold text-black transition-transform hover:scale-[1.02] sm:w-auto"
          >
            <Bot className="size-4" />
            Start a task
            <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
          </button>
          <button
            onClick={() => enterApp("dashboard")}
            className="inline-flex w-full items-center justify-center gap-2 rounded-md border border-white/15 bg-white/5 px-6 py-3 text-base font-semibold text-white backdrop-blur transition-colors hover:bg-white/10 sm:w-auto"
          >
            View dashboard
          </button>
        </motion.div>

        {/* Code preview */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.25 }}
          className="mx-auto mt-16 max-w-4xl"
        >
          <HeroCodePreview />
        </motion.div>
      </div>
    </section>
  );
}

function HeroCodePreview() {
  return (
    <div className="overflow-hidden rounded-xl border border-white/10 bg-[#0a0a12] shadow-2xl shadow-purple-950/30">
      {/* Title bar */}
      <div className="flex items-center justify-between border-b border-white/10 bg-white/[0.02] px-4 py-2.5">
        <div className="flex items-center gap-2">
          <span className="size-3 rounded-full bg-red-500/60" />
          <span className="size-3 rounded-full bg-amber-500/60" />
          <span className="size-3 rounded-full bg-green-500/60" />
          <span className="ml-2 font-mono text-[12px] text-white/40">
            forge — agent session
          </span>
        </div>
        <span className="inline-flex items-center gap-1.5 font-mono text-[11px] text-white/40">
          <span className="size-1.5 rounded-full bg-green-400" />
          claude-sonnet-4.5
        </span>
      </div>
      {/* Body */}
      <div className="grid gap-0 sm:grid-cols-[220px_1fr]">
        {/* Plan sidebar */}
        <div className="border-b border-white/10 p-4 sm:border-b-0 sm:border-r">
          <div className="mb-3 font-mono text-[10px] uppercase tracking-[0.15em] text-white/30">
            Execution plan
          </div>
          <ol className="space-y-2.5">
            {[
              { t: "Explore repository", done: true },
              { t: "Read auth/session.ts", done: true },
              { t: "Edit login route", done: true },
              { t: "Add regression test", done: false, active: true },
              { t: "Run test suite", done: false },
              { t: "Commit & open PR", done: false },
            ].map((step, i) => (
              <li key={i} className="flex items-center gap-2.5 text-[13px]">
                <span
                  className={`flex size-4 shrink-0 items-center justify-center rounded-full text-[9px] ${
                    step.done
                      ? "bg-green-400 text-black"
                      : step.active
                      ? "bg-purple-500/20 text-purple-300 ring-1 ring-purple-400"
                      : "bg-white/10 text-white/30"
                  }`}
                >
                  {step.done ? <Check className="size-2.5" /> : i + 1}
                </span>
                <span
                  className={
                    step.done
                      ? "text-white/30 line-through"
                      : step.active
                      ? "text-white"
                      : "text-white/50"
                  }
                >
                  {step.t}
                </span>
              </li>
            ))}
          </ol>
        </div>
        {/* Terminal */}
        <div className="bg-[#06060a] p-4 font-mono text-[13px] leading-[1.7]">
          <div className="text-white/40">$ forge read src/lib/auth/session.ts</div>
          <div className="text-white/40">→ 50 lines read</div>
          <div className="text-amber-400">
            ⚠ line 38: maxAge ignores `persistent` flag
          </div>
          <div className="mt-2 text-white/40">
            $ forge edit src/app/api/auth/login/route.ts
          </div>
          <div className="text-green-400">
            + await setSession(user.id, remember)
          </div>
          <div className="text-red-400">- await setSession(user.id, false)</div>
          <div className="mt-2 text-white/40">$ forge exec bun run test</div>
          <div className="text-green-400">✓ 2 passed (2)</div>
          <div className="mt-2 text-white/40">$ forge gh pr create</div>
          <div className="text-green-400">✓ PR #143 opened</div>
          <div className="text-white/40">
            https://github.com/acme/webapp/pull/143
            <span className="ml-1 inline-block h-3.5 w-[7px] animate-pulse bg-green-400 align-middle" />
          </div>
        </div>
      </div>
    </div>
  );
}

/* ===================================================================
   Stats strip
   =================================================================== */

function Stats() {
  const stats = [
    { value: "12", label: "Typed tools" },
    { value: "5", label: "Demo scenarios" },
    { value: "200k", label: "Context window" },
    { value: "100%", label: "Observable" },
  ];
  return (
    <section className="border-y border-white/10 bg-[#08080e] py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
          {stats.map((s) => (
            <div key={s.label} className="text-center">
              <div className="bg-gradient-to-r from-purple-400 to-green-300 bg-clip-text text-4xl font-semibold text-transparent sm:text-5xl">
                {s.value}
              </div>
              <div className="mt-2 font-mono text-[11px] uppercase tracking-[0.15em] text-white/40">
                {s.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ===================================================================
   Features — render.com style: bordered cards, gradient icons
   =================================================================== */

const FEATURES = [
  {
    icon: Bot,
    title: "Agentic planning",
    body: "Every task is decomposed into an ordered, observable plan. The agent reasons about each step before touching a file — so you always know what it's about to do and why.",
  },
  {
    icon: Code2,
    title: "Code generation & editing",
    body: "Reads, writes, and edits files with surgical search-and-replace. Real diffs stream into the UI as they happen — no opaque magic edits.",
  },
  {
    icon: Terminal,
    title: "Live terminal & logs",
    body: "Watch every shell command, test run, and git operation stream in real time. Filterable log levels, syntax-highlighted output, no surprises.",
  },
  {
    icon: GitPullRequest,
    title: "GitHub-native workflow",
    body: "Connects to your repositories, creates feature branches, commits with conventional messages, and opens pull requests with full context for reviewers.",
  },
  {
    icon: Cpu,
    title: "Claude-first, pluggable models",
    body: "Anthropic Claude is the primary reasoning engine. A clean provider abstraction means you can swap in any LLM — including a sandbox-friendly default.",
  },
  {
    icon: ShieldCheck,
    title: "Cloud-safe by design",
    body: "Mutating tools are simulated on Vercel's read-only runtime and executed for real in a local worker. The same UI works in both modes — no broken demos.",
  },
];

function Features() {
  return (
    <section id="features" className="bg-[#06060a] py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <div className="mx-auto max-w-2xl text-center">
          <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-green-400/80">
            {"// Capabilities"}
          </span>
          <h2 className="mt-4 text-4xl font-semibold tracking-tight text-white sm:text-5xl">
            Everything an autonomous
            <br />
            engineer needs
          </h2>
          <p className="mt-4 text-lg text-white/50">
            Each capability is a clean, typed module — not a monolithic agent
            loop. Portable across runtimes, trustworthy in production.
          </p>
        </div>

        {/* Grid */}
        <div className="mt-16 grid gap-px overflow-hidden rounded-xl border border-white/10 bg-white/10 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.3, delay: i * 0.04 }}
              className="group relative bg-[#0a0a12] p-7 transition-colors hover:bg-[#0e0e18]"
            >
              <div className="mb-5 inline-flex size-11 items-center justify-center rounded-lg border border-white/10 bg-gradient-to-br from-purple-500/20 to-green-400/10 text-purple-300 transition-colors group-hover:from-purple-500/30 group-hover:to-green-400/20">
                <f.icon className="size-5" />
              </div>
              <h3 className="text-lg font-semibold text-white">{f.title}</h3>
              <p className="mt-2 text-[15px] leading-relaxed text-white/50">
                {f.body}
              </p>
            </motion.div>
          ))}
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
    n: "01",
    icon: Bot,
    title: "Describe the task",
    body: "Tell Forge what you want in plain English. Pick a repository, a branch, and a model. The orchestrator takes it from there.",
  },
  {
    n: "02",
    icon: Workflow,
    title: "Watch the plan form",
    body: "The planner decomposes your task into 5–9 ordered steps with explicit tool calls. You see assumptions and risks before any code is written.",
  },
  {
    n: "03",
    icon: Terminal,
    title: "Follow execution live",
    body: "Terminal output, file diffs, and a step timeline stream in real time. Cancel anytime. Every action is logged for audit.",
  },
  {
    n: "04",
    icon: GitPullRequest,
    title: "Review the pull request",
    body: "Forge commits with conventional messages and opens a pull request with a full summary. You review, merge, ship.",
  },
];

function HowItWorks() {
  return (
    <section id="how-it-works" className="border-y border-white/10 bg-[#08080e] py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-green-400/80">
            {"// Workflow"}
          </span>
          <h2 className="mt-4 text-4xl font-semibold tracking-tight text-white sm:text-5xl">
            From prompt to pull request
          </h2>
          <p className="mt-4 text-lg text-white/50">
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
              {/* Connector */}
              {i < STEPS.length - 1 && (
                <div className="absolute left-12 top-6 hidden h-px w-[calc(100%-3rem)] bg-gradient-to-r from-purple-500/40 to-transparent lg:block" />
              )}
              <div className="relative flex size-12 items-center justify-center rounded-lg border border-white/10 bg-[#0a0a12]">
                <s.icon className="size-5 text-green-400" />
              </div>
              <span className="mt-4 block font-mono text-[11px] uppercase tracking-[0.15em] text-white/30">
                Step {s.n}
              </span>
              <h3 className="mt-1 text-lg font-semibold text-white">
                {s.title}
              </h3>
              <p className="mt-2 text-[15px] leading-relaxed text-white/50">
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
    desc: "Abstracts where tools run — local worker, cloud serverless, or demo mode.",
    tag: "runtime",
  },
  {
    icon: FileCode2,
    name: "Tools",
    desc: "12 typed tool definitions: read_file, edit_file, run_command, git_commit, open_pr.",
    tag: "agent",
  },
  {
    icon: Github,
    name: "GitHub layer",
    desc: "REST v3 client for repos, branches, commits, and pull requests.",
    tag: "github",
  },
];

function Architecture() {
  return (
    <section id="architecture" className="bg-[#06060a] py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-green-400/80">
            {"// Architecture"}
          </span>
          <h2 className="mt-4 text-4xl font-semibold tracking-tight text-white sm:text-5xl">
            Clean layers, not a black box
          </h2>
          <p className="mt-4 text-lg text-white/50">
            Forge is built like a real product, not a notebook. Each layer has
            a single responsibility and a typed contract.
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
              className="group flex items-start gap-4 rounded-lg border border-white/10 bg-[#0a0a12] p-5 transition-colors hover:border-purple-500/30"
            >
              <div className="flex size-10 shrink-0 items-center justify-center rounded-md border border-white/10 bg-white/5 text-purple-300">
                <l.icon className="size-5" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between gap-2">
                  <h3 className="text-sm font-semibold text-white">{l.name}</h3>
                  <span className="font-mono text-[10px] uppercase tracking-wider text-white/30">
                    {l.tag}
                  </span>
                </div>
                <p className="mt-1 text-[13px] leading-relaxed text-white/50">
                  {l.desc}
                </p>
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
    <section id="code" className="border-y border-white/10 bg-[#08080e] py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-green-400/80">
            {"// Under the hood"}
          </span>
          <h2 className="mt-4 text-4xl font-semibold tracking-tight text-white sm:text-5xl">
            Real commands. Real code.
          </h2>
          <p className="mt-4 text-lg text-white/50">
            The agent's planner is a typed function with a clean fallback —
            exactly the kind of code you'd want in production.
          </p>
        </div>

        <div className="mt-16 grid gap-6 lg:grid-cols-2">
          {/* Source code */}
          <div className="overflow-hidden rounded-xl border border-white/10 bg-[#06060a]">
            <div className="flex items-center gap-2 border-b border-white/10 bg-white/[0.02] px-4 py-2.5">
              <span className="font-mono text-[12px] text-white/40">
                src/lib/agent/planner.ts
              </span>
            </div>
            <pre className="overflow-x-auto p-5 font-mono text-[12px] leading-[1.7] text-white/70">
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
                className="group rounded-lg border border-white/10 bg-[#0a0a12] p-4 transition-colors hover:border-green-400/30"
              >
                <div className="font-mono text-[13px] font-semibold text-white">
                  <span className="text-green-400">$</span> {c.cmd}
                </div>
                <div className="mt-1 text-[12px] text-white/40">{c.desc}</div>
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
    <section className="relative overflow-hidden bg-[#06060a] py-24 sm:py-32">
      {/* Glow */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 60% 50% at 50% 50%, rgba(124, 58, 237, 0.15), transparent 70%)",
        }}
      />
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-purple-950/40 via-[#0a0a12] to-green-950/30 px-6 py-16 text-center sm:px-16 sm:py-20">
          {/* Grid overlay */}
          <div
            className="pointer-events-none absolute inset-0 opacity-20"
            style={{
              backgroundImage:
                "linear-gradient(to right, rgba(255,255,255,0.08) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.08) 1px, transparent 1px)",
              backgroundSize: "40px 40px",
            }}
          />
          <div className="relative">
            <h2 className="mx-auto max-w-2xl text-balance text-4xl font-semibold tracking-tight text-white sm:text-5xl">
              Ship your next PR with an{" "}
              <span className="bg-gradient-to-r from-purple-400 to-green-300 bg-clip-text text-transparent">
                AI pair engineer
              </span>
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-lg text-white/60">
              Launch the app, describe a task, and watch Forge plan, code,
              test, and open a pull request — all in real time.
            </p>
            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <button
                onClick={() => enterApp("new-task")}
                className="group inline-flex w-full items-center justify-center gap-2 rounded-md bg-white px-6 py-3 text-base font-semibold text-black transition-transform hover:scale-[1.02] sm:w-auto"
              >
                <Bot className="size-4" />
                Start a task
                <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
              </button>
              <button
                onClick={() => enterApp("dashboard")}
                className="inline-flex w-full items-center justify-center gap-2 rounded-md border border-white/15 bg-white/5 px-6 py-3 text-base font-semibold text-white backdrop-blur transition-colors hover:bg-white/10 sm:w-auto"
              >
                View dashboard
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
    <footer className="border-t border-white/10 bg-[#06060a]">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid gap-8 md:grid-cols-4">
          <div className="md:col-span-1">
            <div className="flex items-center gap-2">
              <div className="flex size-7 items-center justify-center rounded-md bg-gradient-to-br from-purple-500 to-green-400">
                <Bot className="size-4 text-black" />
              </div>
              <span className="text-[17px] font-semibold text-white">
                Forge
              </span>
            </div>
            <p className="mt-3 text-sm text-white/40">
              An autonomous software engineering agent. Claude-powered,
              GitHub-native, deployable on Vercel.
            </p>
          </div>
          <div>
            <h4 className="font-mono text-[11px] uppercase tracking-[0.15em] text-white/30">
              Product
            </h4>
            <ul className="mt-4 space-y-2.5 text-sm">
              <li>
                <button
                  className="text-white/60 transition-colors hover:text-white"
                  onClick={() => enterApp("dashboard")}
                >
                  Dashboard
                </button>
              </li>
              <li>
                <button
                  className="text-white/60 transition-colors hover:text-white"
                  onClick={() => enterApp("new-task")}
                >
                  New task
                </button>
              </li>
              <li>
                <button
                  className="text-white/60 transition-colors hover:text-white"
                  onClick={() => enterApp("history")}
                >
                  History
                </button>
              </li>
              <li>
                <button
                  className="text-white/60 transition-colors hover:text-white"
                  onClick={() => enterApp("settings")}
                >
                  Settings
                </button>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-mono text-[11px] uppercase tracking-[0.15em] text-white/30">
              Resources
            </h4>
            <ul className="mt-4 space-y-2.5 text-sm">
              <li>
                <a
                  href="https://github.com/KeshavCracks/sitty#readme"
                  target="_blank"
                  rel="noreferrer"
                  className="text-white/60 transition-colors hover:text-white"
                >
                  README
                </a>
              </li>
              <li>
                <a
                  href="https://github.com/KeshavCracks/sitty/blob/main/docs/ARCHITECTURE.md"
                  target="_blank"
                  rel="noreferrer"
                  className="text-white/60 transition-colors hover:text-white"
                >
                  Architecture
                </a>
              </li>
              <li>
                <a
                  href="https://github.com/KeshavCracks/sitty/blob/main/docs/DEPLOYMENT.md"
                  target="_blank"
                  rel="noreferrer"
                  className="text-white/60 transition-colors hover:text-white"
                >
                  Deployment
                </a>
              </li>
              <li>
                <a
                  href="https://vercel.com/new"
                  target="_blank"
                  rel="noreferrer"
                  className="text-white/60 transition-colors hover:text-white"
                >
                  Deploy on Vercel
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-mono text-[11px] uppercase tracking-[0.15em] text-white/30">
              Connect
            </h4>
            <ul className="mt-4 space-y-2.5 text-sm">
              <li>
                <a
                  href="https://github.com/KeshavCracks/sitty"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 text-white/60 transition-colors hover:text-white"
                >
                  <Github className="size-4" />
                  GitHub
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-8 text-sm text-white/30 sm:flex-row">
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
    <div className="min-h-screen bg-[#06060a] text-white" style={{ fontFamily: "var(--font-geist-sans), ui-sans-serif, system-ui, sans-serif" }}>
      <GradientBanner />
      <Navbar />
      <main>
        <Hero />
        <Stats />
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

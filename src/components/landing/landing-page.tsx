"use client";

/**
 * Forge — Landing Page
 *
 * Design system: rig.ai
 *   Stark, high-contrast, editorial-bold meets terminal-precise.
 *   - Black ink (#000000) on warm off-white (#F0EDE6) with red-orange (#ED462D) signal
 *   - Archivo (Chalet substitute) headlines: bold, tight-tracked, oversized
 *   - Instrument Sans body: pragmatic, medium weight
 *   - Chivo Mono labels: uppercase, tracked, technical
 *   - Sharp corners (0-6px), no shadows, no pills, no glassmorphism
 *   - Depth via tonal contrast and borders, not elevation
 *   - Hero: light with red wash → dark manifesto sections
 *
 * All Forge data retained. App shell unchanged.
 */

import * as React from "react";
import { motion } from "framer-motion";
import {
  ArrowRight,
  ArrowUpRight,
  Bot,
  Check,
  Code2,
  Cpu,
  FileCode2,
  GitBranch,
  Github,
  GitPullRequest,
  Terminal,
} from "lucide-react";
import { useAppStore } from "@/store/app-store";

/* Colors (from rig.ai design.md) */
const C = {
  primary: "#000000",
  secondary: "#F0EDE6",
  tertiary: "#ED462D",
  neutral: "#FFFFFF",
  surface: "#0A0A0A",
  onSurface: "#F0EDE6",
  borderSubtle: "rgba(10, 10, 10, 0.2)",
  borderSubtleDark: "rgba(240, 237, 230, 0.15)",
};

/* ===================================================================
   Status bar — terminal-like top strip
   =================================================================== */

function StatusBar() {
  return (
    <div
      className="flex items-center justify-between px-5 sm:px-8 py-2 text-[11px] uppercase tracking-[0.08em]"
      style={{
        background: C.surface,
        color: C.onSurface,
        fontFamily: "var(--font-rig-mono)",
        fontWeight: 700,
      }}
    >
      <div className="flex items-center gap-4">
        <span className="flex items-center gap-1.5">
          <span
            className="size-1.5 rounded-full"
            style={{ background: C.tertiary }}
          />
          SYSTEM ONLINE
        </span>
        <span className="hidden sm:inline opacity-50">v1.0.0</span>
      </div>
      <div className="hidden items-center gap-4 sm:flex opacity-50">
        <span>CLAUDE-SONNET-4.5</span>
        <span>GITHUB-NATIVE</span>
        <span>VERCEL-READY</span>
      </div>
      <div className="opacity-50">{new Date().getFullYear()}</div>
    </div>
  );
}

/* ===================================================================
   Navbar — minimal, sharp, mono labels
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
      className="sticky top-0 z-50 transition-colors duration-150"
      style={{
        background: scrolled ? C.secondary : "transparent",
        borderBottom: scrolled
          ? `1px solid ${C.borderSubtle}`
          : "1px solid transparent",
      }}
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-5 sm:px-8">
        {/* Logo */}
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="flex items-center gap-2.5"
        >
          <div
            className="flex size-7 items-center justify-center"
            style={{ background: C.primary }}
          >
            <Bot className="size-4" style={{ color: C.tertiary }} />
          </div>
          <span
            className="text-[18px] font-bold tracking-tight"
            style={{
              fontFamily: "var(--font-rig-headline)",
              color: C.primary,
              letterSpacing: "-0.02em",
            }}
          >
            FORGE
          </span>
          <span
            className="text-[10px] font-bold uppercase tracking-[0.1em] hidden sm:inline"
            style={{
              fontFamily: "var(--font-rig-mono)",
              color: C.tertiary,
              border: `1px solid ${C.tertiary}`,
              padding: "2px 6px",
            }}
          >
            AI/SE
          </span>
        </button>

        {/* Center nav */}
        <nav className="hidden items-center gap-8 md:flex">
          {[
            { label: "FEATURES", href: "#features" },
            { label: "WORKFLOW", href: "#workflow" },
            { label: "ARCHITECTURE", href: "#architecture" },
            { label: "CODE", href: "#code" },
          ].map((item) => (
            <a
              key={item.label}
              href={item.href}
              className="text-[12px] font-bold uppercase tracking-[0.06em] transition-colors"
              style={{
                fontFamily: "var(--font-rig-mono)",
                color: C.primary,
                opacity: 0.6,
              }}
              onMouseEnter={(e) => (e.currentTarget.style.opacity = "1")}
              onMouseLeave={(e) => (e.currentTarget.style.opacity = "0.6")}
            >
              {item.label}
            </a>
          ))}
        </nav>

        {/* Right */}
        <div className="flex items-center gap-3">
          <a
            href="https://github.com/KeshavCracks/sitty"
            target="_blank"
            rel="noreferrer"
            className="hidden sm:flex items-center gap-1.5 text-[12px] font-bold uppercase tracking-[0.06em] transition-colors"
            style={{ fontFamily: "var(--font-rig-mono)", color: C.primary }}
          >
            <Github className="size-4" />
            REPO
            <ArrowUpRight className="size-3" />
          </a>
          <button
            onClick={() => enterApp("new-task")}
            className="rig-btn"
            style={{ height: "40px", padding: "0 20px", fontSize: "12px" }}
          >
            LAUNCH
            <ArrowRight className="size-3.5" />
          </button>
        </div>
      </div>
    </header>
  );
}

/* ===================================================================
   Hero — light with red wash, oversized headline
   =================================================================== */

function Hero() {
  const enterApp = useAppStore((s) => s.enterApp);

  return (
    <section className="rig rig-wash relative overflow-hidden">
      <div className="mx-auto max-w-7xl px-5 sm:px-8 pt-16 pb-24 sm:pt-24 sm:pb-32">
        {/* Overline */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="mb-8 flex items-center gap-3"
        >
          <span
            className="text-[11px] font-bold uppercase tracking-[0.08em]"
            style={{
              fontFamily: "var(--font-rig-mono)",
              color: C.tertiary,
              border: `1px solid ${C.tertiary}`,
              padding: "6px 10px",
            }}
          >
            AUTONOMOUS / CLAUDE-POWERED / GITHUB-NATIVE
          </span>
        </motion.div>

        {/* Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.05 }}
          className="rig-headline max-w-5xl"
          style={{
            fontSize: "clamp(48px, 8vw, 96px)",
            lineHeight: "0.92",
            color: C.primary,
          }}
        >
          SHIP CODE
          <br />
          WITH AN{" "}
          <span style={{ color: C.tertiary }}>AUTONOMOUS</span>
          <br />
          ENGINEER.
        </motion.h1>

        {/* Subtext */}
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.15 }}
          className="mt-8 max-w-xl text-[18px] font-semibold leading-[1.5]"
          style={{
            fontFamily: "var(--font-rig-body)",
            color: C.primary,
          }}
        >
          Forge accepts a task, plans the work, writes and edits code, runs
          your tests, and opens a pull request. Every step observable in real
          time. No black box.
        </motion.p>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.25 }}
          className="mt-10 flex flex-wrap items-center gap-3"
        >
          <button onClick={() => enterApp("new-task")} className="rig-btn">
            START A TASK
            <ArrowRight className="size-4" />
          </button>
          <button
            onClick={() => enterApp("dashboard")}
            className="rig-btn rig-btn-secondary"
          >
            VIEW DASHBOARD
          </button>
        </motion.div>

        {/* Code preview */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.35 }}
          className="mt-20"
        >
          <HeroCodePreview />
        </motion.div>
      </div>
    </section>
  );
}

function HeroCodePreview() {
  return (
    <div
      className="overflow-hidden"
      style={{
        background: C.surface,
        border: `1px solid ${C.tertiary}`,
        borderRadius: "6px",
      }}
    >
      {/* Title bar */}
      <div
        className="flex items-center justify-between px-5 py-3"
        style={{ borderBottom: `1px solid ${C.borderSubtleDark}` }}
      >
        <div className="flex items-center gap-3">
          <span
            className="text-[11px] font-bold uppercase tracking-[0.08em]"
            style={{ fontFamily: "var(--font-rig-mono)", color: C.tertiary }}
          >
            ● AGENT SESSION
          </span>
          <span
            className="text-[11px] font-bold uppercase tracking-[0.08em] opacity-40"
            style={{ fontFamily: "var(--font-rig-mono)", color: C.onSurface }}
          >
            TASK-001
          </span>
        </div>
        <span
          className="text-[11px] font-bold uppercase tracking-[0.08em] flex items-center gap-1.5"
          style={{ fontFamily: "var(--font-rig-mono)", color: C.onSurface }}
        >
          <span
            className="size-1.5 rounded-full"
            style={{ background: C.tertiary }}
          />
          CLAUDE-SONNET-4.5
        </span>
      </div>

      {/* Body */}
      <div className="grid gap-0 sm:grid-cols-[240px_1fr]">
        {/* Plan sidebar */}
        <div
          className="p-5"
          style={{ borderBottom: `1px solid ${C.borderSubtleDark}` }}
        >
          <div className="sm:border-b-0 sm:border-r" style={{}}>
            <div
              className="mb-4 text-[11px] font-bold uppercase tracking-[0.08em]"
              style={{ fontFamily: "var(--font-rig-mono)", color: C.tertiary }}
            >
              EXECUTION PLAN
            </div>
            <ol className="space-y-3">
              {[
                { t: "Explore repository", done: true },
                { t: "Read auth/session.ts", done: true },
                { t: "Edit login route", done: true },
                { t: "Add regression test", done: false, active: true },
                { t: "Run test suite", done: false },
                { t: "Commit & open PR", done: false },
              ].map((step, i) => (
                <li key={i} className="flex items-center gap-2.5">
                  <span
                    className="flex size-4 shrink-0 items-center justify-center text-[9px] font-bold"
                    style={{
                      background: step.done
                        ? C.tertiary
                        : step.active
                        ? "transparent"
                        : "transparent",
                      color: step.done
                        ? C.neutral
                        : step.active
                        ? C.tertiary
                        : C.onSurface,
                      border: `1px solid ${
                        step.done
                          ? C.tertiary
                          : step.active
                          ? C.tertiary
                          : C.borderSubtleDark
                      }`,
                    }}
                  >
                    {step.done ? <Check className="size-2.5" /> : i + 1}
                  </span>
                  <span
                    className="text-[13px] font-medium"
                    style={{
                      fontFamily: "var(--font-rig-mono)",
                      color: step.done
                        ? "rgba(240, 237, 230, 0.3)"
                        : step.active
                        ? C.onSurface
                        : "rgba(240, 237, 230, 0.5)",
                      textDecoration: step.done ? "line-through" : "none",
                    }}
                  >
                    {step.t}
                  </span>
                </li>
              ))}
            </ol>
          </div>
        </div>

        {/* Terminal */}
        <div
          className="p-5 font-mono text-[13px] leading-[1.7]"
          style={{ fontFamily: "var(--font-rig-mono)", color: C.onSurface }}
        >
          <div style={{ color: "rgba(240, 237, 230, 0.4)" }}>
            $ forge read src/lib/auth/session.ts
          </div>
          <div style={{ color: "rgba(240, 237, 230, 0.4)" }}>
            → 50 lines read
          </div>
          <div style={{ color: C.tertiary }}>
            ⚠ line 38: maxAge ignores `persistent` flag
          </div>
          <div className="mt-3" style={{ color: "rgba(240, 237, 230, 0.4)" }}>
            $ forge edit src/app/api/auth/login/route.ts
          </div>
          <div style={{ color: C.tertiary }}>
            + await setSession(user.id, remember)
          </div>
          <div style={{ color: "rgba(240, 237, 230, 0.4)" }}>
            - await setSession(user.id, false)
          </div>
          <div className="mt-3" style={{ color: "rgba(240, 237, 230, 0.4)" }}>
            $ forge exec bun run test
          </div>
          <div style={{ color: C.tertiary }}>✓ 2 passed (2)</div>
          <div className="mt-3" style={{ color: "rgba(240, 237, 230, 0.4)" }}>
            $ forge gh pr create
          </div>
          <div style={{ color: C.tertiary }}>✓ PR #143 opened</div>
          <div style={{ color: "rgba(240, 237, 230, 0.4)" }}>
            https://github.com/acme/webapp/pull/143
            <span
              className="ml-1 inline-block align-middle animate-pulse"
              style={{
                width: "7px",
                height: "14px",
                background: C.tertiary,
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

/* ===================================================================
   Marquee — scrolling technical terms
   =================================================================== */

function Marquee() {
  const items = [
    "PLANNER",
    "EXECUTOR",
    "RUNTIME",
    "TOOLS",
    "GITHUB",
    "CLAUDE",
    "DIFFS",
    "LOGS",
    "TERMINAL",
    "PR",
    "COMMIT",
    "TESTS",
  ];
  return (
    <div
      className="overflow-hidden py-5"
      style={{
        background: C.primary,
        borderBottom: `1px solid ${C.tertiary}`,
      }}
    >
      <div className="flex rig-marquee whitespace-nowrap">
        {[...items, ...items, ...items, ...items].map((item, i) => (
          <span
            key={i}
            className="mx-6 text-[14px] font-bold uppercase tracking-[0.1em] flex items-center gap-6"
            style={{
              fontFamily: "var(--font-rig-mono)",
              color: i % 2 === 0 ? C.tertiary : C.onSurface,
            }}
          >
            {item}
            <span style={{ color: C.tertiary, opacity: 0.5 }}>/</span>
          </span>
        ))}
      </div>
    </div>
  );
}

/* ===================================================================
   Manifesto — dark section, large editorial type
   =================================================================== */

function Manifesto() {
  return (
    <section
      className="rig rig-dark py-24 sm:py-32"
      style={{ background: C.surface, color: C.onSurface }}
    >
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <div className="grid gap-12 lg:grid-cols-[200px_1fr]">
          <div>
            <span
              className="text-[11px] font-bold uppercase tracking-[0.08em]"
              style={{ fontFamily: "var(--font-rig-mono)", color: C.tertiary }}
            >
              [01] MANIFESTO
            </span>
          </div>
          <div>
            <h2
              className="rig-headline"
              style={{
                fontSize: "clamp(32px, 5vw, 56px)",
                lineHeight: "1.05",
                color: C.onSurface,
              }}
            >
              Most AI coding demos run in a notebook with hardcoded prompts.
              Or they need a Kubernetes cluster before they'll say hello.
              <span style={{ color: C.tertiary }}>
                {" "}
                Forge is the middle path.
              </span>
            </h2>
            <p
              className="mt-8 max-w-2xl text-[18px] font-medium leading-[1.6]"
              style={{ fontFamily: "var(--font-rig-body)", color: "rgba(240, 237, 230, 0.6)" }}
            >
              A production-quality Next.js app that demonstrates the full
              Devin-style workflow — task intake, planning, step-by-step
              execution with live terminal output, file diffs, and a pull
              request. Honest about what can and cannot run on Vercel's free
              tier.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ===================================================================
   Features — dark grid with red-bordered cards
   =================================================================== */

const FEATURES = [
  {
    n: "01",
    icon: Bot,
    title: "Agentic planning",
    body: "Every task is decomposed into an ordered, observable plan. The agent reasons about each step before touching a file. Assumptions and risks are surfaced upfront — never hidden inside a black box.",
  },
  {
    n: "02",
    icon: Code2,
    title: "Code generation & editing",
    body: "Reads, writes, and edits files with surgical search-and-replace. Real diffs stream into the UI as they happen. You see every addition, deletion, and context line exactly as a reviewer would.",
  },
  {
    n: "03",
    icon: Terminal,
    title: "Live terminal & logs",
    body: "Watch every shell command, test run, and git operation stream in real time. Filterable log levels, syntax-highlighted output. The terminal auto-scrolls so you're always on the latest line.",
  },
  {
    n: "04",
    icon: GitPullRequest,
    title: "GitHub-native workflow",
    body: "Connects to your repositories, creates feature branches, commits with conventional messages, and opens pull requests with full context for reviewers. Typed REST v3 wrapper — no raw API leaks.",
  },
  {
    n: "05",
    icon: Cpu,
    title: "Claude-first, pluggable models",
    body: "Anthropic Claude is the primary reasoning engine with extended thinking support. A clean provider abstraction means you can swap in any LLM — including a sandbox-friendly default.",
  },
  {
    n: "06",
    icon: FileCode2,
    title: "Cloud-safe by design",
    body: "Mutating tools are simulated on Vercel's read-only runtime and executed for real in a local worker. The same UI works in both modes — no broken demos, no if-statements in components.",
  },
];

function Features() {
  return (
    <section
      id="features"
      className="rig rig-dark py-24 sm:py-32"
      style={{
        background: C.surface,
        color: C.onSurface,
        borderTop: `1px solid ${C.borderSubtleDark}`,
      }}
    >
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        {/* Header */}
        <div className="grid gap-12 lg:grid-cols-[200px_1fr] mb-16">
          <div>
            <span
              className="text-[11px] font-bold uppercase tracking-[0.08em]"
              style={{ fontFamily: "var(--font-rig-mono)", color: C.tertiary }}
            >
              [02] CAPABILITIES
            </span>
          </div>
          <div>
            <h2
              className="rig-headline"
              style={{
                fontSize: "clamp(36px, 6vw, 64px)",
                lineHeight: "0.98",
                color: C.onSurface,
              }}
            >
              EVERYTHING AN
              <br />
              AUTONOMOUS ENGINEER
              <br />
              <span style={{ color: C.tertiary }}>NEEDS.</span>
            </h2>
          </div>
        </div>

        {/* Grid */}
        <div className="grid gap-px sm:grid-cols-2 lg:grid-cols-3" style={{ background: C.borderSubtleDark }}>
          {FEATURES.map((f, i) => (
            <motion.div
              key={f.n}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.3, delay: i * 0.04 }}
              className="group p-8 transition-colors"
              style={{ background: C.surface }}
            >
              <div className="mb-6 flex items-center justify-between">
                <span
                  className="text-[11px] font-bold tracking-[0.08em]"
                  style={{ fontFamily: "var(--font-rig-mono)", color: C.tertiary }}
                >
                  {f.n}
                </span>
                <f.icon
                  className="size-5"
                  style={{ color: "rgba(240, 237, 230, 0.4)" }}
                />
              </div>
              <h3
                className="text-[22px] font-bold tracking-tight mb-3"
                style={{
                  fontFamily: "var(--font-rig-headline)",
                  color: C.onSurface,
                  letterSpacing: "-0.02em",
                }}
              >
                {f.title}
              </h3>
              <p
                className="text-[15px] font-medium leading-[1.6]"
                style={{
                  fontFamily: "var(--font-rig-body)",
                  color: "rgba(240, 237, 230, 0.55)",
                }}
              >
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
   Workflow — numbered steps, sharp dividers
   =================================================================== */

const STEPS = [
  {
    n: "01",
    title: "Describe the task",
    body: "Tell Forge what you want in plain English. Pick a repository, a branch, and a model. The orchestrator takes it from there. No prompt engineering required.",
  },
  {
    n: "02",
    title: "Watch the plan form",
    body: "The planner decomposes your task into five to nine ordered steps with explicit tool calls. You see assumptions and risks before any code is written. Cancel here if it looks wrong.",
  },
  {
    n: "03",
    title: "Follow execution live",
    body: "Terminal output, file diffs, and a step timeline stream in real time. Filterable log levels, syntax-highlighted diffs, auto-scrolling terminal. Cancel anytime.",
  },
  {
    n: "04",
    title: "Review the pull request",
    body: "Forge commits with conventional messages and opens a pull request with a full summary, root-cause analysis, and testing steps. You review, merge, ship.",
  },
];

function Workflow() {
  const enterApp = useAppStore((s) => s.enterApp);
  return (
    <section
      id="workflow"
      className="rig py-24 sm:py-32"
      style={{ background: C.secondary, color: C.primary }}
    >
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        {/* Header */}
        <div className="grid gap-12 lg:grid-cols-[200px_1fr] mb-16">
          <div>
            <span
              className="text-[11px] font-bold uppercase tracking-[0.08em]"
              style={{
                fontFamily: "var(--font-rig-mono)",
                color: C.tertiary,
                border: `1px solid ${C.tertiary}`,
                padding: "6px 10px",
                display: "inline-block",
              }}
            >
              [03] WORKFLOW
            </span>
          </div>
          <div>
            <h2
              className="rig-headline"
              style={{
                fontSize: "clamp(36px, 6vw, 64px)",
                lineHeight: "0.98",
                color: C.primary,
              }}
            >
              FROM PROMPT
              <br />
              TO <span style={{ color: C.tertiary }}>PULL REQUEST.</span>
            </h2>
            <p
              className="mt-6 max-w-lg text-[18px] font-semibold leading-[1.5]"
              style={{ fontFamily: "var(--font-rig-body)", color: C.primary }}
            >
              Four observable stages. No magic, no hidden state.
            </p>
          </div>
        </div>

        {/* Steps */}
        <div className="grid gap-0" style={{ borderTop: `1px solid ${C.borderSubtle}` }}>
          {STEPS.map((s, i) => (
            <motion.div
              key={s.n}
              initial={{ opacity: 0, y: 8 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.35, delay: i * 0.05 }}
              className="grid gap-6 py-10 transition-colors hover:bg-black/[0.02]"
              style={{
                borderBottom: `1px solid ${C.borderSubtle}`,
                gridTemplateColumns: "80px 1fr 1.5fr auto",
              }}
            >
              <span
                className="text-[14px] font-bold"
                style={{ fontFamily: "var(--font-rig-mono)", color: C.tertiary }}
              >
                {s.n}
              </span>
              <h3
                className="text-[26px] font-bold tracking-tight"
                style={{
                  fontFamily: "var(--font-rig-headline)",
                  color: C.primary,
                  letterSpacing: "-0.02em",
                }}
              >
                {s.title}
              </h3>
              <p
                className="text-[16px] font-medium leading-[1.6]"
                style={{
                  fontFamily: "var(--font-rig-body)",
                  color: "rgba(10, 10, 10, 0.6)",
                }}
              >
                {s.body}
              </p>
              <ArrowRight
                className="size-5 opacity-30"
                style={{ color: C.primary }}
              />
            </motion.div>
          ))}
        </div>

        {/* CTA */}
        <div className="mt-12">
          <button onClick={() => enterApp("new-task")} className="rig-btn">
            TRY IT NOW
            <ArrowRight className="size-4" />
          </button>
        </div>
      </div>
    </section>
  );
}

/* ===================================================================
   Architecture — dark grid
   =================================================================== */

const LAYERS = [
  {
    n: "01",
    name: "Orchestrator",
    desc: "Holds the task state machine. Sequences planner → executor → reviewer.",
    tag: "agent",
  },
  {
    n: "02",
    name: "Planner",
    desc: "Asks the LLM to decompose the task into ordered, typed steps with tool bindings.",
    tag: "llm",
  },
  {
    n: "03",
    name: "Executor",
    desc: "Walks the plan one step at a time. Invokes tools, streams events, captures diffs.",
    tag: "agent",
  },
  {
    n: "04",
    name: "Runtime",
    desc: "Abstracts where tools run — local worker, cloud serverless, or demo mode.",
    tag: "runtime",
  },
  {
    n: "05",
    name: "Tools",
    desc: "12 typed tool definitions: read_file, edit_file, run_command, git_commit, open_pr.",
    tag: "agent",
  },
  {
    n: "06",
    name: "GitHub layer",
    desc: "REST v3 client for repos, branches, commits, and pull requests. Typed responses.",
    tag: "github",
  },
];

function Architecture() {
  return (
    <section
      id="architecture"
      className="rig rig-dark py-24 sm:py-32"
      style={{ background: C.surface, color: C.onSurface }}
    >
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        {/* Header */}
        <div className="grid gap-12 lg:grid-cols-[200px_1fr] mb-16">
          <div>
            <span
              className="text-[11px] font-bold uppercase tracking-[0.08em]"
              style={{ fontFamily: "var(--font-rig-mono)", color: C.tertiary }}
            >
              [04] ARCHITECTURE
            </span>
          </div>
          <div>
            <h2
              className="rig-headline"
              style={{
                fontSize: "clamp(36px, 6vw, 64px)",
                lineHeight: "0.98",
                color: C.onSurface,
              }}
            >
              CLEAN LAYERS,
              <br />
              <span style={{ color: C.tertiary }}>NOT A BLACK BOX.</span>
            </h2>
            <p
              className="mt-6 max-w-lg text-[18px] font-medium leading-[1.6]"
              style={{
                fontFamily: "var(--font-rig-body)",
                color: "rgba(240, 237, 230, 0.6)",
              }}
            >
              Forge is built like a real product, not a notebook. Each layer
              has a single responsibility and a typed contract.
            </p>
          </div>
        </div>

        {/* Grid */}
        <div className="grid gap-px sm:grid-cols-2 lg:grid-cols-3" style={{ background: C.borderSubtleDark }}>
          {LAYERS.map((l) => (
            <div key={l.n} className="p-8" style={{ background: C.surface }}>
              <div className="mb-4 flex items-center justify-between">
                <span
                  className="text-[11px] font-bold"
                  style={{ fontFamily: "var(--font-rig-mono)", color: C.tertiary }}
                >
                  {l.n}
                </span>
                <span
                  className="text-[10px] font-bold uppercase tracking-[0.06em] px-2 py-1"
                  style={{
                    fontFamily: "var(--font-rig-mono)",
                    color: C.onSurface,
                    border: `1px solid ${C.borderSubtleDark}`,
                  }}
                >
                  {l.tag}
                </span>
              </div>
              <h3
                className="text-[20px] font-bold tracking-tight mb-2"
                style={{
                  fontFamily: "var(--font-rig-headline)",
                  color: C.onSurface,
                  letterSpacing: "-0.02em",
                }}
              >
                {l.name}
              </h3>
              <p
                className="text-[14px] font-medium leading-[1.6]"
                style={{
                  fontFamily: "var(--font-rig-body)",
                  color: "rgba(240, 237, 230, 0.5)",
                }}
              >
                {l.desc}
              </p>
            </div>
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
    <section
      id="code"
      className="rig py-24 sm:py-32"
      style={{ background: C.secondary, color: C.primary }}
    >
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        {/* Header */}
        <div className="grid gap-12 lg:grid-cols-[200px_1fr] mb-16">
          <div>
            <span
              className="text-[11px] font-bold uppercase tracking-[0.08em]"
              style={{
                fontFamily: "var(--font-rig-mono)",
                color: C.tertiary,
                border: `1px solid ${C.tertiary}`,
                padding: "6px 10px",
                display: "inline-block",
              }}
            >
              [05] UNDER THE HOOD
            </span>
          </div>
          <div>
            <h2
              className="rig-headline"
              style={{
                fontSize: "clamp(36px, 6vw, 64px)",
                lineHeight: "0.98",
                color: C.primary,
              }}
            >
              REAL COMMANDS.
              <br />
              <span style={{ color: C.tertiary }}>REAL CODE.</span>
            </h2>
            <p
              className="mt-6 max-w-lg text-[18px] font-semibold leading-[1.5]"
              style={{ fontFamily: "var(--font-rig-body)", color: C.primary }}
            >
              The agent's planner is a typed function with a clean fallback —
              exactly the kind of code you'd want in production.
            </p>
          </div>
        </div>

        {/* Code + commands */}
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Source */}
          <div
            className="overflow-hidden"
            style={{
              background: C.surface,
              border: `1px solid ${C.tertiary}`,
              borderRadius: "6px",
            }}
          >
            <div
              className="flex items-center justify-between px-5 py-3"
              style={{ borderBottom: `1px solid ${C.borderSubtleDark}` }}
            >
              <span
                className="text-[11px] font-bold uppercase tracking-[0.08em]"
                style={{ fontFamily: "var(--font-rig-mono)", color: C.tertiary }}
              >
                SRC/LIB/AGENT/PLANNER.TS
              </span>
            </div>
            <pre
              className="p-5 text-[12px] leading-[1.7] overflow-x-auto"
              style={{
                fontFamily: "var(--font-rig-mono)",
                color: "rgba(240, 237, 230, 0.7)",
              }}
            >
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
          <div className="grid grid-cols-2 gap-px" style={{ background: C.borderSubtle }}>
            {commands.map((c) => (
              <div
                key={c.cmd}
                className="p-5 transition-colors"
                style={{ background: C.secondary }}
              >
                <div
                  className="text-[14px] font-bold mb-1"
                  style={{ fontFamily: "var(--font-rig-mono)", color: C.primary }}
                >
                  <span style={{ color: C.tertiary }}>$</span> {c.cmd}
                </div>
                <div
                  className="text-[12px] font-medium"
                  style={{
                    fontFamily: "var(--font-rig-body)",
                    color: "rgba(10, 10, 10, 0.5)",
                  }}
                >
                  {c.desc}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ===================================================================
   Final CTA — red wash, stark
   =================================================================== */

function FinalCTA() {
  const enterApp = useAppStore((s) => s.enterApp);
  return (
    <section className="rig rig-wash relative overflow-hidden py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-5 sm:px-8 text-center">
        <span
          className="text-[11px] font-bold uppercase tracking-[0.08em] mb-8 inline-block"
          style={{
            fontFamily: "var(--font-rig-mono)",
            color: C.tertiary,
            border: `1px solid ${C.tertiary}`,
            padding: "6px 10px",
          }}
        >
          [06] START
        </span>
        <h2
          className="rig-headline mx-auto max-w-3xl"
          style={{
            fontSize: "clamp(40px, 7vw, 80px)",
            lineHeight: "0.95",
            color: C.primary,
          }}
        >
          SHIP YOUR NEXT PR
          <br />
          WITH AN{" "}
          <span style={{ color: C.tertiary }}>AI PAIR ENGINEER.</span>
        </h2>
        <p
          className="mx-auto mt-8 max-w-xl text-[18px] font-semibold leading-[1.5]"
          style={{ fontFamily: "var(--font-rig-body)", color: C.primary }}
        >
          Launch the app, describe a task, and watch Forge plan, code, test,
          and open a pull request — all in real time.
        </p>
        <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
          <button onClick={() => enterApp("new-task")} className="rig-btn">
            START A TASK
            <ArrowRight className="size-4" />
          </button>
          <button
            onClick={() => enterApp("dashboard")}
            className="rig-btn rig-btn-secondary"
          >
            VIEW DASHBOARD
          </button>
        </div>
      </div>
    </section>
  );
}

/* ===================================================================
   Footer — dark, mono labels
   =================================================================== */

function Footer() {
  const enterApp = useAppStore((s) => s.enterApp);
  return (
    <footer
      className="rig rig-dark pt-20 pb-10"
      style={{ background: C.surface, color: C.onSurface }}
    >
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        {/* Top: logo + big text */}
        <div className="grid gap-12 lg:grid-cols-[1fr_1fr] mb-16 pb-16" style={{ borderBottom: `1px solid ${C.borderSubtleDark}` }}>
          <div>
            <div className="flex items-center gap-2.5 mb-6">
              <div
                className="flex size-8 items-center justify-center"
                style={{ background: C.onSurface }}
              >
                <Bot className="size-5" style={{ color: C.tertiary }} />
              </div>
              <span
                className="text-[20px] font-bold tracking-tight"
                style={{
                  fontFamily: "var(--font-rig-headline)",
                  color: C.onSurface,
                  letterSpacing: "-0.02em",
                }}
              >
                FORGE
              </span>
            </div>
            <p
              className="max-w-sm text-[16px] font-medium leading-[1.6]"
              style={{
                fontFamily: "var(--font-rig-body)",
                color: "rgba(240, 237, 230, 0.5)",
              }}
            >
              An autonomous software engineering agent. Claude-powered,
              GitHub-native, deployable on Vercel.
            </p>
          </div>
          <div className="grid grid-cols-3 gap-8">
            <div>
              <h4
                className="text-[11px] font-bold uppercase tracking-[0.08em] mb-4"
                style={{ fontFamily: "var(--font-rig-mono)", color: C.tertiary }}
              >
                PRODUCT
              </h4>
              <ul className="space-y-3">
                {[
                  { label: "Dashboard", action: () => enterApp("dashboard") },
                  { label: "New task", action: () => enterApp("new-task") },
                  { label: "History", action: () => enterApp("history") },
                  { label: "Settings", action: () => enterApp("settings") },
                ].map((item) => (
                  <li key={item.label}>
                    <button
                      onClick={item.action}
                      className="text-[14px] font-medium transition-colors"
                      style={{
                        fontFamily: "var(--font-rig-body)",
                        color: "rgba(240, 237, 230, 0.6)",
                      }}
                      onMouseEnter={(e) =>
                        (e.currentTarget.style.color = C.onSurface)
                      }
                      onMouseLeave={(e) =>
                        (e.currentTarget.style.color = "rgba(240, 237, 230, 0.6)")
                      }
                    >
                      {item.label}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4
                className="text-[11px] font-bold uppercase tracking-[0.08em] mb-4"
                style={{ fontFamily: "var(--font-rig-mono)", color: C.tertiary }}
              >
                RESOURCES
              </h4>
              <ul className="space-y-3">
                {[
                  { label: "README", href: "https://github.com/KeshavCracks/sitty#readme" },
                  { label: "Architecture", href: "https://github.com/KeshavCracks/sitty/blob/main/docs/ARCHITECTURE.md" },
                  { label: "Deployment", href: "https://github.com/KeshavCracks/sitty/blob/main/docs/DEPLOYMENT.md" },
                  { label: "Vercel", href: "https://vercel.com/new" },
                ].map((item) => (
                  <li key={item.label}>
                    <a
                      href={item.href}
                      target="_blank"
                      rel="noreferrer"
                      className="text-[14px] font-medium transition-colors"
                      style={{
                        fontFamily: "var(--font-rig-body)",
                        color: "rgba(240, 237, 230, 0.6)",
                      }}
                      onMouseEnter={(e) =>
                        (e.currentTarget.style.color = C.onSurface)
                      }
                      onMouseLeave={(e) =>
                        (e.currentTarget.style.color = "rgba(240, 237, 230, 0.6)")
                      }
                    >
                      {item.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4
                className="text-[11px] font-bold uppercase tracking-[0.08em] mb-4"
                style={{ fontFamily: "var(--font-rig-mono)", color: C.tertiary }}
              >
                CONNECT
              </h4>
              <ul className="space-y-3">
                <li>
                  <a
                    href="https://github.com/KeshavCracks/sitty"
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 text-[14px] font-medium transition-colors"
                    style={{
                      fontFamily: "var(--font-rig-body)",
                      color: "rgba(240, 237, 230, 0.6)",
                    }}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.color = C.onSurface)
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.color = "rgba(240, 237, 230, 0.6)")
                    }
                  >
                    <Github className="size-4" />
                    GitHub
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <p
            className="text-[11px] font-bold uppercase tracking-[0.08em]"
            style={{ fontFamily: "var(--font-rig-mono)", color: "rgba(240, 237, 230, 0.3)" }}
          >
            © {new Date().getFullYear()} FORGE / BUILT BY KESHAVCRACKS
          </p>
          <p
            className="text-[11px] font-bold uppercase tracking-[0.08em] flex items-center gap-1.5"
            style={{ fontFamily: "var(--font-rig-mono)", color: "rgba(240, 237, 230, 0.3)" }}
          >
            <GitBranch className="size-3" />
            INSPIRED BY OPENHANDS &amp; DEVIN
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
    <div className="rig min-h-screen" style={{ background: C.secondary }}>
      <StatusBar />
      <Navbar />
      <main>
        <Hero />
        <Marquee />
        <Manifesto />
        <Features />
        <Workflow />
        <Architecture />
        <CodeShowcase />
        <FinalCTA />
      </main>
      <Footer />
    </div>
  );
}

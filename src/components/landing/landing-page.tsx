"use client";

/**
 * Forge — Landing Page
 *
 * Editorial, Mainframe-inspired design language:
 *   - Full-screen background video scrubbed by horizontal mouse movement
 *   - Helvetica Now Display typography (heading + body)
 *   - Blurred intro label → typewriter hero → action pill buttons
 *   - Monochrome, generous whitespace, large editorial type
 *
 * All substantive sections retained and restyled:
 *   Hero → Manifesto → Features → Architecture → Workflow →
 *   Terminal & Code → Final CTA → Footer
 */

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAppStore } from "@/store/app-store";

const VIDEO_URL =
  "https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260530_042513_df96a13b-6155-4f6e-8b93-c9dee66fba08.mp4";
const SENSITIVITY = 0.8;

/* ═══════════════════════════════════════════════════════════════
   Hooks
   ═══════════════════════════════════════════════════════════════ */

function useTypewriter(text: string, speed = 38, startDelay = 600) {
  const [displayed, setDisplayed] = React.useState("");
  const [done, setDone] = React.useState(false);

  React.useEffect(() => {
    let timeoutId: ReturnType<typeof setTimeout>;
    let intervalId: ReturnType<typeof setInterval>;
    let index = 0;

    timeoutId = setTimeout(() => {
      intervalId = setInterval(() => {
        index++;
        setDisplayed(text.slice(0, index));
        if (index >= text.length) {
          clearInterval(intervalId);
          setDone(true);
        }
      }, speed);
    }, startDelay);

    return () => {
      clearTimeout(timeoutId);
      clearInterval(intervalId);
    };
  }, [text, speed, startDelay]);

  return { displayed, done };
}

function useVideoScrub(videoRef: React.RefObject<HTMLVideoElement | null>) {
  React.useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    let prevX = 0;
    let targetTime = 0;
    let seeking = false;
    let initialised = false;

    const onMouseMove = (e: MouseEvent) => {
      if (!initialised) {
        prevX = e.clientX;
        initialised = true;
        return;
      }
      const delta = e.clientX - prevX;
      prevX = e.clientX;
      if (!video.duration || isNaN(video.duration)) return;
      targetTime =
        video.currentTime +
        (delta / window.innerWidth) * SENSITIVITY * video.duration;
      targetTime = Math.max(0, Math.min(video.duration, targetTime));
      if (!seeking) {
        seeking = true;
        video.currentTime = targetTime;
      }
    };

    const onSeeked = () => {
      seeking = false;
      if (Math.abs(video.currentTime - targetTime) > 0.05) {
        seeking = true;
        video.currentTime = targetTime;
      }
    };

    window.addEventListener("mousemove", onMouseMove);
    video.addEventListener("seeked", onSeeked);

    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      video.removeEventListener("seeked", onSeeked);
    };
  }, [videoRef]);
}

/* ═══════════════════════════════════════════════════════════════
   Icons
   ═══════════════════════════════════════════════════════════════ */

function CopyIcon({ className }: { className?: string }) {
  return (
    <svg
      width="12"
      height="12"
      viewBox="0 0 12 12"
      fill="none"
      className={className}
      aria-hidden="true"
    >
      <rect
        x="3.5"
        y="3.5"
        width="6.5"
        height="6.5"
        rx="1"
        stroke="currentColor"
        strokeWidth="1.1"
        fill="none"
      />
      <path
        d="M2 8V2.5C2 2.22386 2.22386 2 2.5 2H8"
        stroke="currentColor"
        strokeWidth="1.1"
        fill="none"
        strokeLinecap="round"
      />
    </svg>
  );
}

function ArrowDownIcon({ className }: { className?: string }) {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 14 14"
      fill="none"
      className={className}
      aria-hidden="true"
    >
      <path
        d="M7 2V12M7 12L12 7M7 12L2 7"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/* ═══════════════════════════════════════════════════════════════
   Navbar
   ═══════════════════════════════════════════════════════════════ */

function Navbar() {
  const enterApp = useAppStore((s) => s.enterApp);
  const [menuOpen, setMenuOpen] = React.useState(false);

  const navLinks = (
    <>
      <a href="#features" className="hover:opacity-60 transition-opacity">
        Features
      </a>
      <span className="opacity-30">,</span>
      <a href="#architecture" className="hover:opacity-60 transition-opacity">
        Architecture
      </a>
      <span className="opacity-30">,</span>
      <a href="#workflow" className="hover:opacity-60 transition-opacity">
        Workflow
      </a>
      <span className="opacity-30">,</span>
      <a
        href="https://github.com/KeshavCracks/sitty"
        target="_blank"
        rel="noreferrer"
        className="hover:opacity-60 transition-opacity"
      >
        GitHub
      </a>
    </>
  );

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-10 px-5 sm:px-8 py-4 sm:py-5 flex justify-between items-center">
        {/* Logo */}
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="flex items-center gap-3"
        >
          <span
            className="text-[#e8e6e1] text-[21px] sm:text-[26px] tracking-tight"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            Forge&reg;
          </span>
          <span
            className="text-[#e8e6e1] text-[25px] sm:text-[30px] select-none"
            style={{ letterSpacing: "-0.02em" }}
          >
            ✳
          </span>
        </button>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-2 text-[23px] text-[#e8e6e1]">
          {navLinks}
        </div>

        {/* Desktop CTA */}
        <button
          onClick={() => enterApp("dashboard")}
          className="hidden md:block text-[#e8e6e1] text-[23px] underline underline-offset-2 hover:opacity-60 transition-opacity"
        >
          Launch App
        </button>

        {/* Mobile hamburger */}
        <button
          className="md:hidden flex flex-col justify-center gap-[5px] z-20"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          <span
            className="w-6 h-[2px] bg-[#e8e6e1] transition-all duration-300"
            style={{
              transform: menuOpen
                ? "rotate(45deg) translateY(7px)"
                : "rotate(0deg) translateY(0)",
            }}
          />
          <span
            className="w-6 h-[2px] bg-[#e8e6e1] transition-all duration-300"
            style={{ opacity: menuOpen ? 0 : 1 }}
          />
          <span
            className="w-6 h-[2px] bg-[#e8e6e1] transition-all duration-300"
            style={{
              transform: menuOpen
                ? "rotate(-45deg) translateY(-7px)"
                : "rotate(0deg) translateY(0)",
            }}
          />
        </button>
      </nav>

      {/* Mobile overlay */}
      <div
        className="fixed inset-0 z-[9] bg-background/95 backdrop-blur-sm flex flex-col justify-center px-8 gap-8 md:hidden transition-opacity duration-300"
        style={{
          opacity: menuOpen ? 1 : 0,
          pointerEvents: menuOpen ? "auto" : "none",
        }}
      >
        <a
          href="#features"
          onClick={() => setMenuOpen(false)}
          className="text-[32px] font-medium text-foreground"
        >
          Features
        </a>
        <a
          href="#architecture"
          onClick={() => setMenuOpen(false)}
          className="text-[32px] font-medium text-foreground"
        >
          Architecture
        </a>
        <a
          href="#workflow"
          onClick={() => setMenuOpen(false)}
          className="text-[32px] font-medium text-foreground"
        >
          Workflow
        </a>
        <a
          href="https://github.com/KeshavCracks/sitty"
          target="_blank"
          rel="noreferrer"
          onClick={() => setMenuOpen(false)}
          className="text-[32px] font-medium text-foreground"
        >
          GitHub
        </a>
        <button
          onClick={() => {
            setMenuOpen(false);
            enterApp("dashboard");
          }}
          className="text-[32px] font-medium text-foreground underline underline-offset-2 text-left"
        >
          Launch App
        </button>
      </div>
    </>
  );
}

/* ═══════════════════════════════════════════════════════════════
   Hero — video scrub + typewriter + pills
   ═══════════════════════════════════════════════════════════════ */

function Hero() {
  const enterApp = useAppStore((s) => s.enterApp);
  const videoRef = React.useRef<HTMLVideoElement>(null);
  useVideoScrub(videoRef);

  const typewriterText =
    "Glad you stopped in. Describe a task, watch it plan, code, test, and ship. Now, what are we building?";
  const { displayed, done } = useTypewriter(typewriterText);

  const [pillsVisible, setPillsVisible] = React.useState(false);
  const [copied, setCopied] = React.useState(false);

  React.useEffect(() => {
    const t = setTimeout(() => setPillsVisible(true), 400);
    return () => clearTimeout(t);
  }, []);

  const copyEmail = () => {
    navigator.clipboard.writeText("hello@forge.dev").catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const pillBase =
    "inline-flex items-center justify-center rounded-full text-[13px] sm:text-[15px] px-4 sm:px-5 py-[0.3em] mx-[0.2em] mb-[0.4em] whitespace-nowrap transition-colors duration-200 cursor-pointer";

  return (
    <section className="relative h-screen flex flex-col justify-end md:justify-center pb-12 md:pb-0 px-5 sm:px-8 md:px-10 overflow-hidden">
      {/* Background video */}
      <video
        ref={videoRef}
        src={VIDEO_URL}
        muted
        playsInline
        preload="auto"
        className="fixed inset-0 z-0 w-full h-full object-cover"
        style={{ objectPosition: "70% center" }}
      />

      {/* Dark overlay for text readability */}
      <div
        className="fixed inset-0 z-[1] pointer-events-none"
        style={{
          background:
            "linear-gradient(to top, rgba(10,10,12,0.85) 0%, rgba(10,10,12,0.45) 50%, rgba(10,10,12,0.35) 100%)",
        }}
      />

      {/* Content */}
      <div className="relative z-10 max-w-xl">
        {/* Blurred intro */}
        <div
          className="pointer-events-none select-none mb-5 sm:mb-6"
          style={{
            fontSize: "clamp(18px, 4vw, 26px)",
            lineHeight: 1.3,
            fontWeight: 400,
            color: "#e8e6e1",
            filter: "blur(4px)",
          }}
        >
          Hey there, meet Forge,
          <br />
          your autonomous software engineering agent
        </div>

        {/* Typewriter */}
        <p
          className="mb-5 sm:mb-6"
          style={{
            fontSize: "clamp(18px, 4vw, 26px)",
            lineHeight: 1.35,
            fontWeight: 400,
            color: "#e8e6e1",
            minHeight: "54px",
          }}
        >
          {displayed}
          {!done && (
            <span className="animate-blink inline-block w-[2px] h-[1.1em] bg-[#e8e6e1] align-middle ml-[2px]" />
          )}
        </p>

        {/* Action pills */}
        <div
          className="flex flex-wrap gap-y-1"
          style={{
            opacity: pillsVisible ? 1 : 0,
            transform: pillsVisible ? "translateY(0)" : "translateY(8px)",
            transition:
              "opacity 0.4s ease, transform 0.4s ease",
          }}
        >
          <button
            className={`${pillBase} bg-[#e8e6e1] text-black border border-white/10 hover:bg-black hover:text-[#e8e6e1]`}
            onClick={() => enterApp("new-task")}
          >
            Pitch us a task
          </button>
          <button
            className={`${pillBase} bg-[#e8e6e1] text-black border border-white/10 hover:bg-black hover:text-[#e8e6e1]`}
            onClick={() => enterApp("dashboard")}
          >
            See the dashboard
          </button>
          <a
            href="#features"
            className={`${pillBase} bg-[#e8e6e1] text-black border border-white/10 hover:bg-black hover:text-[#e8e6e1] no-underline`}
          >
            Read the brief
          </a>
          <a
            href="#workflow"
            className={`${pillBase} bg-[#e8e6e1] text-black border border-white/10 hover:bg-black hover:text-[#e8e6e1] no-underline`}
          >
            See how we operate
          </a>
          <button
            className={`${pillBase} text-[#e8e6e1] bg-transparent border border-[#e8e6e1] hover:bg-[#e8e6e1] hover:text-black gap-2 sm:gap-3`}
            onClick={copyEmail}
          >
            Reach us:{" "}
            <span className="underline underline-offset-1">
              {copied ? "copied!" : "hello@forge.dev"}
            </span>
            <CopyIcon />
          </button>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10 hidden md:flex flex-col items-center gap-2 text-[#e8e6e1]/40">
        <span className="text-[11px] uppercase tracking-[0.2em]">Scroll</span>
        <ArrowDownIcon className="animate-bounce" />
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════════
   Manifesto — large editorial intro
   ═══════════════════════════════════════════════════════════════ */

function Manifesto() {
  return (
    <section className="relative py-32 md:py-48 px-5 sm:px-8 md:px-10 border-t border-white/10">
      <div className="max-w-5xl">
        <p className="text-[11px] uppercase tracking-[0.25em] text-muted-foreground mb-8">
          (01) — What is this
        </p>
        <h2
          className="text-[clamp(32px,6vw,68px)] leading-[1.08] tracking-tight text-foreground"
          style={{ fontFamily: "var(--font-heading)" }}
        >
          An autonomous software
          <br />
          engineering agent that{" "}
          <span className="text-muted-foreground">plans,</span>{" "}
          <span className="text-muted-foreground">codes,</span>{" "}
          <span className="text-muted-foreground">tests,</span> and{" "}
          <span className="text-muted-foreground">ships</span> — all
          observable in real time.
        </h2>
        <div className="mt-12 max-w-2xl space-y-4 text-[17px] leading-relaxed text-muted-foreground">
          <p>
            Most AI coding demos either run in a notebook with hardcoded
            prompts, or they need a Kubernetes cluster before they'll say
            hello. Forge is the middle path: a production-quality Next.js
            app that demonstrates the full Devin-style workflow — task
            intake, planning, step-by-step execution with live terminal
            output, file diffs, and a pull request.
          </p>
          <p>
            It's honest about what can and cannot run on Vercel's free
            tier. The result is a project equally useful as a portfolio
            piece, an architecture reference, and a starting point for
            your own autonomous agent.
          </p>
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════════
   Features
   ═══════════════════════════════════════════════════════════════ */

const FEATURES = [
  {
    n: "I",
    title: "Agentic planning",
    body: "Every task is decomposed into an ordered, observable plan. The agent reasons about each step before touching a file — so you always know what it's about to do and why. Assumptions and risks are surfaced upfront, never hidden inside a black box.",
  },
  {
    n: "II",
    title: "Code generation & editing",
    body: "Reads, writes, and edits files with surgical search-and-replace. Real diffs stream into the UI as they happen — no opaque magic edits. You see every addition, every deletion, every context line, exactly as a reviewer would.",
  },
  {
    n: "III",
    title: "Live terminal & logs",
    body: "Watch every shell command, test run, and git operation stream in real time. Filterable log levels, syntax-highlighted output, no surprises. The terminal panel auto-scrolls so you're always looking at the latest line the agent produced.",
  },
  {
    n: "IV",
    title: "GitHub-native workflow",
    body: "Connects to your repositories, creates feature branches, commits with conventional messages, and opens pull requests with full context for reviewers. The GitHub client is a typed REST v3 wrapper — every call returns a shape the UI can trust.",
  },
  {
    n: "V",
    title: "Claude-first, pluggable models",
    body: "Anthropic Claude is the primary reasoning engine, with extended thinking support for Sonnet and Opus. A clean provider abstraction means you can swap in any LLM — including a sandbox-friendly Z.ai default that works without a user-provided key.",
  },
  {
    n: "VI",
    title: "Cloud-safe by design",
    body: "Mutating tools are simulated on Vercel's read-only runtime and executed for real in a local worker. The same UI works in both modes — no broken demos, no if-statements scattered through components. The runtime abstraction handles it.",
  },
];

function Features() {
  return (
    <section
      id="features"
      className="relative py-32 md:py-48 px-5 sm:px-8 md:px-10 border-t border-white/10"
    >
      <div className="max-w-6xl">
        <p className="text-[11px] uppercase tracking-[0.25em] text-muted-foreground mb-8">
          (02) — Capabilities
        </p>
        <h2
          className="text-[clamp(28px,5vw,52px)] leading-[1.1] tracking-tight text-foreground mb-20 max-w-3xl"
          style={{ fontFamily: "var(--font-heading)" }}
        >
          Everything an autonomous engineer needs, nothing it doesn't.
        </h2>

        <div className="divide-y divide-white/10">
          {FEATURES.map((f) => (
            <div
              key={f.n}
              className="grid grid-cols-1 md:grid-cols-[60px_1fr_1.5fr] gap-2 md:gap-8 py-10 group"
            >
              <span
                className="text-[15px] text-muted-foreground/60"
                style={{ fontFamily: "var(--font-heading)" }}
              >
                {f.n}
              </span>
              <h3
                className="text-[22px] md:text-[26px] tracking-tight text-foreground leading-tight"
                style={{ fontFamily: "var(--font-heading)" }}
              >
                {f.title}
              </h3>
              <p className="text-[16px] leading-relaxed text-muted-foreground">
                {f.body}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════════
   Architecture
   ═══════════════════════════════════════════════════════════════ */

const LAYERS = [
  {
    n: "01",
    name: "Orchestrator",
    desc: "Holds the task state machine. Sequences planner → executor → reviewer. Tracks progress, handles cancellation, emits structured logs at every transition.",
    tag: "agent",
  },
  {
    n: "02",
    name: "Planner",
    desc: "Asks the LLM to decompose the task into ordered, typed steps with explicit tool bindings. Falls back to scenario-based planning on any error so the demo always works.",
    tag: "llm",
  },
  {
    n: "03",
    name: "Executor",
    desc: "Walks the plan one step at a time. Invokes tools, streams terminal output, captures file diffs, updates progress. Checks a cancel flag between steps.",
    tag: "agent",
  },
  {
    n: "04",
    name: "Runtime",
    desc: "Abstracts where tools actually execute — local worker, cloud serverless, or demo mode. The UI never branches on runtime; it asks for a result and renders it.",
    tag: "runtime",
  },
  {
    n: "05",
    name: "Tools",
    desc: "Twelve typed tool definitions: read_file, write_file, edit_file, list_directory, run_command, search_code, git_commit, git_push, open_pr, run_tests, http_request, llm_reason.",
    tag: "agent",
  },
  {
    n: "06",
    name: "GitHub layer",
    desc: "REST v3 client for repos, branches, commits, and pull requests. Typed responses, graceful degradation when no token is configured, no raw API leaks.",
    tag: "github",
  },
];

function Architecture() {
  return (
    <section
      id="architecture"
      className="relative py-32 md:py-48 px-5 sm:px-8 md:px-10 border-t border-white/10"
    >
      <div className="max-w-6xl">
        <p className="text-[11px] uppercase tracking-[0.25em] text-muted-foreground mb-8">
          (03) — Architecture
        </p>
        <h2
          className="text-[clamp(28px,5vw,52px)] leading-[1.1] tracking-tight text-foreground mb-20 max-w-3xl"
          style={{ fontFamily: "var(--font-heading)" }}
        >
          Clean layers, not a black box.
        </h2>

        <div className="divide-y divide-white/10">
          {LAYERS.map((l) => (
            <div
              key={l.n}
              className="grid grid-cols-1 md:grid-cols-[80px_1fr_1.5fr_auto] gap-2 md:gap-8 py-8 items-start"
            >
              <span
                className="text-[15px] text-muted-foreground/50 font-mono"
              >
                {l.n}
              </span>
              <h3
                className="text-[20px] md:text-[24px] tracking-tight text-foreground"
                style={{ fontFamily: "var(--font-heading)" }}
              >
                {l.name}
              </h3>
              <p className="text-[15px] leading-relaxed text-muted-foreground">
                {l.desc}
              </p>
              <span className="text-[10px] uppercase tracking-[0.15em] text-muted-foreground/50 border border-white/10 rounded px-2 py-1 font-mono whitespace-nowrap">
                {l.tag}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════════
   Workflow
   ═══════════════════════════════════════════════════════════════ */

const STEPS = [
  {
    n: "01",
    title: "Describe the task",
    body: "Tell Forge what you want in plain English. Pick a repository, a branch, and a model. The orchestrator takes it from there. No prompt engineering required — just describe the outcome you want and any constraints that matter.",
  },
  {
    n: "02",
    title: "Watch the plan form",
    body: "The planner decomposes your task into five to nine ordered steps with explicit tool calls. You see assumptions and risks before any code is written. Cancel here if the plan looks wrong — no harm done.",
  },
  {
    n: "03",
    title: "Follow execution live",
    body: "Terminal output, file diffs, and a step timeline stream in real time. Filterable log levels, syntax-highlighted diffs, auto-scrolling terminal. Cancel anytime — every action is logged for audit.",
  },
  {
    n: "04",
    title: "Review the pull request",
    body: "Forge commits with conventional messages and opens a pull request with a full summary, root-cause analysis, and testing steps. You review, merge, ship. The PR is the unit of review — always.",
  },
];

function Workflow() {
  return (
    <section
      id="workflow"
      className="relative py-32 md:py-48 px-5 sm:px-8 md:px-10 border-t border-white/10"
    >
      <div className="max-w-6xl">
        <p className="text-[11px] uppercase tracking-[0.25em] text-muted-foreground mb-8">
          (04) — Workflow
        </p>
        <h2
          className="text-[clamp(28px,5vw,52px)] leading-[1.1] tracking-tight text-foreground mb-20 max-w-3xl"
          style={{ fontFamily: "var(--font-heading)" }}
        >
          From prompt to pull request.
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-16 gap-y-16">
          {STEPS.map((s) => (
            <div key={s.n}>
              <div className="flex items-baseline gap-4 mb-4">
                <span
                  className="text-[15px] text-muted-foreground/50 font-mono"
                >
                  {s.n}
                </span>
                <div className="h-px flex-1 bg-white/10" />
              </div>
              <h3
                className="text-[26px] md:text-[32px] tracking-tight text-foreground mb-4"
                style={{ fontFamily: "var(--font-heading)" }}
              >
                {s.title}
              </h3>
              <p className="text-[16px] leading-relaxed text-muted-foreground">
                {s.body}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════════
   Terminal & Code — commands + planner source
   ═══════════════════════════════════════════════════════════════ */

function TerminalCode() {
  return (
    <section className="relative py-32 md:py-48 px-5 sm:px-8 md:px-10 border-t border-white/10">
      <div className="max-w-6xl">
        <p className="text-[11px] uppercase tracking-[0.25em] text-muted-foreground mb-8">
          (05) — Under the hood
        </p>
        <h2
          className="text-[clamp(28px,5vw,52px)] leading-[1.1] tracking-tight text-foreground mb-20 max-w-3xl"
          style={{ fontFamily: "var(--font-heading)" }}
        >
          Real commands. Real code. No magic.
        </h2>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Terminal output */}
          <div className="border border-white/10 rounded-lg overflow-hidden">
            <div className="flex items-center gap-2 px-4 py-3 border-b border-white/10 bg-white/[0.02]">
              <span className="w-3 h-3 rounded-full bg-white/15" />
              <span className="w-3 h-3 rounded-full bg-white/15" />
              <span className="w-3 h-3 rounded-full bg-white/15" />
              <span className="ml-2 text-[12px] text-muted-foreground font-mono">
                forge — agent session
              </span>
            </div>
            <div
              className="p-5 text-[13px] leading-[1.7] font-mono space-y-1"
              style={{ background: "rgba(0,0,0,0.4)" }}
            >
              <div className="text-muted-foreground">
                $ forge read src/lib/auth/session.ts
              </div>
              <div className="text-muted-foreground">→ 50 lines read</div>
              <div className="text-amber-400">
                ⚠ line 38: maxAge ignores `persistent` flag
              </div>
              <div className="text-muted-foreground mt-2">
                $ forge edit src/app/api/auth/login/route.ts
              </div>
              <div className="text-emerald-400">
                + await setSession(user.id, remember)
              </div>
              <div className="text-red-400">
                - await setSession(user.id, false)
              </div>
              <div className="text-muted-foreground mt-2">
                $ forge exec bun run test
              </div>
              <div className="text-emerald-400">✓ 2 passed (2)</div>
              <div className="text-muted-foreground mt-2">
                $ forge gh pr create --base main
              </div>
              <div className="text-emerald-400">✓ PR #143 opened</div>
              <div className="text-muted-foreground">
                https://github.com/acme/webapp/pull/143
                <span className="animate-blink inline-block w-[2px] h-[1.1em] bg-emerald-400 align-middle ml-[2px]" />
              </div>
            </div>
          </div>

          {/* Planner source code */}
          <div className="border border-white/10 rounded-lg overflow-hidden">
            <div className="flex items-center gap-2 px-4 py-3 border-b border-white/10 bg-white/[0.02]">
              <span className="text-[12px] text-muted-foreground font-mono">
                src/lib/agent/planner.ts
              </span>
            </div>
            <pre
              className="p-5 text-[12px] leading-[1.7] font-mono overflow-x-auto"
              style={{ background: "rgba(0,0,0,0.4)" }}
            >
              <code>{`// Decompose a task into an ordered, typed plan.
export async function planTask(input: PlannerInput): Promise<PlannerResult> {
  if (input.useLlm) {
    try {
      const provider = getCachedProvider();
      const res = await provider.complete({
        messages: [{ role: "system", content: PLANNER_SYSTEM_PROMPT },
                   { role: "user", content: input.description }],
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
        </div>

        {/* Command reference */}
        <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { cmd: "forge plan", desc: "Generate a plan" },
            { cmd: "forge read", desc: "Read a file" },
            { cmd: "forge edit", desc: "Edit a file" },
            { cmd: "forge exec", desc: "Run a command" },
            { cmd: "forge test", desc: "Run the test suite" },
            { cmd: "forge commit", desc: "Commit changes" },
            { cmd: "forge push", desc: "Push the branch" },
            { cmd: "forge pr", desc: "Open a pull request" },
          ].map((c) => (
            <div
              key={c.cmd}
              className="border border-white/10 rounded-lg p-4 hover:border-white/20 transition-colors"
            >
              <div className="font-mono text-[13px] text-foreground mb-1">
                {c.cmd}
              </div>
              <div className="text-[12px] text-muted-foreground">
                {c.desc}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════════
   Final CTA
   ═══════════════════════════════════════════════════════════════ */

function FinalCTA() {
  const enterApp = useAppStore((s) => s.enterApp);
  const pillBase =
    "inline-flex items-center justify-center rounded-full text-[14px] sm:text-[16px] px-5 sm:px-6 py-[0.4em] mx-[0.2em] mb-[0.4em] whitespace-nowrap transition-colors duration-200 cursor-pointer";

  return (
    <section className="relative py-32 md:py-48 px-5 sm:px-8 md:px-10 border-t border-white/10 text-center">
      <div className="max-w-3xl mx-auto">
        <p className="text-[11px] uppercase tracking-[0.25em] text-muted-foreground mb-8">
          (06) — Start
        </p>
        <h2
          className="text-[clamp(32px,6vw,64px)] leading-[1.08] tracking-tight text-foreground mb-8"
          style={{ fontFamily: "var(--font-heading)" }}
        >
          Ship your next PR with an AI pair engineer.
        </h2>
        <p className="text-[17px] text-muted-foreground mb-12 max-w-xl mx-auto">
          Launch the app, describe a task, and watch Forge plan, code, test,
          and open a pull request — all in real time.
        </p>
        <div className="flex flex-wrap justify-center gap-y-1">
          <button
            className={`${pillBase} bg-[#e8e6e1] text-black border border-white/10 hover:bg-transparent hover:text-[#e8e6e1] hover:border-[#e8e6e1]`}
            onClick={() => enterApp("new-task")}
          >
            Start a task
          </button>
          <button
            className={`${pillBase} bg-transparent text-[#e8e6e1] border border-[#e8e6e1] hover:bg-[#e8e6e1] hover:text-black`}
            onClick={() => enterApp("dashboard")}
          >
            View dashboard
          </button>
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════════
   Footer
   ═══════════════════════════════════════════════════════════════ */

function Footer() {
  const enterApp = useAppStore((s) => s.enterApp);
  return (
    <footer className="relative border-t border-white/10 px-5 sm:px-8 md:px-10 py-16">
      <div className="max-w-6xl">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-16">
          <div className="col-span-2">
            <div className="flex items-center gap-3 mb-4">
              <span
                className="text-[24px] tracking-tight text-foreground"
                style={{ fontFamily: "var(--font-heading)" }}
              >
                Forge&reg;
              </span>
              <span
                className="text-[28px] text-foreground select-none"
                style={{ letterSpacing: "-0.02em" }}
              >
                ✳
              </span>
            </div>
            <p className="text-[15px] text-muted-foreground max-w-xs leading-relaxed">
              An autonomous software engineering agent. Claude-powered,
              GitHub-native, deployable on Vercel.
            </p>
          </div>
          <div>
            <h4
              className="text-[12px] uppercase tracking-[0.15em] text-muted-foreground mb-4"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              Product
            </h4>
            <ul className="space-y-3 text-[15px]">
              <li>
                <button
                  className="text-foreground hover:opacity-60 transition-opacity"
                  onClick={() => enterApp("dashboard")}
                >
                  Dashboard
                </button>
              </li>
              <li>
                <button
                  className="text-foreground hover:opacity-60 transition-opacity"
                  onClick={() => enterApp("new-task")}
                >
                  New task
                </button>
              </li>
              <li>
                <button
                  className="text-foreground hover:opacity-60 transition-opacity"
                  onClick={() => enterApp("history")}
                >
                  History
                </button>
              </li>
              <li>
                <button
                  className="text-foreground hover:opacity-60 transition-opacity"
                  onClick={() => enterApp("settings")}
                >
                  Settings
                </button>
              </li>
            </ul>
          </div>
          <div>
            <h4
              className="text-[12px] uppercase tracking-[0.15em] text-muted-foreground mb-4"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              Resources
            </h4>
            <ul className="space-y-3 text-[15px]">
              <li>
                <a
                  href="https://github.com/KeshavCracks/sitty#readme"
                  target="_blank"
                  rel="noreferrer"
                  className="text-foreground hover:opacity-60 transition-opacity"
                >
                  README
                </a>
              </li>
              <li>
                <a
                  href="https://github.com/KeshavCracks/sitty/blob/main/docs/ARCHITECTURE.md"
                  target="_blank"
                  rel="noreferrer"
                  className="text-foreground hover:opacity-60 transition-opacity"
                >
                  Architecture
                </a>
              </li>
              <li>
                <a
                  href="https://github.com/KeshavCracks/sitty/blob/main/docs/DEPLOYMENT.md"
                  target="_blank"
                  rel="noreferrer"
                  className="text-foreground hover:opacity-60 transition-opacity"
                >
                  Deployment
                </a>
              </li>
              <li>
                <a
                  href="https://vercel.com/new"
                  target="_blank"
                  rel="noreferrer"
                  className="text-foreground hover:opacity-60 transition-opacity"
                >
                  Deploy on Vercel
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pt-8 border-t border-white/10 text-[13px] text-muted-foreground">
          <p>© {new Date().getFullYear()} Forge. Built by KeshavCracks.</p>
          <p className="flex items-center gap-2">
            <span>✳</span>
            Inspired by OpenHands &amp; Devin
          </p>
        </div>
      </div>
    </footer>
  );
}

/* ═══════════════════════════════════════════════════════════════
   Page
   ═══════════════════════════════════════════════════════════════ */

export function LandingPage() {
  return (
    <div className="flex min-h-screen flex-col bg-background" style={{ fontFamily: "var(--font-body)" }}>
      <Navbar />
      <main className="flex-1">
        <Hero />
        <Manifesto />
        <Features />
        <Architecture />
        <Workflow />
        <TerminalCode />
        <FinalCTA />
      </main>
      <Footer />
    </div>
  );
}

/**
 * Forge brand mark + custom icons — rig.ai palette (black + orange).
 */

import * as React from "react";

export function ForgeLogo({
  className,
  size = 28,
}: {
  className?: string;
  size?: number;
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="forge-grad" x1="0" y1="0" x2="32" y2="32">
          <stop offset="0%" stopColor="oklch(0.62 0.22 32)" />
          <stop offset="100%" stopColor="oklch(0.70 0.20 45)" />
        </linearGradient>
      </defs>
      {/* Outer hexagon — the "forge" frame */}
      <path
        d="M16 1.5l12.99 7.5v15L16 31.5 3.01 24V9L16 1.5z"
        stroke="url(#forge-grad)"
        strokeWidth="1.5"
        fill="oklch(0.07 0 0 / 0.6)"
      />
      {/* Inner spark — the agent core */}
      <path
        d="M16 8.5l5.5 3.18v6.36L16 21.22l-5.5-3.18v-6.36L16 8.5z"
        fill="url(#forge-grad)"
        opacity="0.9"
      />
      <circle cx="16" cy="16" r="2.2" fill="oklch(0.04 0 0)" />
    </svg>
  );
}

export function ForgeWordmark({ className }: { className?: string }) {
  return (
    <span
      className={`inline-flex items-center gap-2 ${className ?? ""}`}
      style={{ fontFamily: "var(--font-rig-headline), sans-serif" }}
    >
      <ForgeLogo size={26} />
      <span className="text-lg font-bold tracking-tight">
        Forge
        <span
          className="ml-1.5 text-[10px] font-bold uppercase tracking-[0.08em] text-primary"
          style={{ fontFamily: "var(--font-rig-mono), monospace" }}
        >
          AI/SE
        </span>
      </span>
    </span>
  );
}

/** Animated terminal cursor */
export function TerminalCursor({ className }: { className?: string }) {
  return (
    <span
      className={`terminal-cursor inline-block ${className ?? ""}`}
      aria-hidden="true"
    />
  );
}

/** A small spinning gear used for "executing" indicators */
export function SpinnerGear({ className }: { className?: string }) {
  return (
    <svg
      className={`animate-spin ${className ?? ""}`}
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <circle
        cx="12"
        cy="12"
        r="9"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeOpacity="0.2"
      />
      <path
        d="M21 12a9 9 0 0 0-9-9"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
    </svg>
  );
}


"use client";

/**
 * Forge — AI Software Engineer
 * Single user-visible route. Switches between the marketing landing
 * page and the in-app experience based on the app store's `view`.
 */

import * as React from "react";
import { LandingPage } from "@/components/landing/landing-page";
import { AppShell } from "@/components/app/app-shell";
import { useAppStore } from "@/store/app-store";

export default function Home() {
  const view = useAppStore((s) => s.view);

  // Landing is its own full-page experience (no app chrome).
  if (view === "landing") {
    return <LandingPage />;
  }

  return <AppShell />;
}

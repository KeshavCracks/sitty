"use client";

/**
 * Settings view — model + provider, runtime mode, API key status,
 * planner toggle, theme.
 */

import * as React from "react";
import {
  Bot,
  CheckCircle2,
  Cpu,
  Github,
  Key,
  Moon,
  Palette,
  ShieldCheck,
  Sun,
  Terminal,
  Wand2,
} from "lucide-react";
import { useTheme } from "next-themes";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useSettingsStore } from "@/store/settings-store";
import { ALL_MODELS, CLAUDE_MODELS, ZAI_MODELS } from "@/lib/llm/types";
import type { LLMProviderId, RuntimeMode } from "@/types";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

const RUNTIME_OPTIONS: {
  value: RuntimeMode;
  label: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
}[] = [
  {
    value: "demo",
    label: "Demo",
    description:
      "Fully simulated. No network, no filesystem. Perfect for exploring the UX.",
    icon: Bot,
  },
  {
    value: "cloud",
    label: "Cloud (Vercel)",
    description:
      "Serverless. Read-only tools run live; mutating tools are simulated.",
    icon: Cpu,
  },
  {
    value: "local",
    label: "Local worker",
    description:
      "Real execution against a local working tree. Requires the worker process.",
    icon: Terminal,
  },
];

export function SettingsView() {
  const {
    provider,
    setProvider,
    model,
    setModel,
    runtimeMode,
    setRuntimeMode,
    useLlmPlanner,
    setUseLlmPlanner,
    githubConnected,
    githubUsername,
  } = useSettingsStore();
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);
  React.useEffect(() => setMounted(true), []);

  // Detect server-side provider availability
  const [serverInfo, setServerInfo] = React.useState<{
    claude: boolean;
    github: boolean;
    activeProvider: LLMProviderId;
    runtime: RuntimeMode;
  } | null>(null);
  React.useEffect(() => {
    fetch("/api/health")
      .then((r) => r.json())
      .then(setServerInfo)
      .catch(() => undefined);
  }, []);

  const modelsForProvider =
    provider === "claude" ? CLAUDE_MODELS : ZAI_MODELS;

  return (
    <div className="mx-auto max-w-3xl space-y-6 p-4 sm:p-6 lg:p-8">
      <div>
        <h2 className="text-2xl font-semibold tracking-tight">Settings</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Configure the agent's model, runtime, and integrations.
        </p>
      </div>

      {/* Model + provider */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-sm">
            <Bot className="size-4" />
            Model &amp; provider
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Provider</Label>
            <div className="grid gap-2 sm:grid-cols-2">
              <ProviderOption
                id="claude"
                label="Anthropic Claude"
                description="Primary. Requires ANTHROPIC_API_KEY."
                available={serverInfo?.claude ?? false}
                active={provider === "claude"}
                onSelect={() => {
                  setProvider("claude");
                  if (!CLAUDE_MODELS.find((m) => m.id === model)) {
                    setModel(CLAUDE_MODELS[0].id);
                  }
                }}
              />
              <ProviderOption
                id="zai"
                label="Z.ai (GLM)"
                description="Sandbox-friendly default. Always available."
                available
                active={provider === "zai"}
                onSelect={() => {
                  setProvider("zai");
                  if (!ZAI_MODELS.find((m) => m.id === model)) {
                    setModel(ZAI_MODELS[0].id);
                  }
                }}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Model</Label>
            <Select value={model} onValueChange={setModel}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {modelsForProvider.map((m) => (
                  <SelectItem key={m.id} value={m.id}>
                    <div className="flex flex-col gap-0.5">
                      <span>{m.label}</span>
                      <span className="text-[10px] text-muted-foreground">
                        {m.id} · {(m.contextWindow / 1000).toFixed(0)}k ctx
                        {m.reasoning ? " · reasoning" : ""}
                      </span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Separator />

          <div className="flex items-center justify-between">
            <div className="flex items-start gap-3">
              <div className="flex size-8 items-center justify-center rounded-md bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                <Wand2 className="size-4" />
              </div>
              <div>
                <Label className="text-sm">LLM planner</Label>
                <p className="mt-0.5 text-xs text-muted-foreground">
                  When ON, the server calls the LLM to generate the plan.
                  When OFF, a scenario-based plan is used (always works, no
                  network required).
                </p>
              </div>
            </div>
            <Switch
              checked={useLlmPlanner}
              onCheckedChange={setUseLlmPlanner}
            />
          </div>
        </CardContent>
      </Card>

      {/* Runtime mode */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-sm">
            <Cpu className="size-4" />
            Runtime
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {RUNTIME_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              onClick={() => {
                setRuntimeMode(opt.value);
                toast.info(`Runtime set to ${opt.label}`);
              }}
              className={cn(
                "flex w-full items-start gap-3 rounded-lg border p-3 text-left transition-colors",
                runtimeMode === opt.value
                  ? "border-emerald-500/40 bg-emerald-500/5"
                  : "border-border/60 hover:bg-muted/30"
              )}
            >
              <div
                className={cn(
                  "flex size-8 shrink-0 items-center justify-center rounded-md",
                  runtimeMode === opt.value
                    ? "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400"
                    : "bg-muted/40 text-muted-foreground"
                )}
              >
                <opt.icon className="size-4" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">{opt.label}</span>
                  {runtimeMode === opt.value && (
                    <CheckCircle2 className="size-3.5 text-emerald-500" />
                  )}
                  {serverInfo?.runtime === opt.value && (
                    <Badge
                      variant="outline"
                      className="h-4 px-1 text-[9px] text-muted-foreground"
                    >
                      detected
                    </Badge>
                  )}
                </div>
                <p className="mt-0.5 text-xs text-muted-foreground">
                  {opt.description}
                </p>
              </div>
            </button>
          ))}
        </CardContent>
      </Card>

      {/* Integrations */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-sm">
            <Key className="size-4" />
            Integrations
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <IntegrationRow
            icon={Key}
            label="Anthropic API key"
            status={
              serverInfo?.claude
                ? "configured"
                : "not-configured"
            }
            hint="Set ANTHROPIC_API_KEY in your environment"
          />
          <IntegrationRow
            icon={Github}
            label="GitHub token"
            status={
              serverInfo?.github || githubConnected
                ? "configured"
                : "not-configured"
            }
            hint="Set GITHUB_TOKEN with repo scope"
          />
        </CardContent>
      </Card>

      {/* Appearance */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-sm">
            <Palette className="size-4" />
            Appearance
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div className="flex items-start gap-3">
              <div className="flex size-8 items-center justify-center rounded-md bg-muted/40">
                {mounted && theme === "dark" ? (
                  <Moon className="size-4" />
                ) : (
                  <Sun className="size-4" />
                )}
              </div>
              <div>
                <Label className="text-sm">Theme</Label>
                <p className="mt-0.5 text-xs text-muted-foreground">
                  Forge defaults to dark mode for long coding sessions.
                </p>
              </div>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              disabled={!mounted}
            >
              {mounted && theme === "dark" ? (
                <>
                  <Sun className="mr-1.5 size-3.5" />
                  Light
                </>
              ) : (
                <>
                  <Moon className="mr-1.5 size-3.5" />
                  Dark
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* About */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-sm">
            <ShieldCheck className="size-4" />
            About
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-xs text-muted-foreground">
          <div className="flex justify-between">
            <span>Version</span>
            <span className="font-mono">1.0.0</span>
          </div>
          <div className="flex justify-between">
            <span>Server provider</span>
            <span className="font-mono">{serverInfo?.activeProvider ?? "—"}</span>
          </div>
          <div className="flex justify-between">
            <span>Server runtime</span>
            <span className="font-mono">{serverInfo?.runtime ?? "—"}</span>
          </div>
          <div className="flex justify-between">
            <span>GitHub user</span>
            <span className="font-mono">
              {githubConnected ? githubUsername : "—"}
            </span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function ProviderOption({
  label,
  description,
  available,
  active,
  onSelect,
}: {
  id: LLMProviderId;
  label: string;
  description: string;
  available: boolean;
  active: boolean;
  onSelect: () => void;
}) {
  return (
    <button
      onClick={onSelect}
      disabled={!available}
      className={cn(
        "flex flex-col items-start gap-1 rounded-lg border p-3 text-left transition-colors",
        active
          ? "border-emerald-500/40 bg-emerald-500/5"
          : "border-border/60 hover:bg-muted/30",
        !available && "cursor-not-allowed opacity-50"
      )}
    >
      <div className="flex w-full items-center justify-between">
        <span className="text-sm font-medium">{label}</span>
        {available ? (
          <Badge
            variant="outline"
            className="h-4 border-emerald-500/30 bg-emerald-500/10 px-1 text-[9px] text-emerald-600 dark:text-emerald-400"
          >
            ready
          </Badge>
        ) : (
          <Badge variant="outline" className="h-4 px-1 text-[9px]">
            no key
          </Badge>
        )}
      </div>
      <p className="text-xs text-muted-foreground">{description}</p>
    </button>
  );
}

function IntegrationRow({
  icon: Icon,
  label,
  status,
  hint,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  status: "configured" | "not-configured";
  hint: string;
}) {
  return (
    <div className="flex items-center justify-between rounded-md border border-border/60 bg-muted/20 p-3">
      <div className="flex items-center gap-3">
        <div className="flex size-8 items-center justify-center rounded-md bg-muted/40 text-muted-foreground">
          <Icon className="size-4" />
        </div>
        <div>
          <div className="text-sm font-medium">{label}</div>
          <div className="text-xs text-muted-foreground">{hint}</div>
        </div>
      </div>
      {status === "configured" ? (
        <Badge
          variant="outline"
          className="border-emerald-500/30 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
        >
          <CheckCircle2 className="mr-1 size-3" />
          Configured
        </Badge>
      ) : (
        <Badge variant="outline" className="text-muted-foreground">
          Not set
        </Badge>
      )}
    </div>
  );
}

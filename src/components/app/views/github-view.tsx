"use client";

/**
 * GitHub integration view — connection status, repo list, branches.
 *
 * Calls /api/github/connection and /api/github/repos on mount. If the
 * server has no GITHUB_TOKEN configured, shows a friendly "connect"
 * state with setup instructions instead of an error.
 */

import * as React from "react";
import {
  AlertCircle,
  GitBranch,
  CheckCircle2,
  ExternalLink,
  GitFork,
  Github,
  Key,
  Loader2,
  RefreshCw,
  Star,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { useSettingsStore } from "@/store/settings-store";
import { toast } from "sonner";
import type { GitHubConnection, GitHubRepository } from "@/types";

export function GitHubView() {
  const [connection, setConnection] = React.useState<GitHubConnection | null>(null);
  const [repos, setRepos] = React.useState<GitHubRepository[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [reposLoading, setReposLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const setGithub = useSettingsStore((s) => s.setGithub);

  const refresh = React.useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/github/connection");
      const data = (await res.json()) as GitHubConnection & { error?: string };
      setConnection(data);
      setGithub(data.connected, data.username);
      if (data.connected) {
        setReposLoading(true);
        try {
          const repoRes = await fetch("/api/github/repos?perPage=30");
          const repoData = (await repoRes.json()) as {
            repos?: GitHubRepository[];
            error?: string;
          };
          setRepos(repoData.repos ?? []);
          if (repoData.error) {
            setError(repoData.error);
          }
        } finally {
          setReposLoading(false);
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load GitHub status");
    } finally {
      setLoading(false);
    }
  }, [setGithub]);

  React.useEffect(() => {
    void refresh();
  }, [refresh]);

  return (
    <div className="space-y-6 p-4 sm:p-6 lg:p-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight">GitHub</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Connect a personal access token to enable repository browsing,
            branch creation, and pull request automation.
          </p>
        </div>
        <Button variant="outline" size="sm" onClick={refresh} disabled={loading}>
          <RefreshCw className={`mr-1.5 size-3.5 ${loading ? "animate-spin" : ""}`} />
          Refresh
        </Button>
      </div>

      {/* Connection card */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Connection</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center gap-3">
              <Skeleton className="size-10 rounded-full" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-3 w-48" />
              </div>
            </div>
          ) : connection?.connected ? (
            <div className="flex items-center gap-4">
              {connection.avatarUrl && (
                <img
                  src={connection.avatarUrl}
                  alt={connection.username ?? "GitHub avatar"}
                  className="size-12 rounded-full border border-border"
                />
              )}
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="text-base font-semibold">
                    {connection.username}
                  </span>
                  <Badge
                    variant="outline"
                    className="border-emerald-500/30 bg-emerald-500/10 text-[10px] text-emerald-600 dark:text-emerald-400"
                  >
                    <CheckCircle2 className="mr-1 size-2.5" />
                    Connected
                  </Badge>
                </div>
                <div className="mt-1 text-xs text-muted-foreground">
                  Scopes: {connection.scopes.join(", ")}
                </div>
              </div>
              <Button variant="outline" size="sm" asChild>
                <a
                  href={`https://github.com/${connection.username}`}
                  target="_blank"
                  rel="noreferrer"
                >
                  <ExternalLink className="mr-1.5 size-3.5" />
                  Profile
                </a>
              </Button>
            </div>
          ) : (
            <NotConnectedState error={error} />
          )}
        </CardContent>
      </Card>

      {/* Repositories */}
      {connection?.connected && (
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-sm">Repositories</CardTitle>
            <Badge variant="outline" className="text-xs">
              {repos.length} repo{repos.length === 1 ? "" : "s"}
            </Badge>
          </CardHeader>
          <CardContent className="p-0">
            {reposLoading ? (
              <div className="space-y-2 p-4">
                {Array.from({ length: 4 }).map((_, i) => (
                  <Skeleton key={i} className="h-16 w-full" />
                ))}
              </div>
            ) : repos.length === 0 ? (
              <div className="p-8 text-center text-sm text-muted-foreground">
                No repositories found.
              </div>
            ) : (
              <div className="divide-y divide-border/60">
                {repos.map((r) => (
                  <RepoRow key={r.id} repo={r} />
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}

function NotConnectedState({ error }: { error: string | null }) {
  return (
    <div className="space-y-4">
      <div className="flex items-start gap-3">
        <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-muted/40 text-muted-foreground">
          <Github className="size-5" />
        </div>
        <div className="flex-1">
          <p className="text-sm font-medium">Not connected</p>
          <p className="mt-0.5 text-xs text-muted-foreground">
            Set a <code className="rounded bg-muted px-1 py-0.5 font-mono text-[10px]">GITHUB_TOKEN</code> environment variable with the{" "}
            <code className="rounded bg-muted px-1 py-0.5 font-mono text-[10px]">repo</code> scope to enable GitHub integration.
          </p>
          {error && (
            <div className="mt-2 flex items-start gap-1.5 rounded-md border border-amber-500/30 bg-amber-500/5 p-2 text-xs text-amber-700 dark:text-amber-400">
              <AlertCircle className="mt-0.5 size-3.5 shrink-0" />
              <span>{error}</span>
            </div>
          )}
        </div>
      </div>

      <ol className="space-y-2 rounded-md border border-border/60 bg-muted/20 p-3 text-xs text-muted-foreground">
        <li className="flex gap-2">
          <span className="font-mono font-bold text-emerald-500">1.</span>
          <span>
            Visit{" "}
            <a
              href="https://github.com/settings/tokens/new?scopes=repo&description=Forge%20AI%20Software%20Engineer"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-0.5 font-medium text-emerald-600 dark:text-emerald-400 hover:underline"
            >
              github.com/settings/tokens
              <ExternalLink className="size-3" />
            </a>{" "}
            and create a token with the <code className="rounded bg-muted px-1 font-mono">repo</code> scope.
          </span>
        </li>
        <li className="flex gap-2">
          <span className="font-mono font-bold text-emerald-500">2.</span>
          <span>
            Add it to your environment as <code className="rounded bg-muted px-1 font-mono">GITHUB_TOKEN</code> (locally in <code className="rounded bg-muted px-1 font-mono">.env.local</code>, on Vercel in Project Settings → Environment Variables).
          </span>
        </li>
        <li className="flex gap-2">
          <span className="font-mono font-bold text-emerald-500">3.</span>
          <span>Redeploy or restart the dev server, then click Refresh.</span>
        </li>
      </ol>
    </div>
  );
}

function RepoRow({ repo }: { repo: GitHubRepository }) {
  return (
    <div className="flex items-center gap-3 px-4 py-3 transition-colors hover:bg-muted/30">
      <div className="flex size-9 shrink-0 items-center justify-center rounded-md bg-muted/40 text-muted-foreground">
        <Github className="size-4" />
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <span className="truncate text-sm font-medium">{repo.fullName}</span>
          {repo.private && (
            <Badge variant="outline" className="h-4 px-1 text-[9px]">
              private
            </Badge>
          )}
        </div>
        <div className="mt-0.5 flex items-center gap-3 text-xs text-muted-foreground">
          {repo.language && (
            <span className="flex items-center gap-1">
              <span className="size-2 rounded-full bg-emerald-500" />
              {repo.language}
            </span>
          )}
          <span className="flex items-center gap-1">
            <Star className="size-3" />
            {repo.stargazersCount}
          </span>
          <span className="flex items-center gap-1">
            <GitFork className="size-3" />
            {repo.forksCount}
          </span>
          <span className="flex items-center gap-1">
            <GitBranch className="size-3" />
            {repo.defaultBranch}
          </span>
        </div>
        {repo.description && (
          <p className="mt-1 line-clamp-1 text-xs text-muted-foreground">
            {repo.description}
          </p>
        )}
      </div>
      <Button variant="ghost" size="sm" asChild>
        <a href={repo.htmlUrl} target="_blank" rel="noreferrer">
          <ExternalLink className="size-3.5" />
        </a>
      </Button>
    </div>
  );
}

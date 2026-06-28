/**
 * GitHub API client — thin wrapper around the REST API v3.
 *
 * Uses GITHUB_TOKEN from the environment. If absent, the client is
 * "unconfigured" and all calls return typed errors that the UI can
 * surface as "Connect your GitHub account" prompts.
 */

import type {
  GitHubBranch,
  GitHubCommit,
  GitHubConnection,
  GitHubPullRequest,
  GitHubRepository,
} from "@/types";

const GITHUB_API = "https://api.github.com";

export class GitHubClient {
  private token?: string;
  available: boolean;

  constructor(token?: string) {
    this.token = token ?? process.env.GITHUB_TOKEN;
    this.available = Boolean(this.token);
  }

  private async request<T>(
    path: string,
    init?: RequestInit
  ): Promise<T> {
    if (!this.token) {
      throw new Error(
        "GITHUB_TOKEN is not configured. Add a personal access token with repo scope to enable GitHub integration."
      );
    }
    const res = await fetch(`${GITHUB_API}${path}`, {
      ...init,
      headers: {
        Accept: "application/vnd.github+json",
        Authorization: `Bearer ${this.token}`,
        "X-GitHub-Api-Version": "2022-11-28",
        ...(init?.headers ?? {}),
      },
    });
    if (!res.ok) {
      const text = await res.text();
      throw new Error(`GitHub API ${res.status}: ${text.slice(0, 300)}`);
    }
    if (res.status === 204) return undefined as T;
    return (await res.json()) as T;
  }

  async getConnection(): Promise<GitHubConnection> {
    if (!this.token) {
      return {
        connected: false,
        username: null,
        avatarUrl: null,
        scopes: [],
        connectedAt: null,
      };
    }
    const res = await this.request<{
      login: string;
      avatar_url: string;
    }>("/user");
    return {
      connected: true,
      username: res.login,
      avatarUrl: res.avatar_url,
      scopes: ["repo", "read:org"],
      connectedAt: new Date().toISOString(),
    };
  }

  async listRepositories(perPage = 30): Promise<GitHubRepository[]> {
    const data = await this.request<
      Array<{
        id: number;
        name: string;
        full_name: string;
        owner: { login: string };
        description: string | null;
        private: boolean;
        default_branch: string;
        language: string | null;
        stargazers_count: number;
        forks_count: number;
        updated_at: string;
        html_url: string;
        clone_url: string;
      }>
    >(`/user/repos?sort=updated&per_page=${perPage}&type=owner`);
    return data.map((r) => ({
      id: r.id,
      name: r.name,
      fullName: r.full_name,
      owner: r.owner.login,
      description: r.description,
      private: r.private,
      defaultBranch: r.default_branch,
      language: r.language,
      stargazersCount: r.stargazers_count,
      forksCount: r.forks_count,
      updatedAt: r.updated_at,
      htmlUrl: r.html_url,
      cloneUrl: r.clone_url,
    }));
  }

  async listBranches(
    owner: string,
    repo: string
  ): Promise<GitHubBranch[]> {
    const data = await this.request<
      Array<{
        name: string;
        commit: { sha: string };
        protected: boolean;
      }>
    >(`/repos/${owner}/${repo}/branches?per_page=100`);
    return data.map((b) => ({
      name: b.name,
      commitSha: b.commit.sha,
      protected: b.protected,
    }));
  }

  async listPullRequests(
    owner: string,
    repo: string,
    state: "open" | "closed" | "all" = "open"
  ): Promise<GitHubPullRequest[]> {
    const data = await this.request<
      Array<{
        number: number;
        title: string;
        state: "open" | "closed";
        head: { ref: string };
        base: { ref: string };
        html_url: string;
        draft: boolean;
        mergeable: boolean | null;
        additions: number;
        deletions: number;
        changed_files: number;
        created_at: string;
        updated_at: string;
        merged_at: string | null;
      }>
    >(`/repos/${owner}/${repo}/pulls?state=${state}&per_page=30`);
    return data.map((p) => ({
      number: p.number,
      title: p.title,
      state: p.merged_at ? "merged" : (p.state as "open" | "closed"),
      headBranch: p.head.ref,
      baseBranch: p.base.ref,
      htmlUrl: p.html_url,
      draft: p.draft,
      mergeable: p.mergeable,
      additions: p.additions,
      deletions: p.deletions,
      changedFiles: p.changed_files,
      createdAt: p.created_at,
      updatedAt: p.updated_at,
    }));
  }

  async listCommits(
    owner: string,
    repo: string,
    perPage = 20
  ): Promise<GitHubCommit[]> {
    const data = await this.request<
      Array<{
        sha: string;
        commit: {
          message: string;
          author: { name: string; date: string };
        };
        author: { login: string; avatar_url: string } | null;
        stats?: { additions: number; deletions: number; total: number };
      }>
    >(`/repos/${owner}/${repo}/commits?per_page=${perPage}`);
    return data.map((c) => ({
      sha: c.sha,
      message: c.commit.message,
      author: c.author?.login ?? c.commit.author.name,
      authorAvatar: c.author?.avatar_url,
      authoredAt: c.commit.author.date,
      additions: c.stats?.additions ?? 0,
      deletions: c.stats?.deletions ?? 0,
      changedFiles: 0,
    }));
  }

  async createBranch(
    owner: string,
    repo: string,
    branchName: string,
    fromSha: string
  ): Promise<GitHubBranch> {
    const data = await this.request<{ ref: string; object: { sha: string } }>(
      `/repos/${owner}/${repo}/git/refs`,
      {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          ref: `refs/heads/${branchName}`,
          sha: fromSha,
        }),
      }
    );
    return {
      name: branchName,
      commitSha: data.object.sha,
      protected: false,
    };
  }

  async createPullRequest(
    owner: string,
    repo: string,
    title: string,
    head: string,
    base: string,
    body: string
  ): Promise<GitHubPullRequest> {
    const data = await this.request<{
      number: number;
      title: string;
      state: "open" | "closed";
      head: { ref: string };
      base: { ref: string };
      html_url: string;
      draft: boolean;
      mergeable: boolean | null;
      additions: number;
      deletions: number;
      changed_files: number;
      created_at: string;
      updated_at: string;
    }>(`/repos/${owner}/${repo}/pulls`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ title, head, base, body }),
    });
    return {
      number: data.number,
      title: data.title,
      state: data.state,
      headBranch: data.head.ref,
      baseBranch: data.base.ref,
      htmlUrl: data.html_url,
      draft: data.draft,
      mergeable: data.mergeable,
      additions: data.additions,
      deletions: data.deletions,
      changedFiles: data.changed_files,
      createdAt: data.created_at,
      updatedAt: data.updated_at,
    };
  }
}

let cachedClient: GitHubClient | null = null;
export function getGitHubClient(): GitHubClient {
  if (!cachedClient) cachedClient = new GitHubClient();
  return cachedClient;
}

export type { GitHubConnection, GitHubRepository, GitHubBranch, GitHubPullRequest, GitHubCommit };

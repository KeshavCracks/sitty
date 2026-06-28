/**
 * Forge — AI Software Engineer
 * Shared domain types
 *
 * These types are the contract between the UI, the agent runtime,
 * the LLM provider layer, and the GitHub integration layer.
 */

/* ------------------------------------------------------------------ */
/* Tasks                                                              */
/* ------------------------------------------------------------------ */

export type TaskStatus =
  | "queued"
  | "planning"
  | "executing"
  | "reviewing"
  | "completed"
  | "failed"
  | "cancelled";

export type TaskPriority = "low" | "medium" | "high" | "critical";

export interface Task {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
  repository: string;
  branch: string;
  baseBranch: string;
  model: string;
  provider: LLMProviderId;
  createdAt: string;
  updatedAt: string;
  progress: number;
  totalSteps: number;
  completedSteps: number;
  pullRequestNumber: number | null;
  headSha: string | null;
  summary: string | null;
  tags: string[];
}

/* ------------------------------------------------------------------ */
/* Agent plan + steps                                                 */
/* ------------------------------------------------------------------ */

export type StepStatus =
  | "pending"
  | "in_progress"
  | "completed"
  | "failed"
  | "skipped";

export type StepKind =
  | "planning"
  | "exploration"
  | "implementation"
  | "testing"
  | "review"
  | "commit"
  | "pr";

export interface PlanStep {
  id: string;
  order: number;
  kind: StepKind;
  title: string;
  description: string;
  status: StepStatus;
  tool: ToolId;
  toolInput: string;
  toolOutput?: string;
  startedAt?: string;
  completedAt?: string;
  files: string[];
  reasoning?: string;
}

export interface Plan {
  taskId: string;
  steps: PlanStep[];
  objective: string;
  assumptions: string[];
  risks: string[];
}

/* ------------------------------------------------------------------ */
/* Execution events / log stream                                      */
/* ------------------------------------------------------------------ */

export type LogLevel = "debug" | "info" | "warn" | "error" | "success";

export interface LogEntry {
  id: string;
  taskId: string;
  stepId?: string;
  timestamp: string;
  level: LogLevel;
  source: string;
  message: string;
}

/* ------------------------------------------------------------------ */
/* File changes / diffs                                               */
/* ------------------------------------------------------------------ */

export type FileChangeStatus = "added" | "modified" | "deleted" | "renamed";

export interface DiffLine {
  type: "add" | "del" | "context" | "hunk";
  content: string;
  oldNumber?: number;
  newNumber?: number;
}

export interface FileChange {
  id: string;
  taskId: string;
  stepId: string;
  path: string;
  status: FileChangeStatus;
  additions: number;
  deletions: number;
  diff: DiffLine[];
  newContent?: string;
}

/* ------------------------------------------------------------------ */
/* Tools                                                              */
/* ------------------------------------------------------------------ */

export type ToolId =
  | "read_file"
  | "write_file"
  | "edit_file"
  | "list_directory"
  | "run_command"
  | "search_code"
  | "git_commit"
  | "git_push"
  | "open_pr"
  | "run_tests"
  | "http_request"
  | "llm_reason";

export interface ToolDefinition {
  id: ToolId;
  name: string;
  description: string;
  parameters: Record<
    string,
    { type: string; description: string; required?: boolean }
  >;
  readOnly: boolean;
  cloudSafe: boolean;
}

/* ------------------------------------------------------------------ */
/* LLM providers                                                      */
/* ------------------------------------------------------------------ */

export type LLMProviderId = "claude" | "zai" | "openai" | "demo";

export interface LLMModel {
  id: string;
  label: string;
  provider: LLMProviderId;
  contextWindow: number;
  inputCostPer1M?: number;
  outputCostPer1M?: number;
  reasoning: boolean;
  maxOutput: number;
}

export interface ChatMessage {
  role: "system" | "user" | "assistant" | "tool";
  content: string;
  toolName?: string;
}

export interface ChatCompletionRequest {
  messages: ChatMessage[];
  model: string;
  temperature?: number;
  maxTokens?: number;
  thinking?: boolean;
}

export interface ChatCompletionResponse {
  content: string;
  model: string;
  usage: { inputTokens: number; outputTokens: number };
  latencyMs: number;
}

export interface LLMProvider {
  id: LLMProviderId;
  label: string;
  available: boolean;
  models: LLMModel[];
  complete(req: ChatCompletionRequest): Promise<ChatCompletionResponse>;
}

/* ------------------------------------------------------------------ */
/* GitHub                                                             */
/* ------------------------------------------------------------------ */

export interface GitHubRepository {
  id: number;
  name: string;
  fullName: string;
  owner: string;
  description: string | null;
  private: boolean;
  defaultBranch: string;
  language: string | null;
  stargazersCount: number;
  forksCount: number;
  updatedAt: string;
  htmlUrl: string;
  cloneUrl: string;
}

export interface GitHubBranch {
  name: string;
  commitSha: string;
  protected: boolean;
  aheadBy?: number;
  behindBy?: number;
}

export interface GitHubPullRequest {
  number: number;
  title: string;
  state: "open" | "closed" | "merged";
  headBranch: string;
  baseBranch: string;
  htmlUrl: string;
  draft: boolean;
  mergeable: boolean | null;
  additions: number;
  deletions: number;
  changedFiles: number;
  createdAt: string;
  updatedAt: string;
}

export interface GitHubCommit {
  sha: string;
  message: string;
  author: string;
  authorAvatar?: string;
  authoredAt: string;
  additions: number;
  deletions: number;
  changedFiles: number;
}

export interface GitHubConnection {
  connected: boolean;
  username: string | null;
  avatarUrl: string | null;
  scopes: string[];
  connectedAt: string | null;
}

/* ------------------------------------------------------------------ */
/* App navigation                                                     */
/* ------------------------------------------------------------------ */

export type AppView =
  | "landing"
  | "dashboard"
  | "new-task"
  | "execution"
  | "history"
  | "github"
  | "settings";

/* ------------------------------------------------------------------ */
/* Agent runtime                                                      */
/* ------------------------------------------------------------------ */

export type RuntimeMode = "cloud" | "local" | "demo";

export interface RuntimeInfo {
  mode: RuntimeMode;
  canExecute: boolean;
  description: string;
  caveats: string[];
}

/* ------------------------------------------------------------------ */
/* Stats                                                              */
/* ------------------------------------------------------------------ */

export interface DashboardStats {
  totalTasks: number;
  completedTasks: number;
  successRate: number;
  avgDurationMs: number;
  totalFilesChanged: number;
  totalLinesChanged: number;
  activeTasks: number;
  tasksPerDay: { date: string; count: number }[];
  stepKindDistribution: { kind: StepKind; count: number }[];
}

/**
 * Tool definitions for the agent runtime.
 *
 * Tools are the verbs the agent can invoke against a repository:
 * reading files, writing files, running shell commands, opening PRs, etc.
 *
 * The `cloudSafe` flag marks tools that are safe to actually execute on
 * Vercel's read-only serverless runtime. Mutating tools (write_file,
 * run_command, git_push, open_pr) are only executed in local mode; in
 * cloud/demo mode they are simulated and the UI shows what *would* happen.
 */

import type { ToolDefinition, ToolId } from "@/types";

export const TOOLS: Record<ToolId, ToolDefinition> = {
  read_file: {
    id: "read_file",
    name: "Read File",
    description: "Read the contents of a file in the repository.",
    parameters: {
      path: { type: "string", description: "Repo-relative path", required: true },
    },
    readOnly: true,
    cloudSafe: true,
  },
  list_directory: {
    id: "list_directory",
    name: "List Directory",
    description: "List the entries of a directory in the repository.",
    parameters: {
      path: { type: "string", description: "Repo-relative path", required: true },
    },
    readOnly: true,
    cloudSafe: true,
  },
  search_code: {
    id: "search_code",
    name: "Search Code",
    description: "Search the repository for a pattern (regex supported).",
    parameters: {
      query: { type: "string", description: "Search query", required: true },
      glob: { type: "string", description: "Optional file glob" },
    },
    readOnly: true,
    cloudSafe: true,
  },
  write_file: {
    id: "write_file",
    name: "Write File",
    description: "Create or overwrite a file with the given content.",
    parameters: {
      path: { type: "string", description: "Repo-relative path", required: true },
      content: { type: "string", description: "Full file content", required: true },
    },
    readOnly: false,
    cloudSafe: false,
  },
  edit_file: {
    id: "edit_file",
    name: "Edit File",
    description: "Apply a targeted search-and-replace edit to a file.",
    parameters: {
      path: { type: "string", description: "Repo-relative path", required: true },
      old: { type: "string", description: "Text to find", required: true },
      new: { type: "string", description: "Replacement text", required: true },
    },
    readOnly: false,
    cloudSafe: false,
  },
  run_command: {
    id: "run_command",
    name: "Run Command",
    description: "Execute a shell command inside the working tree.",
    parameters: {
      command: { type: "string", description: "Shell command", required: true },
      cwd: { type: "string", description: "Working directory" },
    },
    readOnly: false,
    cloudSafe: false,
  },
  run_tests: {
    id: "run_tests",
    name: "Run Tests",
    description: "Run the project's test suite.",
    parameters: {
      filter: { type: "string", description: "Optional test name filter" },
    },
    readOnly: false,
    cloudSafe: false,
  },
  http_request: {
    id: "http_request",
    name: "HTTP Request",
    description: "Perform an outbound HTTP request (read-only data fetch).",
    parameters: {
      url: { type: "string", description: "Request URL", required: true },
      method: { type: "string", description: "HTTP method" },
    },
    readOnly: true,
    cloudSafe: true,
  },
  git_commit: {
    id: "git_commit",
    name: "Git Commit",
    description: "Stage and commit changes with a message.",
    parameters: {
      message: { type: "string", description: "Commit message", required: true },
      files: { type: "string[]", description: "Files to stage" },
    },
    readOnly: false,
    cloudSafe: false,
  },
  git_push: {
    id: "git_push",
    name: "Git Push",
    description: "Push the current branch to the remote.",
    parameters: {
      remote: { type: "string", description: "Remote name (default: origin)" },
      force: { type: "boolean", description: "Force push" },
    },
    readOnly: false,
    cloudSafe: false,
  },
  open_pr: {
    id: "open_pr",
    name: "Open Pull Request",
    description: "Open a pull request against the base branch.",
    parameters: {
      title: { type: "string", description: "PR title", required: true },
      body: { type: "string", description: "PR description" },
    },
    readOnly: false,
    cloudSafe: false,
  },
  llm_reason: {
    id: "llm_reason",
    name: "LLM Reasoning",
    description: "Invoke the LLM for an internal reasoning step (no file changes).",
    parameters: {
      prompt: { type: "string", description: "Reasoning prompt", required: true },
    },
    readOnly: true,
    cloudSafe: true,
  },
};

export const TOOL_LIST = Object.values(TOOLS);

export function isReadOnly(toolId: ToolId): boolean {
  return TOOLS[toolId].readOnly;
}

export function isCloudSafe(toolId: ToolId): boolean {
  return TOOLS[toolId].cloudSafe;
}

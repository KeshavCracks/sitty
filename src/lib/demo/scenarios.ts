/**
 * Demo scenarios — predefined, realistic agent execution flows.
 *
 * Each scenario is a complete, polished example of how the agent
 * would tackle a common software-engineering task: a plan with
 * 6-8 steps, terminal output for each step, and file diffs that
 * look like real patches.
 *
 * The UI uses these to render a believable end-to-end flow even
 * when no LLM / GitHub credentials are configured. When the user
 * types a free-form task description, `matchScenario` picks the
 * closest scenario by keyword so the demo always feels relevant.
 */

import type { PlanStep, StepKind, ToolId } from "@/types";

export interface ScenarioStep {
  kind: StepKind;
  title: string;
  description: string;
  tool: ToolId;
  toolInput: string;
  files: string[];
  /** Lines of terminal output to stream for this step */
  terminal: string[];
  /** File diffs to render for this step */
  diffs?: ScenarioDiff[];
  /** Reasoning shown in the "agent thoughts" panel */
  reasoning?: string;
}

export interface ScenarioDiff {
  path: string;
  status: "added" | "modified" | "deleted" | "renamed";
  /** Patch-style lines: +, -, ' ' (context), @@ hunk headers */
  lines: string[];
}

export interface Scenario {
  id: string;
  /** Keywords used by matchScenario to score relevance */
  keywords: string[];
  objective: string;
  assumptions: string[];
  risks: string[];
  steps: ScenarioStep[];
  /** Final summary the agent produces when the task completes */
  summary: string;
}

/* ------------------------------------------------------------------ */
/* Scenario 1: Add dark mode toggle                                   */
/* ------------------------------------------------------------------ */

const darkModeScenario: Scenario = {
  id: "dark-mode",
  keywords: [
    "dark",
    "theme",
    "toggle",
    "mode",
    "light",
    "appearance",
    "color-scheme",
  ],
  objective:
    "Add a persistent dark/light theme toggle to the app header with system-preference detection",
  assumptions: [
    "TailwindCSS is already configured with a `dark` variant",
    "next-themes is available in the dependency tree",
    "The header layout has room for an additional icon button",
  ],
  risks: [
    "Hydration mismatch if theme is read on the server",
    "FOUC (flash of unstyled content) before the theme script runs",
  ],
  summary:
    "Added a ThemeToggle component wired to next-themes, mounted it in the header, and gated it behind a mounted flag to avoid hydration mismatches. The preference is persisted in localStorage and respects the user's system preference on first visit.",
  steps: [
    {
      kind: "exploration",
      title: "Inspect current theme setup",
      description:
        "Read the existing layout and globals.css to understand how theming is currently wired.",
      tool: "read_file",
      toolInput: "read src/app/layout.tsx, src/app/globals.css",
      files: ["src/app/layout.tsx", "src/app/globals.css"],
      reasoning:
        "Before adding a toggle I need to know if next-themes is already installed and whether the html element has suppressHydrationWarning set — that's required for next-themes to work without React warnings.",
      terminal: [
        "$ forge read src/app/layout.tsx",
        "→ 54 lines read",
        "$ forge read src/app/globals.css",
        "→ 122 lines read",
        "✓ Found @custom-variant dark — Tailwind dark mode is class-based",
        "✓ html element has suppressHydrationWarning — safe for next-themes",
      ],
    },
    {
      kind: "exploration",
      title: "Check header layout for placement",
      description:
        "Inspect the existing header component to find a good insertion point for the toggle.",
      tool: "search_code",
      toolInput: 'search "Header" in src/components',
      files: ["src/components/site-header.tsx"],
      reasoning:
        "I want to place the toggle next to the existing user menu. Searching for the header component first to avoid guessing the file name.",
      terminal: [
        '$ forge search "Header" --glob src/components',
        "src/components/site-header.tsx:14  export function SiteHeader() {",
        "src/components/site-header.tsx:42    <UserMenu />",
        "✓ 1 match in 1 file",
      ],
    },
    {
      kind: "implementation",
      title: "Create ThemeProvider wrapper",
      description:
        "Wrap the app in next-themes ThemeProvider so the toggle has something to talk to.",
      tool: "write_file",
      toolInput: "write src/components/theme-provider.tsx",
      files: ["src/components/theme-provider.tsx"],
      reasoning:
        "next-themes requires a client-side ThemeProvider mounted high in the tree. Wrapping it in our own component keeps the 'use client' boundary clean.",
      terminal: [
        "$ forge write src/components/theme-provider.tsx",
        "→ 11 lines written",
        "✓ File created",
      ],
      diffs: [
        {
          path: "src/components/theme-provider.tsx",
          status: "added",
          lines: [
            '"use client"',
            "",
            "import * as React from \"react\";",
            "import { ThemeProvider as NextThemesProvider } from \"next-themes\";",
            "",
            "export function ThemeProvider({",
            "  children,",
            "  ...props",
            "}: React.ComponentProps<typeof NextThemesProvider>) {",
            "  return <NextThemesProvider {...props}>{children}</NextThemesProvider>;",
            "}",
          ],
        },
      ],
    },
    {
      kind: "implementation",
      title: "Add ThemeToggle component",
      description:
        "Create the toggle button with Sun/Moon icons and a mounted guard.",
      tool: "write_file",
      toolInput: "write src/components/theme-toggle.tsx",
      files: ["src/components/theme-toggle.tsx"],
      reasoning:
        "The toggle must wait for mount before reading the resolved theme, otherwise SSR and client render will disagree and React will warn about hydration mismatch.",
      terminal: [
        "$ forge write src/components/theme-toggle.tsx",
        "→ 28 lines written",
        "✓ File created",
      ],
      diffs: [
        {
          path: "src/components/theme-toggle.tsx",
          status: "added",
          lines: [
            '"use client"',
            "",
            "import * as React from \"react\";",
            "import { Moon, Sun } from \"lucide-react\";",
            "import { useTheme } from \"next-themes\";",
            "import { Button } from \"@/components/ui/button\";",
            "",
            "export function ThemeToggle() {",
            "  const { setTheme, resolvedTheme } = useTheme();",
            "  const [mounted, setMounted] = React.useState(false);",
            "  React.useEffect(() => setMounted(true), []);",
            "  if (!mounted) {",
            "    return <Button variant=\"ghost\" size=\"icon\" disabled />;",
            "  }",
            "  const isDark = resolvedTheme === \"dark\";",
            "  return (",
            "    <Button",
            "      variant=\"ghost\"",
            "      size=\"icon\"",
            "      onClick={() => setTheme(isDark ? \"light\" : \"dark\")}",
            "      aria-label=\"Toggle theme\"",
            "    >",
            "      {isDark ? <Sun className=\"size-5\" /> : <Moon className=\"size-5\" />}",
            "    </Button>",
            "  );",
            "}",
          ],
        },
      ],
    },
    {
      kind: "implementation",
      title: "Wire ThemeProvider into layout",
      description:
        "Mount the provider in the root layout and place the toggle in the header.",
      tool: "edit_file",
      toolInput:
        "edit src/app/layout.tsx — wrap children with ThemeProvider",
      files: ["src/app/layout.tsx", "src/components/site-header.tsx"],
      reasoning:
        "ThemeProvider must wrap {children} so every route inherits it. The toggle goes into the header next to the user menu.",
      terminal: [
        "$ forge edit src/app/layout.tsx",
        "  + import { ThemeProvider } from \"@/components/theme-provider\";",
        "  + <ThemeProvider attribute=\"class\" defaultTheme=\"dark\">",
        "  +   {children}",
        "  + </ThemeProvider>",
        "✓ 1 file edited",
        "$ forge edit src/components/site-header.tsx",
        "  + import { ThemeToggle } from \"@/components/theme-toggle\";",
        "  + <ThemeToggle />",
        "✓ 1 file edited",
      ],
      diffs: [
        {
          path: "src/app/layout.tsx",
          status: "modified",
          lines: [
            "   import { Toaster } from \"@/components/ui/toaster\";",
            "+  import { ThemeProvider } from \"@/components/theme-provider\";",
            "   ",
            "       <body className={...}>",
            "+        <ThemeProvider attribute=\"class\" defaultTheme=\"dark\">",
            "+          {children}",
            "+          <Toaster />",
            "+        </ThemeProvider>",
            "       </body>",
          ],
        },
        {
          path: "src/components/site-header.tsx",
          status: "modified",
          lines: [
            "   import { UserMenu } from \"@/components/user-menu\";",
            "+  import { ThemeToggle } from \"@/components/theme-toggle\";",
            "   ",
            "       <nav className=\"flex items-center gap-2\">",
            "+        <ThemeToggle />",
            "         <UserMenu />",
            "       </nav>",
          ],
        },
      ],
    },
    {
      kind: "testing",
      title: "Run lint and typecheck",
      description:
        "Verify the new files pass ESLint and TypeScript checks.",
      tool: "run_tests",
      toolInput: "run bun run lint && bun tsc --noEmit",
      files: [],
      reasoning:
        "Cheap sanity check before committing — catches unused imports and type errors in seconds.",
      terminal: [
        "$ forge exec bun run lint",
        "✔ No ESLint warnings or errors",
        "$ forge exec bun tsc --noEmit",
        "✔ Typecheck passed (0 errors)",
        "✓ All checks passed",
      ],
    },
    {
      kind: "commit",
      title: "Commit changes",
      description:
        "Stage and commit all theme-related changes with a descriptive message.",
      tool: "git_commit",
      toolInput: 'git commit -m "feat(theme): add dark/light theme toggle"',
      files: [
        "src/components/theme-provider.tsx",
        "src/components/theme-toggle.tsx",
        "src/app/layout.tsx",
        "src/components/site-header.tsx",
      ],
      reasoning:
        "Conventional-commits style message so the PR title and changelog are auto-derived.",
      terminal: [
        "$ forge git add src/components/theme-provider.tsx src/components/theme-toggle.tsx src/app/layout.tsx src/components/site-header.tsx",
        "$ forge git commit -m \"feat(theme): add dark/light theme toggle\"",
        "[forge/dark-mode-toggle 7a3f9c2] feat(theme): add dark/light theme toggle",
        " 4 files changed, 43 insertions(+), 2 deletions(-)",
        "✓ Commit 7a3f9c2 created",
      ],
    },
    {
      kind: "pr",
      title: "Open pull request",
      description:
        "Push the branch and open a PR against main with a description and screenshot placeholder.",
      tool: "open_pr",
      toolInput:
        "gh pr create --title 'feat(theme): add dark/light theme toggle'",
      files: [],
      reasoning:
        "PR body should include the rationale, the testing steps, and a screenshot so reviewers can verify visually.",
      terminal: [
        "$ forge git push -u origin forge/dark-mode-toggle",
        "→ branch pushed",
        "$ forge gh pr create --base main --head forge/dark-mode-toggle \\",
        "    --title 'feat(theme): add dark/light theme toggle' \\",
        "    --body 'Adds a ThemeToggle in the header...'",
        "✓ Pull request #142 opened",
        "  https://github.com/acme/webapp/pull/142",
      ],
    },
  ],
};

/* ------------------------------------------------------------------ */
/* Scenario 2: Fix authentication bug                                 */
/* ------------------------------------------------------------------ */

const authBugScenario: Scenario = {
  id: "auth-bug",
  keywords: [
    "auth",
    "login",
    "bug",
    "fix",
    "session",
    "token",
    "logout",
    "jwt",
    "cookie",
  ],
  objective:
    "Fix the bug where users are logged out on page refresh despite selecting 'remember me'",
  assumptions: [
    "Sessions are stored in HTTP-only cookies",
    "The 'remember me' flag is supposed to extend the cookie's maxAge to 30 days",
    "The bug is reproducible in Chrome and Firefox",
  ],
  risks: [
    "Changing cookie expiry may invalidate existing sessions",
    "Need to verify the fix doesn't weaken security (no infinite sessions)",
  ],
  summary:
    "Root cause: the `persistent` flag from the login form was not being forwarded to the cookie options in `setSession()`. The cookie always used the session-scoped maxAge. Fixed by threading the flag through and defaulting to 30 days when persistent=true. Added a regression test.",
  steps: [
    {
      kind: "exploration",
      title: "Reproduce the bug",
      description:
        "Read the auth login route to understand how 'remember me' is handled today.",
      tool: "read_file",
      toolInput: "read src/app/api/auth/login/route.ts",
      files: ["src/app/api/auth/login/route.ts"],
      reasoning:
        "Before guessing, I want to read the actual login handler to see where the persistent flag is consumed (or dropped).",
      terminal: [
        "$ forge read src/app/api/auth/login/route.ts",
        "→ 87 lines read",
        "  line 34: const { email, password, remember } = await req.json()",
        "  line 56: await setSession(user.id, /* persistent */ false)",
        "⚠ `remember` is read but never forwarded to setSession",
      ],
    },
    {
      kind: "exploration",
      title: "Inspect setSession implementation",
      description:
        "Read the session helper to see what `persistent` actually controls.",
      tool: "search_code",
      toolInput: 'search "export async function setSession"',
      files: ["src/lib/auth/session.ts"],
      reasoning:
        "I need to confirm that setSession even accepts a persistent flag, and what it does with cookie maxAge when true.",
      terminal: [
        '$ forge search "export async function setSession"',
        "src/lib/auth/session.ts:22  export async function setSession(",
        "src/lib/auth/session.ts:23    userId: string,",
        "src/lib/auth/session.ts:24    persistent: boolean = false,",
        "src/lib/auth/session.ts:25  ) {",
        "$ forge read src/lib/auth/session.ts:22-50",
        "  line 38: maxAge: persistent ? 60 * 60 * 24 * 30 : undefined",
      ],
    },
    {
      kind: "implementation",
      title: "Forward remember flag to setSession",
      description:
        "Edit the login route to pass the `remember` flag through to setSession.",
      tool: "edit_file",
      toolInput:
        "edit src/app/api/auth/login/route.ts — pass `remember` to setSession",
      files: ["src/app/api/auth/login/route.ts"],
      reasoning:
        "One-line fix: pass the already-parsed `remember` boolean to setSession instead of hard-coding false.",
      terminal: [
        "$ forge edit src/app/api/auth/login/route.ts",
        "  - await setSession(user.id, /* persistent */ false)",
        "  + await setSession(user.id, remember)",
        "✓ 1 file edited",
      ],
      diffs: [
        {
          path: "src/app/api/auth/login/route.ts",
          status: "modified",
          lines: [
            "       await createAuditLog('login', user.id);",
            "-      await setSession(user.id, /* persistent */ false);",
            "+      await setSession(user.id, remember);",
            "       return NextResponse.json({ ok: true });",
          ],
        },
      ],
    },
    {
      kind: "testing",
      title: "Add regression test",
      description:
        "Add a test that verifies the cookie maxAge is 30 days when remember=true.",
      tool: "write_file",
      toolInput:
        "write src/lib/auth/__tests__/session.test.ts",
      files: ["src/lib/auth/__tests__/session.test.ts"],
      reasoning:
        "Without a regression test this bug will come back. The test should assert the cookie maxAge for both branches.",
      terminal: [
        "$ forge write src/lib/auth/__tests__/session.test.ts",
        "→ 38 lines written",
        "✓ Test file created",
      ],
      diffs: [
        {
          path: "src/lib/auth/__tests__/session.test.ts",
          status: "added",
          lines: [
            "import { describe, it, expect, vi } from 'vitest';",
            "import { setSession } from '../session';",
            "",
            "describe('setSession', () => {",
            "  it('sets a 30-day maxAge when persistent=true', async () => {",
            "    const cookies = await setSession('user_1', true);",
            "    const session = cookies.find(c => c.name === 'session');",
            "    expect(session?.maxAge).toBe(60 * 60 * 24 * 30);",
            "  });",
            "",
            "  it('omits maxAge when persistent=false (session cookie)', async () => {",
            "    const cookies = await setSession('user_1', false);",
            "    const session = cookies.find(c => c.name === 'session');",
            "    expect(session?.maxAge).toBeUndefined();",
            "  });",
            "});",
          ],
        },
      ],
    },
    {
      kind: "testing",
      title: "Run the test suite",
      description:
        "Run vitest to confirm the new test passes and nothing regressed.",
      tool: "run_tests",
      toolInput: "run bun run test",
      files: [],
      reasoning: "Green test suite before committing — non-negotiable.",
      terminal: [
        "$ forge exec bun run test",
        " ✓ src/lib/auth/__tests__/session.test.ts (2)",
        "   ✓ setSession > sets a 30-day maxAge when persistent=true",
        "   ✓ setSession > omits maxAge when persistent=false",
        " Test Files  1 passed (1)",
        "      Tests  2 passed (2)",
        "✓ All tests passed",
      ],
    },
    {
      kind: "commit",
      title: "Commit the fix",
      description: "Stage and commit the fix and the new test.",
      tool: "git_commit",
      toolInput: 'git commit -m "fix(auth): forward remember flag to setSession"',
      files: [
        "src/app/api/auth/login/route.ts",
        "src/lib/auth/__tests__/session.test.ts",
      ],
      reasoning: "Fix + regression test in one commit so reviewers see both together.",
      terminal: [
        "$ forge git add -A",
        "$ forge git commit -m \"fix(auth): forward remember flag to setSession\"",
        "[forge/auth-remember-fix 9c4e1a8] fix(auth): forward remember flag to setSession",
        " 2 files changed, 31 insertions(+), 1 deletion(-)",
        "✓ Commit 9c4e1a8 created",
      ],
    },
    {
      kind: "pr",
      title: "Open pull request",
      description: "Push and open a PR against main with the root cause analysis.",
      tool: "open_pr",
      toolInput: "gh pr create --title 'fix(auth): forward remember flag to setSession'",
      files: [],
      reasoning: "PR body explains the root cause so reviewers can validate the fix is correct, not just that tests pass.",
      terminal: [
        "$ forge git push -u origin forge/auth-remember-fix",
        "$ forge gh pr create --base main \\",
        "    --title 'fix(auth): forward remember flag to setSession' \\",
        "    --body '## Root cause\\nThe `remember` flag...'",
        "✓ Pull request #143 opened",
        "  https://github.com/acme/webapp/pull/143",
      ],
    },
  ],
};

/* ------------------------------------------------------------------ */
/* Scenario 3: Add unit tests                                         */
/* ------------------------------------------------------------------ */

const addTestsScenario: Scenario = {
  id: "add-tests",
  keywords: ["test", "tests", "unit", "coverage", "vitest", "jest", "spec"],
  objective:
    "Add unit tests for the UserService class to bring coverage above 80%",
  assumptions: [
    "Vitest is already configured",
    "UserService has 4 public methods: findById, create, update, delete",
    "A test database fixture is available",
  ],
  risks: [
    "Tests that hit a real database will be flaky — should mock the Prisma client",
  ],
  summary:
    "Added 14 unit tests covering all 4 UserService methods, including happy path, not-found, validation, and error cases. Mocked the Prisma client so tests run in <50ms. Coverage for user-service.ts went from 0% to 92%.",
  steps: [
    {
      kind: "exploration",
      title: "Read UserService implementation",
      description: "Read the source file to enumerate all branches that need coverage.",
      tool: "read_file",
      toolInput: "read src/services/user-service.ts",
      files: ["src/services/user-service.ts"],
      reasoning: "I need to know every method, branch, and error path before writing tests — otherwise I'll miss edge cases.",
      terminal: [
        "$ forge read src/services/user-service.ts",
        "→ 124 lines read",
        "  methods: findById, create, update, delete",
        "  branches: 11 (3 error paths, 8 happy paths)",
      ],
    },
    {
      kind: "exploration",
      title: "Check existing test patterns",
      description: "Read an existing test file to match the project's testing conventions.",
      tool: "search_code",
      toolInput: 'search "describe(" --glob "**/*.test.ts"',
      files: ["src/services/__tests__/billing-service.test.ts"],
      reasoning: "Matching the existing test style (mock setup, fixture loading, naming) keeps the codebase consistent.",
      terminal: [
        '$ forge search "describe(" --glob "**/*.test.ts"',
        "src/services/__tests__/billing-service.test.ts:9 describe('BillingService', () => {",
        "✓ Found reference test file",
      ],
    },
    {
      kind: "implementation",
      title: "Write the test file",
      description: "Write a comprehensive test file covering all methods and edge cases.",
      tool: "write_file",
      toolInput: "write src/services/__tests__/user-service.test.ts",
      files: ["src/services/__tests__/user-service.test.ts"],
      reasoning: "Mock the Prisma client at the module level so tests are deterministic and fast. Cover happy path + not-found + validation + unexpected errors for each method.",
      terminal: [
        "$ forge write src/services/__tests__/user-service.test.ts",
        "→ 186 lines written",
        "✓ Test file created",
      ],
      diffs: [
        {
          path: "src/services/__tests__/user-service.test.ts",
          status: "added",
          lines: [
            "import { describe, it, expect, beforeEach, vi } from 'vitest';",
            "import { UserService } from '../user-service';",
            "import { db } from '@/lib/db';",
            "",
            "vi.mock('@/lib/db', () => ({",
            "  db: {",
            "    user: {",
            "      findUnique: vi.fn(),",
            "      create: vi.fn(),",
            "      update: vi.fn(),",
            "      delete: vi.fn(),",
            "    },",
            "  },",
            "}));",
            "",
            "describe('UserService', () => {",
            "  let service: UserService;",
            "  beforeEach(() => {",
            "    vi.clearAllMocks();",
            "    service = new UserService();",
            "  });",
            "",
            "  describe('findById', () => {",
            "    it('returns the user when found', async () => {",
            "      (db.user.findUnique as any).mockResolvedValue({ id: '1', email: 'a@b.c' });",
            "      const user = await service.findById('1');",
            "      expect(user).toEqual({ id: '1', email: 'a@b.c' });",
            "    });",
            "",
            "    it('returns null when not found', async () => {",
            "      (db.user.findUnique as any).mockResolvedValue(null);",
            "      const user = await service.findById('missing');",
            "      expect(user).toBeNull();",
            "    });",
            "  });",
            "",
            "  // ... 12 more tests for create / update / delete",
            "});",
          ],
        },
      ],
    },
    {
      kind: "testing",
      title: "Run the new tests",
      description: "Run vitest with coverage to verify the new tests pass and coverage improved.",
      tool: "run_tests",
      toolInput: "run bun run test:coverage -- user-service",
      files: [],
      reasoning: "Always run with coverage to prove the tests actually exercise the code, not just pass trivially.",
      terminal: [
        "$ forge exec bun run test:coverage -- user-service",
        " ✓ src/services/__tests__/user-service.test.ts (14)",
        "   ✓ UserService > findById > returns the user when found",
        "   ✓ UserService > findById > returns null when not found",
        "   ✓ UserService > create > hashes the password",
        "   ✓ UserService > create > rejects duplicate emails",
        "   ... 10 more",
        "",
        " File                     | % Stmts | % Branch | % Funcs |",
        " user-service.ts          |   92.3  |   88.8   |  100.0  |",
        "✓ Coverage target met (>80%)",
      ],
    },
    {
      kind: "commit",
      title: "Commit the tests",
      description: "Stage and commit the new test file.",
      tool: "git_commit",
      toolInput: 'git commit -m "test(user-service): add unit tests (92% coverage)"',
      files: ["src/services/__tests__/user-service.test.ts"],
      reasoning: "Tests-only commit; no source changes needed since the existing code already works correctly.",
      terminal: [
        "$ forge git add src/services/__tests__/user-service.test.ts",
        "$ forge git commit -m \"test(user-service): add unit tests (92% coverage)\"",
        "[forge/user-service-tests b2d7f44] test(user-service): add unit tests (92% coverage)",
        " 1 file changed, 186 insertions(+)",
        "✓ Commit b2d7f44 created",
      ],
    },
    {
      kind: "pr",
      title: "Open pull request",
      description: "Open a PR with the coverage report in the description.",
      tool: "open_pr",
      toolInput: "gh pr create --title 'test(user-service): add unit tests (92% coverage)'",
      files: [],
      reasoning: "Including the coverage numbers in the PR body gives reviewers an at-a-glance summary of the value.",
      terminal: [
        "$ forge git push -u origin forge/user-service-tests",
        "$ forge gh pr create --base main \\",
        "    --title 'test(user-service): add unit tests (92% coverage)' \\",
        "    --body 'Coverage for user-service.ts: 0% → 92%'",
        "✓ Pull request #144 opened",
        "  https://github.com/acme/webapp/pull/144",
      ],
    },
  ],
};

/* ------------------------------------------------------------------ */
/* Scenario 4: Refactor to server actions                             */
/* ------------------------------------------------------------------ */

const refactorScenario: Scenario = {
  id: "refactor-server-actions",
  keywords: [
    "refactor",
    "server",
    "action",
    "actions",
    "api",
    "route",
    "handler",
    "migrate",
  ],
  objective:
    "Migrate the /api/projects POST handler to a Next.js Server Action",
  assumptions: [
    "The project uses Next.js 16 App Router",
    "The existing route handler validates with zod",
    "There are no file uploads in this endpoint",
  ],
  risks: [
    "Server Action revalidation semantics differ from route handlers",
    "Need to preserve the same error response shape for the frontend",
  ],
  summary:
    "Migrated the projects POST endpoint from a route handler to a typed Server Action. Preserved the zod validation, kept the same error shape (now returned as a state object), and added `revalidatePath` so the projects list updates instantly. Deleted the old route handler.",
  steps: [
    {
      kind: "exploration",
      title: "Read the existing route handler",
      description: "Read the route handler to capture validation, side effects, and response shape.",
      tool: "read_file",
      toolInput: "read src/app/api/projects/route.ts",
      files: ["src/app/api/projects/route.ts"],
      reasoning: "I need to preserve the exact validation rules and the response shape so the frontend doesn't break.",
      terminal: [
        "$ forge read src/app/api/projects/route.ts",
        "→ 64 lines read",
        "  schema: projectCreateSchema (zod)",
        "  side effects: db.project.create, revalidatePath('/projects')",
        "  returns: 201 with { id } on success, 400 on validation error",
      ],
    },
    {
      kind: "exploration",
      title: "Find frontend callers",
      description: "Search the codebase for fetch calls to /api/projects to know what to update.",
      tool: "search_code",
      toolInput: 'search "/api/projects" --glob src/**/*.{ts,tsx}',
      files: ["src/components/project-create-form.tsx"],
      reasoning: "The form that calls this endpoint needs to switch from fetch to useActionState.",
      terminal: [
        '$ forge search "/api/projects" --glob src/**/*.{ts,tsx}',
        "src/components/project-create-form.tsx:18  const res = await fetch('/api/projects', {",
        "✓ 1 caller found",
      ],
    },
    {
      kind: "implementation",
      title: "Create the Server Action",
      description: "Write the createProject action with the same validation and side effects.",
      tool: "write_file",
      toolInput: "write src/app/actions/projects.ts",
      files: ["src/app/actions/projects.ts"],
      reasoning: "Server Actions must be in a 'use server' file or function. Putting them in /actions keeps them discoverable.",
      terminal: [
        "$ forge write src/app/actions/projects.ts",
        "→ 42 lines written",
        "✓ Server Action created",
      ],
      diffs: [
        {
          path: "src/app/actions/projects.ts",
          status: "added",
          lines: [
            "'use server'",
            "",
            "import { revalidatePath } from 'next/cache';",
            "import { z } from 'zod';",
            "import { db } from '@/lib/db';",
            "",
            "const projectCreateSchema = z.object({",
            "  name: z.string().min(1).max(80),",
            "  description: z.string().max(500).optional(),",
            "});",
            "",
            "export type CreateProjectState = {",
            "  error?: string;",
            "  projectId?: string;",
            "};",
            "",
            "export async function createProject(",
            "  _prev: CreateProjectState,",
            "  formData: FormData",
            "): Promise<CreateProjectState> {",
            "  const parsed = projectCreateSchema.safeParse({",
            "    name: formData.get('name'),",
            "    description: formData.get('description'),",
            "  });",
            "  if (!parsed.success) {",
            "    return { error: parsed.error.issues[0]?.message ?? 'Invalid input' };",
            "  }",
            "  const project = await db.project.create({ data: parsed.data });",
            "  revalidatePath('/projects');",
            "  return { projectId: project.id };",
            "}",
          ],
        },
      ],
    },
    {
      kind: "implementation",
      title: "Migrate the form to useActionState",
      description: "Replace the fetch call with useActionState wired to the new Server Action.",
      tool: "edit_file",
      toolInput: "edit src/components/project-create-form.tsx",
      files: ["src/components/project-create-form.tsx"],
      reasoning: "useActionState gives us pending state and the returned state object for free — no more manual loading flags.",
      terminal: [
        "$ forge edit src/components/project-create-form.tsx",
        "  - const res = await fetch('/api/projects', { method: 'POST', body: formData })",
        "  + const [state, formAction, pending] = useActionState(createProject, {})",
        "✓ Form migrated to useActionState",
      ],
      diffs: [
        {
          path: "src/components/project-create-form.tsx",
          status: "modified",
          lines: [
            "-  const [loading, setLoading] = useState(false)",
            "+  const [state, formAction, pending] = useActionState(createProject, {})",
            "   ",
            "-  async function onSubmit(e: FormEvent) {",
            "-    e.preventDefault()",
            "-    setLoading(true)",
            "-    const res = await fetch('/api/projects', { method: 'POST', body: new FormData(e.currentTarget) })",
            "-    setLoading(false)",
            "-    if (!res.ok) setError('Failed')",
            "-  }",
            "+  <form action={formAction}>",
          ],
        },
      ],
    },
    {
      kind: "implementation",
      title: "Delete the old route handler",
      description: "Remove the now-unused POST handler to avoid drift.",
      tool: "run_command",
      toolInput: "rm src/app/api/projects/route.ts",
      files: ["src/app/api/projects/route.ts"],
      reasoning: "Keeping the old endpoint around invites future bugs — delete it now that nothing calls it.",
      terminal: [
        "$ forge exec rm src/app/api/projects/route.ts",
        "✓ Removed src/app/api/projects/route.ts",
      ],
      diffs: [
        {
          path: "src/app/api/projects/route.ts",
          status: "deleted",
          lines: [
            "-import { NextResponse } from 'next/server'",
            "-import { z } from 'zod'",
            "-import { db } from '@/lib/db'",
            "-",
            "-const projectCreateSchema = z.object({ ... })",
            "-",
            "-export async function POST(req: Request) { ... }",
          ],
        },
      ],
    },
    {
      kind: "testing",
      title: "Typecheck and lint",
      description: "Verify the refactor compiles and passes lint.",
      tool: "run_tests",
      toolInput: "run bun run lint && bun tsc --noEmit",
      files: [],
      reasoning: "Server Actions have stricter typing rules — want to catch any 'use server' boundary issues now.",
      terminal: [
        "$ forge exec bun run lint",
        "✔ No issues",
        "$ forge exec bun tsc --noEmit",
        "✔ Typecheck passed",
        "✓ All checks passed",
      ],
    },
    {
      kind: "commit",
      title: "Commit the refactor",
      description: "Stage and commit all changes from the refactor.",
      tool: "git_commit",
      toolInput:
        'git commit -m "refactor(projects): migrate POST handler to Server Action"',
      files: [
        "src/app/actions/projects.ts",
        "src/components/project-create-form.tsx",
        "src/app/api/projects/route.ts",
      ],
      reasoning: "Single commit so the migration is atomic — the form, the action, and the deletion all land together.",
      terminal: [
        "$ forge git add -A",
        "$ forge git commit -m \"refactor(projects): migrate POST handler to Server Action\"",
        "[forge/projects-server-action 4f8c2b1] refactor(projects): migrate POST handler to Server Action",
        " 3 files changed, 48 insertions(+), 52 deletions(-)",
        "✓ Commit 4f8c2b1 created",
      ],
    },
    {
      kind: "pr",
      title: "Open pull request",
      description: "Open a PR describing the migration and its benefits.",
      tool: "open_pr",
      toolInput: "gh pr create --title 'refactor(projects): migrate POST handler to Server Action'",
      files: [],
      reasoning: "Explain WHY (progressive enhancement, less boilerplate, automatic revalidation) so reviewers see the value beyond 'it works'.",
      terminal: [
        "$ forge git push -u origin forge/projects-server-action",
        "$ forge gh pr create --base main \\",
        "    --title 'refactor(projects): migrate POST handler to Server Action' \\",
        "    --body '## Why\\n- Progressive enhancement...'\\",
        "✓ Pull request #145 opened",
        "  https://github.com/acme/webapp/pull/145",
      ],
    },
  ],
};

/* ------------------------------------------------------------------ */
/* Scenario 5: Generic fallback                                       */
/* ------------------------------------------------------------------ */

const genericScenario: Scenario = {
  id: "generic",
  keywords: [],
  objective:
    "Implement the requested change end-to-end: explore, plan, implement, test, and ship a PR",
  assumptions: [
    "The repository is in a clean state on the target branch",
    "Tests are configured and runnable via the standard script",
  ],
  risks: [
    "Untested edge cases may exist in the affected code paths",
  ],
  summary:
    "Explored the affected files, implemented the requested change, added test coverage, and opened a pull request with a description of the approach and the testing steps.",
  steps: [
    {
      kind: "exploration",
      title: "Explore the repository",
      description: "Read the README, package.json, and the most relevant source files to understand the codebase shape.",
      tool: "list_directory",
      toolInput: "ls . && cat package.json",
      files: ["package.json", "README.md"],
      reasoning: "Establish the project's stack, conventions, and entry points before touching any code.",
      terminal: [
        "$ forge exec ls .",
        "src/  package.json  tsconfig.json  README.md",
        "$ forge read package.json",
        "→ 94 lines read",
        "✓ Project identified: Next.js 16 + TypeScript + Tailwind",
      ],
    },
    {
      kind: "planning",
      title: "Decompose the task",
      description: "Break the task into ordered steps with clear tool calls.",
      tool: "llm_reason",
      toolInput: "reason about task decomposition",
      files: [],
      reasoning: "Decomposition prevents skipping steps like 'run tests' that are easy to forget under pressure.",
      terminal: [
        "$ forge reason --task '...' ",
        "→ plan: 7 steps",
        "  1. explore    2. implement   3. implement",
        "  4. test       5. lint        6. commit    7. pr",
      ],
    },
    {
      kind: "implementation",
      title: "Implement the change",
      description: "Write or edit the code that fulfills the task.",
      tool: "edit_file",
      toolInput: "edit src/path/to/file.ts",
      files: ["src/path/to/file.ts"],
      reasoning: "Minimal, targeted edit — prefer edit_file over write_file to keep the diff reviewable.",
      terminal: [
        "$ forge edit src/path/to/file.ts",
        "  - // old line",
        "  + // new line",
        "✓ 1 file edited",
      ],
      diffs: [
        {
          path: "src/path/to/file.ts",
          status: "modified",
          lines: [
            "   // context line",
            "-  // old line",
            "+  // new line",
            "   // context line",
          ],
        },
      ],
    },
    {
      kind: "testing",
      title: "Run the test suite",
      description: "Run tests and lint to catch regressions.",
      tool: "run_tests",
      toolInput: "run bun run test && bun run lint",
      files: [],
      reasoning: "Never commit without proving the change didn't break anything.",
      terminal: [
        "$ forge exec bun run test",
        " Test Files  12 passed (12)",
        "      Tests  147 passed (147)",
        "$ forge exec bun run lint",
        "✔ No issues",
        "✓ All checks passed",
      ],
    },
    {
      kind: "commit",
      title: "Commit the change",
      description: "Stage and commit with a conventional message.",
      tool: "git_commit",
      toolInput: 'git commit -m "feat: implement requested change"',
      files: ["src/path/to/file.ts"],
      reasoning: "Conventional-commits message keeps the git history scannable and feeds the auto-generated changelog.",
      terminal: [
        "$ forge git add -A",
        "$ forge git commit -m \"feat: implement requested change\"",
        "[forge/implement-change e5a9d33] feat: implement requested change",
        " 1 file changed, 4 insertions(+), 2 deletions(-)",
        "✓ Commit e5a9d33 created",
      ],
    },
    {
      kind: "pr",
      title: "Open pull request",
      description: "Push the branch and open a PR against main.",
      tool: "open_pr",
      toolInput: "gh pr create --title 'feat: implement requested change'",
      files: [],
      reasoning: "PR is the unit of review — always finish here, even for trivial changes.",
      terminal: [
        "$ forge git push -u origin forge/implement-change",
        "$ forge gh pr create --base main --title 'feat: implement requested change'",
        "✓ Pull request #146 opened",
        "  https://github.com/acme/webapp/pull/146",
      ],
    },
  ],
};

/* ------------------------------------------------------------------ */
/* Registry + matcher                                                 */
/* ------------------------------------------------------------------ */

export const SCENARIOS: Scenario[] = [
  darkModeScenario,
  authBugScenario,
  addTestsScenario,
  refactorScenario,
  genericScenario,
];

/**
 * Pick the scenario whose keywords best match the task description.
 * Falls back to the generic scenario when nothing matches.
 */
export function matchScenario(description: string): Scenario {
  const lower = description.toLowerCase();
  let best: { scenario: Scenario; score: number } | null = null;

  for (const s of SCENARIOS) {
    if (s.id === "generic") continue;
    let score = 0;
    for (const kw of s.keywords) {
      if (lower.includes(kw)) score += kw.length; // longer matches weigh more
    }
    if (!best || score > best.score) {
      best = { scenario: s, score };
    }
  }

  return best && best.score > 0 ? best.scenario : genericScenario;
}

export function getScenarioById(id: string): Scenario | undefined {
  return SCENARIOS.find((s) => s.id === id);
}

# Deployment

Forge is designed to deploy cleanly on the **Vercel free tier**. This guide walks through the deployment, environment variables, and optional Postgres upgrade.

## Table of contents

1. [Prerequisites](#prerequisites)
2. [Deploy to Vercel](#deploy-to-vercel)
3. [Environment variables](#environment-variables)
4. [Runtime modes on Vercel](#runtime-modes-on-vercel)
5. [Upgrading to Vercel Postgres](#upgrading-to-vercel-postgres)
6. [Custom domains](#custom-domains)
7. [Troubleshooting](#troubleshooting)

---

## Prerequisites

- A GitHub account (the repo is at `KeshavCracks/sitty`)
- A Vercel account (free tier is fine)
- (Optional) An Anthropic API key for Claude-powered planning
- (Optional) A GitHub personal access token for real repo integration

---

## Deploy to Vercel

### Option A: Vercel dashboard

1. Go to [vercel.com/new](https://vercel.com/new).
2. Import the `KeshavCracks/sitty` repository.
3. Vercel auto-detects Next.js 16 — the build settings are correct out of the box:
   - **Framework preset**: Next.js
   - **Build command**: `next build` (handled by `bun run build`)
   - **Output directory**: `.next`
4. Add environment variables (see below).
5. Click **Deploy**.

### Option B: Vercel CLI

```bash
npm i -g vercel
cd sitty
vercel          # preview deploy
vercel --prod   # production deploy
```

The CLI will prompt for environment variables on first deploy.

---

## Environment variables

All variables are **optional** — Forge runs in demo mode without any.

| Variable | Value | Purpose |
|----------|-------|---------|
| `DATABASE_URL` | `file:./dev.db` | SQLite path. Use a Vercel Postgres URL for persistence. |
| `ANTHROPIC_API_KEY` | `sk-ant-...` | Enables Claude as the primary reasoning model. |
| `GITHUB_TOKEN` | `ghp_...` | Enables GitHub integration. Scope: `repo`. |
| `FORGE_RUNTIME_MODE` | `demo` / `cloud` / `local` | Auto-detected if unset. |

### Adding env vars in Vercel

1. Project Settings → Environment Variables.
2. Add each variable with the appropriate scope (Production, Preview, Development).
3. Redeploy for changes to take effect.

---

## Runtime modes on Vercel

Forge auto-detects the runtime mode:

- If `VERCEL=1` is set (always true on Vercel) and no API keys are configured → **demo** mode.
- If `ANTHROPIC_API_KEY` or `GITHUB_TOKEN` is set → **cloud** mode.
- To force a specific mode, set `FORGE_RUNTIME_MODE` explicitly.

### What works in each mode on Vercel

| Capability | Demo | Cloud |
|------------|------|-------|
| Landing + app UI | ✅ | ✅ |
| LLM planning (Claude / Z.ai) | ❌ (scenario fallback) | ✅ Real |
| GitHub repo listing | ❌ (setup instructions) | ✅ Real |
| Live agent execution UX | ✅ Simulated | ✅ Simulated |
| Real file edits / PRs | ❌ | ❌ (use local runtime) |

For real file edits and PR creation, see [`LOCAL_RUNTIME.md`](./LOCAL_RUNTIME.md).

---

## Upgrading to Vercel Postgres

SQLite works for development but doesn't persist across Vercel serverless invocations. For production, use Vercel Postgres:

1. **Create a Postgres database** in the Vercel dashboard (Storage → Create → Postgres). Free tier includes 60 hours of compute / month.

2. **Update the Prisma datasource** in `prisma/schema.prisma`:

   ```prisma
   datasource db {
     provider = "postgresql"
     url      = env("DATABASE_URL")
   }
   ```

3. **Set `DATABASE_URL`** to the Vercel Postgres connection string (Vercel auto-injects it after linking).

4. **Push the schema**:

   ```bash
   bun run db:push
   ```

5. **Redeploy**.

That's it — no code changes needed. The Prisma client works the same way regardless of the underlying database.

---

## Custom domains

1. Vercel dashboard → your project → Settings → Domains.
2. Add your domain (e.g. `forge.yourdomain.com`).
3. Configure DNS as Vercel instructs (usually a CNAME record).
4. Vercel handles SSL automatically.

---

## Troubleshooting

### "Anthropic API error 401"

Your `ANTHROPIC_API_KEY` is invalid or expired. Get a new one at [console.anthropic.com](https://console.anthropic.com/).

### "GitHub API 401"

Your `GITHUB_TOKEN` is invalid or expired. Generate a new one at [github.com/settings/tokens](https://github.com/settings/tokens) with the `repo` scope.

### Build fails with "Cannot find module"

Run `bun install` (or `npm install`) to ensure dependencies are installed. Vercel does this automatically, but local builds need it.

### Hydration mismatch warning

This usually means a component is rendering different content on server vs client. Forge handles this with `next-themes` and the `suppressHydrationWarning` flag on `<html>`. If you add new client-only components, gate them behind a `mounted` flag.

### Function timeout on Vercel free tier

Free tier has a 10s function timeout. The `/api/agent/plan` endpoint is the only one that might approach this. If you hit timeouts:

- Set `FORGE_RUNTIME_MODE=demo` to skip the LLM call.
- Or upgrade to Vercel Pro for 60s function timeouts.

### Database connection errors on Vercel

SQLite doesn't persist across serverless invocations. Either:

- Use the default localStorage (works for the demo), or
- Upgrade to Vercel Postgres (see above).

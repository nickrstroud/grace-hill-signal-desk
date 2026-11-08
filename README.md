# Grace Hill Signal Desk

An always-on Claude agent that watches a set of Grace Hill's multifamily and commercial real estate customers, plus the rental housing market around them. It ranks which account needs a conversation first, and turns each meaningful signal into a ready-to-run account management workflow. Built as an independent portfolio project, not affiliated with Grace Hill. It runs daily on a schedule with no database.

Live: https://grace-hill-signal-desk.vercel.app (after deploy)

## What it does

- **Account lane.** Fetches news per account (Google News RSS), sends only new articles to Claude Haiku, and gets back scored signals: score (-2 risk to +2 opportunity), update type, a play, and one concrete suggested action.
- **Industry lane.** A second pass reads rental housing and real estate news, Federal Register rules (HUD, CFPB, Labor, FTC), and topic searches. It keeps what an account manager could act on, and tags which Grace Hill solutions each item touches ("affects what they own" vs "expansion angle").
- **Ranking.** Signals are weighted by strength, last 90 days only, 30-day half-life; risk weighs slightly more than upside. ARR bands and a renewal window (120 days) multiply the score.
- **Learns from the user.** 👍 / 👎 on every signal reweights that update type live and re-ranks the accounts.
- **Workflows.** Each non-neutral signal gets a pre-generated play owned by the Account Manager: five stages (Validate, Align, Engage Customer, Act, Close Loop) with timing and tasks, a "done when", and drafts of the customer email, Slack note, and CRM task. Customer Success is consulted on delivery; large or rescoped opportunities go to the Director, Account Management.
- **Ask the agent.** Plain-English Q&A over the dashboard's own data, with a daily question cap.
- **Filters.** Sentiment, solution, workflow status, update type, time period, and account.

## Architecture

1. `scripts/run.ts`: daily pipeline (accounts, industry lane, workflows). Fails loudly if the API key is missing or rejected instead of silently skipping accounts. `--days=N` widens the news window for a catch-up run.
2. Results are written to `data/` as JSON and committed by a scheduled GitHub Action (`.github/workflows/daily-run.yml`, 9am ET). The git history is the audit trail.
3. A static Next.js app reads that JSON at build time; every commit redeploys on Vercel. The only server route is `app/api/ask/route.ts`.

All vendor-specific framing (solution lineup, scoring rubric, industry scope and sources, disclaimer) lives in [`lib/vendor.ts`](./lib/vendor.ts). The customer list is `data/companies.json`.

The customers, sponsors, ARR, and renewal dates are illustrative placeholders for the demo, drawn from public Grace Hill case studies. Lease results and AUM in the notes are customer-reported context, not contract values. Every signal comes from public news, linked to its source.

## Setup

```bash
bun install
cp .env.local.example .env.local   # add your ANTHROPIC_API_KEY
bun run run                        # one local run, writes to data/
bun run dev                        # preview the dashboard
```

Environment:

| Variable | Where | Purpose |
|---|---|---|
| `ANTHROPIC_API_KEY` | GitHub Actions secret | Daily pipeline |
| `ANTHROPIC_API_KEY` | Vercel env (Production) | "Ask the agent". Use a separate key |
| `KV_REST_API_URL`, `KV_REST_API_TOKEN` | Vercel env (Upstash Redis) | Daily question cap (falls back to in-memory) |

Use one dedicated Anthropic key per purpose, turn on auto-reload in billing, and set a monthly spend limit as a backstop.

Trigger a manual or catch-up run from the Actions tab (`workflow_dispatch`, with a `days` input), or locally with `bun run run -- --days=120`.

## Cost

Claude Haiku at roughly a cent or two per account per run. Eight accounts plus the industry lane and workflows is a few dollars a month. News, Federal Register, and RSS are free.

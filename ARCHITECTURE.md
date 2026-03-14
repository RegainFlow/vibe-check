# VibeCheck — System Architecture

## Audit Pipeline

The core audit flow is a 5-step Inngest function (`lib/inngest/functions.ts`):

```
ingest → scan → analyze → [cap] → rewrite → finalize
```

1. **Ingest** — Clone the GitHub repo to a temp directory (`lib/analysis/ingestion/github.ts`)
2. **Scan** — Walk the file tree, read contents, skip ignored dirs/extensions (`lib/analysis/scanner.ts`, max 2000 files)
3. **Analyze** — Run 7 analyzers in parallel via `Promise.allSettled`, deduplicate findings, calculate scores (`lib/analysis/engine.ts`)
4. **Cap** — Filter to top 3 most severe findings per category (max 21 total) to limit GPT rewriter costs. Scores are unaffected — they're computed from ALL findings in step 3.
5. **Rewrite** — Send capped findings to GPT-4o in batches of 12 for plain-English descriptions + fix prompts (`lib/openai/rewriter.ts`)
6. **Finalize** — Store scores in `audits` table, insert findings into `findings` table

On failure, the `onFailure` handler sets audit status to `"failed"` with an error message.

## Analysis Engine

### 7 Category Analyzers (`lib/analysis/analyzers/`)

All analyzers run concurrently. Each returns `RawFinding[]` for its category:

| Analyzer              | Weight | What it checks                          |
| --------------------- | ------ | --------------------------------------- |
| `security`            | 25%    | Secrets, injection, auth issues         |
| `architecture`        | 15%    | File structure, coupling, patterns      |
| `maintainability`     | 15%    | Complexity, naming, duplication         |
| `error-handling`      | 15%    | Try/catch, error boundaries, validation |
| `scalability`         | 10%    | Performance patterns, resource usage    |
| `tech-debt`           | 10%    | TODOs, deprecated APIs, outdated deps   |
| `prompt-architecture` | 10%    | AI prompt patterns (for AI-built apps)  |

### Scoring (`lib/analysis/scoring.ts`)

- Each category starts at 100, deducted per finding: **critical −15**, **warning −5**, **info −1**
- Category scores are floored at 0
- Overall score = weighted average using `CATEGORY_WEIGHTS` from `lib/constants.ts`
- Grade thresholds: A (90+), B (80+), C (70+), D (60+), F (<60)

## Inngest Orchestration

- **Client:** `lib/inngest/client.ts`
- **Function:** `run-audit` triggered by `audit/started` event
- **Route:** `app/api/inngest/route.ts` serves the Inngest endpoint
- **Config:** 0 retries, with `onFailure` handler for error recording
- Each `step.run()` call is independently retryable and checkpointed by Inngest

## Database (Supabase)

### Tables

| Table      | Purpose                                       |
| ---------- | --------------------------------------------- |
| `profiles` | User profiles, plan, Stripe IDs (extends `auth.users`) |
| `audits`   | Audit records with scores, metadata, status   |
| `findings` | Individual findings linked to an audit        |

### Row-Level Security (RLS)

All 3 tables have RLS enabled:
- **profiles:** users can read/update their own
- **audits:** users can view their own, insert with their `user_id` or `null`
- **findings:** users can view findings belonging to their audits

### Triggers
- `on_auth_user_created` — auto-creates a profile row on signup
- `updated_at` triggers on `profiles` and `audits`

## Stripe Integration

- **Checkout:** `app/api/stripe/checkout/` creates a Stripe Checkout session
- **Portal:** `app/api/stripe/portal/` redirects to Stripe billing portal
- **Webhook:** `app/api/webhook/stripe/` handles Stripe events → updates `profiles.plan`
- **Config:** `lib/stripe/config.ts`

Flow: user clicks upgrade → checkout session → payment → webhook fires → plan updated in DB.

## Auth

- Supabase OAuth (Google provider)
- `proxy.ts` handles cookie-based session management (Next.js 16 proxy file, auto-activated)
- `app/api/auth/callback/route.ts` exchanges the OAuth code for a session
- `components/shared/AuthButton.tsx` — reactive sign-in / Dashboard link in navbar
- `components/shared/LoginModal.tsx` — modal triggered by `?login=true` (e.g. from dashboard redirect)
- Client: `lib/supabase/client.ts` (browser), `lib/supabase/server.ts` (server components), `lib/supabase/admin.ts` (service role)

## API Routes

| Route                          | Method | Purpose                        |
| ------------------------------ | ------ | ------------------------------ |
| `api/audit/start`              | POST   | Start a new audit              |
| `api/audit/status/[id]`       | GET    | Poll audit status              |
| `api/auth/callback`           | GET    | OAuth callback handler         |
| `api/github`                  | GET    | Fetch GitHub repo metadata     |
| `api/inngest`                 | POST   | Inngest webhook endpoint       |
| `api/og/[token]`              | GET    | Dynamic OG image generation    |
| `api/stripe/checkout`         | POST   | Create checkout session        |
| `api/stripe/portal`           | POST   | Create billing portal session  |
| `api/webhook/stripe`          | POST   | Stripe webhook handler         |

## Component Organization

```
components/
  ui/           # Primitive UI components (CVA + @base-ui/react)
                # Button, Badge, Tabs, Tooltip
  shared/       # App-wide layout: Navbar, Footer
  marketing/    # Landing page: Hero, Features, HowItWorks, SampleReport,
                #   SocialProof, CTABanner
  audit/        # Audit results: ScoreGauge, ScoreOverview, FindingCard,
                #   FindingsList, AuditProgress
  dashboard/    # User dashboard: AuditHistory, DashboardNav, DashboardTopBar
```

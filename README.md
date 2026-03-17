# VibeCheck

AI-powered code audit platform for non-technical founders. Get a plain-English, veteran inspection of your AI-built codebase, scored across 7 categories with actionable fix prompts. Features a retro 2D dungeon RPG aesthetic.

![Next.js](https://img.shields.io/badge/Next.js-16-black) ![React](https://img.shields.io/badge/React-19-blue) ![Tailwind](https://img.shields.io/badge/Tailwind-v4-38bdf8) ![Supabase](https://img.shields.io/badge/Supabase-green) ![Stripe](https://img.shields.io/badge/Stripe-purple) ![OpenAI](https://img.shields.io/badge/OpenAI-GPT--4o-412991) ![Inngest](https://img.shields.io/badge/Inngest-orange)

## What is VibeCheck?

VibeCheck is an AI-powered code audit platform built for non-technical founders who ship with AI coding tools (Cursor, Copilot, Claude Code, etc.) and need to know if their codebase is actually production-ready.

Submit a public GitHub repo or upload a ZIP, and VibeCheck runs 7 specialized analyzers in parallel across your entire codebase. The result is a plain-English report scored across every category, with actionable fix prompts you can paste directly into your AI coding tool to resolve issues. Every finding is rewritten by GPT-4o from raw technical output into founder-friendly language.

The whole experience is wrapped in a retro dungeon RPG aesthetic — your code is the dungeon, and VibeCheck is the veteran adventurer inspecting it.

## Key Features

### 7-Category Analysis Engine

Every audit scores your codebase across 7 independently weighted categories:

- **Security** — vulnerabilities, exposed secrets, injection risks
- **Architecture** — structure, separation of concerns, routing patterns
- **Maintainability** — readability, naming, code organization
- **Error Handling** — try/catch coverage, error boundaries, graceful failures
- **Scalability** — performance bottlenecks, N+1 queries, caching gaps
- **Tech Debt** — deprecated APIs, TODOs, dead code, outdated patterns
- **Prompt Architecture** — AI prompt quality, context handling, guardrails

All 7 analyzers run in parallel. Findings are deduplicated and scored independently per category.

### AI-Powered Plain-English Rewriting

Raw technical findings are rewritten by GPT-4o into founder-friendly language. Every finding includes:

- A **"why it matters"** description in plain English
- An **actionable fix prompt** you can paste directly into Claude, Cursor, or Copilot

### Skills System

A curated database of programming patterns matched to findings by category. Each finding recommends a relevant skill with a compatibility rating:

- **Best Fit** — directly addresses the finding
- **Good Fit** — strongly related pattern
- **Possible Fit** — may help depending on context

One-click copy buttons generate prompts tailored for Claude, Codex, or a generic format.

### Observability Badges

Every finding is tagged with metadata badges so you know the cost of fixing it before you start:

- **AI Fix Effort** — Quick Fix / Moderate / Deep Refactor
- **Context Load** — Low / Med / High
- **Estimated Agent Passes** — Single-prompt / Multi-step / Large refactor
- **Likely Files Touched** — 1–2 / 3–5 / 6+

### AI Repair Summary

An aggregated repair profile across all findings showing:

- Effort distribution (how many quick fixes vs. deep refactors)
- Context load breakdown
- Estimated agent passes

Tells you upfront how much work the fixes will take before you start.

### Shareable Reports

Every audit generates a public report link with OG image generation for social sharing.

## How It Works

1. **Submit** — Paste a public GitHub URL or upload a ZIP file
2. **Scan** — Repo is cloned/extracted and scanned (up to 2,000 files)
3. **Analyze** — 7 analyzers run in parallel, findings deduplicated and scored
4. **Rewrite** — Findings capped (1 per category, max 7) and rewritten by GPT-4o into plain English
5. **Report** — Scores, findings, fix prompts, skill recommendations, and observability badges delivered

## Project Structure

```
app/                  # Next.js App Router pages & API routes
  api/                # Route handlers (audit, auth, stripe, inngest, etc.)
  audit/              # Audit results page
  dashboard/          # User dashboard
  pricing/            # Pricing page
  report/             # Shareable report page
components/
  ui/                 # Base UI components (Button, Badge, Tabs, Tooltip)
  shared/             # Navbar, Footer, AuthButton, LoginModal
  marketing/          # Landing page sections
  audit/              # Audit components (ScoreGauge, FindingCard, AIRepairSummary)
  dashboard/          # Dashboard components
lib/
  analysis/           # Code analysis engine
    analyzers/        # 7 category analyzers (security, architecture, etc.)
    engine.ts         # Orchestrates analyzers, scoring
    scanner.ts        # File discovery & reading
    scoring.ts        # Score calculation
    observability.ts  # Observability badge derivation
  inngest/            # Background job orchestration
  openai/             # GPT-4o rewriter for plain-English findings
  skills/             # Skill queries and prompt builders
  stripe/             # Stripe config & helpers
  supabase/           # Supabase client (browser, server, admin)
  constants.ts        # Plans, categories, weights, severity deductions
types/                # Shared TypeScript types
  skills.ts           # Skill type definitions
  observability.ts    # Observability badge types
supabase/
  migrations/         # Database schema migrations
```

## Prerequisites

- Node.js 20+
- npm
- [Supabase CLI](https://supabase.com/docs/guides/cli) (for local development)
- Stripe account (test keys work)
- OpenAI API key
- [Inngest Dev Server](https://www.inngest.com/docs/local-development)

## Setup

1. **Install dependencies**

   ```bash
   npm install
   ```

2. **Configure environment variables**

   ```bash
   cp .env.example .env.local
   ```

   Fill in the values — see [`.env.example`](.env.example) for all required keys.

3. **Start Supabase locally**

   ```bash
   npx supabase start
   ```

4. **Run Inngest dev server**

   ```bash
   npx inngest-cli@latest dev
   ```

5. **Start the dev server**

   ```bash
   npm run dev
   ```

   Open [http://localhost:3000](http://localhost:3000).

## Scripts

| Command         | Description              |
| --------------- | ------------------------ |
| `npm run dev`   | Start dev server         |
| `npm run build` | Production build         |
| `npm run start` | Start production server  |
| `npm run lint`  | Run ESLint               |

# VibeCheck

AI-powered code audit platform for non-technical founders. Get a plain-English, veteran inspection of your AI-built codebase, scored across 7 categories with actionable fix prompts. Features a retro 2D dungeon RPG aesthetic.

![Next.js](https://img.shields.io/badge/Next.js-16-black) ![React](https://img.shields.io/badge/React-19-blue) ![Tailwind](https://img.shields.io/badge/Tailwind-v4-38bdf8) ![Supabase](https://img.shields.io/badge/Supabase-green) ![Stripe](https://img.shields.io/badge/Stripe-purple) ![OpenAI](https://img.shields.io/badge/OpenAI-GPT--4o-412991) ![Inngest](https://img.shields.io/badge/Inngest-orange)

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
  shared/             # Navbar, Footer
  marketing/          # Landing page sections
  audit/              # Audit-specific components (ScoreGauge, FindingCard, etc.)
  dashboard/          # Dashboard components
lib/
  analysis/           # Code analysis engine
    analyzers/        # 7 category analyzers (security, architecture, etc.)
    engine.ts         # Orchestrates analyzers, scoring
    scanner.ts        # File discovery & reading
    scoring.ts        # Score calculation
  inngest/            # Background job orchestration
  openai/             # GPT-4o rewriter for plain-English findings
  stripe/             # Stripe config & helpers
  supabase/           # Supabase client (browser, server, admin)
  constants.ts        # Plans, categories, weights, severity deductions
types/                # Shared TypeScript types
supabase/
  migrations/         # Database schema migrations
```

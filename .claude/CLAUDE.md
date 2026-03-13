# VibeCheck — Claude Code Project Instructions

## Tech Stack

- **Framework:** Next.js 16 (App Router) with React 19
- **Styling:** Tailwind CSS v4 (PostCSS plugin, `@import "tailwindcss"` syntax)
- **UI:** CVA (class-variance-authority) + @base-ui/react primitives + framer-motion
- **Notifications:** sonner (toast notifications)
- **Backend:** Supabase (auth, database, RLS), Inngest (background jobs), OpenAI (GPT-4o rewriter)
- **Payments:** Stripe (checkout + webhooks)
- **Language:** TypeScript (strict)

## Conventions

- **Server components by default.** Only add `"use client"` when the component needs hooks, event handlers, or browser APIs.
- **App Router patterns:** pages are `page.tsx`, layouts are `layout.tsx`, API routes are `route.ts`.
- **Imports:** use `@/` path alias (maps to project root).
- **Utility:** `cn()` from `lib/utils` for merging Tailwind classes. Constants from `lib/constants.ts`.
- **Component pattern:** UI components use CVA for variants, wrap @base-ui/react primitives. See `components/ui/button.tsx` for the canonical example.
- **Theme:** Dark/light mode via next-themes (`enableSystem`, default `"dark"`). Toggle via `ThemeToggle` component. CSS vars in `globals.css` (`:root` = light, `.dark` = dark).
- **Animation:** Use shared variants from `lib/motion.ts` (`fadeUp`, `fadeIn`, `scaleIn`, `staggerContainer`). Use `MotionDiv`/`MotionSection` wrappers from `components/shared/MotionWrapper.tsx` in server components.
- **Toasts:** Use `sonner` (`toast.success()`, `toast.error()`) instead of custom copy-feedback state.
- **Styling reference:** see `STYLES.md` for color palette, custom utilities, and animation patterns.

## Key Files

- `lib/motion.ts` — Shared framer-motion variants and transitions
- `components/shared/MotionWrapper.tsx` — `MotionDiv`/`MotionSection` for server component animation
- `components/shared/PageTransition.tsx` — `AnimatePresence` page enter/exit animation
- `components/ui/theme-toggle.tsx` — Sun/Moon theme toggle with icon crossfade
- `lib/constants.ts` — Plans, categories, weights, severity deductions, ignored paths
- `lib/inngest/functions.ts` — Main audit pipeline (ingest → scan → analyze → cap → rewrite → finalize)
- `lib/analysis/engine.ts` — Runs 7 analyzers in parallel, deduplicates, scores
- `lib/openai/rewriter.ts` — GPT-4o batch rewriter for plain-English findings
- `proxy.ts` — Supabase auth cookie handling middleware

## Build & Verify

```bash
npm run build    # Verify TypeScript + build
npm run lint     # ESLint check
```

## Known Limitations

- **Findings capped at 1 per category** (max 7 total) before GPT rewrite step. This limits OpenAI API costs. Scores are still computed from all findings — only the report output is capped. This is a temporary limitation.

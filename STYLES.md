# VibeCheck — Styling Reference

## Theme

Supports dark and light mode via `next-themes` with `enableSystem`. Default theme is `dark`. Users can toggle with the `ThemeToggle` component in the navbar and footer.

CSS variables are defined in `app/globals.css` with `:root` for light mode and `.dark` for dark mode.

## Color Palette

All colors defined as CSS custom properties in `app/globals.css`:

| Token             | Light        | Dark        | Usage                      |
| ----------------- | ------------ | ----------- | -------------------------- |
| `--background`    | `#FAFBFC`    | `#0B0D17`   | Page background            |
| `--foreground`    | `#0F172A`    | `#F1F5F9`   | Primary text               |
| `--card`          | `#FFFFFF`    | `#111528`   | Card backgrounds           |
| `--primary`       | `#7C3AED`    | `#7C3AED`   | Purple accent, CTAs        |
| `--secondary`     | `#F1F5F9`    | `#1E2536`   | Muted backgrounds          |
| `--muted`         | `#F1F5F9`    | `#1E2536`   | Disabled / subtle surfaces |
| `--muted-foreground` | `#64748B` | `#8B95A9`   | Secondary text             |
| `--destructive`   | `#EF4444`    | `#EF4444`   | Error / critical states    |
| `--success`       | `#22C55E`    | `#22C55E`   | Positive indicators        |
| `--warning`       | `#F59E0B`    | `#F59E0B`   | Warning indicators         |
| `--border`        | `#E2E8F0`    | `#1E2536`   | Borders                    |
| `--ring`          | `#7C3AED`    | `#7C3AED`   | Focus ring                 |

**Gradient colors:** `--gradient-start: #7C3AED`, `--gradient-end: #2563EB` (purple to blue).

## Fonts

- **Sans:** Inter (`--font-sans`) — body text, headings
- **Mono:** JetBrains Mono (`--font-mono`) — code snippets, terminal UI

Loaded via `next/font/google` in `app/layout.tsx`.

## Custom Utility Classes

Defined in `app/globals.css` under `@layer utilities`. Theme-aware via CSS custom properties:

| Class             | Description                                           |
| ----------------- | ----------------------------------------------------- |
| `.glass`          | Glassmorphism panel — blur + subtle purple gradient    |
| `.glow-card`      | Card with hover glow effect + lift                     |
| `.glow-purple`    | Purple box-shadow glow                                 |
| `.gradient-purple` | Solid purple to blue gradient background              |
| `.gradient-text`  | Purple to violet to blue gradient text (via `bg-clip-text`) |
| `.terminal-card`  | Dark terminal-style card with border                   |
| `.terminal-dots`  | macOS-style traffic light dots                         |
| `.animated-border` | Rotating conic-gradient border animation              |
| `.section-glow`   | Subtle radial purple glow behind sections              |
| `.grid-pattern`   | Dotted grid background pattern                         |

## Component Variants (CVA)

### Button (`components/ui/button.tsx`)
- **Variants:** `default`, `outline`, `secondary`, `ghost`, `destructive`, `link`
- **Sizes:** `xs`, `sm`, `default`, `lg`, `icon`, `icon-xs`, `icon-sm`, `icon-lg`
- **Motion:** `whileTap={{ scale: 0.97 }}`, `whileHover={{ scale: 1.02 }}` via framer-motion wrapper

### Badge (`components/ui/badge.tsx`)
- **Variants:** `default`, `secondary`, `destructive`, `outline`, `ghost`, `link`

### Tabs (`components/ui/tabs.tsx`)
- Animated `layoutId` sliding indicator on active tab
- Check file for current variant definitions

### Input (`components/ui/input.tsx`)
- **Variants:** `default`, `ghost`
- **Sizes:** `default`, `sm`, `lg`

### Skeleton (`components/ui/skeleton.tsx`)
- Shimmer loading placeholder with `shimmer-slide` animation

## Animations

### CSS Keyframes (`app/globals.css` + `tailwind.config.ts`)

| Name            | Duration | Description                          |
| --------------- | -------- | ------------------------------------ |
| `float`         | 3s       | Gentle vertical bob                  |
| `glow-pulse`    | 2s       | Purple glow intensity pulse          |
| `card-enter`    | 0.4s     | Fade up from 10px below              |
| `score-fill`    | 1.5s     | SVG circular gauge fill              |
| `shimmer`       | 2s       | Horizontal shimmer for loading       |
| `pulse-ring`    | 2s       | Scale + opacity pulse                |
| `score-pop`     | —        | Scale bounce entrance                |
| `shimmer-slide` | —        | Slide-through shimmer                |
| `rotate-border` | 4s       | Rotating conic gradient for borders  |

### Framer Motion (`lib/motion.ts`)

Shared motion variants for consistent animations:

| Variant            | Description                              |
| ------------------ | ---------------------------------------- |
| `fadeUp`           | Fade in + slide up 20px                  |
| `fadeIn`           | Simple opacity fade                      |
| `scaleIn`          | Fade in + scale from 0.95               |
| `staggerContainer` | Parent variant, staggers children 0.1s   |
| `springTransition` | Reusable spring config                   |

**Usage patterns:**
- `whileInView="visible"` with `viewport={{ once: true }}` for scroll-triggered animations
- `AnimatePresence mode="wait"` for page/tab transitions
- `layoutId` for sliding indicators (tabs, nav)
- `useSpring` + `useTransform` for animated counters

**Motion wrappers for server components:** `MotionDiv` and `MotionSection` from `components/shared/MotionWrapper.tsx`

## Radius Scale

Defined via `--radius: 0.75rem` (12px):

| Token        | Value  | Pixels |
| ------------ | ------ | ------ |
| `--radius-sm` | `calc(var(--radius) - 4px)` | 8px |
| `--radius-md` | `calc(var(--radius) - 2px)` | 10px |
| `--radius-lg` | `var(--radius)` | 12px |
| `--radius-xl` | `calc(var(--radius) + 4px)` | 16px |

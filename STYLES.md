# VibeCheck — Styling Reference

## Theme

The application uses a **Retro 2D Dungeon RPG** inspired visual style with rounded corners for a polished feel. It supports both **light** and **dark** modes via `next-themes`, defaulting to dark.

CSS variables are defined in `app/globals.css` under `:root` (light) and `.dark` (dark).

## Color Palette

All colors defined as CSS custom properties in `app/globals.css` and extended in `tailwind.config.ts`:

| Token                | Value (dark)   | Usage                      |
| -------------------- | -------------- | -------------------------- |
| `--background`       | `#0A0D1E`      | Deep navy page background  |
| `--foreground`       | `#F1F5F9`      | Primary text               |
| `--card`             | `#111528`       | Card backgrounds           |
| `--primary`          | `#D946EF`      | Magenta accent, CTAs       |
| `--secondary`        | `#1E1B4B`      | Indigo muted backgrounds   |
| `--muted`            | `#1E2536`      | Disabled / subtle surfaces |
| `--muted-foreground` | `#8B95A9`      | Secondary text             |
| `--destructive`      | `#EF4444`      | Error / critical states    |
| `--success`          | `#22C55E`      | Positive indicators        |
| `--warning`          | `#F59E0B`      | Warning indicators         |
| `--border`           | `#1E2536`      | Borders                    |
| `--ring`             | `#D946EF`      | Focus ring                 |
| `--gold`             | `#22D3EE`      | Cyan accent (dark), `#0891B2` (light) |
| `--navy`             | `#0A0D1E`      | Navy background alias      |
| `--scanline-color`   | `rgba(217,70,239,0.05)` | Scanline overlay tint |
| `--grid-color`       | `rgba(49,46,129,0.05)`  | RPG grid line color   |
| `--gradient-bottom`  | `rgba(10,13,30,0.8)`    | Dungeon gradient bottom |
| `--btn-shadow`       | `rgba(0,0,0,0.8)`       | Button drop shadow    |

**Light-mode `--indigo-*` overrides** (`:root` only — `.dark` retains standard values):

| Variable        | Light value | Dark value |
| --------------- | ----------- | ---------- |
| `--indigo-400`  | `#C7D2FE`   | `#818CF8`  |
| `--indigo-500`  | `#A5B4FC`   | `#6366F1`  |
| `--indigo-800`  | `#E0E7FF`   | `#3730A3`  |
| `--indigo-900`  | `#EEF2FF`   | `#312E81`  |
| `--indigo-950`  | `#F5F3FF`   | `#1E1B4B`  |

**RPG Accents (Tailwind configuration):**
- `navy`: `var(--navy)`
- `indigo`: `#1E1B4B`
- `magenta`: `var(--primary)`
- `violet`: `#7C3AED`
- `cyan`: `var(--gold)`
- `electric-blue`: `#3B82F6`

## Fonts

- **Sans:** Inter (`--font-sans`) — body text, headings (used sparingly)
- **Mono:** JetBrains Mono (`--font-mono`) — **Primary font for the RPG aesthetic**, used for UI elements, labels, stats, buttons, and code snippets.

Loaded via `next/font/google` in `app/layout.tsx`.

## Custom Utility Classes

Defined in `app/globals.css` under `@layer utilities` and at root scope. The UI heavily relies on these RPG-themed classes:

| Class               | Description                                           |
| ------------------- | ----------------------------------------------------- |
| `.rpg-panel`        | Framed panel with inset shadow and glowing border     |
| `.rpg-panel-header` | Header for panels, mono font, uppercase, magenta text |
| `.rpg-button`       | Base RPG button: flat, uppercase mono, bold bottom shadow |
| `.rpg-button-primary` | Primary CTA variation (magenta background)          |
| `.rpg-input`        | Styled input field matching the RPG aesthetic         |
| `.quest-card`       | Variation of `.rpg-panel` with hover lift             |
| `.stat-value`       | Large, glowing cyan mono text for scores/stats        |
| `.stat-label`       | Small, uppercase mono text for stat descriptions      |
| `.glow-text-magenta`| Text shadow effect for magenta glow                   |
| `.glow-text-cyan`   | Text shadow effect for cyan glow                      |
| `.glow-card`        | Card with inset shadow, glowing border, and `::before` overlay |
| `.atmospheric-overlay` | Fixed linear gradient overlay for depth             |
| `.hud-line`         | Thin decorative glowing line                          |
| `.scanline`         | Animated CRT-style scanline overlay                   |
| `.terminal-frame`   | Wrapper for terminal-style UI components              |
| `.terminal-header`  | Header section for terminal components                |
| `.terminal-body`    | Body section for terminal components                  |
| `.rpg-grid`         | Subtle 40x40px grid pattern for dungeon floor texture |
| `.dungeon-gradient` | Dark linear gradient to anchor sections               |

## Background Patterns

Defined in `app/globals.css`:
- `.rpg-grid`: A subtle 40x40px grid pattern used for dungeon floor/background texture.
- `.dungeon-gradient`: A dark linear gradient used to anchor sections.
- **Body Background:** Uses fixed radial gradients for a multi-layered atmospheric glow.

## Component Variants (CVA)

### Base UI Components (`components/ui/*`)
Original shadcn/ui components exist but are generally superseded by custom `.rpg-*` utility classes for primary UI elements (buttons, inputs, cards) to maintain the strict retro aesthetic.

## Animations

### CSS Keyframes (`app/globals.css` + `tailwind.config.ts`)

| Name            | Duration | Description                          |
| --------------- | -------- | ------------------------------------ |
| `float`         | 3s       | Gentle vertical bob                  |
| `glow-pulse`    | 2s       | Magenta glow intensity pulse         |
| `flicker`       | 1.5s     | Neon-style text flicker              |
| `scanline`      | 8s       | Vertical scanline movement           |
| `card-enter`    | 0.4s     | Fade up from 10px below              |
| `score-fill`    | 1.5s     | SVG circular gauge fill              |
| `shimmer`       | 2s       | Horizontal shimmer for loading       |
| `pulse-ring`    | 2s       | Scale + opacity pulse                |

### Framer Motion (`lib/motion.ts`)

Shared motion variants for consistent animations:

| Variant            | Description                              |
| ------------------ | ---------------------------------------- |
| `fadeUp`           | Fade in + slide up 20px                  |
| `fadeIn`           | Simple opacity fade                      |
| `scaleIn`          | Fade in + scale from 0.95               |
| `staggerContainer` | Parent variant, staggers children 0.1s   |

## Radius Scale

Rounded corners using a base `--radius` of `0.5rem`, computed into size variants:

| Token        | Value                          | Computed  |
| ------------ | ------------------------------ | --------- |
| `--radius`   | `0.5rem`                       | `8px`     |
| `--radius-sm`| `calc(var(--radius) - 4px)`    | `4px`     |
| `--radius-md`| `calc(var(--radius) - 2px)`    | `6px`     |
| `--radius-lg`| `var(--radius)`                | `8px`     |
| `--radius-xl`| `calc(var(--radius) + 4px)`    | `12px`    |

## Dashboard Sidebar

All sidebar interactive elements use `rounded-lg` for consistency with the global RPG rounded style:

| Element              | Rounding      | Notes                                          |
| -------------------- | ------------- | ---------------------------------------------- |
| Nav links            | `rounded-lg`  | Both main and account nav items                |
| New Audit CTA        | `rpg-button`  | Uses `rpg-button rpg-button-primary` classes   |
| Collapse toggle      | `rounded-lg`  | Visible container with border + bg, below logo |
| Sign out button      | `rounded-lg`  | Destructive red styling (`text-red-400`)       |
| Mobile hamburger     | `rounded-lg`  | Fixed position toggle for mobile nav           |
| Active indicator bar | `rounded-full`| Left-edge bar with `top-1 bottom-1` inset      |
| Plan badge container | `rpg-panel`   | Already has `rounded-xl`, no change needed     |
| Diamond elements     | `rounded-sm`  | All rotated-45deg diamond icons use `rounded-sm` for subtle corner rounding |

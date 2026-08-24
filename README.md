# Shashank Mourya — Portfolio

A HUD-style portfolio for **Shashank Mourya**, AI Systems Engineer.
Built as a game interface: a crosshair cursor that locks onto targets, a mission
log, a weapon-loadout skills screen, an F1-style telemetry chart, and a working
contact terminal.

## Run it

```bash
npm install
npm run dev          # http://localhost:3000
npm run build        # production build
npm run start        # serve the production build
npm run lint         # tsc --noEmit
npm run test:e2e     # Playwright suite (starts the prod server itself)
npm run test:e2e:headed
```

## Design system

Everything derives from tokens in `app/globals.css`. Every colour on the site
reads through a `var(--color-*)` custom property — there are no hard-coded hexes
in components — so swapping the token block re-themes the whole build.

| Token | NIGHT | DAY | Job |
| --- | --- | --- | --- |
| `--color-void` / `-panel` / `-raise` | `#08090C` → `#141922` | `#EEF1F5` → `#FFFFFF` | Surfaces, ground to raised |
| `--color-line` / `-hot` | `#1E242E` / `#2B3341` | `#D3DAE3` / `#AEB9C7` | Hairline rules |
| `--color-ink` / `-dim` / `-faint` | `#E8EDF5` / `#8B97A8` / `#7B8797` | `#0D131B` / `#46525F` / `#5C6873` | Text, all ≥ 4.5:1 |
| `--color-cyan` | `#22E0D6` | `#006B65` | System, interactive, active state |
| `--color-magenta` | `#FF3D7F` | `#BD1257` | Rank, records, achievement |
| `--color-amber` | `#FFB238` | `#8A5300` | Telemetry and measured data |

The accents each carry **one fixed meaning** and are used sparingly — the page
is ~90% monochrome, the way a real game HUD is. Spacing is on an 8px
baseline (`--u`); panel padding only uses 24/32/48.

### Theming

NIGHT is the default and the brand. DAY is a genuine second design — a daylight
pit-wall printout, not an inversion: cool paper ground, near-black ink, and the
same three accents darkened until they hold 4.5:1 on paper. The HUD chrome flips
too (`--scan-line`, `--scan-blend`, `--vignette`, `--sweep-tint`), because
scanlines on paper are ink rather than light.

- The **NIGHT / DAY toggle** sits in the header (`components/hud/ThemeToggle.tsx`).
- First visit follows the system preference; an explicit choice is stored in
  `localStorage` under `hud-theme` and always wins after that.
- While nothing is stored, the page keeps following the system live.
- `THEME_INIT_SCRIPT` is inlined in `<head>` and stamps `data-theme` **before
  first paint**, so there is no flash of the wrong theme. Because it always
  stamps an explicit value, the palette lives in one CSS block with no
  duplicated `prefers-color-scheme` copy to drift.
- With JS disabled nothing is stamped and the visitor gets NIGHT.

Type: **Chakra Petch** (display), **Inter Tight** (body), **JetBrains Mono**
(data and terminal, with tabular figures via `.tnum`).

`.label` and `.label-hot` live in `@layer components` so Tailwind colour
utilities always override them — without the layer they collide at equal
specificity and the winner depends on source order.

## Structure

```
app/
  layout.tsx        fonts, metadata
  page.tsx          section composition
  globals.css       tokens, HUD chrome, motion primitives
  icon.svg          favicon (crosshair)
components/hud/
  Crosshair.tsx     custom cursor + lock-on states
  HudFrame.tsx      scanlines, sweep, corner brackets, status strip
  BootSequence.tsx  cold-boot overlay (once per tab, skippable)
  Nav.tsx           top bar, left index rail, mobile tab bar
  ThemeToggle.tsx   NIGHT / DAY switch + the no-flash init script
  SectionHeader.tsx indexed section headings
  Typewriter.tsx    terminal-style typing
components/sections/
  Hero.tsx          standby screen
  Dossier.tsx       narrative + Nerumach.AI deployment
  MissionLog.tsx    project grid
  MissionBrief.tsx  full-screen briefing dialog
  Loadout.tsx       skills as a weapon-select screen
  Telemetry.tsx     record as an F1 lap chart
  Comms.tsx         contact terminal + plain channel links
lib/data.ts         every string on the site
tests/              Playwright E2E
legacy/             the previous static site, kept for reference
```

## Content

`lib/data.ts` is the single source of truth. Structured facts come from the 2026
resume; the longer narrative framing carries over from the previous build. To
update the site, edit that file — no component holds copy.

## Accessibility

Enforced by the E2E suite, not just intended:

- Every visible text node clears **4.5:1** (3:1 for large text) against its real
  computed background, **in both themes**. Asserted programmatically over the
  whole DOM. Colours are parsed by painting to a canvas (computed styles
  serialise `color-mix` as `oklab(… / 0.82)`, which no regex reads correctly)
  and translucent layers are composited, so the measurement matches what a
  reader actually sees behind the frosted bars.
- The custom cursor layer is `pointer-events: none` and never intercepts clicks.
- The native cursor is only hidden on `(pointer: fine)`; touch is untouched.
- Skip link is first in the tab order; focus rings are restyled, never removed.
- The mission briefing is a real dialog: focus moves in, is trapped, returns to
  the trigger on close, and Escape dismisses.
- Loadout tabs follow the tab pattern with arrow-key navigation.
- `prefers-reduced-motion` kills the boot sequence, the sweep, the typewriter
  and the cursor lag.
- No horizontal overflow at 375px; mobile gets its own docked section tab bar.

## Deploying

The build is fully static. On Vercel it deploys as-is. For a static host, add
`output: "export"` to `next.config.mjs` and serve `out/`.

# Architecture

## Principles

1. **Physiology first, rules second.** Diagnostic and treatment content is derived from two equations (Edelman; urine volume = solute ÷ Uosm). The simulator and calculators implement the same equations the text teaches, so what learners read and what they see agree.
2. **Every claim is traceable.** Content uses `[@refId]` markers that render as numbered citations linking to `#/reference/<id>`. Tests fail if a marker does not resolve or a reference is never cited.
3. **Engines are pure and tested.** All medical logic lives in `src/lib` as side-effect-free TypeScript with vitest coverage; UI components only render engine output.
4. **Content is data.** Modules, questions, cases, cards and drugs are typed objects (`src/data/types.ts`), rendered by generic components.

## Engines (`src/lib`)

| File | Responsibility |
|---|---|
| `physiology.ts` | Osmolality (calculated, effective, gap), glucose-corrected Na, TBW, mass-balance infusion / Adrogué–Madias, litres-to-target, free-water deficit, free-water and electrolyte-free water clearance, Furst ratio, fractional excretion, solute-limited urine volume, severity classification |
| `fluids.ts` | Fluid compositions (Na, K, Na+K) |
| `fluidLab.ts` | Hour-by-hour simulation (dt = 15 min). State: TBW, exchangeable Na+K, ECF Na balance. Kidney: excretes surplus Na+K with τ = 16 h, avidly retains when depleted; urine volume = (2·U_NaK + urea) ÷ Uosm. Uosm set by ADH mode (physiologic osmotic + baroreceptor, SIAD fixed, AVP-D, AVP-R) and drugs (desmopressin ≥ 700, tolvaptan ≤ 200, loop ≈ 300, thiazide ≥ 200). Thirst optional. Six presets with lessons. |
| `sodiumMonitor.ts` | Correction-limit analysis by 24-h treatment period (peak and latest change, remaining allowance, 48-h cumulative), with EU/US limits by acuity and ODS risk, and guideline actions |
| `hyponatremiaNavigator.ts` | EU 2014 urine-first algorithm with emergency triage, tonicity checks (pseudo, translocational, ineffective osmoles), urine Osm/Na branches, diuretic branch with FE urate, ECF branches, SIAD exclusions, ODS risk and "what would change my mind" |
| `polyuria.ts` | Four patient archetypes; water-deprivation kinetics, Miller stopping rules, desmopressin response, interpretation (including the 300–800 grey zone) and copeptin interpretation (baseline, hypertonic saline, arginine) |
| `srs.ts` | Leitner spaced repetition |

## UI

- `App.tsx` provides a hash router (`#/`, `#/learn/:id`, `#/lab?preset=`, `#/cases/:id`, `#/practice`, `#/cards`, `#/tools/:id`, `#/reference/:refId`).
- `components/learn/ModulePage.tsx` renders `Block` types (paragraph, points, table, callout, equation, steps, patterns, interactive) and the mastery check.
- `components/interactives` holds the embeddable widgets, reused on the Tools page.
- `components/lab/LineChart.tsx` is a dependency-free responsive SVG chart: hover/keyboard crosshair with tooltip, labelled reference lines, a legend for two or more series and theme tokens (`--viz-*`).
- State: `store/progress.ts` (zustand `persist`, storage wrapped for private-mode failures). Theme: class strategy, initialised before first paint.

## Accessibility

Semantic landmarks, skip link, labelled inputs, `aria-live` results, radio/checkbox roles on answer options, keyboard-operable charts, colour never the only signal (icons and labels on statuses), WCAG AA contrast in both themes (axe-checked).

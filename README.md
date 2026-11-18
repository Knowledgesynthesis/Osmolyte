# Osmolyte — sodium & water disorders, from first principles

An interactive, evidence-based course on hyponatremia, SIAD, cerebral salt wasting, AVP deficiency/resistance (formerly central/nephrogenic diabetes insipidus) and hypernatremia. It is built around two equations — **serum Na ≈ (Naₑ + Kₑ) ÷ total body water** and **urine volume = solute ÷ urine osmolality** — and a simulator that applies them hour by hour.

## What's inside

| Area | What it does |
|---|---|
| **Course** (8 modules, ≈ 3 h) | Physiology → first ten minutes → finding the cause → SIAD vs CSW → safe treatment → polyuria → hypernatremia & AVP disorders → special situations. Each module has objectives, rapid "see → think → do" patterns, embedded interactives and a mastery check. |
| **Fluid Lab** | 48-hour mass-balance simulator (Edelman + solute-limited water excretion) with six scenarios: SIAD, hypovolemia, beer potomania, AVP-D without thirst, lithium AVP-R and salt wasting. Shows the water diuresis that drives overcorrection, desmopressin clamps, the saline paradox, urea, tolvaptan, thiazides and loop diuretics, with 24/48-h limit lines, a comparison trace and a data table. |
| **Cases** | Ten branching cases (ED, ward, neuro-ICU, clinic, obstetrics) with per-option feedback, a first-try score and a structured debrief. |
| **Practice** | 55 questions (single, multi-select, numeric) with a rationale for every option; review queue of unanswered or missed items; 25-second pattern drill. |
| **Flashcards** | 49 cards with Leitner spaced repetition (1 → 3 → 7 → 16 days). |
| **Tools** | Hyponatremia navigator (EU urine-first algorithm), osmolality/tonicity & corrected Na, correction-limit flowsheet monitor, Adrogué–Madias planner, Furst ratio & EFWC, fractional excretion, free-water planner, solute explorer, polyuria test bench (water deprivation and copeptin). |
| **Reference** | 43 cited sources with one-line takeaways and DOI/PubMed links, a drug table and key numbers. Every in-text citation links here. |

Progress (answers, mastery, cards, cases) is stored locally in the browser.

## Evidence base (reviewed November 2026)

The content follows the European (Spasovski 2014) and US (Verbalis 2013) hyponatremia guidelines and the AHA/ASA 2023 aSAH guideline, updated with:

- **HIT (NEJM Evid 2026)** — targeted normalisation of Na in hospitalised chronic hyponatremia did not reduce 30-day death or readmission.
- **MacMillan 2023, Seethapathy 2023, Ayus 2025** — ODS is rare (0.05%), and slower correction of severe hyponatremia is associated with higher mortality (observational). Guideline limits still apply.
- **SALSA (2021)** — bolus hypertonic saline is as safe as continuous infusion.
- **Fenske 2018, CARGO 2023, Timper 2015** — copeptin-based testing (hypertonic-saline-stimulated copeptin is the reference test) replaces the water deprivation test as first choice.
- **2022 renaming** — AVP deficiency / AVP resistance.
- **Chauhan 2019, Feigin 2023** — faster correction of hypernatremia in adults was not harmful.
- **Garrahy 2020, EFFUSE-FLUID 2020, empagliflozin RCTs 2020/2023** — the evidence behind each step of chronic SIAD treatment.

### Corrections to the previous version

The earlier app contained errors that this version fixes:

1. **FE urate dynamics were reversed.** It normalises after correction in SIAD and stays high in salt wasting (Maesaka) — not the other way round.
2. **Correction limits were applied as extrapolated hourly rates** ("5 in 2 h = 60/day → danger"). Limits concern the cumulative change in each 24-hour period; a 5 mmol/L rise in the first hour is the guideline target for severe symptoms.
3. **Limits were wrong**: "≤ 6–8 mmol/L/day" with a "0.5 mmol/L/h" ceiling for hyponatremia. The correct limits are EU 10, then 8 per 24 h; US 10–12/24 h and 18/48 h; high-risk 8/24 h.
4. **The ΔNa formula** divided by (TBW + volume) without scaling by volume and ignored potassium. Now exact mass balance (equal to Adrogué–Madias for 1 L), with Na + K.
5. **Tonicity used calculated osmolality including urea**, misclassifying uremic patients as isotonic. Now effective osmolality is used.
6. **"DDAVP + no water = hypernatremia" pearl** was inverted. The danger of desmopressin with free water intake is *hyponatremia*.
7. **Gestational DI was labelled nephrogenic.** It is vasopressinase-mediated AVP deficiency and responds to desmopressin.
8. **DI was taught as always hypernatremic.** With intact thirst, Na is high-normal; hypernatremia needs a failure of thirst or water access.
9. **Missing topics added**: pseudohyponatremia, glucose-corrected Na, glucocorticoid deficiency as the SIAD mimic, the water diuresis behind overcorrection, relowering, desmopressin clamps, K repletion raising Na, thiazides raising lithium levels, the urine/serum electrolyte ratio, copeptin testing, the post-pituitary-surgery patterns, CSW epidemiology and SAH management.

## Run it

```bash
npm install
npm run dev        # http://localhost:3000
npm test           # 94 unit/content tests (vitest)
npm run lint       # eslint, zero warnings allowed
npm run build      # type-check + production build
```

Requires Node ≥ 20.19. Stack: React 19, TypeScript 5.9, Vite 8, Tailwind CSS 4, Zustand 5. Hash-based routing, so any static host works (deployed on Vercel from `main`).

## Quality gates

- `src/lib/*.test.ts` verify every formula, the correction-limit logic, the diagnostic navigator, the polyuria test engine and the Fluid Lab physiology (for example: saline lowers Na in SIAD when urine Na+K > 154; restoring volume triggers > 10 mmol/L autocorrection; a desmopressin clamp prevents it; AVP-R ignores desmopressin).
- `src/data/content.test.ts` checks content integrity: every citation resolves, every reference is cited, answer keys match options, each case stage has exactly one correct answer, and no boilerplate disclaimers are present.
- Browser QA: every route at 1366 px and 390 px in light and dark themes shows no console errors and no horizontal overflow, with zero axe-core WCAG 2.1 AA violations.

## Project structure

```
src/
  lib/          pure engines + tests (physiology, fluidLab, sodiumMonitor, hyponatremiaNavigator, polyuria, srs)
  data/         modules, questions, cases, cards, drugs, references (+ integrity tests)
  store/        progress (zustand, persisted to localStorage)
  components/   layout, home, learn, lab, interactives, practice, cases, cards, tools, reference, ui
```

See [ARCHITECTURE.md](ARCHITECTURE.md) for design details.

---

Made by Bashar Hasan, MD. A learning resource — confirm doses and limits against local protocols.

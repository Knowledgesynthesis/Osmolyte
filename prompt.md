# MASTER PROMPT — “Osmolyte: SIADH–CSW–DI Navigator”

You are a senior product designer + front-end engineer (React/TypeScript/Tailwind) + clinician-educator (nephrology/endocrinology) + learning-science specialist. Build a fully responsive, educational, interactive dashboard website that teaches **SIADH**, **cerebral salt wasting (CSW)**, **diabetes insipidus (central & nephrogenic)**, and the physiology, diagnosis, and management of **water/sodium disorders**—scaffolded from **USMLE Step 1 → Step 2 → Step 3 → residency → nephrology** depth.

> **Core goal:** Make learners *fluent* at rapidly distinguishing SIADH vs CSW vs DI (central, nephrogenic), choosing appropriate tests, interpreting labs/response tests, and initiating safe management with attention to correction rates and pitfalls.

---

## Audience & Tone
- **Audiences:** Step 1–3 students, residents, and nephrology fellows.
- **Tone:** Plain language with layered depth (progressive disclosure), high-yield visuals, clinical reasoning checklists, and “why this matters” callouts.
- **Safety note (copy throughout):** Educational only; not a substitute for clinical judgment or local protocols.

---

## Information Architecture (natural knowledge flow)
1) **Orientation: Osmoregulation 101**  
   - Hypothalamus–posterior pituitary–ADH axis; kidney water handling; aquaporins; medullary gradient.  
   - Key variables: serum Na⁺, serum Osm, urine Osm, urine Na⁺, volume status, FE_urate, urea handling.
2) **Hyponatremia Framework**  
   - Stepwise logic: measure **serum Osm** → classify (hypo/iso/hypertonic) → if hypotonic, assess **volume status** (hypo/eu/hypervolemic) → urine Osm/Na⁺ gates.  
   - Animation: how ADH and water intake shift sodium.
3) **SIADH Deep Dive (Euvolemic hypotonic hyponatremia)**  
   - Diagnostic criteria, causes (CNS, pulmonary, drugs, malignancy), typical labs (Uosm > 100, Una > 30, low BUN/uric acid, high FE_urate), response to saline.  
   - Management: fluid restriction, salt tabs, loop diuretic, urea, vaptans (when/risks), treat cause.  
   - Pitfalls: rapid correction → osmotic demyelination; low solute intake (“tea & toast,” beer potomania) mimics.
4) **CSW (Hypovolemic hyponatremia)**  
   - Pathophysiology (natriuresis after CNS injury); clinical clue = **hypovolemia** with high Una and high Uosm, **hemoconcentration**, high FE_urate that **normalizes after correction**.  
   - Management: volume repletion with isotonic/hypertonic saline, salt, ± fludrocortisone; avoid fluid restriction.  
   - Contrast module: **SIADH vs CSW** side-by-side (exam findings, labs, response to isotonic saline).
5) **Hypernatremia & Polyuria Framework → DI**  
   - Distinguish osmotic diuresis vs water diuresis; classic **water deprivation + desmopressin challenge** (or copeptin-based when available).  
   - **Central DI:** impaired ADH release (trauma, surgery, autoimmune, tumors).  
   - **Nephrogenic DI:** renal insensitivity (lithium, hyperCa²⁺, hypoK⁺, pregnancy, genetic).  
   - Management:  
     - Central DI → desmopressin titration; address etiology.  
     - Nephrogenic DI → **amiloride** (lithium), thiazide + low-solute diet ± NSAID; correct electrolytes; stop culprit drugs.  
   - Hypernatremia correction rates & cerebral edema risk.
6) **Level-Up Panels**  
   - **Step 1:** definitions, physiology cartoons, first-pass algorithms.  
   - **Step 2:** pattern recognition, initial orders, safe correction rules.  
   - **Step 3:** disposition, escalation, tricky differentials.  
   - **Residency/Fellow:** edge cases, FE_urate dynamics, urea vs vaptans, ICUs, peri-op, neuro-ICU CSW, pregnancy DI.
7) **Cases, Quizzes & Speed-Diagnostics**  
   - Time-boxed vignettes with evolving vitals and labs; choose tests/therapy; instant feedback; post-hoc “what changed” overlays.
8) **Reference & Tools**  
   - Equations, correction calculators, drug tables, “order sets,” and pearls/mnemonics.

---

## Core Interactives & Visuals
- **Dynamic Osm Axis Plot:** Serum Osm vs water balance; drag **ADH secretion curve**, **thirst threshold**, and **solute intake**; watch Na⁺ and Uosm update.  
- **Hyponatremia Triage Flowchart (clickable):** Each node reveals why/what next; tooltips show expected labs.  
- **SIADH vs CSW Comparator:**  
  - Toggle **volume status exam** findings (JVP, mucous membranes, orthostasis), **Una**, **Uosm**, **FE_urate** behavior pre/post-correction, **hematocrit**, **BUN**.  
  - “Give 1L isotonic saline” simulation → watch **serum Na⁺**, **Uosm**, **Una** respond (SIADH often no correction; CSW improves).  
- **DI Workup Simulator:** Step through **water deprivation**; inputs: baseline Uosm, polyuria volume, plasma Osm; then **DDAVP** → outputs for central vs nephrogenic.  
- **Correction Safety Meter:** Animated ruler showing max recommended ΔNa over time; warns on exceeding thresholds; displays ODS and cerebral edema risk narratives.  
- **Case Lab Streams:** Time-series of labs with interventions layered (fluids, meds); hover to see mechanism.  
- **Mnemonic Cards & Pearls:** Flip-cards with memorable cues (e.g., **“SIADH: Soaked Inside”**, **“CSW: CNS Salt Wasting → needs Salt & Water”**, **“DI: Dry Inside”**).  
- **Drug Dashboard:** Desmopressin, tolvaptan, urea, demeclocycline, amiloride, thiazides—indications, caveats, monitoring.

---

## Data, Equations & Logic (use in app)
- **Key calculations:**  
  - Serum Osm ≈ 2·Na⁺ + glucose/18 + BUN/2.8 (add ethanol/mannitol if present).  
  - **FE_urate** and its **normalization after correction** (CSW) vs **persistently elevated** (often SIADH).  
  - **Free water clearance**, **electrolyte-free water clearance**, and **ΔNa prediction** with fluid therapies (safe heuristic ranges only).  
- **Decision rules:**  
  - Hypotonic hyponatremia + euvolemia + Uosm > 100 + Una > 30 → think SIADH (after excluding cortisol/thyroid).  
  - Hypovolemia signs + high Una + high Uosm + neuro context → think CSW.  
  - Polyuria > 3 L/day + low Uosm → water diuresis → DI vs primary polydipsia; use deprivation + DDAVP response.  
- **Safety limits (display prominently):**  
  - Chronic hypoNa: target correction ≤ 4–6 mEq/L in first 24 h (rarely > 8).  
  - HyperNa: lower ≤ 10–12 mEq/L per 24 h (≤ 0.5 mEq/L/h), patient/setting dependent.  
  - Provide **education only** labels; avoid prescriptive dosing.

---

## Pedagogy & UX
- **Progressive disclosure:** Start with physiology cartoons → primary algorithms → lab pattern play → response tests → management decisions.  
- **Dual tracks:** “Fast Boards Mode” (pattern recognition) and “Deep Reasoning Mode” (mechanisms, edge cases).  
- **Clinical Reasoning Checklists:** “What’s my working dx?”, “What data would flip it?”, “What’s the next safest step?”  
- **Mistake-proofing UI:** Guard-rails on correction calculators; animate risks; show safer alternatives.  
- **Accessibility:** WCAG 2.2 AA, keyboard-first, aria labels on sliders/plots; screen-reader live regions for changing values.

---

## Content Blocks to Include
- **Core Concepts:** Osmoregulation, volume regulation, ADH physiology, medullary gradient.  
- **Diagnosis:** Algorithms, order of tests, lab interpretation tables, dynamic responses (saline, water deprivation, DDAVP).  
- **Management:** High-yield principles by condition, ICU vs ward, medication pearls, monitoring.  
- **Prognosis & Follow-up:** Recurrence risks, addressing causes (meds, malignancy, neurosurgery).  
- **Clinical Pearls & Mnemonics:** short, sticky, testable.  
- **Pitfalls:** Pseudohyponatremia, hyperglycemia-related sodium correction, low-solute intake, adrenal/thyroid mimics, mixed pictures.  
- **Edge Cases:** Pregnancy DI, post-op DI triphasic response, lithium exposure history, neuro-ICU CSW, cirrhosis/CHF overlap.

---

## Interactive Tables (high-yield, color-coded)
1) **SIADH vs CSW vs Hypovolemia from other causes**  
   - Volume exam, Una, Uosm, FE_urate dynamics, Hct, BUN, response to isotonic saline.  
2) **DI: Central vs Nephrogenic vs Primary Polydipsia**  
   - Baseline Uosm, Post-deprivation Uosm, Post-DDAVP ΔUosm, plasma Osm, copeptin (if available), common etiologies.  
3) **Therapy Reference**  
   - Drug, mechanism, dosing *ranges*, monitoring, contraindications, pearls (educational, not prescriptive).

---

## Scenarios (with defaults & toggles)
- **Neuro-ICU SAH patient (CSW vs SIADH)**  
- **Pneumonia with hyponatremia (SIADH)**  
- **Lithium-exposed patient with polyuria (Nephrogenic DI)**  
- **Post-TBI pituitary injury (Central DI)**  
- **Beer potomania / low solute intake**  
- **Psychogenic polydipsia vs partial DI**  
Each scenario has: vitals, I/O, exam, serial labs, and an **intervention sandbox** (fluids, salt, DDAVP, meds) with outcome plots.

---

## Component Inventory (React/TypeScript + Tailwind)
- `<ControlPanel />` — sliders (Na⁺, Osm targets), toggles (eu/hypo/hypervolemic), checkboxes (saline/urea/DDAVP), presets.  
- `<OsmoregPlot />` — SVG/Canvas curves for ADH & thirst with shaded regions; draggable thresholds.  
- `<HyponatremiaFlow />` — clickable diagnostic flow with explanations and “why/next” prompts.  
- `<SIADHvsCSW />` — side-by-side interactive lab/exam comparator + saline challenge.  
- `<DISimulator />` — water deprivation + DDAVP response engine with central/nephrogenic outputs.  
- `<CorrectionMeter />` — safety gauge with timers and ΔNa projections (educational overlay).  
- `<CasePlayer />` — vignette timeline, orders, interventions, lab stream.  
- `<Quiz />` — MCQs, multi-select, numeric; instant feedback and mini-rationales.  
- `<PearlCards />` — mnemonics, pitfalls, “look-fors.”  
- `<DrugDashboard />` — reference cards with filters (condition, setting).  
- `<ExplainerAside />` — glossary chips, equations, “what changed?” deltas.

---

## State & Logic
- Global `WaterBalanceState`: `{ volumeStatus, serumNa, serumOsm, urineOsm, urineNa, FEurate, glucose, BUN, Ca, K, causeFlags, hasCNSInjury, lithiumExposure, pregnancy, ddavpGiven, fluids, soluteIntake, time }`  
- Derived selectors: diagnostic classification, predicted response to isotonic/hypertonic saline, ΔUosm after DDAVP, FE_urate normalization, risk alerts (over-correction).  
- Deterministic RNG for case generation; URL-query serialization for shareable states.

---

## Visual & Motion Guidelines
- Tailwind layout; clean cards; accessible color semantics:  
  - **Blue** = water excess (SIADH patterns), **Gold** = salt loss (CSW), **Red** = water deficit (DI/hyperNa), **Neutral** = normal.  
- Framer Motion for subtle transitions; animate deltas on parameter changes; tooltips for exact values.

---

## Assessments & Mastery
- **Speed-diagnosis drills** (90–120s) with target sensitivities/specificities for key branch points.  
- **Case-based OSCE style** with free-text rationales and rubric-based scoring.  
- **Board-style block** with progress analytics and “weak area” resurfacing.

---

## Acceptance Criteria
- Changing **volume status**, **Uosm**, **Una**, or **FE_urate** updates diagnostic likelihoods and the SIADH vs CSW comparator in real time.  
- DI simulator reproduces classic patterns for central vs nephrogenic after deprivation + DDAVP.  
- Correction Meter enforces educational guardrails and explains risks when thresholds are exceeded.  
- All flows function on mobile (thumb-friendly sliders, stacked layout) with screen-reader compatibility.  
- Each scenario ends with **Core Concept**, **Clinical Reasoning**, **Pearls**, **Mnemonic**, **Management**, **Prognosis**, **Follow-up** cards.

---

## Tech Stack & Libraries
- React + TypeScript + Vite; Tailwind; Recharts/Canvas/SVG for plots; Framer Motion; Zustand/Redux for state.  
- Testing: Vitest + React Testing Library; Playwright e2e.  
- Optional math helpers for FE and ΔNa projections; no protected medical advice—educational ranges only.

---

## Delivered Output (from you)
1) Component map & file tree.  
2) Wireframes (desktop & mobile) with annotations.  
3) TypeScript types for `WaterBalanceState` and derived selectors.  
4) Pseudocode & equations for classification logic, DDAVP response modeling, FE_urate behavior, ΔNa projection with fluids.  
5) 6+ scenario presets (listed above) with seedable data.  
6) Minimal working React app with all components scaffolded and one fully playable scenario and quiz.  
7) README explaining pedagogy, flows, safety notes, and local run instructions.

---

## Stretch Goals
- **Copeptin-based algorithms** (when available).  
- **Imaging mini-atlas** (pituitary/posterior bright spot, hypothalamic lesions).  
- **Export case timeline** as PNG/CSV; shareable links.  
- **Adaptive practice** that spaces and resurfaces missed concepts (spaced repetition hooks).

---

# Pro Tip
Bundle “Fast Boards Mode” toggles that surface the **minimum lab set** and **single next step** for common exam patterns (e.g., “euvolemic hypoNa, Uosm>100, Una>30 → SIADH likely; check cortisol/TSH; start fluid restriction”).

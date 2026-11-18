import type { Module } from './types';

export const MODULES: Module[] = [
  // ───────────────────────────────────────────── 1
  {
    id: 'physiology',
    number: 1,
    title: 'Sodium is a water problem',
    tagline: 'The two equations behind every sodium disorder',
    minutes: 15,
    objectives: [
      'Explain serum Na as (exchangeable Na + K) ÷ total body water',
      'Separate osmolality from tonicity, and effective from ineffective osmoles',
      'Predict water excretion with urine volume = solute ÷ urine osmolality',
      'Describe osmotic and non-osmotic ADH release, and what copeptin measures',
    ],
    check: ['phys-edelman', 'phys-urea', 'phys-solute', 'phys-baro', 'phys-efwc'],
    sections: [
      {
        id: 'edelman',
        title: 'Equation 1 — what serum sodium actually measures',
        blocks: [
          { kind: 'equation', label: 'Edelman (simplified)', formula: 'Serum Na ≈ (exchangeable Na + exchangeable K) ÷ total body water', note: 'Edelman 1958 [@edelman1958]' },
          {
            kind: 'p',
            text: 'Serum Na is a **ratio**, not a measure of body sodium. A low value means too much water for the cations present; a high value means too little. Total body sodium can be high (heart failure), normal (SIAD) or low (diarrhea) in every one of these.',
          },
          {
            kind: 'points',
            title: 'Consequences you will use daily',
            items: [
              'Serum Na changes only when water or Na + K enter or leave the body — so every intervention can be reasoned as a mass balance.',
              '**Potassium counts like sodium.** Replacing 40 mmol of KCl raises serum Na as much as 40 mmol of NaCl: hypokalemia repletion is a hidden source of overcorrection.',
              'The bedside formulas (Adrogué–Madias, free-water deficit) are rearrangements of this equation — and they all ignore urine output, their biggest weakness.',
            ],
          },
        ],
      },
      {
        id: 'tonicity',
        title: 'Osmolality vs tonicity',
        blocks: [
          { kind: 'equation', label: 'Calculated osmolality', formula: '2·Na + glucose/18 + BUN/2.8 (+ ethanol/3.7)', note: 'mg/dL units; normal 275–295 mOsm/kg' },
          { kind: 'equation', label: 'Effective osmolality (tonicity)', formula: '2·Na + glucose/18', note: 'Urea and ethanol omitted' },
          {
            kind: 'p',
            text: 'Water moves across cell membranes only in response to **effective** osmoles — solutes the membrane keeps out (Na, glucose without insulin, mannitol). **Urea and ethanol** cross freely: they raise measured osmolality but never shift water, so they never cause or prevent cell swelling.',
          },
          {
            kind: 'callout',
            tone: 'pitfall',
            title: 'The uremic trap',
            text: 'Na 125, BUN 110 mg/dL: measured osmolality ≈ 290 looks "isotonic", yet effective osmolality is ≈ 255. The patient is hypotonic and the brain is swelling. Classify tonicity with effective osmolality.',
          },
        ],
      },
      {
        id: 'adh',
        title: 'ADH: two triggers, one target',
        blocks: [
          {
            kind: 'steps',
            items: [
              { title: 'Osmotic trigger', text: 'Osmoreceptors fire above ≈ 280–285 mOsm/kg (Na ≈ 135–137). A 1–2% change in tonicity changes ADH; urine is maximally concentrated by ≈ 295 mOsm/kg. Thirst starts a few mOsm/kg higher.' },
              { title: 'Non-osmotic trigger', text: 'A fall of ≈ 5–10% in effective arterial volume (hypovolemia, heart failure, cirrhosis) releases ADH whatever the tonicity — volume beats osmolality. So do nausea, pain, stress, hypoglycemia and many drugs.' },
              { title: 'Action', text: 'ADH binds V2 receptors in collecting-duct principal cells → cAMP → aquaporin-2 inserted → water follows the medullary gradient. Maximum urine osmolality ≈ 1000–1200 mOsm/kg when young, falling with age; minimum ≈ 50–100.' },
              { title: 'Copeptin', text: 'ADH (arginine vasopressin, AVP) is unstable in the tube. Copeptin, the C-terminal fragment of its precursor, is released 1:1 and stable — it is what modern tests measure.' },
            ],
          },
        ],
      },
      {
        id: 'solute',
        title: 'Equation 2 — the kidney can only excrete water with solute',
        blocks: [
          { kind: 'equation', label: 'Water excretion', formula: 'Urine volume (L/day) = solute excreted (mOsm/day) ÷ urine osmolality (mOsm/kg)' },
          {
            kind: 'p',
            text: 'A normal diet delivers ≈ 600–900 mOsm/day of solute (urea, Na, K). At maximal dilution (≈ 60 mOsm/kg) that carries ≈ 10–15 L of urine. But if solute intake falls to 150–250 mOsm/day (beer, tea and toast) the ceiling drops to ≈ 3–4 L — drink more and Na falls even with ADH fully suppressed. If ADH fixes the urine at 600 mOsm/kg (SIAD), the same 900 mOsm carries only 1.5 L.',
          },
          { kind: 'interactive', id: 'solute-explorer' },
          {
            kind: 'callout',
            tone: 'pearl',
            title: 'Why urea and SGLT2 inhibitors work in SIAD',
            text: 'They raise solute excretion (urea; glucose plus natriuresis) so more water leaves at the same fixed urine osmolality.',
          },
        ],
      },
      {
        id: 'efwc',
        title: 'What the urine does to the serum Na',
        blocks: [
          { kind: 'equation', label: 'Electrolyte-free water clearance', formula: 'EFWC = V × [1 − (U_Na + U_K) ÷ S_Na]' },
          {
            kind: 'p',
            text: 'Only urine Na + K (not urea) matters for serum Na. If urine Na + K is **lower** than serum Na, urine removes free water and serum Na rises. If it is **higher**, every litre of urine leaves free water behind and Na falls — even while the patient is "fluid restricted".',
          },
          {
            kind: 'callout',
            tone: 'pitfall',
            title: 'The saline paradox in SIAD',
            text: 'Give 1 L of 0.9% saline (154 mmol Na) to a patient whose urine Na + K is 250 mmol/L: the kidney excretes the 154 mmol in ≈ 0.6 L of urine and keeps ≈ 0.4 L of free water. Na falls. Isotonic saline lowers Na whenever urine Na + K exceeds 154 (roughly urine osmolality > 500).',
          },
          {
            kind: 'patterns',
            items: [
              { see: 'Low serum Na', think: 'Too much water relative to Na + K', do: 'Ask: where is the water coming from, and why isn’t the kidney excreting it?' },
              { see: 'Measured Osm normal but BUN very high', think: 'Urea is ineffective', do: 'Use 2·Na + glucose/18 to judge tonicity' },
              { see: 'Urine Na + K > serum Na', think: 'Urine is making Na worse', do: 'Restriction alone will fail; add solute or a vaptan' },
            ],
          },
        ],
      },
    ],
  },

  // ───────────────────────────────────────────── 2
  {
    id: 'hypo-first',
    number: 2,
    title: 'Hyponatremia: the first ten minutes',
    tagline: 'Grade it, treat brain edema, confirm hypotonicity, flag ODS risk',
    minutes: 20,
    objectives: [
      'Grade hyponatremia by biochemistry, symptoms and duration',
      'Give hypertonic saline correctly for severe or moderately severe symptoms',
      'Exclude pseudohyponatremia and translocational hyponatremia',
      'Identify high risk for osmotic demyelination and know what the newest data say',
    ],
    check: ['hf-severe', 'hf-bolus', 'hf-pseudo', 'hf-glucose', 'hf-ods', 'hf-hit'],
    sections: [
      {
        id: 'grade',
        title: 'Grade it three ways',
        blocks: [
          {
            kind: 'table',
            caption: 'European guideline classification [@eu2014]',
            head: ['Axis', 'Categories', 'Why it matters'],
            rows: [
              ['Biochemical', 'Mild 130–134 · moderate 125–129 · profound < 125 mmol/L', 'Risk of complications rises as Na falls'],
              ['Symptoms', 'Moderately severe: nausea without vomiting, confusion, headache · Severe: vomiting, seizures, somnolence/GCS ≤ 8, cardiorespiratory distress', 'Symptoms = brain edema; severity drives emergency treatment'],
              ['Duration', 'Acute < 48 h · chronic ≥ 48 h — if unknown, assume chronic', 'Brain cells shed osmolytes over 24–48 h: protects against edema, but makes rapid correction dangerous'],
            ],
          },
          {
            kind: 'callout',
            tone: 'pearl',
            title: 'Chronic and "asymptomatic" is rarely truly asymptomatic',
            text: 'Chronic mild hyponatremia is associated with gait instability, falls, attention deficits and fractures in older adults. But the 2026 HIT trial showed that intensively normalising Na in hospital did not reduce 30-day death or readmission [@hit2026] — treat the cause and the symptoms, not the number.',
          },
        ],
      },
      {
        id: 'emergency',
        title: 'Severe symptoms: treat before you diagnose',
        blocks: [
          {
            kind: 'table',
            caption: 'Hypertonic saline (3% NaCl) for symptomatic hyponatremia',
            head: ['Source', 'Regimen', 'Target'],
            rows: [
              ['EU 2014 [@eu2014]', '150 mL over 20 min; recheck Na; repeat up to twice', '+5 mmol/L in the first hour, then stop 3%'],
              ['US 2013 [@us2013]', '100 mL over 10 min; up to 3 doses in total', '+4–6 mmol/L'],
              ['SALSA RCT 2021 [@salsa2021]', 'Bolus 2 mL/kg (4 mL/kg if severe) vs infusion 0.5–1 mL/kg/h', 'Bolus as safe, faster, less relowering'],
              ['Moderately severe (EU)', 'Single 150 mL 3% bolus', '+5 mmol/L in 24 h'],
            ],
          },
          {
            kind: 'points',
            items: [
              'A rise of 4–6 mmol/L reverses most herniation risk. Once symptoms improve, stop hypertonic saline and switch to cause-specific treatment.',
              'Rule of thumb: **1 mL/kg of 3% NaCl raises Na ≈ 1 mmol/L** (often more, because formulas ignore urine).',
              '3% can be given through a peripheral IV for boluses.',
              'Acute (< 48 h) hyponatremia with any symptoms — marathon runners, MDMA, psychogenic water intoxication, postoperative — is treated as severe.',
            ],
          },
          {
            kind: 'callout',
            tone: 'pitfall',
            title: 'Wrong emergency fluids',
            text: 'Isotonic saline is not an emergency treatment for hyponatremia — in SIAD it can lower Na. Hypotonic fluids (D5W, 0.45%, LR in large volume) are contraindicated in symptomatic hyponatremia.',
          },
        ],
      },
      {
        id: 'tonicity',
        title: 'Confirm it is hypotonic',
        blocks: [
          { kind: 'interactive', id: 'tonicity-calc' },
          {
            kind: 'table',
            head: ['Situation', 'Measured Osm', 'Mechanism', 'Action'],
            rows: [
              ['Pseudohyponatremia', 'Normal', 'Lipids or paraproteins displace plasma water in indirect ion-selective electrode (ISE) assays', 'Remeasure Na on a blood-gas analyser (direct ISE)'],
              ['Hyperglycemia', 'High', 'Glucose pulls water out of cells: Na falls ≈ 2.4 per 100 mg/dL [@hillier1999]', 'Use corrected Na; treat glucose'],
              ['Mannitol, glycine (TURP), maltose (IVIG), contrast', 'High or normal, with osmolal gap', 'Extra effective osmoles', 'Stop source; follow osmolal gap'],
              ['Uremia, ethanol', 'Normal or high', 'Ineffective osmoles — patient is still hypotonic', 'Treat as hypotonic hyponatremia'],
            ],
          },
        ],
      },
      {
        id: 'ods',
        title: 'Osmotic demyelination: who is at risk, and how big is the risk?',
        blocks: [
          {
            kind: 'points',
            title: 'High-risk features (US 2013) [@us2013]',
            items: ['Na ≤ 105 mmol/L', 'Hypokalemia', 'Alcohol use disorder', 'Malnutrition', 'Advanced liver disease (and liver transplantation)'],
          },
          {
            kind: 'p',
            text: 'ODS appears 2–6 days after an over-rapid rise in chronic hyponatremia: dysarthria, dysphagia, behavioural change, quadriparesis, "locked-in" syndrome. MRI changes can lag by up to two weeks.',
          },
          {
            kind: 'callout',
            tone: 'evidence',
            title: 'What changed 2023–2026',
            text: 'In 22,858 hospitalisations ODS occurred in 0.05%, and 7 of 12 cases had not been corrected rapidly [@macmillan2023]. In Na < 120, correction > 10 mmol/L/day was associated with *lower* mortality [@seethapathy2023], confirmed by a 2025 meta-analysis [@ayus2025]. These are observational (sicker patients correct more slowly), and no society has changed its limits — but the message is shifting from "fear of correction" to "avoid undertreatment and avoid overshoot in high-risk patients".',
          },
          {
            kind: 'patterns',
            items: [
              { see: 'Seizure, Na 118', think: 'Severe symptoms', do: '3% 150 mL over 20 min now, repeat until +5 or seizure stops' },
              { see: 'Na 128, glucose 800 mg/dL', think: 'Translocational', do: 'Corrected Na ≈ 145 — treat the hyperglycemia, give free water as needed' },
              { see: 'Na 126, triglycerides 3000 mg/dL, measured Osm 290', think: 'Pseudohyponatremia', do: 'Direct-ISE Na on a blood gas' },
              { see: 'Na 104 in alcohol use disorder with K 2.8', think: 'Highest ODS risk', do: 'Limit rise to 8 mmol/L/24 h; count KCl as sodium; plan a desmopressin clamp' },
            ],
          },
        ],
      },
    ],
  },

  // ───────────────────────────────────────────── 3
  {
    id: 'hypo-cause',
    number: 3,
    title: 'Hyponatremia: finding the cause',
    tagline: 'Urine first, volume last — and exclude the SIAD mimics',
    minutes: 25,
    objectives: [
      'Apply the urine-first diagnostic algorithm',
      'Use FE urate when diuretics make urine Na uninterpretable',
      'State SIAD criteria and its two mandatory exclusions',
      'Recognise the common causes of SIAD',
    ],
    check: ['hc-order', 'hc-uosm100', 'hc-una', 'hc-feurate', 'hc-mimic', 'hc-ai'],
    sections: [
      {
        id: 'why-urine',
        title: 'Why the urine comes before the exam',
        blocks: [
          {
            kind: 'p',
            text: 'Clinical assessment of volume is unreliable: bedside examination misclassified about half of hypovolemic patients, while urine Na < 30 mmol/L predicted a response to saline [@chung1987]. The European algorithm therefore asks about urine osmolality and urine Na **before** volume status [@eu2014]. Send urine osmolality, Na, K and creatinine on the same spot sample — before treatment if you can.',
          },
          { kind: 'interactive', id: 'hypo-navigator' },
        ],
      },
      {
        id: 'branches',
        title: 'The branches',
        blocks: [
          {
            kind: 'table',
            head: ['Finding', 'Meaning', 'Causes'],
            rows: [
              ['Uosm ≤ 100 mOsm/kg', 'ADH suppressed; intake exceeds excretion capacity', 'Primary polydipsia · low solute intake (beer potomania, tea and toast) · reset osmostat after a water load'],
              ['Uosm > 100, UNa ≤ 30', 'Kidney senses low effective arterial volume', 'Extra-renal loss (diarrhea, late vomiting, third spacing) · edematous states (HF, cirrhosis, nephrotic) · remote diuretic'],
              ['Uosm > 100, UNa > 30, diuretic or CKD', 'Urine Na uninterpretable', 'Thiazide (commonest drug cause) · CKD · SIAD hidden behind the diuretic'],
              ['UNa > 30, ECF reduced', 'Renal salt loss', 'Vomiting (bicarbonaturia) · primary adrenal insufficiency · salt-losing nephropathy · cerebral salt wasting (rare) · occult diuretics'],
              ['UNa > 30, ECF normal', 'Inappropriate antidiuresis', 'SIAD · secondary adrenal insufficiency · severe hypothyroidism'],
            ],
          },
          {
            kind: 'callout',
            tone: 'evidence',
            title: 'When the patient is on a diuretic',
            text: 'FE urate > 12% identified SIAD even in diuretic-treated patients [@fenske2008]. FE urea > 55% is a weaker supportive sign. A low serum urate (< 4 mg/dL) and low BUN (< 10 mg/dL) also point to SIAD.',
          },
        ],
      },
      {
        id: 'siad',
        title: 'SIAD — criteria, mimics, causes',
        blocks: [
          {
            kind: 'table',
            caption: 'Diagnostic criteria (Schwartz–Bartter, as adopted by EU 2014 and US 2013)',
            head: ['Essential', 'Supportive'],
            rows: [
              ['Effective serum osmolality < 275 mOsm/kg', 'Serum urate < 4 mg/dL; BUN < 10 mg/dL'],
              ['Urine osmolality > 100 mOsm/kg', 'FE Na > 0.5%, FE urea > 55%, FE urate > 12%'],
              ['Clinical euvolemia', 'No rise in Na after 2 L 0.9% saline over 24 h'],
              ['Urine Na > 30 mmol/L on normal salt and water intake', 'Na corrects with fluid restriction'],
              ['No recent diuretic; normal thyroid and adrenal function; normal kidney function', 'Elevated AVP/copeptin inappropriate to tonicity'],
            ],
          },
          {
            kind: 'callout',
            tone: 'pitfall',
            title: 'The mimic that kills: glucocorticoid deficiency',
            text: 'Secondary adrenal insufficiency (pituitary disease, immune-checkpoint-inhibitor hypophysitis, stopping long-term steroids) produces a picture identical to SIAD — euvolemic, concentrated urine, high urine Na, normal K. Cortisol normally restrains ADH. Check a morning cortisol in every "SIAD"; it is the one cause where hydrocortisone corrects Na — fast enough to overcorrect.',
          },
          {
            kind: 'table',
            caption: 'Causes of SIAD',
            head: ['Group', 'Examples'],
            rows: [
              ['Drugs', 'SSRIs/SNRIs, tricyclics, carbamazepine/oxcarbazepine, valproate, antipsychotics, cyclophosphamide, vincristine, cisplatin, opioids, MDMA, NSAIDs, PPIs (rare), desmopressin, oxytocin'],
              ['Lung', 'Pneumonia (Legionella classically), TB, positive-pressure ventilation, acute asthma'],
              ['CNS', 'SAH, meningitis/encephalitis, stroke, trauma, tumour, neurosurgery'],
              ['Malignancy', 'Small-cell lung cancer (ectopic ADH), head and neck, others'],
              ['Other', 'Nausea, pain, postoperative state, endurance exercise, HIV, hereditary nephrogenic SIAD (activating V2 mutation, copeptin low)'],
            ],
          },
          {
            kind: 'p',
            text: '"SIAD" (syndrome of inappropriate antidiuresis) is preferred to SIADH because some patients have antidiuresis without measurable ADH [@ellison2007]. Hypothyroidism causes hyponatremia only when severe (myxedema); a mildly raised TSH is not the explanation.',
          },
          {
            kind: 'patterns',
            items: [
              { see: 'Pneumonia, diarrhea, confusion, Na 124', think: 'Legionella with SIAD', do: 'Urinary antigen; cover atypicals' },
              { see: 'Euvolemic "SIAD" in a patient on ipilimumab', think: 'ACTH deficiency (hypophysitis)', do: 'Cortisol now; hydrocortisone if low' },
              { see: 'Older woman started on a thiazide 2 weeks ago, Na 118', think: 'Thiazide-induced', do: 'Stop it forever; expect a water diuresis when it washes out' },
              { see: 'Uosm 70, UNa 8, lives on beer', think: 'Low solute intake', do: 'Thiamine; feed cautiously; anticipate rapid autocorrection' },
            ],
          },
        ],
      },
    ],
  },

  // ───────────────────────────────────────────── 4
  {
    id: 'siad-csw',
    number: 4,
    title: 'SIAD vs cerebral salt wasting',
    tagline: 'A hard distinction that changes less than you think',
    minutes: 15,
    objectives: [
      'List the features SIAD and CSW share and the one that separates them',
      'Interpret FE urate before and after correction correctly',
      'Know how rare CSW is in prospective series',
      'Manage hyponatremia after SAH without harming the brain',
    ],
    check: ['sc-shared', 'sc-feurate', 'sc-sah', 'sc-fludro'],
    sections: [
      {
        id: 'compare',
        title: 'Same urine, different volume',
        blocks: [
          {
            kind: 'table',
            head: ['Feature', 'SIAD', 'Cerebral/renal salt wasting', 'Hypovolemia (extra-renal)'],
            rows: [
              ['ECF volume', 'Normal or slightly expanded', '**Depleted** (negative Na balance, weight loss, hypotension)', 'Depleted'],
              ['Urine Na', '> 30', '> 30 (often very high)', '< 30'],
              ['Urine osmolality', '> 100', '> 100', '> 100'],
              ['Serum urate / FE urate', 'Low / > 12%', 'Low / > 12%', 'Normal–high / low'],
              ['FE urate after Na corrected', '**Normalises**', '**Stays high**', '—'],
              ['BUN, hematocrit', 'Low–normal', 'Rising', 'Rising'],
              ['Response to 0.9% saline', 'No rise, or fall if urine Na + K > 154', 'Na and volume improve', 'Na rises'],
              ['Treatment', 'Fluid restriction ± solute', 'Replace salt and water; fludrocortisone', 'Isotonic fluid'],
            ],
          },
          {
            kind: 'callout',
            tone: 'pitfall',
            title: 'A common error, corrected',
            text: 'FE urate is elevated in both conditions at presentation. After hyponatremia is corrected it returns to normal in SIAD but remains elevated in salt wasting [@maesaka2018]. (Older teaching material often states the opposite.) This criterion comes mainly from one group and is not universally accepted.',
          },
        ],
      },
      {
        id: 'rare',
        title: 'How common is CSW?',
        blocks: [
          {
            kind: 'p',
            text: 'In a prospective study of 100 consecutive patients with aneurysmal SAH, 49% became hyponatremic: SIAD explained ≈ 71%, acute glucocorticoid deficiency 8%, and no patient met criteria for CSW [@hannon2014]. CSW is real but uncommon; it requires documented negative sodium balance with true volume depletion — urine Na excretion exceeding intake, falling weight, rising hematocrit or BUN, hypotension.',
          },
          {
            kind: 'points',
            title: 'Questions that settle it at the bedside',
            items: [
              'Is urine output persistently greater than intake?',
              'Is cumulative Na excretion greater than Na given?',
              'Are weight falling and hematocrit/BUN rising?',
              'Is cortisol low? (Treat with hydrocortisone.)',
            ],
          },
        ],
      },
      {
        id: 'sah',
        title: 'Managing hyponatremia after SAH',
        blocks: [
          {
            kind: 'steps',
            items: [
              { title: 'Do not fluid-restrict', text: 'Fluid restriction after SAH was associated with cerebral infarction [@wijdicks1985]; hypovolemia promotes delayed cerebral ischemia (days 3–14). This holds whether the mechanism is SIAD or salt wasting.' },
              { title: 'Maintain euvolemia and replace salt', text: 'Isotonic saline to euvolemia; oral NaCl; hypertonic saline (e.g. 3% infusion or boluses) to raise Na. Many neuro-ICUs keep Na ≥ 135.' },
              { title: 'Mineralocorticoid', text: 'Fludrocortisone reduces natriuresis [@hasan1989]; AHA/ASA 2023 rates mineralocorticoids reasonable (Class 2a) for natriuresis and hyponatremia [@aha-sah2023]. Watch K, BP, pulmonary edema.' },
              { title: 'Check cortisol', text: 'Acute glucocorticoid deficiency occurs after SAH and TBI; hydrocortisone corrects it.' },
              { title: 'Avoid vaptans by default', text: 'They induce aquaresis and can cause hypovolemia in a patient at risk of vasospasm.' },
            ],
          },
          { kind: 'interactive', id: 'fluid-lab-link', preset: 'csw' },
          {
            kind: 'patterns',
            items: [
              { see: 'Day 6 after SAH, Na 128, urine Na 90, euvolemic', think: 'SIAD most likely', do: 'Still do not restrict: NaCl tablets or 3%, check cortisol' },
              { see: 'Urine output 4 L/day > intake, Hct rising, BP falling after SAH', think: 'Salt wasting', do: 'Replace volume and salt; add fludrocortisone' },
            ],
          },
        ],
      },
    ],
  },

  // ───────────────────────────────────────────── 5
  {
    id: 'hypo-treat',
    number: 5,
    title: 'Treating hyponatremia safely',
    tagline: 'Plan the rise, anticipate the water diuresis, rescue an overshoot',
    minutes: 30,
    objectives: [
      'Apply 24-hour correction limits correctly (cumulative, not hourly)',
      'Estimate the effect of a fluid and explain why formulas underestimate',
      'Recognise the triggers of overcorrection and use desmopressin strategies',
      'Choose chronic SIAD therapy from the urine/serum electrolyte ratio',
    ],
    check: ['ht-limit', 'ht-cumulative', 'ht-am', 'ht-trigger', 'ht-rescue', 'ht-furst', 'ht-tolvaptan'],
    sections: [
      {
        id: 'limits',
        title: 'The limits are about the total, not the slope',
        blocks: [
          {
            kind: 'table',
            caption: 'Chronic hyponatremia (≥ 48 h or unknown)',
            head: ['', 'Goal', 'Limit (first 24 h)', 'Limit thereafter'],
            rows: [
              ['EU 2014 [@eu2014]', '+5 in first hour if severe symptoms', '10 mmol/L', '8 mmol/L per 24 h'],
              ['US 2013, standard risk [@us2013]', '4–8 mmol/L/day', '10–12 mmol/L', '18 mmol/L over 48 h'],
              ['US 2013, high ODS risk', '4–6 mmol/L/day', '8 mmol/L', '8 mmol/L per 24 h'],
            ],
          },
          {
            kind: 'callout',
            tone: 'pearl',
            title: 'Front-load, then hold',
            text: 'A rise of 5 mmol/L in the first hour is the intended effect of a 3% bolus, not a violation. What matters is that the total change in that 24-hour period stays within the limit. Do not extrapolate "5 in 1 h = 120 per day".',
          },
          { kind: 'interactive', id: 'correction-monitor' },
        ],
      },
      {
        id: 'predict',
        title: 'Predicting the rise — and why formulas fail',
        blocks: [
          { kind: 'equation', label: 'Adrogué–Madias', formula: 'ΔNa per litre = (infusate Na + K − serum Na) ÷ (TBW + 1)', note: 'TBW = 0.6 × kg (young man), 0.5 (young woman, older man), 0.45 (older woman)' },
          { kind: 'interactive', id: 'correction-planner' },
          {
            kind: 'p',
            text: 'Every formula assumes no urine. In practice the rise usually **exceeds** the prediction, because the stimulus for ADH resolves and the kidney starts excreting dilute urine [@mohmand2007]. Formulas plan the first dose; serial Na and hourly urine output steer the rest.',
          },
        ],
      },
      {
        id: 'overcorrection',
        title: 'Overcorrection: the water diuresis',
        blocks: [
          {
            kind: 'points',
            title: 'Expect a water diuresis when the cause of ADH release goes away',
            items: [
              'Hypovolemia corrected with saline (vomiting, diarrhea, thiazide)',
              'Thiazide or desmopressin stopped',
              'Low-solute patient fed (beer potomania, tea and toast)',
              'Glucocorticoid deficiency treated with hydrocortisone',
              'Nausea, pain or hypoxia relieved; offending drug stopped',
              'Potassium repleted (counts as Na)',
            ],
          },
          {
            kind: 'callout',
            tone: 'action',
            title: 'Alarm sign',
            text: 'Urine output > 100 mL/h with urine osmolality < 200 (or a sudden fall in urine Na + K): Na is about to climb. Check Na now and consider desmopressin.',
          },
          {
            kind: 'table',
            head: ['Strategy', 'How', 'When'],
            rows: [
              ['Reactive', 'Na every 2–4 h + hourly urine output; desmopressin 1–2 µg IV/SC when a dilute diuresis starts', 'Most patients'],
              ['Proactive "clamp"', 'Desmopressin 1–2 µg every 6–8 h from the start + 3% NaCl titrated to the goal [@sood2013]', 'Profound hyponatremia or high ODS risk; reversible cause'],
              ['Rescue (relowering)', 'Stop Na-raising therapy; 10 mL/kg electrolyte-free water (D5W) over 1 h with desmopressin 2 µg IV; recheck Na hourly [@eu2014] [@adrogue2022]', 'Limit exceeded'],
            ],
          },
          { kind: 'interactive', id: 'fluid-lab-link', preset: 'hypovolemic' },
        ],
      },
      {
        id: 'chronic',
        title: 'Chronic SIAD: a ladder',
        blocks: [
          { kind: 'interactive', id: 'furst' },
          {
            kind: 'table',
            head: ['Step', 'Therapy', 'Evidence and cautions'],
            rows: [
              ['0', 'Treat or remove the cause (drug, infection, nausea, pain)', 'Often curative'],
              ['1', 'Fluid restriction (≤ 1 L/day, or 500 mL if electrolyte ratio 0.5–1)', 'RCT: modest rise; > 1/3 still < 130 at day 3 [@garrahy2020]. Fails if urine Na + K > serum Na'],
              ['2', 'Oral urea 15–60 g/day (EU: 0.25–0.5 g/kg/day)', 'As effective as vaptans long term [@soupart2012]; unpalatable — mix with juice'],
              ['2', 'NaCl tablets + low-dose loop diuretic', 'Adding furosemide ± NaCl to restriction gave no extra benefit, more AKI and hypokalemia [@effuse2020]'],
              ['2', 'SGLT2 inhibitor (empagliflozin 25 mg)', 'RCTs: +3 mmol/L vs placebo in 4 days (inpatients) [@empa2020], ≈ +4 over 4 weeks (chronic) [@empa2023]; off-label'],
              ['3', 'Tolvaptan 7.5–15 mg/day, start in hospital', 'Raises Na [@salt2006]; overcorrection risk; no fluid restriction in the first 24–48 h; ≤ 30 days, never in liver disease [@fda-tolvaptan]. EU guideline advises against for moderate/profound'],
              ['✗', 'Demeclocycline, lithium', 'Not recommended (nephrotoxic, unpredictable)'],
            ],
          },
          { kind: 'interactive', id: 'fluid-lab-link', preset: 'siad' },
          {
            kind: 'patterns',
            items: [
              { see: 'Na 115 → 121 at hour 6 after one 3% bolus and NS', think: 'On a trajectory to overshoot', do: 'Stop NS, check urine output, desmopressin if dilute diuresis' },
              { see: 'Na 112 → 125 at hour 20, alcohol use disorder', think: 'Limit (8) exceeded in high-risk', do: 'Relower: D5W 10 mL/kg/1 h + desmopressin 2 µg' },
              { see: 'SIAD, UNa 110, UK 50, SNa 126', think: 'Ratio 1.27 — restriction will fail', do: 'Urea or SGLT2i (or tolvaptan)' },
            ],
          },
        ],
      },
    ],
  },

  // ───────────────────────────────────────────── 6
  {
    id: 'polyuria',
    number: 6,
    title: 'Polyuria: AVP deficiency, AVP resistance, primary polydipsia',
    tagline: 'Copeptin has replaced guesswork',
    minutes: 25,
    objectives: [
      'Define polyuria and separate solute from water diuresis',
      'Use the 2022 names: AVP deficiency and AVP resistance',
      'Choose a diagnostic test (copeptin first) and interpret a water deprivation test',
      'Recognise gestational and post-surgical forms',
    ],
    check: ['pu-define', 'pu-solute', 'pu-names', 'pu-copeptin', 'pu-wdt', 'pu-na', 'pu-baseline'],
    sections: [
      {
        id: 'which',
        title: 'Is it polyuria — and which kind?',
        blocks: [
          {
            kind: 'steps',
            items: [
              { title: 'Polyuria', text: '> 50 mL/kg/day (≈ > 3 L/day in adults), confirmed on a 24-h collection. Distinguish it from frequency and nocturia with normal volume.' },
              { title: 'Solute diuresis', text: 'Urine osmolality > 300 mOsm/kg and total solute excretion > ≈ 1000 mOsm/day (Uosm × litres). Causes: glucose, urea (high-protein feeds, recovering AKI, catabolism), mannitol, saline, post-obstruction.' },
              { title: 'Water diuresis (hypotonic polyuria)', text: 'Uosm < 300: AVP deficiency, AVP resistance or primary polydipsia — the subject of this module.' },
            ],
          },
        ],
      },
      {
        id: 'names',
        title: 'New names (2022)',
        blocks: [
          {
            kind: 'table',
            head: ['Old', 'New', 'Defect'],
            rows: [
              ['Central diabetes insipidus', '**Arginine vasopressin deficiency (AVP-D)**', 'Too little AVP secreted'],
              ['Nephrogenic diabetes insipidus', '**Arginine vasopressin resistance (AVP-R)**', 'Kidney cannot respond to AVP'],
            ],
          },
          {
            kind: 'p',
            text: 'The renaming responds to patient harm: confusion with diabetes mellitus has led to withheld desmopressin and deaths in hospital [@rename2022].',
          },
        ],
      },
      {
        id: 'causes',
        title: 'Causes',
        blocks: [
          {
            kind: 'table',
            head: ['AVP deficiency', 'AVP resistance', 'Primary polydipsia'],
            rows: [
              ['Idiopathic/autoimmune (often stalk thickening)', 'Lithium (commonest acquired)', 'Psychiatric (compulsive) drinking'],
              ['Pituitary/hypothalamic surgery, TBI', 'Hypercalcemia, hypokalemia', '"Healthy habit" high intake'],
              ['Craniopharyngioma, germinoma, metastases', 'Post-obstructive, sickle cell, amyloid', 'Dipsogenic (hypothalamic thirst lesion)'],
              ['Infiltrative: LCH, sarcoidosis, IgG4/lymphocytic hypophysitis, checkpoint inhibitors', 'Drugs: demeclocycline, amphotericin, foscarnet, ifosfamide', 'Dry mouth from anticholinergic drugs'],
              ['Genetic (AVP gene, Wolfram)', 'Genetic: AVPR2 (X-linked, ≈ 90%), AQP2', ''],
            ],
          },
          {
            kind: 'callout',
            tone: 'pearl',
            title: 'Two clinical clues',
            text: 'A pituitary **adenoma** rarely causes AVP-D before surgery — if a sellar mass presents with AVP-D, think craniopharyngioma, germinoma, metastasis or hypophysitis. And in pregnancy, placental vasopressinase can unmask or cause AVP deficiency (gestational DI): desmopressin resists the enzyme and works.',
          },
        ],
      },
      {
        id: 'clues',
        title: 'Sodium tells you a lot',
        blocks: [
          {
            kind: 'p',
            text: 'With intact thirst and free access to water, AVP-D and AVP-R hold Na high-normal (≈ 142–145) and primary polydipsia holds it low-normal (≈ 135–138). **Hypernatremia appears only when thirst or access fails** — infants, older adults, ICU, after surgery, adipsic hypothalamic damage. An unprovoked Na > 147 with Uosm < 300 already proves AVP-D or AVP-R: skip deprivation and give desmopressin.',
          },
        ],
      },
      {
        id: 'tests',
        title: 'Testing: copeptin first',
        blocks: [
          {
            kind: 'table',
            head: ['Test', 'Cut-off', 'Performance'],
            rows: [
              ['Unstimulated copeptin (no thirsting)', '> 21.4 pmol/L → AVP-R', '100% in a small series [@timper2015]'],
              ['Hypertonic saline–stimulated copeptin (3% until Na ≥ 150)', '≤ 4.9 pmol/L → AVP-D; > 4.9 → primary polydipsia', '96.5% vs 76.6% for water deprivation [@fenske2018]; 95.6% in CARGO [@cargo2023]'],
              ['Arginine-stimulated copeptin (60 min)', '≤ 3.8 pmol/L → AVP-D', '93% initially [@winzeler2019], 74.4% head-to-head [@cargo2023]; better tolerated'],
              ['Water deprivation + desmopressin', 'Uosm > 800 PP; < 300 then > 50% rise AVP-D; < 300 and < 50% rise AVP-R', '≈ 77% overall, poor in partial forms [@miller1970] [@fenske2018]'],
            ],
          },
          {
            kind: 'callout',
            tone: 'action',
            title: 'Safety in testing',
            text: 'Hypertonic saline testing needs Na every 30 min and stops at Na ≥ 150. Water deprivation stops at Na > 147, weight loss ≥ 3% or a urine osmolality plateau. Never send a patient with suspected AVP-D home thirsty.',
          },
          { kind: 'interactive', id: 'polyuria-lab' },
          {
            kind: 'patterns',
            items: [
              { see: 'Polyuria, Na 146, copeptin 45 pmol/L, on lithium', think: 'AVP-R', do: 'No stimulation test needed; amiloride, check Ca' },
              { see: 'Polyuria, Na 137, deprivation Uosm 560, +6% after desmopressin', think: 'Indeterminate (washout)', do: 'Hypertonic saline–stimulated copeptin' },
              { see: 'Craving ice-cold water, sudden onset, nocturia', think: 'AVP-D', do: 'Copeptin test, MRI pituitary, anterior pituitary function' },
            ],
          },
        ],
      },
    ],
  },

  // ───────────────────────────────────────────── 7
  {
    id: 'hyper-treat',
    number: 7,
    title: 'Hypernatremia and treating AVP disorders',
    tagline: 'Replace the deficit and the ongoing loss — without fear of speed in adults',
    minutes: 25,
    objectives: [
      'Explain why hypernatremia implies impaired thirst or access',
      'Calculate free-water deficit plus ongoing losses',
      'State current evidence on correction speed',
      'Manage desmopressin safely, AVP-R and post-pituitary-surgery water disorders',
    ],
    check: ['hy-why', 'hy-deficit', 'hy-speed', 'hy-desmo', 'hy-escape', 'hy-thiazide', 'hy-postop', 'hy-gestational'],
    sections: [
      {
        id: 'why',
        title: 'Hypernatremia = water deficit + a failure of thirst or access',
        blocks: [
          {
            kind: 'table',
            head: ['Mechanism', 'Examples'],
            rows: [
              ['Renal water loss', 'AVP-D, AVP-R, osmotic diuresis (glucose, urea from tube feeds/catabolism, mannitol), post-ATN diuresis'],
              ['Extra-renal water loss', 'Fever, burns, ventilation without humidification, osmotic diarrhea, lactulose'],
              ['Sodium gain', 'Hypertonic saline or bicarbonate, salt ingestion, hypertonic feeds'],
              ['Who cannot drink', 'ICU, intubated, dementia, infants, post-op, adipsic hypothalamic disease'],
            ],
          },
        ],
      },
      {
        id: 'plan',
        title: 'The plan',
        blocks: [
          {
            kind: 'steps',
            items: [
              { title: '1. Shock first', text: 'If hypotensive or hypovolemic, give isotonic fluid until perfusion is restored — it is still hypotonic relative to the patient.' },
              { title: '2. Deficit', text: 'Free-water deficit = TBW × (Na ÷ 140 − 1).' },
              { title: '3. Ongoing losses', text: 'Add urine electrolyte-free water clearance and ≈ 0.5–1 L/day insensible loss (more with fever).' },
              { title: '4. Route', text: 'Enteral water is safest. IV D5W otherwise (watch glucose: hyperglycemia causes an osmotic diuresis that worsens hypernatremia); 0.45% NaCl if also volume depleted.' },
              { title: '5. Monitor', text: 'Na every 4–6 h; adjust to the measured response, not the formula.' },
            ],
          },
          { kind: 'interactive', id: 'free-water' },
        ],
      },
      {
        id: 'speed',
        title: 'How fast?',
        blocks: [
          {
            kind: 'p',
            text: 'The classic ceiling of ≤ 10–12 mmol/L per 24 h (≈ 0.5 mmol/L/h) for chronic hypernatremia comes mainly from infants with seizures from cerebral edema [@adrogue2000hyper]. In adults, rapid correction was not associated with cerebral edema or higher mortality in ICU patients [@chauhan2019], and in 4265 adults with Na ≥ 155 faster correction was associated with **lower** 30-day mortality [@feigin2023].',
          },
          {
            kind: 'callout',
            tone: 'evidence',
            title: 'Practical position',
            text: 'Chronic: aim for ≈ 10–12 mmol/L/day and do not undertreat — under-correction is the commoner error. Acute (< 48 h: salt loading, new post-operative AVP-D): correct quickly (≈ 1 mmol/L/h) back to normal. Brain injury with raised ICP: avoid abrupt falls.',
          },
          { kind: 'interactive', id: 'fluid-lab-link', preset: 'avp-d-icu' },
        ],
      },
      {
        id: 'avpd',
        title: 'Treating AVP deficiency',
        blocks: [
          {
            kind: 'points',
            items: [
              'Desmopressin (selective V2 agonist): oral 0.1–0.4 mg 1–3×/day, sublingual 60–240 µg, nasal 10–40 µg/day, SC/IV 0.5–2 µg. Start low at night; titrate to control nocturia.',
              'Drink to thirst, not to a target. Recheck Na within a week of any start or dose change.',
              '**Desmopressin-induced hyponatremia** affects up to about a quarter of patients; a regular "escape" (delay one dose until polyuria returns, e.g. weekly) lowers the risk [@atila2024].',
              'Adipsic AVP-D: fixed daily intake adjusted to daily weight, frequent Na checks.',
              'In hospital: never omit desmopressin in a patient with AVP-D (NPO, peri-operative) without IV replacement and a plan — omission causes rapid, dangerous hypernatremia.',
            ],
          },
        ],
      },
      {
        id: 'postop',
        title: 'After pituitary surgery',
        blocks: [
          {
            kind: 'table',
            head: ['Pattern', 'Timing', 'Frequency', 'Management'],
            rows: [
              ['Transient AVP-D', 'Day 1–3', 'Common (series vary widely)', 'Desmopressin only for distressing polyuria or rising Na; let thirst guide intake'],
              ['Isolated delayed hyponatremia', 'Day 5–10 (peak 7)', '≈ 10–30%', 'Na at day 7; limit fluids to thirst in week 2'],
              ['Triphasic response', 'AVP-D (days 1–5) → SIAD (≈ 5–10, stored AVP leaks from degenerating neurons) → permanent AVP-D', '≈ 1%', 'Stop desmopressin in phase 2; restrict fluids'],
              ['Permanent AVP-D', 'Persists > 3 months', '≈ 2–7%', 'Long-term desmopressin'],
            ],
          },
          { kind: 'p', text: 'Mechanisms and timing: Loh & Verbalis [@loh2008].' },
        ],
      },
      {
        id: 'avpr',
        title: 'Treating AVP resistance',
        blocks: [
          {
            kind: 'points',
            items: [
              'Remove the cause: correct Ca and K; review lithium with psychiatry (after years of use the defect may be irreversible).',
              'Guarantee water access. Low-salt, moderate-protein diet: less solute → less urine (equation 2).',
              '**Thiazide** (e.g. HCTZ 25 mg): mild volume contraction → more proximal reabsorption → 30–50% less urine. It raises lithium levels (≈ 25–40%) — monitor and reduce the dose.',
              '**Amiloride** 5–10 mg twice daily: blocks lithium entry through ENaC; first choice for lithium-induced AVP-R [@batlle1985].',
              'NSAIDs (indomethacin) reduce urine further; limited by kidney and GI toxicity.',
              'Desmopressin does not work (except some partial forms at high doses).',
            ],
          },
        ],
      },
      {
        id: 'pregnancy',
        title: 'Gestational AVP deficiency',
        blocks: [
          {
            kind: 'p',
            text: 'Placental vasopressinase (cystine aminopeptidase) rises in the third trimester and degrades AVP. Clearance falls in pre-eclampsia, HELLP and acute fatty liver of pregnancy, so check BP and liver tests. Desmopressin is resistant to vasopressinase and is the treatment. It resolves within weeks of delivery. Pregnancy also lowers the osmotic set point: normal Na in pregnancy is ≈ 4–5 mmol/L lower.',
          },
          {
            kind: 'patterns',
            items: [
              { see: 'Nursing-home resident, Na 162, dry', think: 'Chronic, hypovolemic water deficit', do: 'Isotonic until perfused, then free water ≈ 10–12/day; do not undershoot' },
              { see: 'Post-craniotomy, urine 500 mL/h, Uosm 90, Na 149', think: 'Acute AVP-D', do: 'Desmopressin 1 µg IV, match losses; can correct quickly' },
              { see: 'Day 7 after transsphenoidal surgery, headache, Na 124', think: 'Delayed hyponatremia', do: 'Fluid restriction; hold desmopressin' },
              { see: 'On lithium + new HCTZ for polyuria, now tremor and confusion', think: 'Lithium toxicity', do: 'Lithium level; thiazide raises it' },
            ],
          },
        ],
      },
    ],
  },

  // ───────────────────────────────────────────── 8
  {
    id: 'special',
    number: 8,
    title: 'Special situations',
    tagline: 'The scenarios that fill ICUs and exam papers',
    minutes: 15,
    objectives: [
      'Manage exercise-associated, postoperative and drug-induced hyponatremia',
      'Avoid the classic traps in beer potomania, cirrhosis, heart failure and oncology',
      'Recognise hyponatremia from checkpoint inhibitors and desmopressin',
    ],
    check: ['sp-eah', 'sp-postop', 'sp-cirrhosis', 'sp-potomania', 'sp-mdma', 'sp-k'],
    sections: [
      {
        id: 'situations',
        title: 'Situation cards',
        blocks: [
          {
            kind: 'table',
            head: ['Situation', 'Mechanism', 'Do', 'Watch'],
            rows: [
              ['Exercise-associated (marathon, hiking)', 'Drinking beyond losses + non-osmotic ADH', 'Symptomatic: 100 mL 3% bolus, up to 3× at 10-min intervals; no hypotonic fluids [@eah2015]', 'Acute — no correction limit; weight gain during the race confirms overdrinking'],
              ['Postoperative', 'Pain, nausea and opioids drive ADH; hypotonic maintenance fluids add water', 'Isotonic maintenance fluids; treat nausea; avoid hypotonic fluids', 'Young women and children develop acute symptomatic hyponatremia fastest'],
              ['MDMA ("ecstasy")', 'ADH release + heavy water intake', 'Acute: 3% bolus for symptoms', 'Seizures can be the first sign'],
              ['Thiazide', 'Impaired dilution + K and volume loss; older, thin women; high water intake', 'Stop permanently; replace K', 'Water diuresis when the drug wears off'],
              ['Beer potomania / tea and toast', 'Too little solute to excrete water', 'Thiamine first; correct K, Mg, phosphate; feed cautiously; limit 8/day; consider desmopressin clamp', 'Highest ODS risk group; rapid autocorrection'],
              ['Heart failure', 'Low effective volume → ADH; hyponatremia marks severity', 'Fluid restriction; loop diuretic; guideline therapy; tolvaptan short-term only', 'Avoid thiazides'],
              ['Cirrhosis', 'Splanchnic vasodilation → ADH', 'Stop diuretics if Na < 125; fluid restriction; albumin; 3% only for severe symptoms', 'No tolvaptan (liver injury); ODS risk around liver transplant'],
              ['Checkpoint inhibitor hypophysitis', 'ACTH deficiency mimics SIAD', 'Cortisol; hydrocortisone', 'AVP-D is rare; anterior deficits common'],
              ['Desmopressin for nocturia, enuresis, bleeding disorders', 'Fixed antidiuresis + normal drinking', 'Restrict fluid for 24 h after a dose; check Na in older adults', 'Severe acute hyponatremia'],
              ['Small-cell lung cancer, chemotherapy', 'Ectopic ADH; cyclophosphamide/vincristine/cisplatin; vigorous hydration', 'Treat tumour; urea or tolvaptan', 'Cisplatin can also cause renal salt wasting'],
              ['Hypokalemia', 'K repletion raises Na (Edelman)', 'Count KCl in the Na budget', 'Overcorrection in alcohol and thiazide cases'],
            ],
          },
          {
            kind: 'patterns',
            items: [
              { see: 'Runner collapses at mile 24, vomiting, weight up 2 kg', think: 'Acute EAH', do: '100 mL 3% now, repeat ×2 if needed' },
              { see: 'Healthy child after tonsillectomy on 0.18% saline, seizure', think: 'Iatrogenic acute hyponatremia', do: '3% bolus; switch to isotonic maintenance' },
              { see: 'Cirrhosis, Na 122 on spironolactone + furosemide', think: 'Diuretic-aggravated hypervolemic hyponatremia', do: 'Stop diuretics; restrict fluids; albumin' },
            ],
          },
        ],
      },
    ],
  },
];

export const MODULE_INDEX: Record<string, Module> = Object.fromEntries(MODULES.map((m) => [m.id, m]));

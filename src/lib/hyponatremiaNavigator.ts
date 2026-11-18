/**
 * Stepwise diagnostic reasoning for hyponatremia.
 *
 * Order follows the European guideline (Spasovski 2014): treat severe symptoms first,
 * confirm hypotonicity, then urine osmolality, THEN urine sodium, and only then clinical
 * volume status — because bedside volume assessment is unreliable (Chung 1987: clinical
 * exam misclassified about half of hypovolemic patients).
 */

import { calculatedOsm, correctedNaForGlucose, effectiveOsm, round } from './physiology';

export type Symptoms = 'none' | 'mild' | 'moderate' | 'severe';
export type Ecf = 'reduced' | 'normal' | 'expanded' | 'unsure';
export type Onset = 'acute' | 'chronic' | 'unknown';

export interface HypoInputs {
  na: number;
  glucose: number;
  bun: number;
  /** measured serum osmolality, if available */
  measuredOsm: number | null;
  symptoms: Symptoms;
  onset: Onset;
  uOsm: number | null;
  uNa: number | null;
  ecf: Ecf;
  diuretics: boolean;
  kidneyDisease: boolean;
  cnsInsult: boolean;
  hypokalemia: boolean;
  alcoholOrMalnutrition: boolean;
  liverDisease: boolean;
}

export type StepStatus = 'pass' | 'stop' | 'alert' | 'missing';

export interface Step {
  id: string;
  question: string;
  finding: string;
  status: StepStatus;
  why: string;
}

export interface NavigatorResult {
  steps: Step[];
  emergency: { level: 'none' | 'moderate' | 'severe'; action: string } | null;
  conclusion: string;
  differential: string[];
  nextTests: string[];
  odsRisk: { high: boolean; reasons: string[] };
  flips: string[];
}

export const DEFAULT_HYPO_INPUTS: HypoInputs = {
  na: 124,
  glucose: 100,
  bun: 10,
  measuredOsm: 258,
  symptoms: 'mild',
  onset: 'chronic',
  uOsm: 450,
  uNa: 55,
  ecf: 'normal',
  diuretics: false,
  kidneyDisease: false,
  cnsInsult: false,
  hypokalemia: false,
  alcoholOrMalnutrition: false,
  liverDisease: false,
};

export function navigateHyponatremia(x: HypoInputs): NavigatorResult {
  const steps: Step[] = [];
  const differential: string[] = [];
  const nextTests: string[] = [];
  const flips: string[] = [];
  let conclusion = '';

  // --- ODS risk (US expert panel 2013) ---
  const reasons: string[] = [];
  if (x.na <= 105) reasons.push('Na ≤ 105 mmol/L');
  if (x.hypokalemia) reasons.push('hypokalemia');
  if (x.alcoholOrMalnutrition) reasons.push('alcohol use disorder / malnutrition');
  if (x.liverDisease) reasons.push('advanced liver disease');
  const odsRisk = { high: reasons.length > 0, reasons };

  // --- Step 0: emergency ---
  let emergency: NavigatorResult['emergency'] = null;
  const acuteSymptomatic = x.onset === 'acute' && x.symptoms !== 'none';
  if (x.symptoms === 'severe' || acuteSymptomatic) {
    emergency = {
      level: 'severe',
      action:
        '3% NaCl 150 mL over 20 min (EU) or 100 mL over 10 min (US); recheck Na and repeat up to twice until symptoms improve or Na has risen 5 mmol/L. Do not wait for the diagnosis.',
    };
  } else if (x.symptoms === 'moderate') {
    emergency = {
      level: 'moderate',
      action: 'Single 150 mL 3% NaCl bolus over 20 min (EU), aiming for +5 mmol/L in 24 h, while you work up the cause.',
    };
  }
  steps.push({
    id: 'symptoms',
    question: 'Severe or moderately severe symptoms? Acute onset?',
    finding:
      x.symptoms === 'severe'
        ? 'Severe (vomiting, seizure, GCS ≤ 8, cardiorespiratory distress)'
        : x.symptoms === 'moderate'
          ? 'Moderately severe (nausea, confusion, headache)'
          : acuteSymptomatic
            ? 'Acute onset with symptoms'
            : x.symptoms === 'mild'
              ? 'Mild / nonspecific symptoms'
              : 'Asymptomatic',
    status: emergency?.level === 'severe' ? 'alert' : 'pass',
    why: 'Symptoms reflect brain edema. Treatment of severe symptoms comes before diagnosis — a small, fast rise (4–6 mmol/L) is enough to stop herniation.',
  });

  // --- Step 1: tonicity ---
  const eff = effectiveOsm(x.na, x.glucose);
  const calc = calculatedOsm(x.na, x.glucose, x.bun);
  const corrNa = correctedNaForGlucose(x.na, x.glucose);
  if (x.glucose > 200 && corrNa >= 135) {
    steps.push({
      id: 'tonicity',
      question: 'Is the hyponatremia hypotonic?',
      finding: `Glucose ${x.glucose} mg/dL → corrected Na ≈ ${round(corrNa)} mmol/L`,
      status: 'stop',
      why: 'Hyperglycemia pulls water out of cells (translocational hyponatremia). Tonicity is high or normal; treat the hyperglycemia, not the sodium.',
    });
    return finish('Translocational (hyperglycemic) hyponatremia — not hypotonic.', ['Hyperglycemia'], ['Recheck Na as glucose falls (Na should rise ≈ 2.4 per 100 mg/dL)']);
  }
  if (x.measuredOsm !== null && x.measuredOsm >= 275) {
    const highUrea = calc - eff > 15;
    if (highUrea && eff < 275) {
      steps.push({
        id: 'tonicity',
        question: 'Is the hyponatremia hypotonic?',
        finding: `Measured Osm ${x.measuredOsm} looks normal, but effective Osm (2·Na + glucose/18) = ${round(eff, 0)}`,
        status: 'pass',
        why: 'Urea is an ineffective osmole: it raises measured osmolality but does not hold water outside cells. This patient is hypotonic.',
      });
    } else {
      steps.push({
        id: 'tonicity',
        question: 'Is the hyponatremia hypotonic?',
        finding: `Measured Osm ${x.measuredOsm} mOsm/kg (≥ 275)`,
        status: 'stop',
        why: 'Not hypotonic. Think: pseudohyponatremia (very high lipids or protein, e.g. myeloma — remeasure with a direct ion-selective electrode, i.e. blood-gas analyser), or extra effective osmoles (mannitol, glycine irrigation, contrast, IVIG-maltose).',
      });
      return finish(
        'Non-hypotonic hyponatremia — find the extra osmole or the lab artefact.',
        ['Pseudohyponatremia (lipids, paraproteins)', 'Mannitol / glycine / sorbitol', 'Hyperglycemia (check corrected Na)'],
        ['Direct-ISE Na (blood gas)', 'Lipids, total protein', 'Osmolal gap'],
      );
    }
  } else {
    steps.push({
      id: 'tonicity',
      question: 'Is the hyponatremia hypotonic?',
      finding:
        x.measuredOsm !== null
          ? `Measured Osm ${x.measuredOsm} mOsm/kg (< 275)`
          : `No measured Osm; effective Osm ≈ ${round(eff, 0)} mOsm/kg`,
      status: x.measuredOsm === null ? 'missing' : 'pass',
      why: 'Hypotonic hyponatremia = true water excess relative to solute. Always confirm before chasing SIAD.',
    });
  }

  // --- Step 2: urine osmolality ---
  if (x.uOsm === null) {
    steps.push({ id: 'uosm', question: 'Urine osmolality ≤ 100?', finding: 'Not measured', status: 'missing', why: 'Tells you whether ADH (or something acting like it) is active.' });
    return finish('Measure urine osmolality and sodium on the same spot sample, ideally before treatment.', [], ['Spot urine Osm, Na, K, creatinine', 'Serum urate, urea, creatinine']);
  }
  if (x.uOsm <= 100) {
    steps.push({
      id: 'uosm',
      question: 'Urine osmolality ≤ 100?',
      finding: `Uosm ${x.uOsm} mOsm/kg — maximally dilute`,
      status: 'stop',
      why: 'ADH is appropriately suppressed. Na is low because water intake exceeds the kidney’s capacity: max urine volume = daily solute ÷ minimum Uosm.',
    });
    flips.push('Uosm rising above 100 after admission means ADH has come back on (e.g. nausea, pain, hypovolemia).');
    return finish(
      'Excess water intake relative to solute intake. High risk of rapid autocorrection once intake normalises.',
      ['Primary polydipsia', 'Low solute intake (beer potomania, tea-and-toast)', 'Reset osmostat (if Na stable 125–135 and Uosm varies)'],
      ['Diet and drinking history', 'Hourly urine output after admission — a brisk dilute diuresis predicts overcorrection'],
    );
  }
  steps.push({
    id: 'uosm',
    question: 'Urine osmolality ≤ 100?',
    finding: `Uosm ${x.uOsm} mOsm/kg — not maximally dilute`,
    status: 'pass',
    why: 'Urine is less dilute than it should be: ADH is acting (appropriately, as in low effective volume, or inappropriately, as in SIAD).',
  });

  // --- Step 3: urine sodium ---
  if (x.uNa === null) {
    steps.push({ id: 'una', question: 'Urine Na ≤ 30?', finding: 'Not measured', status: 'missing', why: 'Separates low effective arterial volume from SIAD and renal salt loss.' });
    return finish('Measure urine Na on the same sample.', [], ['Spot urine Na']);
  }
  if (x.uNa <= 30) {
    steps.push({
      id: 'una',
      question: 'Urine Na ≤ 30?',
      finding: `UNa ${x.uNa} mmol/L — kidneys are retaining sodium`,
      status: 'pass',
      why: 'Low urine Na means the kidney senses low effective arterial blood volume (Una ≤ 30 predicts a rise in Na with isotonic saline).',
    });
    if (x.ecf === 'expanded') {
      steps.push({ id: 'ecf', question: 'Extracellular fluid volume?', finding: 'Expanded (edema, ascites, raised JVP)', status: 'stop', why: 'Low effective arterial volume with total-body Na and water excess.' });
      return finish('Hypervolemic hyponatremia (low effective arterial volume).', ['Heart failure', 'Cirrhosis', 'Nephrotic syndrome'], ['Treat the disease; water restriction; loop diuretic; avoid thiazides']);
    }
    steps.push({
      id: 'ecf',
      question: 'Extracellular fluid volume?',
      finding: x.ecf === 'reduced' ? 'Reduced' : x.ecf === 'normal' ? 'Looks normal (exam is insensitive)' : 'Unsure',
      status: 'stop',
      why: 'Low urine Na with a non-edematous patient = volume depletion from extra-renal losses (even if the exam looks normal).',
    });
    flips.push('If Na does not rise after 0.5–1 L NS and urine Na rises with Uosm unchanged, reconsider SIAD.');
    return finish(
      'Hypovolemic hyponatremia from extra-renal loss (or remote diuretic use). Isotonic fluid restores volume — then ADH switches off: watch for a water diuresis.',
      ['Diarrhea / vomiting (late)', 'Third spacing (pancreatitis, burns)', 'Remote (stopped) diuretic'],
      ['Hourly urine output after starting saline', 'Na every 2–4 h', 'K (repletion also raises Na)'],
    );
  }
  steps.push({
    id: 'una',
    question: 'Urine Na ≤ 30?',
    finding: `UNa ${x.uNa} mmol/L — natriuresis`,
    status: 'pass',
    why: 'High urine Na means either the kidney is not sensing hypovolemia (SIAD, euvolemia) or it is losing salt (diuretics, mineralocorticoid deficiency, salt wasting).',
  });

  // --- Step 4: diuretics / kidney disease ---
  if (x.diuretics || x.kidneyDisease) {
    steps.push({
      id: 'diuretic',
      question: 'Diuretics or kidney disease?',
      finding: x.diuretics ? 'On a diuretic' : 'Kidney disease',
      status: 'alert',
      why: 'Diuretics and CKD raise urine Na and make the urine indices uninterpretable. Thiazides are a leading cause of hyponatremia (especially in older women).',
    });
    nextTests.push('FE urate: > 12% favours SIAD even on diuretics (Fenske 2008)');
    return finish(
      x.diuretics ? 'Diuretic-associated hyponatremia (thiazide most often) — SIAD still possible.' : 'Kidney disease limiting water excretion — SIAD still possible.',
      ['Thiazide-induced hyponatremia', 'SIAD masked by diuretic', 'CKD / AKI'],
      ['Stop the thiazide', 'FE urate, FE urea', 'Reassess off diuretics'],
    );
  }
  steps.push({ id: 'diuretic', question: 'Diuretics or kidney disease?', finding: 'No', status: 'pass', why: 'Urine Na can now be interpreted.' });

  // --- Step 5: ECF volume ---
  if (x.ecf === 'reduced') {
    steps.push({
      id: 'ecf',
      question: 'Extracellular fluid volume?',
      finding: 'Reduced, with urine Na > 30',
      status: 'stop',
      why: 'The kidney is losing salt despite volume depletion.',
    });
    if (x.cnsInsult) flips.push('In SAH/neurosurgery SIAD is far commoner than CSW (Hannon 2014: SIAD 71%, CSW 0 of 49) — but neither is treated with fluid restriction.');
    return finish(
      'Renal salt loss with volume depletion.',
      [
        'Vomiting (bicarbonaturia drags Na)',
        'Primary adrenal insufficiency (look for high K)',
        ...(x.cnsInsult ? ['Cerebral salt wasting (diagnosis of exclusion)'] : []),
        'Salt-losing nephropathy',
        'Occult diuretic',
      ],
      ['Morning cortisol ± ACTH stimulation', 'K, bicarbonate, urine Cl', 'Response to isotonic saline'],
    );
  }
  if (x.ecf === 'expanded') {
    steps.push({ id: 'ecf', question: 'Extracellular fluid volume?', finding: 'Expanded with urine Na > 30', status: 'stop', why: 'Edematous state on diuretics, or kidney failure.' });
    return finish('Hypervolemic hyponatremia with renal Na loss (diuretic effect or kidney disease).', ['Heart failure on diuretics', 'Cirrhosis on diuretics', 'AKI/CKD'], []);
  }
  steps.push({
    id: 'ecf',
    question: 'Extracellular fluid volume?',
    finding: x.ecf === 'normal' ? 'Normal' : 'Unsure',
    status: 'stop',
    why: 'Euvolemic, concentrated urine, natriuresis, not on diuretics: SIAD — once two mimics are excluded.',
  });
  nextTests.push('Morning cortisol (secondary adrenal insufficiency is the classic SIAD mimic)', 'TSH (only severe hypothyroidism causes hyponatremia)');
  nextTests.push('Supportive: serum urate < 4 mg/dL, BUN < 10 mg/dL, FE urate > 12%, FE urea > 55%');
  if (x.cnsInsult) {
    flips.push('After SAH/neurosurgery: if volume becomes clearly depleted despite intake, consider salt wasting — and avoid fluid restriction either way (delayed cerebral ischemia risk).');
  }
  flips.push('If Na rises ≥ 5 mmol/L after 2 L NS over 24 h, the patient was volume-depleted after all.');
  return finish(
    'SIAD (syndrome of inappropriate antidiuresis) — after excluding glucocorticoid deficiency and severe hypothyroidism.',
    ['Drugs: SSRIs/SNRIs, carbamazepine/oxcarbazepine, cyclophosphamide, vincristine, cisplatin, opioids, MDMA, desmopressin', 'Lung: pneumonia, TB', 'CNS: SAH, meningitis, stroke, tumour', 'Malignancy: small-cell lung cancer', 'Nausea, pain, postoperative state, exercise'],
    [],
  );

  function finish(text: string, ddx: string[], tests: string[]): NavigatorResult {
    conclusion = text;
    differential.push(...ddx);
    nextTests.push(...tests);
    return { steps, emergency, conclusion, differential, nextTests, odsRisk, flips };
  }
}

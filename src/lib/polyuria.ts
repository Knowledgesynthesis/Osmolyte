/**
 * Polyuria–polydipsia testing engine.
 *
 * Diagnoses use the 2022 nomenclature: AVP deficiency (AVP-D, formerly central DI) and
 * AVP resistance (AVP-R, formerly nephrogenic DI).
 *
 * Interpretation thresholds:
 *  - Hypotonic polyuria: > 50 mL/kg/day with Uosm < 300 mOsm/kg.
 *  - Water deprivation (Miller 1970; reviewed Christ-Crain 2019): Uosm > 800 after
 *    deprivation → primary polydipsia/normal; < 300 → complete AVP-D or AVP-R; desmopressin
 *    rise > 50% → AVP-D; 300–800 is indeterminate (where the test fails: 77% accuracy, Fenske 2018).
 *  - Baseline copeptin > 21.4 pmol/L (no prior thirsting) → AVP-R (Timper 2015).
 *  - Hypertonic-saline-stimulated copeptin (Na ≥ 150): ≤ 4.9 pmol/L → AVP-D (96.5%, Fenske 2018;
 *    95.6% in CARGO, Refardt 2023).
 *  - Arginine-stimulated copeptin at 60 min: ≤ 3.8 pmol/L → AVP-D (93% in Winzeler 2019,
 *    but 74.4% in the head-to-head CARGO trial).
 */

export type PolyuriaDx = 'avp-d-complete' | 'avp-d-partial' | 'avp-r' | 'primary-polydipsia';

export const DX_LABEL: Record<PolyuriaDx, string> = {
  'avp-d-complete': 'AVP deficiency, complete (central DI)',
  'avp-d-partial': 'AVP deficiency, partial',
  'avp-r': 'AVP resistance (nephrogenic DI)',
  'primary-polydipsia': 'Primary polydipsia',
};

export interface PolyuriaCase {
  id: string;
  dx: PolyuriaDx;
  vignette: string;
  weightKg: number;
  urineLPerDay: number;
  baseline: { na: number; uOsm: number; copeptin: number };
  /** deprivation kinetics */
  depr: { uOsmPlateau: number; tauH: number; naRisePerH: number; urineLPerH: number };
  desmoRise: number; // fractional rise after desmopressin
  hsCopeptin: number; // pmol/L at Na ≥ 150
  arginineCopeptin: number; // pmol/L at 60 min
}

export const POLYURIA_CASES: PolyuriaCase[] = [
  {
    id: 'pp1',
    dx: 'primary-polydipsia',
    vignette: '29-year-old woman, 7 L/day of water "to stay healthy", Na 137.',
    weightKg: 62,
    urineLPerDay: 7,
    baseline: { na: 137, uOsm: 110, copeptin: 2.1 },
    depr: { uOsmPlateau: 690, tauH: 6, naRisePerH: 0.35, urineLPerH: 0.08 },
    desmoRise: 0.05,
    hsCopeptin: 9.8,
    arginineCopeptin: 5.6,
  },
  {
    id: 'cd1',
    dx: 'avp-d-complete',
    vignette: '41-year-old man, new nocturia and thirst for ice-cold water; MRI: thickened pituitary stalk. Na 143.',
    weightKg: 80,
    urineLPerDay: 9,
    baseline: { na: 143, uOsm: 95, copeptin: 1.2 },
    depr: { uOsmPlateau: 150, tauH: 4, naRisePerH: 1.1, urineLPerH: 0.35 },
    desmoRise: 1.8,
    hsCopeptin: 1.4,
    arginineCopeptin: 1.9,
  },
  {
    id: 'pd1',
    dx: 'avp-d-partial',
    vignette: '55-year-old woman, 4 years after pituitary surgery, 5 L/day urine. Na 142.',
    weightKg: 68,
    urineLPerDay: 5,
    baseline: { na: 142, uOsm: 160, copeptin: 2.4 },
    depr: { uOsmPlateau: 470, tauH: 5, naRisePerH: 0.55, urineLPerH: 0.15 },
    desmoRise: 0.28,
    hsCopeptin: 3.1,
    arginineCopeptin: 4.2,
  },
  {
    id: 'nd1',
    dx: 'avp-r',
    vignette: '50-year-old man on lithium for 15 years, 6 L/day urine. Na 144.',
    weightKg: 85,
    urineLPerDay: 6,
    baseline: { na: 144, uOsm: 130, copeptin: 38 },
    depr: { uOsmPlateau: 190, tauH: 4, naRisePerH: 0.9, urineLPerH: 0.25 },
    desmoRise: 0.06,
    hsCopeptin: 65,
    arginineCopeptin: 30,
  },
];

export interface DeprivationPoint {
  t: number;
  uOsm: number;
  na: number;
  weightLossPct: number;
}

/** Hourly water-deprivation course until `hours`. */
export function deprivationCourse(c: PolyuriaCase, hours: number): DeprivationPoint[] {
  const pts: DeprivationPoint[] = [];
  for (let t = 0; t <= hours; t++) {
    const uOsm = c.depr.uOsmPlateau - (c.depr.uOsmPlateau - c.baseline.uOsm) * Math.exp(-t / c.depr.tauH);
    // urine flow falls as urine concentrates
    const flowFactor = c.baseline.uOsm / uOsm;
    const lostL = Array.from({ length: t }, (_, i) => {
      const u = c.depr.uOsmPlateau - (c.depr.uOsmPlateau - c.baseline.uOsm) * Math.exp(-i / c.depr.tauH);
      return Math.max(c.depr.urineLPerH * (c.baseline.uOsm / u), 0.05) + 0.04;
    }).reduce((a, b) => a + b, 0);
    pts.push({
      t,
      uOsm: Math.round(uOsm),
      na: Math.round((c.baseline.na + c.depr.naRisePerH * t * Math.max(0.4, flowFactor)) * 10) / 10,
      weightLossPct: Math.round((lostL / c.weightKg) * 1000) / 10,
    });
  }
  return pts;
}

export interface StopCheck {
  stop: boolean;
  reasons: string[];
}

/** Standard stopping criteria for water deprivation. */
export function deprivationStopCheck(pts: DeprivationPoint[]): StopCheck {
  const reasons: string[] = [];
  const last = pts[pts.length - 1];
  if (last.na > 147) reasons.push(`Na ${last.na} > 147 mmol/L (enough osmotic stimulus — stop to avoid harm)`);
  if (last.weightLossPct >= 3) reasons.push(`Weight loss ${last.weightLossPct}% ≥ 3%`);
  if (pts.length >= 4) {
    const w = pts.slice(-4);
    const flat = w.slice(1).every((p, i) => Math.abs(p.uOsm - w[i].uOsm) < 30);
    if (flat) reasons.push('Urine osmolality plateau (rise < 30 mOsm/kg/h for 3 consecutive hours)');
  }
  if (last.uOsm > 800) reasons.push('Uosm > 800 — concentrating ability intact');
  return { stop: reasons.length > 0, reasons };
}

export function desmopressinResponse(c: PolyuriaCase, postDeprivationUosm: number): number {
  return Math.round(postDeprivationUosm * (1 + c.desmoRise));
}

export interface Interpretation {
  verdict: string;
  confidence: 'clear' | 'indeterminate';
  explanation: string;
}

export function interpretDeprivation(postDepr: number, postDesmo: number): Interpretation {
  const rise = (postDesmo - postDepr) / postDepr;
  const pct = Math.round(rise * 100);
  if (postDepr > 800) {
    return { verdict: 'Primary polydipsia (or normal)', confidence: 'clear', explanation: `Uosm ${postDepr} > 800 after deprivation: AVP secretion and action are intact.` };
  }
  if (postDepr < 300) {
    if (rise > 0.5) return { verdict: 'Complete AVP deficiency', confidence: 'clear', explanation: `Uosm stayed < 300, then rose ${pct}% with desmopressin (> 50%): kidneys work, AVP is missing.` };
    return { verdict: 'AVP resistance', confidence: 'clear', explanation: `Uosm stayed < 300 and rose only ${pct}% with desmopressin: the kidney cannot respond to AVP.` };
  }
  return {
    verdict: rise >= 0.1 ? 'Indeterminate — favours partial AVP deficiency' : 'Indeterminate — favours primary polydipsia',
    confidence: 'indeterminate',
    explanation: `Uosm ${postDepr} lies in the 300–800 grey zone (desmopressin rise ${pct}%). Chronic polydipsia washes out the medullary gradient, so primary polydipsia can look like partial AVP-D and vice versa. This is where the deprivation test is wrong ~1 time in 4 — use hypertonic-saline-stimulated copeptin.`,
  };
}

export function interpretCopeptin(kind: 'baseline' | 'hypertonic' | 'arginine', value: number): Interpretation {
  if (kind === 'baseline') {
    return value > 21.4
      ? { verdict: 'AVP resistance', confidence: 'clear', explanation: `Unstimulated copeptin ${value} pmol/L > 21.4: AVP is high but ineffective (Timper 2015). No further testing needed.` }
      : { verdict: 'Not AVP resistance', confidence: 'indeterminate', explanation: `Copeptin ${value} pmol/L ≤ 21.4: excludes AVP-R; a stimulation test is needed to separate AVP-D from primary polydipsia.` };
  }
  if (kind === 'hypertonic') {
    return value <= 4.9
      ? { verdict: 'AVP deficiency', confidence: 'clear', explanation: `Copeptin ${value} ≤ 4.9 pmol/L despite Na ≥ 150: the hypothalamus cannot secrete AVP (accuracy ≈ 96%).` }
      : { verdict: 'Primary polydipsia', confidence: 'clear', explanation: `Copeptin ${value} > 4.9 pmol/L at Na ≥ 150: AVP secretion is intact.` };
  }
  return value <= 3.8
    ? { verdict: 'AVP deficiency (likely)', confidence: 'indeterminate', explanation: `Arginine-stimulated copeptin ${value} ≤ 3.8 pmol/L. Better tolerated, but less accurate (74% in CARGO) — confirm with hypertonic saline if the result does not fit.` }
    : { verdict: 'Primary polydipsia (likely)', confidence: 'indeterminate', explanation: `Arginine-stimulated copeptin ${value} > 3.8 pmol/L. Accuracy 74% in CARGO; confirm with hypertonic saline if doubtful.` };
}

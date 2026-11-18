/**
 * Fluid Lab — an hour-by-hour mass-balance model of serum sodium.
 *
 * Two equations do all the work:
 *   1. Edelman:          serum Na ≈ (exchangeable Na + K) / total body water
 *   2. Water excretion:  urine volume = solute excreted ÷ urine osmolality
 * Urine osmolality is set by the ADH state (physiologic, SIAD, AVP-deficiency, AVP-resistance)
 * and by drugs (desmopressin, tolvaptan, loop, thiazide). The kidney excretes surplus Na+K with
 * a ~16 h time constant and avidly retains Na+K when the extracellular volume is depleted.
 *
 * It is a teaching model: it reproduces the classic behaviours (the saline paradox in SIAD,
 * auto-correction when a hypovolemic or low-solute patient's ADH switches off, desmopressin
 * clamps, AVP-deficiency polyuria) but not the fine detail of a real patient.
 */

import { FLUIDS, FluidId, MMOL_NA_PER_G_NACL, MOSM_PER_G_UREA } from './fluids';
import { Sex, totalBodyWater } from './physiology';

export type AdhMode = 'physiologic' | 'siad' | 'avp-d' | 'avp-r';
export type Diet = 'normal' | 'low-solute' | 'npo';

/** naK = mmol/day, urea = mOsm/day, foodWater = L/day of water contained in food. */
export const DIETS: Record<Diet, { label: string; naK: number; urea: number; foodWater: number; note: string }> = {
  normal: { label: 'Normal diet', naK: 200, urea: 400, foodWater: 0.5, note: '≈ 800 mOsm/day' },
  'low-solute': { label: 'Tea-and-toast / beer', naK: 40, urea: 100, foodWater: 0.2, note: '≈ 180 mOsm/day' },
  npo: { label: 'Nil by mouth', naK: 0, urea: 250, foodWater: 0, note: 'catabolic urea ≈ 250 mOsm/day' },
};

export interface Patient {
  id: string;
  label: string;
  summary: string;
  weightKg: number;
  sex: Sex;
  age: number;
  na0: number;
  adh: AdhMode;
  /** fixed urine osmolality when adh = 'siad' */
  siadUosm: number;
  /** urine osmolality without desmopressin in AVP deficiency (100 complete, 250–400 partial) */
  avpDUosm: number;
  /** maximum urine osmolality in AVP resistance */
  avpRUosm: number;
  /** ECF Na+K balance vs euvolemia, mmol (negative = volume depleted) */
  volumeNa0: number;
  /** extra renal Na loss in mmol/day (cerebral/renal salt wasting) */
  saltWastingPerDay: number;
  /** intact thirst AND access to water */
  thirst: boolean;
}

export interface Regimen {
  diet: Diet;
  /** oral free water (incl. beer, tea) L/day */
  oralWaterLPerDay: number;
  ivFluid: FluidId | 'none';
  ivRateMlPerH: number;
  ivHours: number;
  /** number of 3% NaCl boluses given at t = 0, 20 and 40 min (each `bolusMl`) */
  hts3Boluses: number;
  bolusMl: number;
  saltTabsGPerDay: number;
  ureaGPerDay: number;
  /** added KCl mmol/day (oral or IV) */
  kclMmolPerDay: number;
  desmopressin: boolean;
  tolvaptan: boolean;
  loop: boolean;
  thiazide: boolean;
}

export interface LabPoint {
  t: number;
  na: number;
  tbw: number;
  /** urine flow mL/h during the preceding hour */
  urineMlH: number;
  uOsm: number;
  /** urine Na+K, mmol/L */
  uNaK: number;
  /** ECF Na balance, mmol */
  volumeNa: number;
  /** cumulative intake / output (L) */
  inL: number;
  outL: number;
}

export interface SimResult {
  points: LabPoint[];
  na0: number;
  change24: number;
  change48: number;
  peakChange24: number;
  events: string[];
}

export const PARAMS = {
  /** time constant for excreting surplus Na+K, hours */
  natriuresisTau: 16,
  /** minimum obligatory urine Na+K, mmol/h, when volume-avid */
  minUrineNaK: 0.4,
  /** net insensible loss (≈ 0.9 L evaporation − 0.3 L metabolic water) */
  insensibleLPerDay: 0.6,
  physMinUosm: 60,
  physMaxUosm: 900,
  /** non-osmotic ADH: urine osm when baroreceptor drive is maximal */
  baroUosm: 600,
  desmoUosm: 700,
  tolvaptanUosm: 200,
  loopUosm: 300,
  thiazideMinUosm: 200,
  loopExtraNaKPerDay: 100,
  thiazideExtraNaKPerDay: 50,
  /** thirst: extra drinking L/h per mmol/L above 141 */
  thirstGain: 0.15,
  thirstMaxLPerH: 1.0,
};

/** ECF ≈ 20% of body weight; Na content ≈ 140 mmol/L. */
export const ecfNa = (p: Patient) => 0.2 * p.weightKg * 140;

/** Fraction of maximal baroreceptor (non-osmotic) ADH drive: 0 when deficit ≤ 5% of ECF, 1 at ≥ 10%. */
export function baroDrive(volumeNa: number, p: Patient): number {
  const deficitFrac = -volumeNa / ecfNa(p);
  return Math.min(1, Math.max(0, (deficitFrac - 0.05) / 0.05));
}

/** Osmotic ADH: urine osm rises linearly from max dilution at Na 135 to max concentration at Na 145. */
export function osmoticUosm(na: number): number {
  const f = Math.min(1, Math.max(0, (na - 135) / 10));
  return PARAMS.physMinUosm + f * (PARAMS.physMaxUosm - PARAMS.physMinUosm);
}

export function urineOsm(na: number, volumeNa: number, p: Patient, r: Regimen): number {
  let u: number;
  switch (p.adh) {
    case 'siad':
      u = p.siadUosm;
      break;
    case 'avp-d':
      u = p.avpDUosm;
      break;
    case 'avp-r':
      u = p.avpRUosm;
      break;
    default: {
      const osm = osmoticUosm(na);
      const d = baroDrive(volumeNa, p);
      u = osm + d * Math.max(0, PARAMS.baroUosm - osm);
    }
  }
  if (r.desmopressin && p.adh !== 'avp-r') u = Math.max(u, PARAMS.desmoUosm);
  if (r.tolvaptan) u = Math.min(u, PARAMS.tolvaptanUosm);
  if (r.loop) u = PARAMS.loopUosm;
  if (r.thiazide) u = Math.max(u, PARAMS.thiazideMinUosm);
  return u;
}

export function simulate(p: Patient, r: Regimen, hours = 48, dt = 0.25): SimResult {
  const tbw0 = totalBodyWater(p.weightKg, p.sex, p.age);
  let tbw = tbw0;
  let e = p.na0 * tbw0; // exchangeable Na + K
  let volumeNa = p.volumeNa0;
  const diet = DIETS[r.diet];
  const fluid = r.ivFluid === 'none' ? null : FLUIDS[r.ivFluid];
  const events: string[] = [];
  const points: LabPoint[] = [];
  let inL = 0;
  let outL = 0;

  // dietary + supplement inputs per hour
  const dietNaKPerH = (diet.naK + r.saltTabsGPerDay * MMOL_NA_PER_G_NACL) / 24;
  // Supplemental KCl repletes intracellular K: it is retained, and (Edelman) raises serum Na mmol-for-mmol.
  const kclPerH = r.kclMmolPerDay / 24;
  const ureaPerH = (diet.urea + r.ureaGPerDay * MOSM_PER_G_UREA) / 24;
  const extraLossPerH = (p.saltWastingPerDay + (r.loop ? PARAMS.loopExtraNaKPerDay : 0) + (r.thiazide ? PARAMS.thiazideExtraNaKPerDay : 0)) / 24;

  // 3% boluses at t = 0 (given instantly — the model's resolution is minutes, not seconds)
  if (r.hts3Boluses > 0) {
    const vol = (r.hts3Boluses * r.bolusMl) / 1000;
    tbw += vol;
    e += vol * FLUIDS.hts3.naK;
    volumeNa += vol * FLUIDS.hts3.naK;
    inL += vol;
    events.push(`${r.hts3Boluses} × ${r.bolusMl} mL 3% NaCl at t = 0`);
  }

  let prevMode = '';
  let urineAcc = 0;
  let uOsmLast = 0;
  let uNaKLast = 0;
  const record = (t: number) => {
    points.push({
      t,
      na: e / tbw,
      tbw,
      urineMlH: urineAcc * 1000,
      uOsm: uOsmLast,
      uNaK: uNaKLast,
      volumeNa,
      inL,
      outL,
    });
    urineAcc = 0;
  };
  record(0);

  const steps = Math.round(hours / dt);
  for (let i = 1; i <= steps; i++) {
    const t = i * dt;
    const na = e / tbw;

    // --- inputs ---
    let waterIn = ((r.oralWaterLPerDay + diet.foodWater) / 24) * dt;
    let naKIn = dietNaKPerH * dt;
    if (fluid && t <= r.ivHours + 1e-9) {
      const v = (r.ivRateMlPerH / 1000) * dt;
      waterIn += v;
      naKIn += v * fluid.naK;
    }
    if (p.thirst && na > 141) {
      waterIn += Math.min(PARAMS.thirstMaxLPerH, PARAMS.thirstGain * (na - 141)) * dt;
    }

    // --- kidney: electrolytes ---
    const target = dietNaKPerH + volumeNa / PARAMS.natriuresisTau;
    const uNaK = (Math.max(PARAMS.minUrineNaK, target) + extraLossPerH) * dt;

    // --- kidney: water ---
    const uOsm = urineOsm(na, volumeNa, p, r);
    const solute = 2 * uNaK + ureaPerH * dt;
    const urine = solute / uOsm;
    const insensible = (PARAMS.insensibleLPerDay / 24) * dt;

    // --- update ---
    tbw = Math.max(5, tbw + waterIn - urine - insensible);
    e = Math.max(0, e + naKIn + kclPerH * dt - uNaK);
    volumeNa += naKIn - uNaK;
    inL += waterIn;
    outL += urine + insensible;
    urineAcc += urine;
    uOsmLast = uOsm;
    uNaKLast = urine > 0 ? uNaK / urine : 0;

    const mode = uOsm < 200 ? 'dilute' : 'concentrated';
    if (prevMode && mode !== prevMode) {
      events.push(
        mode === 'dilute'
          ? `t ≈ ${t.toFixed(0)} h: ADH effect switched off → dilute urine (${uOsm.toFixed(0)} mOsm/kg) — water diuresis begins`
          : `t ≈ ${t.toFixed(0)} h: urine became concentrated (${uOsm.toFixed(0)} mOsm/kg)`,
      );
    }
    prevMode = mode;

    if (Math.abs(t - Math.round(t)) < 1e-9) record(Math.round(t));
  }

  const at = (h: number) => points.find((pt) => pt.t === h)?.na ?? points[points.length - 1].na;
  const change24 = at(24) - p.na0;
  const change48 = at(48) - p.na0;
  const sign = p.na0 < 140 ? 1 : -1;
  const peakChange24 = points.filter((pt) => pt.t <= 24).reduce((m, pt) => Math.max(m, sign * (pt.na - p.na0)), -Infinity) * sign;
  return { points, na0: p.na0, change24, change48, peakChange24, events };
}

export const EMPTY_REGIMEN: Regimen = {
  diet: 'normal',
  oralWaterLPerDay: 1.5,
  ivFluid: 'none',
  ivRateMlPerH: 0,
  ivHours: 24,
  hts3Boluses: 0,
  bolusMl: 150,
  saltTabsGPerDay: 0,
  ureaGPerDay: 0,
  kclMmolPerDay: 0,
  desmopressin: false,
  tolvaptan: false,
  loop: false,
  thiazide: false,
};

const base = {
  weightKg: 70,
  sex: 'male' as Sex,
  age: 50,
  siadUosm: 500,
  avpDUosm: 100,
  avpRUosm: 150,
  volumeNa0: 0,
  saltWastingPerDay: 0,
  thirst: false,
};

export interface Preset {
  patient: Patient;
  regimen: Regimen;
  lesson: string;
  tryThis: string[];
}

export const PRESETS: Preset[] = [
  {
    patient: { ...base, id: 'siad', label: 'SIAD (Uosm 500)', summary: 'Euvolemic, fixed concentrated urine, Na 122', na0: 122, adh: 'siad', age: 68 },
    regimen: { ...EMPTY_REGIMEN, oralWaterLPerDay: 2 },
    lesson:
      'With urine fixed at 500 mOsm/kg, a normal diet (≈ 800 mOsm) can only carry ≈ 1.6 L of urine a day. Drink more than urine + insensible losses and Na falls.',
    tryThis: [
      'Give 1 L NS over 8 h: Na barely moves — and falls if you raise Uosm above ~530 (urine Na+K > 154).',
      'Restrict water to 0.8 L/day: slow rise (~2–3 mmol/L/day), as in the 2020 RCT.',
      'Add urea 30 g/day: more solute → more urine at the same Uosm → faster rise.',
      'Try tolvaptan: Uosm drops to ~200 → aquaresis. Watch the 24-h change against the limit.',
    ],
  },
  {
    patient: {
      ...base,
      id: 'hypovolemic',
      label: 'Hypovolemic (vomiting + thiazide)',
      summary: '78-year-old woman, 3 L volume deficit, Na 116',
      sex: 'female',
      age: 78,
      weightKg: 55,
      na0: 116,
      adh: 'physiologic',
      volumeNa0: -420,
    },
    regimen: { ...EMPTY_REGIMEN, diet: 'npo', oralWaterLPerDay: 0, ivFluid: 'ns', ivRateMlPerH: 150, ivHours: 24 },
    lesson:
      'Volume depletion drives ADH non-osmotically. Saline restores volume → ADH switches off → urine turns dilute → a brisk water diuresis can raise Na far past the limit.',
    tryThis: [
      'Run as is: find the hour the urine turns dilute and watch the slope steepen.',
      'Tick desmopressin (the "clamp"): urine stays concentrated, so Na now rises only by what you give. NS at 150 mL/h still edges past the high-risk limit of 8 — lower the rate to 75–100 mL/h.',
      'Replace NS with one 3% bolus plus desmopressin: a smaller, predictable rise.',
    ],
  },
  {
    patient: {
      ...base,
      id: 'potomania',
      label: 'Beer potomania (low solute)',
      summary: 'Normal ADH, but only ≈ 180 mOsm/day of solute, Na 110',
      na0: 110,
      adh: 'physiologic',
      weightKg: 60,
    },
    regimen: { ...EMPTY_REGIMEN, diet: 'normal', oralWaterLPerDay: 1, ivFluid: 'ns', ivRateMlPerH: 75, ivHours: 24 },
    lesson:
      'The kidney can dilute to ~60 mOsm/kg, but 180 mOsm of solute can only carry ≈ 3 L of urine. Feeding the patient multiplies the solute — and the water diuresis.',
    tryThis: [
      'Set diet to tea-and-toast and water to 4 L/day (pre-admission): Na keeps falling.',
      'Now normal diet + NS (as loaded): Na rockets. Add desmopressin to clamp.',
      'Use the "low-solute" diet with 1 L water: a gentle, safe rise.',
    ],
  },
  {
    patient: {
      ...base,
      id: 'avp-d-icu',
      label: 'AVP deficiency (no thirst)',
      summary: 'Post-TBI, intubated, urine 100 mOsm/kg, Na 150',
      na0: 150,
      adh: 'avp-d',
      age: 28,
      weightKg: 80,
    },
    regimen: { ...EMPTY_REGIMEN, diet: 'npo', oralWaterLPerDay: 0, ivFluid: 'ns', ivRateMlPerH: 80, ivHours: 48 },
    lesson:
      'Without AVP, urine stays near 100 mOsm/kg: even catabolic solute alone produces > 3 L/day of nearly electrolyte-free urine. Without thirst, Na climbs.',
    tryThis: [
      'Give desmopressin: urine concentrates, output falls, Na stabilises.',
      'Then switch NS to D5W at 150 mL/h with desmopressin on: Na falls — the iatrogenic hyponatremia trap.',
      'Untick desmopressin and tick "thirst intact" in the patient panel: an awake patient who can drink stays near normal.',
    ],
  },
  {
    patient: {
      ...base,
      id: 'avp-r',
      label: 'AVP resistance (lithium)',
      summary: 'Urine max 150 mOsm/kg, thirst intact, Na 144',
      na0: 144,
      adh: 'avp-r',
      thirst: true,
      sex: 'female',
      age: 45,
      weightKg: 60,
    },
    regimen: { ...EMPTY_REGIMEN, oralWaterLPerDay: 3 },
    lesson:
      'Intact thirst keeps Na near normal despite ~5 L/day of urine. Desmopressin does nothing. Reducing solute and adding a thiazide reduce urine volume.',
    tryThis: [
      'Tick desmopressin: no change — that is the diagnosis.',
      'Tick thiazide (and pick low-solute diet): urine volume falls.',
      'Untick thirst in the patient panel (e.g. admitted, NPO): Na rises fast.',
    ],
  },
  {
    patient: {
      ...base,
      id: 'csw',
      label: 'Salt wasting after SAH',
      summary: 'Natriuresis 250 mmol/day, early volume depletion, Na 128',
      na0: 128,
      adh: 'physiologic',
      volumeNa0: -200,
      saltWastingPerDay: 250,
      sex: 'female',
      age: 52,
      weightKg: 65,
    },
    regimen: { ...EMPTY_REGIMEN, diet: 'npo', oralWaterLPerDay: 0.5, ivFluid: 'ns', ivRateMlPerH: 60, ivHours: 48 },
    lesson:
      'Ongoing natriuresis keeps the patient volume-depleted, so ADH stays on and Na falls. Fluid restriction would worsen volume (and DCI risk); replace salt and water.',
    tryThis: [
      'Increase NS to 125 mL/h, then add salt tablets 6 g/day.',
      'Replace NS with 3% at 20 mL/h.',
      'Try restricting to 0.5 L/day with no IV fluid: Na still falls, volume collapses.',
    ],
  },
];

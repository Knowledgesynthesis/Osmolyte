/**
 * Core water–sodium physiology formulas.
 *
 * Every function is pure and unit-tested (physiology.test.ts). Units are conventional
 * US units unless stated: Na/K in mmol/L (= mEq/L), glucose and BUN in mg/dL,
 * osmolality in mOsm/kg, volumes in litres.
 */

export type Sex = 'male' | 'female';

/** Divisors converting mg/dL to mmol/L (molecular weight / 10). */
export const DIVISORS = {
  glucose: 18, // MW 180
  bun: 2.8, // 2 N atoms × 14
  ethanol: 3.7, // empiric best fit (theoretical 4.6)
  methanol: 3.2,
  ethyleneGlycol: 6.2,
  isopropanol: 6.0,
} as const;

/** Calculated serum osmolality = 2·Na + glucose/18 + BUN/2.8 (+ ethanol/3.7). */
export function calculatedOsm(na: number, glucose: number, bun: number, ethanol = 0): number {
  return 2 * na + glucose / DIVISORS.glucose + bun / DIVISORS.bun + ethanol / DIVISORS.ethanol;
}

/**
 * Effective osmolality (tonicity) = 2·Na + glucose/18.
 * Urea and ethanol cross cell membranes freely, so they raise measured osmolality
 * without moving water — they never protect against hypotonicity.
 */
export function effectiveOsm(na: number, glucose: number): number {
  return 2 * na + glucose / DIVISORS.glucose;
}

/** Osmolal gap = measured − calculated. > 10 mOsm/kg suggests unmeasured osmoles. */
export function osmolalGap(measured: number, calculated: number): number {
  return measured - calculated;
}

/**
 * Glucose-corrected sodium. Hillier 1999: 2.4 mmol/L per 100 mg/dL above 100
 * (Katz 1973 used 1.6; the true factor rises with glucose). Returns na unchanged if glucose ≤ 100.
 */
export function correctedNaForGlucose(na: number, glucose: number, factor = 2.4): number {
  if (glucose <= 100) return na;
  return na + (factor * (glucose - 100)) / 100;
}

/** Total body water fraction of weight (Watson-type bedside convention). */
export function tbwFraction(sex: Sex, age: number): number {
  const elderly = age >= 65;
  if (sex === 'male') return elderly ? 0.5 : 0.6;
  return elderly ? 0.45 : 0.5;
}

export function totalBodyWater(weightKg: number, sex: Sex, age: number): number {
  return weightKg * tbwFraction(sex, age);
}

/**
 * Exact single-compartment mass balance (Edelman): Na ≈ (Naₑ + Kₑ) / TBW.
 * Serum Na after adding `litres` of a fluid with the given Na+K, with NO urine output.
 * For litres = 1 this equals the Adrogué–Madias formula.
 */
export function naAfterInfusion(serumNa: number, tbw: number, infusateNaK: number, litres: number): number {
  if (tbw + litres <= 0) return serumNa;
  return (serumNa * tbw + infusateNaK * litres) / (tbw + litres);
}

/** Adrogué–Madias: change in serum Na per 1 L of infusate = (infusate Na+K − serum Na) / (TBW + 1). */
export function adrogueMadiasPerLitre(serumNa: number, tbw: number, infusateNaK: number): number {
  return (infusateNaK - serumNa) / (tbw + 1);
}

/**
 * Litres of infusate needed to move serum Na from `serumNa` to `targetNa`
 * (no urine output assumed). Returns null if the fluid cannot reach the target.
 */
export function litresToTarget(serumNa: number, targetNa: number, tbw: number, infusateNaK: number): number | null {
  const denom = infusateNaK - targetNa;
  if (denom === 0) return null;
  const v = (tbw * (targetNa - serumNa)) / denom;
  return v >= 0 ? v : null;
}

/** Free-water deficit (hypernatremia) = TBW × (Na / target − 1). */
export function freeWaterDeficit(na: number, tbw: number, target = 140): number {
  return tbw * (na / target - 1);
}

/** Water that must be removed to raise Na from `na` to `target` = TBW × (1 − Na / target). */
export function excessWater(na: number, tbw: number, target: number): number {
  return tbw * (1 - na / target);
}

/** Osmolar free-water clearance C_H2O = V × (1 − Uosm / Posm). Positive = net water excretion. */
export function freeWaterClearance(urineVolume: number, uOsm: number, pOsm: number): number {
  return urineVolume * (1 - uOsm / pOsm);
}

/**
 * Electrolyte-free water clearance = V × (1 − (U_Na + U_K) / S_Na).
 * This — not osmolar clearance — predicts the effect of urine on serum Na.
 */
export function electrolyteFreeWaterClearance(urineVolume: number, uNa: number, uK: number, sNa: number): number {
  return urineVolume * (1 - (uNa + uK) / sNa);
}

export interface FurstResult {
  ratio: number;
  advice: string;
  tier: 'restrict-1L' | 'restrict-500' | 'restriction-will-fail';
}

/**
 * Urine-to-serum electrolyte ratio (Furst 2000; US expert panel 2013).
 * (U_Na + U_K) / S_Na predicts whether fluid restriction can work in SIAD.
 */
export function furstRatio(uNa: number, uK: number, sNa: number): FurstResult {
  const ratio = (uNa + uK) / sNa;
  if (ratio < 0.5) return { ratio, tier: 'restrict-1L', advice: 'Restrict to ≤1 L/day — restriction alone is likely to work.' };
  if (ratio <= 1) return { ratio, tier: 'restrict-500', advice: 'Restrict to ≤500 mL/day — or add a solute therapy (urea, NaCl + loop, SGLT2i).' };
  return {
    ratio,
    tier: 'restriction-will-fail',
    advice: 'Urine Na+K exceeds plasma Na, so the kidney is excreting no electrolyte-free water. Restriction cannot raise Na — add urea, NaCl + loop diuretic, an SGLT2 inhibitor or a vaptan.',
  };
}

/** Fractional excretion of X (%) = (U_X × P_Cr) / (P_X × U_Cr) × 100. */
export function fractionalExcretion(uX: number, pX: number, uCr: number, pCr: number): number {
  if (pX <= 0 || uCr <= 0) return NaN;
  return ((uX * pCr) / (pX * uCr)) * 100;
}

/** Daily urine solute excretion (mOsm/day) = Uosm × volume. Normal on a Western diet ≈ 600–900. */
export function dailySoluteExcretion(uOsm: number, urineLitresPerDay: number): number {
  return uOsm * urineLitresPerDay;
}

/**
 * The master equation of water excretion: urine volume = solute excreted ÷ urine osmolality.
 * Returns the maximum daily urine volume achievable at a given (minimum) urine osmolality.
 */
export function maxUrineVolume(soluteMosmPerDay: number, uOsm: number): number {
  if (uOsm <= 0) return Infinity;
  return soluteMosmPerDay / uOsm;
}

export type Tonicity = 'hypotonic' | 'isotonic' | 'hypertonic';

export function classifyTonicity(effOsm: number): Tonicity {
  if (effOsm < 275) return 'hypotonic';
  if (effOsm > 295) return 'hypertonic';
  return 'isotonic';
}

/** Biochemical severity of hyponatremia (European guideline 2014). */
export function hyponatremiaSeverity(na: number): 'none' | 'mild' | 'moderate' | 'profound' {
  if (na >= 135) return 'none';
  if (na >= 130) return 'mild';
  if (na >= 125) return 'moderate';
  return 'profound';
}

/** Polyuria threshold in adults: > 50 mL/kg/day (≈ > 3 L/day). */
export function isPolyuric(urineLitresPerDay: number, weightKg: number): boolean {
  return urineLitresPerDay * 1000 > 50 * weightKg || urineLitresPerDay > 3;
}

export const round = (x: number, digits = 1): number => {
  const f = 10 ** digits;
  return Math.round(x * f) / f;
};

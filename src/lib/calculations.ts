/**
 * Core medical calculations and formulas
 */

import { WaterBalanceState, CalculatedValues, FluidType } from '@/types';
import { FLUID_COMPOSITIONS, TBW_COEFFICIENTS } from './constants';

/**
 * Calculate serum osmolality
 * Formula: 2·Na + glucose/18 + BUN/2.8
 */
export const calculateSerumOsm = (
  na: number,
  glucose: number,
  bun: number
): number => {
  return 2 * na + glucose / 18 + bun / 2.8;
};

/**
 * Calculate total body water (TBW)
 * Depends on sex, weight, and age
 */
export const calculateTBW = (
  weight: number,
  sex: 'male' | 'female',
  age: number
): number => {
  const isElderly = age >= 65;
  let coefficient: number;

  if (sex === 'male') {
    coefficient = isElderly ? TBW_COEFFICIENTS.elderly_male : TBW_COEFFICIENTS.male;
  } else {
    coefficient = isElderly ? TBW_COEFFICIENTS.elderly_female : TBW_COEFFICIENTS.female;
  }

  return weight * coefficient;
};

/**
 * Calculate fractional excretion of urate (FEurate)
 * Formula: (urineUrate / serumUrate) / (urineCr / serumCr) × 100
 */
export const calculateFEurate = (
  urineUrate: number,
  serumUrate: number,
  urineCr: number,
  serumCr: number
): number => {
  if (serumUrate === 0 || serumCr === 0) return 0;
  return ((urineUrate / serumUrate) / (urineCr / serumCr)) * 100;
};

/**
 * Calculate fractional excretion of sodium (FENa)
 */
export const calculateFENa = (
  urineNa: number,
  serumNa: number,
  urineCr: number,
  serumCr: number
): number => {
  if (serumNa === 0 || serumCr === 0) return 0;
  return ((urineNa / serumNa) / (urineCr / serumCr)) * 100;
};

/**
 * Calculate free water deficit (for hypernatremia)
 * Formula: TBW × (current Na / desired Na - 1)
 */
export const calculateFreeWaterDeficit = (
  currentNa: number,
  desiredNa: number,
  tbw: number
): number => {
  if (desiredNa === 0) return 0;
  return tbw * (currentNa / desiredNa - 1);
};

/**
 * Calculate free water excess (for hyponatremia)
 * Formula: TBW × (1 - current Na / desired Na)
 */
export const calculateFreeWaterExcess = (
  currentNa: number,
  desiredNa: number,
  tbw: number
): number => {
  if (desiredNa === 0) return 0;
  return tbw * (1 - currentNa / desiredNa);
};

/**
 * Predict change in serum sodium from fluid administration
 * Simplified Adrogue-Madias formula
 * ΔNa = (infusate Na - serum Na) / (TBW + 1)
 */
export const predictNaChange = (
  currentNa: number,
  fluidType: FluidType,
  fluidVolume: number, // liters
  tbw: number
): number => {
  let fluidNa: number;

  switch (fluidType) {
    case 'isotonic':
      fluidNa = FLUID_COMPOSITIONS['normal-saline'];
      break;
    case 'hypertonic':
      fluidNa = FLUID_COMPOSITIONS['hypertonic-3%'];
      break;
    case 'hypotonic':
      fluidNa = FLUID_COMPOSITIONS['half-normal'];
      break;
    case 'D5W':
      fluidNa = FLUID_COMPOSITIONS['D5W'];
      break;
    default:
      fluidNa = 0;
  }

  return (fluidNa - currentNa) / (tbw + fluidVolume);
};

/**
 * Calculate correction rate
 * Returns mEq/L per 24 hours
 */
export const calculateCorrectionRate = (
  initialNa: number,
  currentNa: number,
  timeElapsed: number // hours
): number => {
  if (timeElapsed === 0) return 0;
  const deltaNa = Math.abs(currentNa - initialNa);
  return (deltaNa / timeElapsed) * 24;
};

/**
 * Simulate water deprivation test
 * Returns expected urine osmolality values
 */
export const simulateWaterDeprivation = (
  baselineUosm: number,
  hasADH: boolean,
  respondsToADH: boolean
): {
  postDeprivationUosm: number;
  postDDAVPUosm: number;
  interpretation: string;
  diagnosis: 'central-DI' | 'nephrogenic-DI' | 'primary-polydipsia' | 'normal' | 'partial-DI';
} => {
  let postDeprivationUosm: number;
  let postDDAVPUosm: number;
  let interpretation: string;
  let diagnosis: 'central-DI' | 'nephrogenic-DI' | 'primary-polydipsia' | 'normal' | 'partial-DI';

  if (!hasADH && respondsToADH) {
    // Central DI: no endogenous ADH, but kidneys respond to exogenous
    postDeprivationUosm = Math.min(baselineUosm * 1.2, 300);
    postDDAVPUosm = postDeprivationUosm * 2.2; // Strong response
    interpretation = 'Urine fails to concentrate with water deprivation but concentrates significantly with DDAVP → Central DI';
    diagnosis = 'central-DI';
  } else if (hasADH && !respondsToADH) {
    // Nephrogenic DI: may have ADH, but kidneys don\'t respond
    postDeprivationUosm = Math.min(baselineUosm * 1.3, 350);
    postDDAVPUosm = postDeprivationUosm * 1.1; // Minimal response
    interpretation = 'Urine fails to concentrate with water deprivation AND minimal response to DDAVP → Nephrogenic DI';
    diagnosis = 'nephrogenic-DI';
  } else if (!hasADH && !respondsToADH) {
    // Severe nephrogenic or combined
    postDeprivationUosm = Math.min(baselineUosm * 1.1, 250);
    postDDAVPUosm = postDeprivationUosm * 1.05;
    interpretation = 'Minimal concentration with deprivation or DDAVP → Severe nephrogenic DI';
    diagnosis = 'nephrogenic-DI';
  } else {
    // Normal or primary polydipsia
    if (baselineUosm < 300) {
      // Primary polydipsia - can concentrate normally when deprived
      postDeprivationUosm = Math.min(baselineUosm * 3, 900);
      postDDAVPUosm = postDeprivationUosm * 1.05; // Already maximally concentrated
      interpretation = 'Urine concentrates appropriately with water deprivation → Primary polydipsia or normal';
      diagnosis = 'primary-polydipsia';
    } else {
      // Normal
      postDeprivationUosm = Math.min(baselineUosm * 1.2, 1000);
      postDDAVPUosm = postDeprivationUosm * 1.05;
      interpretation = 'Normal concentration ability';
      diagnosis = 'normal';
    }
  }

  // Check for partial DI pattern
  if (postDeprivationUosm > 300 && postDeprivationUosm < 600 && postDDAVPUosm > postDeprivationUosm * 1.3) {
    diagnosis = 'partial-DI';
    interpretation = 'Partial concentration with deprivation, significant response to DDAVP → Partial Central DI';
  }

  return {
    postDeprivationUosm: Math.round(postDeprivationUosm),
    postDDAVPUosm: Math.round(postDDAVPUosm),
    interpretation,
    diagnosis,
  };
};

/**
 * Calculate all derived values from water balance state
 */
export const calculateDerivedValues = (state: WaterBalanceState): CalculatedValues => {
  const calculatedSerumOsm = state.serumOsm ?? calculateSerumOsm(
    state.serumNa,
    state.glucose,
    state.BUN
  );

  const totalBodyWater = calculateTBW(state.weight, state.sex, state.age);

  const freeWaterDeficit = state.serumNa > 145
    ? calculateFreeWaterDeficit(state.serumNa, 140, totalBodyWater)
    : undefined;

  const freeWaterExcess = state.serumNa < 135
    ? calculateFreeWaterExcess(state.serumNa, 140, totalBodyWater)
    : undefined;

  const correctionRate = state.baselineNa
    ? calculateCorrectionRate(state.baselineNa, state.serumNa, state.timeElapsed)
    : undefined;

  // Predict Na change from current fluid orders
  let predictedNaChange: number | undefined;
  if (state.fluidsGiven.length > 0) {
    const lastFluid = state.fluidsGiven[state.fluidsGiven.length - 1];
    predictedNaChange = predictNaChange(
      state.serumNa,
      lastFluid.type,
      lastFluid.volume / 1000, // convert mL to L
      totalBodyWater
    );
  }

  return {
    calculatedSerumOsm,
    totalBodyWater,
    freeWaterDeficit,
    freeWaterExcess,
    correctionRate,
    predictedNaChange,
  };
};

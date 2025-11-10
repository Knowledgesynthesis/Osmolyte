/**
 * Medical constants and reference values
 */

// Normal ranges
export const NORMAL_RANGES = {
  serumNa: { low: 135, high: 145 }, // mEq/L
  serumK: { low: 3.5, high: 5.0 },
  serumOsm: { low: 275, high: 295 }, // mOsm/kg
  urineOsm: { low: 50, high: 1200 },
  BUN: { low: 7, high: 20 }, // mg/dL
  creatinine: { low: 0.6, high: 1.2 },
  glucose: { low: 70, high: 100 },
  calcium: { low: 8.5, high: 10.5 },
  uricAcid: { low: 3.5, high: 7.2 },
};

// Diagnostic thresholds
export const THRESHOLDS = {
  hyponatremia: 135, // mEq/L
  hypernatremia: 145,
  concentratedUrine: 100, // mOsm/kg
  highUrineNa: 30, // mEq/L
  hypotonicity: 275, // mOsm/kg
  hypertonicity: 295,
  polyuria: 3, // L/day
};

// Safety limits for correction
export const CORRECTION_LIMITS = {
  hypoNa: {
    safe: 6, // mEq/L per 24h
    max: 8,
    hourly: 0.5, // mEq/L/h
  },
  hyperNa: {
    safe: 10, // mEq/L per 24h
    max: 12,
    hourly: 0.5,
  },
};

// Fluid compositions (mEq/L of Na)
export const FLUID_COMPOSITIONS = {
  'normal-saline': 154, // 0.9% NaCl
  'half-normal': 77, // 0.45% NaCl
  'hypertonic-3%': 513,
  'D5W': 0,
  'LR': 130, // Lactated Ringer's
};

// Total body water (TBW) coefficients
export const TBW_COEFFICIENTS = {
  male: 0.6,
  female: 0.5,
  elderly_male: 0.5,
  elderly_female: 0.45,
};

// FEurate interpretations
export const FE_URATE_THRESHOLDS = {
  siadh: 12, // % - typically >12% in SIADH
  normal: 8, // % - usually 4-11%
};

// Water deprivation test thresholds
export const WATER_DEPRIVATION_THRESHOLDS = {
  normalConcentration: 600, // mOsm/kg
  partialDI: 300,
  completeDI: 200,
  ddavpResponse: 1.5, // fold increase suggests central DI
};

// Common medication categories
export const MEDICATION_CATEGORIES = {
  SIADH_causes: ['SSRIs', 'carbamazepine', 'oxcarbazepine', 'cyclophosphamide', 'vincristine'],
  SIADH_treatment: ['fluid restriction', 'salt tablets', 'furosemide', 'tolvaptan', 'urea'],
  DI_causes: ['lithium', 'demeclocycline', 'amphotericin B'],
  DI_treatment: ['desmopressin', 'amiloride', 'thiazides', 'NSAIDs'],
};

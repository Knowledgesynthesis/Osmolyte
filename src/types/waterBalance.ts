/**
 * Core type definitions for water balance and electrolyte physiology
 */

export type VolumeStatus = 'hypovolemic' | 'euvolemic' | 'hypervolemic';
export type FluidType = 'isotonic' | 'hypertonic' | 'hypotonic' | 'D5W';
export type EducationLevel = 'step1' | 'step2' | 'step3' | 'residency';

export interface FluidIntervention {
  type: FluidType;
  volume: number; // mL
  timepoint: number; // hours
  naConcentration?: number; // mEq/L (for custom fluids)
}

export interface Medication {
  name: string;
  dose?: string;
  timepoint: number; // hours
  category: 'diuretic' | 'vaptan' | 'hormone' | 'other';
}

export interface WaterBalanceState {
  // Serum parameters
  serumNa: number; // mEq/L
  serumOsm: number | null; // mOsm/kg (null = calculate from Na/glucose/BUN)
  glucose: number; // mg/dL
  BUN: number; // mg/dL
  serumCreatinine: number; // mg/dL

  // Urine parameters
  urineOsm: number; // mOsm/kg
  urineNa: number; // mEq/L
  urineVolume: number; // L/day
  urineCreatinine?: number; // mg/dL (for FE calculations)

  // Clinical assessment
  volumeStatus: VolumeStatus;

  // Advanced markers
  FEurate: number | null; // Fractional excretion of urate (% )
  hematocrit: number; // %
  serumUricAcid: number; // mg/dL
  urineUricAcid?: number; // mg/dL (for FEurate calculation)

  // Electrolytes
  calcium: number; // mg/dL
  potassium: number; // mEq/L

  // Hormones
  serumCortisol?: number; // mcg/dL
  TSH?: number; // mIU/L

  // Clinical context flags
  hasCNSInjury: boolean;
  lithiumExposure: boolean;
  pregnancy: boolean;
  recentSurgery: boolean;
  malignancy: boolean;

  // Interventions
  fluidsGiven: FluidIntervention[];
  medicationsGiven: Medication[];
  soluteIntake: number; // mOsm/day

  // Time tracking
  timeElapsed: number; // hours
  baselineNa?: number; // For tracking correction rate

  // Additional clinical context
  weight: number; // kg (for TBW calculations)
  age: number; // years
  sex: 'male' | 'female';
}

export interface CalculatedValues {
  calculatedSerumOsm: number; // mOsm/kg
  totalBodyWater: number; // L
  freeWaterDeficit?: number; // L (for hypernatremia)
  freeWaterExcess?: number; // L (for hyponatremia)
  correctionRate?: number; // mEq/L per 24h
  predictedNaChange?: number; // mEq/L (from current interventions)
}

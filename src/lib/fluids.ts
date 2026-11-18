/** Composition of common fluids. `naK` = Na + K (mmol/L), which is what moves serum Na (Edelman). */
export interface Fluid {
  id: FluidId;
  name: string;
  short: string;
  na: number;
  k: number;
  /** Na + K, mmol/L */
  naK: number;
  /** Approximate in-vivo tonicity note */
  note: string;
}

export type FluidId = 'd5w' | 'half' | 'lr' | 'plasmalyte' | 'ns' | 'hts3' | 'hts5';

export const FLUIDS: Record<FluidId, Fluid> = {
  d5w: { id: 'd5w', name: '5% dextrose in water', short: 'D5W', na: 0, k: 0, naK: 0, note: 'Glucose is metabolised → pure free water.' },
  half: { id: 'half', name: '0.45% NaCl', short: '½NS', na: 77, k: 0, naK: 77, note: 'Half free water, half isotonic saline.' },
  lr: { id: 'lr', name: "Lactated Ringer's", short: 'LR', na: 130, k: 4, naK: 134, note: 'Slightly hypotonic to plasma.' },
  plasmalyte: { id: 'plasmalyte', name: 'Plasma-Lyte 148', short: 'PL-148', na: 140, k: 5, naK: 145, note: 'Balanced, near-isotonic.' },
  ns: { id: 'ns', name: '0.9% NaCl', short: 'NS', na: 154, k: 0, naK: 154, note: 'Isotonic — but raises Na only if urine Na+K < 154.' },
  hts3: { id: 'hts3', name: '3% NaCl', short: '3%', na: 513, k: 0, naK: 513, note: 'Hypertonic; 1 mL/kg raises Na ≈ 1 mmol/L.' },
  hts5: { id: 'hts5', name: '5% NaCl', short: '5%', na: 855, k: 0, naK: 855, note: 'Hypertonic; usually central line.' },
};

export const FLUID_LIST: Fluid[] = Object.values(FLUIDS);

/** 1 g NaCl = 17.1 mmol Na. */
export const MMOL_NA_PER_G_NACL = 17.1;
/** 1 g urea (MW 60) = 16.7 mOsm. */
export const MOSM_PER_G_UREA = 16.7;
/** 20 mmol KCl adds 20 mmol to exchangeable Na+K — potassium raises serum Na too. */
export const KCL_NOTE = 'Each mmol of K given raises serum Na as much as a mmol of Na (Edelman).';

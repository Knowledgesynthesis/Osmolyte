/**
 * Diagnostic classification algorithms
 */

import {
  WaterBalanceState,
  DiagnosticResult,
  DiagnosisType,
  HyponatremiaClassification,
  SafetyAssessment,
} from '@/types';
import { calculateSerumOsm } from './calculations';
import { THRESHOLDS, CORRECTION_LIMITS, FE_URATE_THRESHOLDS } from './constants';

/**
 * Classify hyponatremia by tonicity and volume status
 */
export const classifyHyponatremia = (state: WaterBalanceState): HyponatremiaClassification => {
  const serumOsm = state.serumOsm ?? calculateSerumOsm(state.serumNa, state.glucose, state.BUN);

  // Determine tonicity
  let tonicity: 'hypotonic' | 'isotonic' | 'hypertonic';
  if (serumOsm < THRESHOLDS.hypotonicity) {
    tonicity = 'hypotonic';
  } else if (serumOsm > THRESHOLDS.hypertonicity) {
    tonicity = 'hypertonic';
  } else {
    tonicity = 'isotonic';
  }

  // Categorize urine tests
  const urineOsmCategory = state.urineOsm > THRESHOLDS.concentratedUrine ? 'concentrated' : 'dilute';
  const urineNaCategory = state.urineNa > THRESHOLDS.highUrineNa ? 'high' : 'low';

  // Determine likely diagnoses based on classification
  const likelyDiagnoses: DiagnosisType[] = [];

  if (tonicity === 'hypotonic') {
    if (state.volumeStatus === 'euvolemic') {
      if (urineOsmCategory === 'concentrated' && urineNaCategory === 'high') {
        likelyDiagnoses.push('SIADH', 'hypothyroidism', 'adrenal-insufficiency');
      } else if (urineOsmCategory === 'dilute') {
        likelyDiagnoses.push('primary-polydipsia', 'beer-potomania');
      }
    } else if (state.volumeStatus === 'hypovolemic') {
      if (urineNaCategory === 'high') {
        likelyDiagnoses.push('CSW', 'adrenal-insufficiency');
      } else {
        likelyDiagnoses.push('hypovolemic-hyponatremia');
      }
    } else {
      // hypervolemic
      likelyDiagnoses.push('hypervolemic-hyponatremia');
    }
  }

  return {
    tonicity,
    volumeStatus: state.volumeStatus,
    urineOsmCategory,
    urineNaCategory,
    likelyDiagnoses,
  };
};

/**
 * Assess for SIADH
 */
export const assessSIADH = (state: WaterBalanceState): DiagnosticResult => {
  const supportingFeatures: string[] = [];
  const contradictingFeatures: string[] = [];
  const nextSteps: string[] = [];
  const warningFlags: string[] = [];

  // Core SIADH criteria
  if (state.serumNa < THRESHOLDS.hyponatremia) {
    supportingFeatures.push(`Hyponatremia (${state.serumNa} mEq/L)`);
  } else {
    contradictingFeatures.push('Serum sodium is normal');
  }

  if (state.volumeStatus === 'euvolemic') {
    supportingFeatures.push('Clinically euvolemic');
  } else {
    contradictingFeatures.push(`Patient appears ${state.volumeStatus}`);
  }

  if (state.urineOsm > THRESHOLDS.concentratedUrine) {
    supportingFeatures.push(`Inappropriately concentrated urine (${state.urineOsm} mOsm/kg)`);
  } else {
    contradictingFeatures.push('Dilute urine suggests water intake issue or other cause');
  }

  if (state.urineNa > THRESHOLDS.highUrineNa) {
    supportingFeatures.push(`Elevated urinary sodium (${state.urineNa} mEq/L)`);
  } else {
    contradictingFeatures.push('Low urinary sodium less consistent with SIADH');
  }

  if (state.BUN < 10) {
    supportingFeatures.push(`Low BUN (${state.BUN} mg/dL) suggesting dilution`);
  }

  if (state.serumUricAcid < 4) {
    supportingFeatures.push(`Low uric acid (${state.serumUricAcid} mg/dL) due to increased excretion`);
  }

  if (state.FEurate !== null && state.FEurate > FE_URATE_THRESHOLDS.siadh) {
    supportingFeatures.push(`Elevated FE urate (${state.FEurate.toFixed(1)}%)`);
  }

  // Contradicting factors
  if (state.hasCNSInjury) {
    warningFlags.push('CNS injury present - consider CSW in differential');
  }

  if (state.soluteIntake < 250) {
    warningFlags.push('Low solute intake - consider beer potomania or tea-and-toast hyponatremia');
  }

  // Next steps
  nextSteps.push('Check cortisol and TSH to exclude adrenal insufficiency and hypothyroidism');
  nextSteps.push('Review medications for SIADH culprits (SSRIs, carbamazepine, etc.)');
  nextSteps.push('Consider chest imaging if pulmonary or malignancy causes suspected');

  if (state.serumNa < 130) {
    nextSteps.push('Assess need for hypertonic saline if symptomatic');
  } else {
    nextSteps.push('Consider fluid restriction as first-line therapy');
  }

  // Calculate confidence
  const confidence =
    supportingFeatures.length >= 5 && contradictingFeatures.length === 0 ? 0.9 :
    supportingFeatures.length >= 4 && contradictingFeatures.length <= 1 ? 0.75 :
    supportingFeatures.length >= 3 && contradictingFeatures.length <= 2 ? 0.6 :
    0.4;

  return {
    primaryDiagnosis: 'SIADH',
    confidence,
    supportingFeatures,
    contradictingFeatures,
    nextSteps,
    warningFlags,
  };
};

/**
 * Assess for Cerebral Salt Wasting (CSW)
 */
export const assessCSW = (state: WaterBalanceState): DiagnosticResult => {
  const supportingFeatures: string[] = [];
  const contradictingFeatures: string[] = [];
  const nextSteps: string[] = [];
  const warningFlags: string[] = [];

  // Core CSW features
  if (state.hasCNSInjury) {
    supportingFeatures.push('CNS injury present (SAH, TBI, neurosurgery)');
  } else {
    contradictingFeatures.push('No CNS injury - CSW is rare without neurologic insult');
  }

  if (state.serumNa < THRESHOLDS.hyponatremia) {
    supportingFeatures.push(`Hyponatremia (${state.serumNa} mEq/L)`);
  }

  if (state.volumeStatus === 'hypovolemic') {
    supportingFeatures.push('Clinical hypovolemia (key differentiator from SIADH)');
  } else {
    contradictingFeatures.push('Patient appears euvolemic - SIADH more likely');
  }

  if (state.urineNa > THRESHOLDS.highUrineNa) {
    supportingFeatures.push(`High urinary sodium loss (${state.urineNa} mEq/L)`);
  }

  if (state.urineOsm > THRESHOLDS.concentratedUrine) {
    supportingFeatures.push(`Concentrated urine (${state.urineOsm} mOsm/kg) despite hypovolemia`);
  }

  // Hemoconcentration markers
  if (state.hematocrit > 42) {
    supportingFeatures.push(`Hemoconcentration (Hct ${state.hematocrit}%)`);
  }

  if (state.BUN > 20) {
    supportingFeatures.push(`Elevated BUN (${state.BUN} mg/dL) suggesting volume depletion`);
  }

  if (state.FEurate !== null && state.FEurate > FE_URATE_THRESHOLDS.siadh) {
    supportingFeatures.push(`Elevated FE urate (${state.FEurate.toFixed(1)}%) - should normalize with volume repletion`);
  }

  // Next steps
  nextSteps.push('Administer isotonic saline and reassess volume status');
  nextSteps.push('Repeat labs after 1-2L NS to see if Una/FEurate normalize (CSW) or worsen (SIADH)');
  nextSteps.push('Consider salt tablets and fludrocortisone if CSW confirmed');
  nextSteps.push('Monitor closely for vasospasm if SAH patient');

  if (state.volumeStatus !== 'hypovolemic') {
    warningFlags.push('Euvolemia makes CSW less likely - reconsider SIADH');
  }

  // Calculate confidence
  const confidence =
    state.hasCNSInjury && state.volumeStatus === 'hypovolemic' && supportingFeatures.length >= 5 ? 0.85 :
    state.hasCNSInjury && supportingFeatures.length >= 4 ? 0.7 :
    state.hasCNSInjury && supportingFeatures.length >= 3 ? 0.5 :
    0.3;

  return {
    primaryDiagnosis: 'CSW',
    confidence,
    supportingFeatures,
    contradictingFeatures,
    nextSteps,
    warningFlags,
  };
};

/**
 * Assess for Diabetes Insipidus (central or nephrogenic)
 */
export const assessDI = (state: WaterBalanceState): DiagnosticResult => {
  const supportingFeatures: string[] = [];
  const contradictingFeatures: string[] = [];
  const nextSteps: string[] = [];
  const warningFlags: string[] = [];

  let primaryDiagnosis: DiagnosisType = 'central-DI'; // default, will refine

  // Core DI features
  if (state.urineVolume > THRESHOLDS.polyuria) {
    supportingFeatures.push(`Polyuria (${state.urineVolume} L/day)`);
  } else {
    contradictingFeatures.push('Urine output not elevated');
  }

  if (state.serumNa > THRESHOLDS.hypernatremia) {
    supportingFeatures.push(`Hypernatremia (${state.serumNa} mEq/L)`);
  }

  if (state.urineOsm < THRESHOLDS.concentratedUrine) {
    supportingFeatures.push(`Dilute urine (${state.urineOsm} mOsm/kg) despite hypertonicity`);
  } else {
    contradictingFeatures.push('Concentrated urine argues against DI');
  }

  // Differentiate central vs nephrogenic
  if (state.recentSurgery || state.hasCNSInjury) {
    supportingFeatures.push('Recent neurosurgery or CNS injury (risk for central DI)');
    primaryDiagnosis = 'central-DI';
  }

  if (state.lithiumExposure) {
    supportingFeatures.push('Lithium exposure (classic cause of nephrogenic DI)');
    primaryDiagnosis = 'nephrogenic-DI';
  }

  if (state.calcium > 10.5) {
    supportingFeatures.push(`Hypercalcemia (${state.calcium} mg/dL) can cause nephrogenic DI`);
    primaryDiagnosis = 'nephrogenic-DI';
  }

  if (state.potassium < 3.5) {
    supportingFeatures.push(`Hypokalemia (${state.potassium} mEq/L) can impair concentrating ability`);
  }

  if (state.pregnancy) {
    supportingFeatures.push('Pregnancy (transient DI possible due to vasopressinase)');
    primaryDiagnosis = 'nephrogenic-DI';
  }

  // Next steps
  nextSteps.push('Perform water deprivation test with DDAVP challenge');
  nextSteps.push('Check plasma copeptin if available');

  if (primaryDiagnosis === 'central-DI') {
    nextSteps.push('MRI pituitary/hypothalamus to assess for mass, infiltration, or posterior pituitary bright spot loss');
    nextSteps.push('Consider DDAVP trial (expect response in central DI)');
  } else {
    nextSteps.push('Review medications and correct electrolytes (stop lithium if possible, correct Ca/K)');
    nextSteps.push('Consider amiloride if lithium-induced');
    nextSteps.push('Consider thiazide + low sodium diet for nephrogenic DI');
  }

  // Calculate confidence
  const confidence =
    supportingFeatures.length >= 4 && contradictingFeatures.length === 0 ? 0.8 :
    supportingFeatures.length >= 3 && contradictingFeatures.length <= 1 ? 0.65 :
    0.45;

  return {
    primaryDiagnosis,
    confidence,
    supportingFeatures,
    contradictingFeatures,
    nextSteps,
    warningFlags,
  };
};

/**
 * Main diagnostic function - determines most likely diagnosis
 */
export const diagnoseWaterBalanceDisorder = (state: WaterBalanceState): DiagnosticResult => {
  // Hyponatremia pathway
  if (state.serumNa < THRESHOLDS.hyponatremia) {
    const classification = classifyHyponatremia(state);

    if (classification.tonicity === 'hypotonic' && state.volumeStatus === 'euvolemic') {
      // SIADH is most likely, but check CSW if CNS injury
      if (state.hasCNSInjury) {
        const cswResult = assessCSW(state);
        const siadhResult = assessSIADH(state);

        // Return the diagnosis with higher confidence
        return cswResult.confidence > siadhResult.confidence ? cswResult : siadhResult;
      } else {
        return assessSIADH(state);
      }
    } else if (classification.tonicity === 'hypotonic' && state.volumeStatus === 'hypovolemic') {
      return assessCSW(state);
    } else {
      // Other hyponatremia causes
      const likelyDx = classification.likelyDiagnoses[0] || 'unclear';
      return {
        primaryDiagnosis: likelyDx,
        confidence: 0.6,
        supportingFeatures: [`${classification.tonicity} hyponatremia`, `${state.volumeStatus} on exam`],
        contradictingFeatures: [],
        nextSteps: ['Complete diagnostic workup based on tonicity and volume status'],
        warningFlags: [],
      };
    }
  }

  // Hypernatremia pathway
  if (state.serumNa > THRESHOLDS.hypernatremia) {
    return assessDI(state);
  }

  // Normal sodium
  return {
    primaryDiagnosis: 'unclear',
    confidence: 0,
    supportingFeatures: ['Serum sodium within normal limits'],
    contradictingFeatures: [],
    nextSteps: ['Continue monitoring; reassess if clinical picture changes'],
    warningFlags: [],
  };
};

/**
 * Assess safety of sodium correction
 */
export const assessCorrectionSafety = (
  deltaNa: number,
  timeElapsed: number, // hours
  isHyponatremia: boolean
): SafetyAssessment => {
  if (timeElapsed === 0) {
    return {
      level: 'safe',
      message: 'No time elapsed yet',
    };
  }

  const rate = (Math.abs(deltaNa) / timeElapsed) * 24; // mEq/L per 24h
  const limits = isHyponatremia ? CORRECTION_LIMITS.hypoNa : CORRECTION_LIMITS.hyperNa;

  if (rate <= limits.safe) {
    return {
      level: 'safe',
      message: `Correction rate (${rate.toFixed(1)} mEq/L per 24h) is within safe limits`,
      correctionRate: rate,
    };
  } else if (rate <= limits.max) {
    return {
      level: 'caution',
      message: `Correction rate (${rate.toFixed(1)} mEq/L per 24h) approaching upper limit`,
      recommendation: 'Consider slowing correction; closely monitor sodium every 2-4 hours',
      correctionRate: rate,
    };
  } else {
    if (isHyponatremia) {
      return {
        level: 'danger',
        message: `RISK: Correction rate (${rate.toFixed(1)} mEq/L per 24h) too rapid!`,
        recommendation: 'STOP hypertonic saline. Consider D5W to re-lower sodium. Risk of osmotic demyelination syndrome (ODS).',
        correctionRate: rate,
      };
    } else {
      return {
        level: 'danger',
        message: `RISK: Correction rate (${rate.toFixed(1)} mEq/L per 24h) too rapid!`,
        recommendation: 'Slow correction rate. Risk of cerebral edema.',
        correctionRate: rate,
      };
    }
  }
};

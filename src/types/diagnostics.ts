/**
 * Diagnostic classification types
 */

export type EducationLevel = 'step1' | 'step2' | 'step3' | 'residency';

export type DiagnosisType =
  | 'SIADH'
  | 'CSW'
  | 'central-DI'
  | 'nephrogenic-DI'
  | 'primary-polydipsia'
  | 'hypovolemic-hyponatremia'
  | 'hypervolemic-hyponatremia'
  | 'osmotic-diuresis'
  | 'beer-potomania'
  | 'adrenal-insufficiency'
  | 'hypothyroidism'
  | 'mixed'
  | 'unclear';

export type SafetyLevel = 'safe' | 'caution' | 'danger';

export interface DiagnosticResult {
  primaryDiagnosis: DiagnosisType;
  confidence: number; // 0-1
  supportingFeatures: string[];
  contradictingFeatures: string[];
  nextSteps: string[];
  warningFlags: string[];
  differentials?: Array<{
    diagnosis: DiagnosisType;
    likelihood: number; // 0-1
    reason: string;
  }>;
}

export interface SafetyAssessment {
  level: SafetyLevel;
  message: string;
  recommendation?: string;
  correctionRate?: number; // mEq/L per 24h
  timeToTarget?: number; // hours
}

export interface WaterDeprivationResult {
  baselineUosm: number;
  postDeprivationUosm: number;
  postDDAVPUosm: number;
  interpretation: string;
  diagnosis: 'central-DI' | 'nephrogenic-DI' | 'primary-polydipsia' | 'normal' | 'partial-DI';
  confidence: number;
}

export interface SalineResponseTest {
  preInfusionNa: number;
  postInfusionNa: number;
  preInfusionUosm: number;
  postInfusionUosm: number;
  interpretation: string;
  diagnosis: 'SIADH' | 'CSW' | 'other';
}

export interface HyponatremiaClassification {
  tonicity: 'hypotonic' | 'isotonic' | 'hypertonic';
  volumeStatus: 'hypovolemic' | 'euvolemic' | 'hypervolemic';
  urineOsmCategory: 'dilute' | 'concentrated'; // <100 vs >100
  urineNaCategory: 'low' | 'high'; // <30 vs >30
  likelyDiagnoses: DiagnosisType[];
}

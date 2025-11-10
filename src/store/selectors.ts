/**
 * Zustand store selectors for derived state
 */

import { WaterBalanceSlice } from './waterBalanceSlice';
import {
  calculateDerivedValues,
  diagnoseWaterBalanceDisorder,
  classifyHyponatremia,
  assessCorrectionSafety,
  assessSIADH,
  assessCSW,
  assessDI,
} from '@/lib';
import { CalculatedValues, DiagnosticResult, HyponatremiaClassification, SafetyAssessment } from '@/types';

export const selectDerivedValues = (state: WaterBalanceSlice): CalculatedValues => {
  return calculateDerivedValues(state);
};

export const selectDiagnosis = (state: WaterBalanceSlice): DiagnosticResult => {
  return diagnoseWaterBalanceDisorder(state);
};

export const selectHyponatremiaClassification = (state: WaterBalanceSlice): HyponatremiaClassification | null => {
  if (state.serumNa >= 135) return null;
  return classifyHyponatremia(state);
};

export const selectSIADHAssessment = (state: WaterBalanceSlice): DiagnosticResult => {
  return assessSIADH(state);
};

export const selectCSWAssessment = (state: WaterBalanceSlice): DiagnosticResult => {
  return assessCSW(state);
};

export const selectDIAssessment = (state: WaterBalanceSlice): DiagnosticResult => {
  return assessDI(state);
};

export const selectCorrectionSafety = (state: WaterBalanceSlice): SafetyAssessment | null => {
  if (!state.baselineNa || state.timeElapsed === 0) return null;

  const deltaNa = state.serumNa - state.baselineNa;
  const isHyponatremia = state.baselineNa < 135;

  return assessCorrectionSafety(deltaNa, state.timeElapsed, isHyponatremia);
};

export const selectIsHyponatremic = (state: WaterBalanceSlice): boolean => {
  return state.serumNa < 135;
};

export const selectIsHypernatremic = (state: WaterBalanceSlice): boolean => {
  return state.serumNa > 145;
};

export const selectHasPolyuria = (state: WaterBalanceSlice): boolean => {
  return state.urineVolume > 3;
};

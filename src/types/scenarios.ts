/**
 * Clinical scenario and case types
 */

import { WaterBalanceState } from './waterBalance';
import { DiagnosisType, EducationLevel } from './diagnostics';

export type EventType = 'vitals' | 'labs' | 'exam' | 'intervention' | 'imaging' | 'note';

export interface TimelineEvent {
  id: string;
  timepoint: number; // hours
  type: EventType;
  title: string;
  data: any;
  autoReveal: boolean; // or requires user action
  hidden?: boolean; // for progressive disclosure
}

export interface VitalsEvent {
  BP: string; // e.g., "120/80"
  HR: number;
  temp: number; // Celsius
  RR: number;
  O2sat: number;
  orthostatics?: boolean;
}

export interface LabsEvent {
  serumNa?: number;
  serumK?: number;
  serumCl?: number;
  BUN?: number;
  creatinine?: number;
  glucose?: number;
  calcium?: number;
  serumOsm?: number;
  serumUricAcid?: number;
  urineNa?: number;
  urineOsm?: number;
  urineCreatinine?: number;
  urineUricAcid?: number;
  cortisol?: number;
  TSH?: number;
  hematocrit?: number;
  [key: string]: number | undefined;
}

export interface ExamEvent {
  general: string;
  JVP: 'normal' | 'elevated' | 'low';
  mucousMembranes: 'moist' | 'dry';
  skinTurgor: 'normal' | 'decreased';
  edema: 'none' | 'trace' | 'moderate' | 'severe';
  neurologic?: string;
  other?: string;
}

export interface InterventionEvent {
  type: 'fluid' | 'medication' | 'dietary';
  description: string;
  details: any;
}

export interface ClinicalScenario {
  id: string;
  title: string;
  level: EducationLevel;
  initialState: Partial<WaterBalanceState>;
  clinicalContext: string;
  presentingComplaint: string;
  timeline: TimelineEvent[];
  learningObjectives: string[];
  correctDiagnosis: DiagnosisType;
  managementPearls: string[];
  pitfalls: string[];
  tags: string[];
}

export interface UserAction {
  type: 'order-test' | 'give-fluid' | 'give-medication' | 'consult';
  timestamp: number;
  details: any;
}

export interface ScenarioProgress {
  scenarioId: string;
  currentTimepoint: number;
  userActions: UserAction[];
  correctActions: number;
  mistakes: number;
  completed: boolean;
  score?: number;
}

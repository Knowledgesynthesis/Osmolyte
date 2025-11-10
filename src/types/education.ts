/**
 * Educational content types
 */

import { DiagnosisType } from './diagnostics';

export type QuestionType = 'multiple-choice' | 'multi-select' | 'numeric' | 'ordering';
export type DifficultyLevel = 'easy' | 'medium' | 'hard';

export interface QuizQuestion {
  id: string;
  type: QuestionType;
  difficulty: DifficultyLevel;
  question: string;
  options?: string[]; // for MC/multi-select
  correctAnswer: string | string[] | number;
  explanation: string;
  tags: string[];
  relatedDiagnoses: DiagnosisType[];
}

export interface QuizAttempt {
  questionId: string;
  userAnswer: string | string[] | number;
  correct: boolean;
  timestamp: number;
  timeSpent: number; // seconds
}

export interface Pearl {
  id: string;
  title: string;
  content: string;
  mnemonic?: string;
  category: 'diagnosis' | 'management' | 'physiology' | 'pitfall';
  relatedDiagnoses: DiagnosisType[];
  level: 'step1' | 'step2' | 'step3' | 'residency' | 'all';
}

export interface Drug {
  id: string;
  name: string;
  genericName?: string;
  class: string;
  mechanism: string;
  indications: DiagnosisType[];
  contraindications: string[];
  dosing: string; // educational ranges only
  monitoring: string[];
  adverseEffects: string[];
  pearls: string[];
  whenToUse: string;
  whenToAvoid: string;
}

export interface Concept {
  id: string;
  title: string;
  summary: string;
  detailedExplanation: string;
  keyEquations?: string[];
  clinicalRelevance: string;
  commonMisconceptions?: string[];
  level: 'step1' | 'step2' | 'step3' | 'residency' | 'all';
}

export interface LearningPath {
  id: string;
  title: string;
  description: string;
  modules: Array<{
    id: string;
    title: string;
    concepts: string[]; // concept IDs
    scenarios: string[]; // scenario IDs
    quizzes: string[]; // quiz IDs
    estimatedTime: number; // minutes
  }>;
  prerequisites?: string[]; // other learning path IDs
}

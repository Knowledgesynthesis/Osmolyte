export type InteractiveId =
  | 'solute-explorer'
  | 'tonicity-calc'
  | 'hypo-navigator'
  | 'correction-planner'
  | 'correction-monitor'
  | 'furst'
  | 'polyuria-lab'
  | 'free-water'
  | 'fluid-lab-link';

/**
 * Inline markup supported in all text fields:
 *   **bold**   and   [@refId] citation markers (rendered as linked superscripts).
 */
export type Block =
  | { kind: 'p'; text: string }
  | { kind: 'points'; title?: string; items: string[] }
  | { kind: 'table'; caption?: string; head: string[]; rows: string[][] }
  | { kind: 'callout'; tone: 'pearl' | 'pitfall' | 'evidence' | 'action'; title: string; text: string }
  | { kind: 'equation'; label: string; formula: string; note?: string }
  | { kind: 'interactive'; id: InteractiveId; preset?: string }
  | { kind: 'steps'; title?: string; items: { title: string; text: string }[] }
  | { kind: 'patterns'; items: { see: string; think: string; do: string }[] };

export interface Section {
  id: string;
  title: string;
  blocks: Block[];
}

export interface Module {
  id: string;
  number: number;
  title: string;
  tagline: string;
  minutes: number;
  objectives: string[];
  sections: Section[];
  /** question ids from the bank used as the module's mastery check */
  check: string[];
}

export interface Option {
  id: string;
  text: string;
  /** why this option is right or wrong */
  why?: string;
}

export interface Question {
  id: string;
  module: string;
  difficulty: 1 | 2 | 3;
  type: 'single' | 'multi' | 'numeric';
  stem: string;
  options?: Option[];
  /** option id(s) for single/multi */
  answer?: string[];
  /** numeric answer and tolerance */
  numeric?: { value: number; tolerance: number; unit: string };
  explanation: string;
  refs?: string[];
  /** short pattern-recognition item suitable for timed drills */
  drill?: boolean;
}

export interface CaseStage {
  title: string;
  narrative: string;
  data?: { label: string; value: string; flag?: 'high' | 'low' }[];
  question: string;
  options: { id: string; text: string; correct: boolean; feedback: string }[];
  teaching: string;
}

export interface ClinicalCase {
  id: string;
  title: string;
  setting: string;
  level: 'Core' | 'Advanced' | 'Expert';
  topics: string[];
  hook: string;
  stages: CaseStage[];
  summary: {
    concept: string;
    reasoning: string;
    management: string;
    pearls: string[];
    followUp: string;
  };
  labPreset?: string;
  refs?: string[];
}

export interface Card {
  id: string;
  deck: 'physiology' | 'hyponatremia' | 'treatment' | 'polyuria' | 'hypernatremia' | 'special';
  front: string;
  back: string;
}

export interface Drug {
  id: string;
  name: string;
  class: string;
  use: string;
  mechanism: string;
  dosing: string;
  evidence: string;
  monitoring: string;
  cautions: string;
  refs?: string[];
}

export interface Reference {
  id: string;
  citation: string;
  /** one-line takeaway */
  takeaway: string;
  url: string;
  year: number;
  kind: 'guideline' | 'rct' | 'cohort' | 'meta' | 'review' | 'diagnostic' | 'physiology' | 'statement';
}

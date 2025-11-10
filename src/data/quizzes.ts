/**
 * Quiz questions for assessment
 */

import { QuizQuestion } from '@/types';

export const quizQuestions: QuizQuestion[] = [
  {
    id: 'q1',
    type: 'multiple-choice',
    difficulty: 'easy',
    question: 'A patient has serum Na 125, euvolemic exam, urine Osm 450, urine Na 60. What is the most likely diagnosis?',
    options: ['SIADH', 'CSW', 'Primary polydipsia', 'Adrenal insufficiency'],
    correctAnswer: 'SIADH',
    explanation: 'Euvolemic hyponatremia with concentrated urine (>100) and high urinary sodium (>30) is classic for SIADH. Must exclude adrenal/thyroid causes.',
    tags: ['SIADH', 'diagnosis'],
    relatedDiagnoses: ['SIADH'],
  },
  {
    id: 'q2',
    type: 'multiple-choice',
    difficulty: 'medium',
    question: 'What is the KEY clinical finding that differentiates CSW from SIADH?',
    options: ['Urinary sodium', 'Volume status', 'Urine osmolality', 'Serum uric acid'],
    correctAnswer: 'Volume status',
    explanation: 'Both SIADH and CSW have high urinary sodium and concentrated urine. The KEY differentiator is volume status: CSW is hypovolemic, SIADH is euvolemic.',
    tags: ['CSW', 'SIADH', 'diagnosis'],
    relatedDiagnoses: ['SIADH', 'CSW'],
  },
  {
    id: 'q3',
    type: 'multiple-choice',
    difficulty: 'hard',
    question: 'A patient with serum Na 115 from chronic SIADH is given 3% saline. After 6 hours, Na is now 125. What is the next best step?',
    options: [
      'Continue 3% saline to target 135',
      'Stop 3% saline and give D5W',
      'Continue current rate',
      'Switch to isotonic saline'
    ],
    correctAnswer: 'Stop 3% saline and give D5W',
    explanation: 'Sodium rose 10 mEq/L in 6 hours (40 mEq/L per 24h), far exceeding safe limits of 6-8 mEq/L per 24h. Must stop hypertonic saline and potentially re-lower sodium with D5W to prevent osmotic demyelination syndrome.',
    tags: ['SIADH', 'management', 'complications'],
    relatedDiagnoses: ['SIADH'],
  },
  {
    id: 'q4',
    type: 'multiple-choice',
    difficulty: 'medium',
    question: 'What test best differentiates central from nephrogenic DI?',
    options: [
      'Serum sodium level',
      'Urine osmolality',
      'Response to desmopressin (DDAVP)',
      'Serum ADH level'
    ],
    correctAnswer: 'Response to desmopressin (DDAVP)',
    explanation: 'Water deprivation test followed by DDAVP challenge: Central DI responds to DDAVP (Uosm increases >50%), nephrogenic DI does not respond significantly.',
    tags: ['central-DI', 'nephrogenic-DI', 'diagnosis'],
    relatedDiagnoses: ['central-DI', 'nephrogenic-DI'],
  },
  {
    id: 'q5',
    type: 'multiple-choice',
    difficulty: 'easy',
    question: 'What is the maximum safe sodium correction rate in chronic hyponatremia?',
    options: ['2-4 mEq/L per 24h', '4-6 mEq/L per 24h', '6-8 mEq/L per 24h', '10-12 mEq/L per 24h'],
    correctAnswer: '6-8 mEq/L per 24h',
    explanation: 'Safe correction is ≤6 mEq/L per 24h, with a maximum of 8 mEq/L per 24h to minimize risk of osmotic demyelination syndrome. Faster correction risks permanent neurologic damage.',
    tags: ['management', 'safety'],
    relatedDiagnoses: ['SIADH', 'CSW'],
  },
  {
    id: 'q6',
    type: 'multi-select',
    difficulty: 'medium',
    question: 'Which of the following are risk factors for osmotic demyelination syndrome? (Select all that apply)',
    options: ['Rapid sodium correction', 'Alcoholism', 'Malnutrition', 'Liver disease', 'Hypernatremia'],
    correctAnswer: ['Rapid sodium correction', 'Alcoholism', 'Malnutrition', 'Liver disease'],
    explanation: 'ODS risk factors: rapid correction (>8 mEq/L per 24h), chronic hyponatremia, alcoholism, malnutrition, liver disease, and hypokalemia. Hypernatremia is not a risk factor for ODS.',
    tags: ['complications', 'management'],
    relatedDiagnoses: ['SIADH'],
  },
  {
    id: 'q7',
    type: 'multiple-choice',
    difficulty: 'hard',
    question: 'A patient drinks only beer for weeks and presents with Na 118, urine Osm 80. What is the MAIN risk during treatment?',
    options: [
      'Severe dehydration',
      'Rapid auto-correction of sodium',
      'Alcohol withdrawal',
      'Hyperkalemia'
    ],
    correctAnswer: 'Rapid auto-correction of sodium',
    explanation: 'Beer potomania (low solute intake) has dilute urine despite hyponatremia. When patient resumes normal diet/solute intake, sodium can rapidly auto-correct, risking osmotic demyelination. Must monitor Na q2-4h and possibly give D5W to slow correction.',
    tags: ['beer-potomania', 'pitfall'],
    relatedDiagnoses: ['beer-potomania'],
  },
  {
    id: 'q8',
    type: 'multiple-choice',
    difficulty: 'medium',
    question: 'Which medication is most appropriate for lithium-induced nephrogenic DI?',
    options: ['Desmopressin', 'Tolvaptan', 'Amiloride', 'Furosemide'],
    correctAnswer: 'Amiloride',
    explanation: 'Amiloride blocks ENaC channels, reducing lithium entry into collecting duct cells. Can reduce polyuria while allowing continued lithium therapy. Desmopressin won\'t work (nephrogenic), and tolvaptan would worsen DI.',
    tags: ['nephrogenic-DI', 'management'],
    relatedDiagnoses: ['nephrogenic-DI'],
  },
];

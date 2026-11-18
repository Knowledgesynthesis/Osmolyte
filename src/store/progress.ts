import { create } from 'zustand';
import { createJSONStorage, persist, StateStorage } from 'zustand/middleware';
import { CardState, review } from '@/lib/srs';
import { MODULES } from '@/data/modules';

export interface AnswerRecord {
  correct: boolean;
  attempts: number;
  correctCount: number;
  at: number;
}

export interface CaseRecord {
  score: number;
  total: number;
  at: number;
}

interface ProgressState {
  answers: Record<string, AnswerRecord>;
  cards: Record<string, CardState>;
  cases: Record<string, CaseRecord>;
  visited: Record<string, number>;
  recordAnswer: (id: string, correct: boolean) => void;
  reviewCard: (id: string, remembered: boolean) => void;
  completeCase: (id: string, score: number, total: number) => void;
  visit: (moduleId: string) => void;
  reset: () => void;
}

const memory: Record<string, string> = {};
const safeStorage: StateStorage = {
  getItem: (k) => {
    try {
      return localStorage.getItem(k);
    } catch {
      return memory[k] ?? null;
    }
  },
  setItem: (k, v) => {
    try {
      localStorage.setItem(k, v);
    } catch {
      memory[k] = v;
    }
  },
  removeItem: (k) => {
    try {
      localStorage.removeItem(k);
    } catch {
      delete memory[k];
    }
  },
};

export const useProgress = create<ProgressState>()(
  persist(
    (set) => ({
      answers: {},
      cards: {},
      cases: {},
      visited: {},
      recordAnswer: (id, correct) =>
        set((s) => {
          const prev = s.answers[id];
          return {
            answers: {
              ...s.answers,
              [id]: { correct, attempts: (prev?.attempts ?? 0) + 1, correctCount: (prev?.correctCount ?? 0) + (correct ? 1 : 0), at: Date.now() },
            },
          };
        }),
      reviewCard: (id, remembered) => set((s) => ({ cards: { ...s.cards, [id]: review(s.cards[id], remembered) } })),
      completeCase: (id, score, total) => set((s) => ({ cases: { ...s.cases, [id]: { score, total, at: Date.now() } } })),
      visit: (moduleId) => set((s) => ({ visited: { ...s.visited, [moduleId]: Date.now() } })),
      reset: () => set({ answers: {}, cards: {}, cases: {}, visited: {} }),
    }),
    { name: 'osmolyte-progress-v2', storage: createJSONStorage(() => safeStorage), version: 2 },
  ),
);

export function moduleMastery(moduleId: string, answers: Record<string, AnswerRecord>) {
  const m = MODULES.find((x) => x.id === moduleId);
  if (!m) return { done: 0, total: 0, mastered: false };
  const done = m.check.filter((q) => answers[q]?.correct).length;
  return { done, total: m.check.length, mastered: done === m.check.length };
}

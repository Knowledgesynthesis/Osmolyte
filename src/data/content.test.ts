import { describe, expect, it } from 'vitest';
import { MODULES } from './modules';
import { QUESTIONS, QUESTION_INDEX } from './questions';
import { CASES } from './cases';
import { CARDS } from './cards';
import { DRUGS } from './drugs';
import { REFERENCES, REF_INDEX } from './references';
import { PRESETS } from '@/lib/fluidLab';
import type { Block } from './types';

const refMarkers = (text: string) => [...text.matchAll(/\[@([\w-]+)\]/g)].map((m) => m[1]);
const blockTexts = (b: Block): string[] => {
  switch (b.kind) {
    case 'p':
      return [b.text];
    case 'points':
      return [b.title ?? '', ...b.items];
    case 'table':
      return [b.caption ?? '', ...b.head, ...b.rows.flat()];
    case 'callout':
      return [b.title, b.text];
    case 'equation':
      return [b.label, b.formula, b.note ?? ''];
    case 'steps':
      return b.items.flatMap((i) => [i.title, i.text]);
    case 'patterns':
      return b.items.flatMap((i) => [i.see, i.think, i.do]);
    default:
      return [];
  }
};

const unique = (ids: string[]) => new Set(ids).size === ids.length;

describe('content integrity', () => {
  it('ids are unique', () => {
    expect(unique(MODULES.map((m) => m.id))).toBe(true);
    expect(unique(QUESTIONS.map((q) => q.id))).toBe(true);
    expect(unique(CASES.map((c) => c.id))).toBe(true);
    expect(unique(CARDS.map((c) => c.id))).toBe(true);
    expect(unique(DRUGS.map((d) => d.id))).toBe(true);
    expect(unique(REFERENCES.map((r) => r.id))).toBe(true);
  });

  it('every module check question exists and belongs to that module', () => {
    for (const m of MODULES) {
      expect(m.check.length).toBeGreaterThanOrEqual(3);
      for (const id of m.check) {
        expect(QUESTION_INDEX[id], `${m.id} → ${id}`).toBeDefined();
        expect(QUESTION_INDEX[id].module).toBe(m.id);
      }
    }
  });

  it('every question is well-formed', () => {
    const moduleIds = new Set(MODULES.map((m) => m.id));
    for (const q of QUESTIONS) {
      expect(moduleIds.has(q.module), q.id).toBe(true);
      if (q.type === 'numeric') {
        expect(q.numeric, q.id).toBeDefined();
      } else {
        const opts = new Set(q.options!.map((o) => o.id));
        expect(q.answer!.length, q.id).toBeGreaterThan(0);
        for (const a of q.answer!) expect(opts.has(a), `${q.id}:${a}`).toBe(true);
        if (q.type === 'single') expect(q.answer!.length, q.id).toBe(1);
        expect(unique(q.options!.map((o) => o.id)), q.id).toBe(true);
      }
      for (const r of q.refs ?? []) expect(REF_INDEX[r], `${q.id} ref ${r}`).toBeDefined();
    }
  });

  it('every citation marker in modules resolves', () => {
    for (const m of MODULES)
      for (const s of m.sections)
        for (const b of s.blocks)
          for (const t of blockTexts(b))
            for (const r of refMarkers(t)) expect(REF_INDEX[r], `${m.id}/${s.id}: ${r}`).toBeDefined();
  });

  it('lab presets referenced by modules and cases exist', () => {
    const presetIds = new Set(PRESETS.map((p) => p.patient.id));
    for (const m of MODULES) for (const s of m.sections) for (const b of s.blocks) if (b.kind === 'interactive' && b.preset) expect(presetIds.has(b.preset), b.preset).toBe(true);
    for (const c of CASES) if (c.labPreset) expect(presetIds.has(c.labPreset), c.labPreset).toBe(true);
  });

  it('cases: each stage has exactly one correct option and refs resolve', () => {
    for (const c of CASES) {
      for (const st of c.stages) expect(st.options.filter((o) => o.correct).length, `${c.id}/${st.title}`).toBe(1);
      for (const r of c.refs ?? []) expect(REF_INDEX[r], `${c.id} ref ${r}`).toBeDefined();
    }
  });

  it('drug refs resolve', () => {
    for (const d of DRUGS) for (const r of d.refs ?? []) expect(REF_INDEX[r], `${d.id} ref ${r}`).toBeDefined();
  });

  it('every reference is cited somewhere', () => {
    const cited = new Set<string>();
    for (const m of MODULES) for (const s of m.sections) for (const b of s.blocks) for (const t of blockTexts(b)) refMarkers(t).forEach((r) => cited.add(r));
    QUESTIONS.forEach((q) => q.refs?.forEach((r) => cited.add(r)));
    CASES.forEach((c) => c.refs?.forEach((r) => cited.add(r)));
    DRUGS.forEach((d) => d.refs?.forEach((r) => cited.add(r)));
    const uncited = REFERENCES.filter((r) => !cited.has(r.id)).map((r) => r.id);
    expect(uncited).toEqual([]);
  });

  it('no "educational purposes only" boilerplate in content', () => {
    const all = JSON.stringify([MODULES, QUESTIONS, CASES, CARDS, DRUGS]).toLowerCase();
    expect(all).not.toMatch(/educational purposes only|not for clinical use|educational only/);
  });
});

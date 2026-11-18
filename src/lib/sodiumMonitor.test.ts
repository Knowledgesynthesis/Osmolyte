import { describe, expect, it } from 'vitest';
import { analyseCorrection, limitsFor, naAt } from './sodiumMonitor';

const hypo = { direction: 'hypo' as const, acute: false, highRisk: false };

describe('limits', () => {
  it('chronic standard risk: 10 then 8 (EU), 18/48 h (US)', () => {
    const l = limitsFor(hypo);
    expect([l.first24, l.subsequent24, l.over48]).toEqual([10, 8, 18]);
  });
  it('high risk: 8 in any 24 h', () => {
    const l = limitsFor({ ...hypo, highRisk: true });
    expect([l.first24, l.subsequent24]).toEqual([8, 8]);
  });
  it('acute hyponatremia has no ceiling', () => {
    expect(limitsFor({ ...hypo, acute: true }).first24).toBeNull();
  });
});

describe('analyseCorrection', () => {
  it('a deliberate +5 in the first hour is NOT an overcorrection', () => {
    const r = analyseCorrection([{ t: 0, na: 118 }, { t: 1, na: 123 }], hypo);
    expect(r.worst).not.toBe('exceeded');
    expect(r.periods[0].remaining).toBe(5);
  });
  it('+10 within 6 h hits the 24-h allowance → approaching', () => {
    const r = analyseCorrection([{ t: 0, na: 115 }, { t: 6, na: 124 }], hypo);
    expect(r.worst).toBe('approaching');
  });
  it('+12 by hour 20 exceeds and triggers relowering actions', () => {
    const r = analyseCorrection([{ t: 0, na: 112 }, { t: 8, na: 118 }, { t: 20, na: 124 }], hypo);
    expect(r.worst).toBe('exceeded');
    expect(r.actions.join(' ')).toMatch(/desmopressin/i);
  });
  it('peak excursion counts even if Na later falls back', () => {
    const r = analyseCorrection([{ t: 0, na: 110 }, { t: 12, na: 121 }, { t: 22, na: 119 }], hypo);
    expect(r.periods[0].status).toBe('exceeded');
  });
  it('second period measured from the Na at hour 24, limit 8', () => {
    const r = analyseCorrection([{ t: 0, na: 110 }, { t: 24, na: 118 }, { t: 40, na: 127 }], hypo);
    expect(r.periods[1].startNa).toBe(118);
    expect(r.periods[1].status).toBe('exceeded');
  });
  it('48-h cumulative limit', () => {
    const r = analyseCorrection([{ t: 0, na: 110 }, { t: 24, na: 119 }, { t: 47, na: 129 }], hypo);
    expect(r.over48Exceeded).toBe(true);
  });
  it('falling Na during treatment is flagged', () => {
    const r = analyseCorrection([{ t: 0, na: 124 }, { t: 6, na: 122 }], hypo);
    expect(r.worst).toBe('wrong-direction');
  });
  it('hypernatremia: a fall is the corrective direction', () => {
    const r = analyseCorrection([{ t: 0, na: 160 }, { t: 12, na: 154 }], { direction: 'hyper', acute: false, highRisk: false });
    expect(r.periods[0].change).toBe(6);
    expect(r.worst).toBe('on-track');
  });
  it('interpolates Na at period boundaries', () => {
    expect(naAt([{ t: 0, na: 110 }, { t: 48, na: 126 }], 24)).toBe(118);
  });
  it('handles unsorted and empty input', () => {
    expect(analyseCorrection([], hypo).periods).toHaveLength(0);
    const r = analyseCorrection([{ t: 10, na: 120 }, { t: 0, na: 115 }], hypo);
    expect(r.baselineNa).toBe(115);
  });
});

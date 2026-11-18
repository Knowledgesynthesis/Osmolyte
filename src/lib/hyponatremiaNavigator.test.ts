import { describe, expect, it } from 'vitest';
import { DEFAULT_HYPO_INPUTS, HypoInputs, navigateHyponatremia } from './hyponatremiaNavigator';

const nav = (o: Partial<HypoInputs>) => navigateHyponatremia({ ...DEFAULT_HYPO_INPUTS, ...o });

describe('hyponatremia navigator', () => {
  it('classic SIAD', () => {
    const r = nav({});
    expect(r.conclusion).toMatch(/SIAD/);
    expect(r.nextTests.join(' ')).toMatch(/cortisol/i);
  });
  it('severe symptoms trigger hypertonic saline before diagnosis', () => {
    const r = nav({ symptoms: 'severe' });
    expect(r.emergency?.level).toBe('severe');
    expect(r.emergency?.action).toMatch(/150 mL/);
  });
  it('acute onset with any symptoms is treated as an emergency', () => {
    expect(nav({ onset: 'acute', symptoms: 'mild' }).emergency?.level).toBe('severe');
  });
  it('hyperglycemia → translocational', () => {
    const r = nav({ na: 128, glucose: 700, measuredOsm: 300 });
    expect(r.conclusion).toMatch(/Translocational/);
  });
  it('normal measured osm without hyperglycemia → pseudohyponatremia path', () => {
    const r = nav({ na: 128, glucose: 100, bun: 14, measuredOsm: 288 });
    expect(r.differential.join(' ')).toMatch(/Pseudohyponatremia/);
  });
  it('uremia: measured osm normal but effective osm low → still hypotonic', () => {
    const r = nav({ na: 125, glucose: 100, bun: 110, measuredOsm: 292 });
    expect(r.steps.find((s) => s.id === 'tonicity')?.status).toBe('pass');
    expect(r.conclusion).not.toMatch(/Non-hypotonic/);
  });
  it('Uosm ≤ 100 → excess water/low solute with autocorrection warning', () => {
    const r = nav({ uOsm: 70, uNa: 10 });
    expect(r.differential.join(' ')).toMatch(/beer potomania/);
    expect(r.conclusion).toMatch(/autocorrection/);
  });
  it('low urine Na, not edematous → extra-renal loss even if exam looks normal', () => {
    const r = nav({ uNa: 12, ecf: 'normal' });
    expect(r.conclusion).toMatch(/extra-renal/);
  });
  it('low urine Na and edema → hypervolemic', () => {
    expect(nav({ uNa: 10, ecf: 'expanded' }).differential).toContain('Cirrhosis');
  });
  it('thiazide → diuretic path with FE urate advice', () => {
    const r = nav({ diuretics: true });
    expect(r.nextTests.join(' ')).toMatch(/FE urate/);
  });
  it('reduced ECF with natriuresis after SAH includes CSW and the SIAD-is-commoner caveat', () => {
    const r = nav({ ecf: 'reduced', cnsInsult: true });
    expect(r.differential.join(' ')).toMatch(/Cerebral salt wasting/);
    expect(r.flips.join(' ')).toMatch(/Hannon/);
  });
  it('flags high ODS risk', () => {
    const r = nav({ na: 104, hypokalemia: true });
    expect(r.odsRisk.high).toBe(true);
    expect(r.odsRisk.reasons).toHaveLength(2);
  });
  it('asks for missing urine studies instead of guessing', () => {
    expect(nav({ uOsm: null }).steps.at(-1)?.status).toBe('missing');
    expect(nav({ uNa: null }).steps.at(-1)?.status).toBe('missing');
  });
});

import { describe, expect, it } from 'vitest';
import { POLYURIA_CASES, deprivationCourse, deprivationStopCheck, desmopressinResponse, interpretCopeptin, interpretDeprivation } from './polyuria';

const byDx = (dx: string) => POLYURIA_CASES.find((c) => c.dx === dx)!;

function runToStop(id: string, maxH = 18) {
  const c = byDx(id);
  for (let h = 1; h <= maxH; h++) {
    const pts = deprivationCourse(c, h);
    if (deprivationStopCheck(pts).stop) return { c, pts };
  }
  return { c, pts: deprivationCourse(c, maxH) };
}

describe('water deprivation test', () => {
  it('complete AVP-D: urine stays < 300, Na hits the stop threshold, desmopressin > 50%', () => {
    const { c, pts } = runToStop('avp-d-complete');
    const last = pts.at(-1)!;
    expect(last.uOsm).toBeLessThan(300);
    const post = desmopressinResponse(c, last.uOsm);
    expect(interpretDeprivation(last.uOsm, post).verdict).toBe('Complete AVP deficiency');
  });
  it('AVP-R: < 300 and minimal desmopressin response', () => {
    const { c, pts } = runToStop('avp-r');
    const u = pts.at(-1)!.uOsm;
    expect(interpretDeprivation(u, desmopressinResponse(c, u)).verdict).toBe('AVP resistance');
  });
  it('partial AVP-D and primary polydipsia both land in the grey zone', () => {
    for (const dx of ['avp-d-partial', 'primary-polydipsia']) {
      const { c, pts } = runToStop(dx);
      const u = pts.at(-1)!.uOsm;
      const res = interpretDeprivation(u, desmopressinResponse(c, u));
      expect(res.confidence).toBe('indeterminate');
    }
  });
  it('stop criteria fire for Na > 147', () => {
    expect(deprivationStopCheck([{ t: 5, uOsm: 140, na: 148, weightLossPct: 1 }]).stop).toBe(true);
  });
  it('weight loss stays physiological', () => {
    for (const c of POLYURIA_CASES) {
      const pts = deprivationCourse(c, 16);
      expect(pts.at(-1)!.weightLossPct).toBeLessThan(10);
    }
  });
});

describe('copeptin', () => {
  it('every case is classified correctly by hypertonic-saline copeptin', () => {
    for (const c of POLYURIA_CASES.filter((x) => x.dx !== 'avp-r')) {
      const v = interpretCopeptin('hypertonic', c.hsCopeptin).verdict;
      expect(v).toBe(c.dx.startsWith('avp-d') ? 'AVP deficiency' : 'Primary polydipsia');
    }
  });
  it('baseline > 21.4 identifies AVP-R', () => {
    expect(interpretCopeptin('baseline', byDx('avp-r').baseline.copeptin).verdict).toBe('AVP resistance');
  });
  it('arginine misclassifies the partial AVP-D case (illustrating CARGO)', () => {
    expect(interpretCopeptin('arginine', byDx('avp-d-partial').arginineCopeptin).verdict).toMatch(/polydipsia/);
  });
});

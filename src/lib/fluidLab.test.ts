import { describe, expect, it } from 'vitest';
import { EMPTY_REGIMEN, PRESETS, Patient, Regimen, simulate, urineOsm } from './fluidLab';

const preset = (id: string) => {
  const p = PRESETS.find((x) => x.patient.id === id);
  if (!p) throw new Error(id);
  return p;
};
const run = (p: Patient, r: Partial<Regimen>, hours = 48) => simulate(p, { ...EMPTY_REGIMEN, ...r }, hours);
const naAt = (res: ReturnType<typeof simulate>, h: number) => res.points.find((x) => x.t === h)!.na;

describe('Fluid Lab invariants', () => {
  it('produces finite, physiological values for every preset', () => {
    for (const pr of PRESETS) {
      const res = simulate(pr.patient, pr.regimen);
      expect(res.points).toHaveLength(49);
      for (const pt of res.points) {
        expect(Number.isFinite(pt.na)).toBe(true);
        expect(pt.tbw).toBeGreaterThan(5);
        expect(pt.urineMlH).toBeGreaterThanOrEqual(0);
      }
    }
  });

  it('holds Na constant when nothing goes in or out (closed system)', () => {
    const p: Patient = { ...preset('siad').patient, adh: 'siad' };
    // NPO, no water, no IV: only catabolic urea and insensible loss → Na must rise, never fall
    const res = run(p, { diet: 'npo', oralWaterLPerDay: 0 });
    expect(naAt(res, 48)).toBeGreaterThan(p.na0);
  });
});

describe('SIAD', () => {
  const p = preset('siad').patient;

  it('saline paradox: 1 L NS lowers Na when urine Na+K exceeds 154 (Uosm 600)', () => {
    const control = run({ ...p, siadUosm: 600 }, { oralWaterLPerDay: 1.5 }, 24);
    const ns = run({ ...p, siadUosm: 600 }, { oralWaterLPerDay: 1.5, ivFluid: 'ns', ivRateMlPerH: 125, ivHours: 8 }, 24);
    expect(naAt(ns, 24)).toBeLessThan(naAt(control, 24) - 0.5);
  });

  it('NS raises Na when urine is not very concentrated (Uosm 250)', () => {
    const control = run({ ...p, siadUosm: 250 }, { oralWaterLPerDay: 1.5 }, 24);
    const ns = run({ ...p, siadUosm: 250 }, { oralWaterLPerDay: 1.5, ivFluid: 'ns', ivRateMlPerH: 125, ivHours: 8 }, 24);
    expect(naAt(ns, 24)).toBeGreaterThan(naAt(control, 24));
  });

  it('fluid restriction to 0.8 L/day gives a modest rise (≈ 1–5 mmol/L/day)', () => {
    const res = run(p, { oralWaterLPerDay: 0.8 });
    const perDay = (naAt(res, 48) - p.na0) / 2;
    expect(perDay).toBeGreaterThan(1);
    expect(perDay).toBeLessThan(5);
  });

  it('urea adds solute and accelerates the rise', () => {
    const fr = run(p, { oralWaterLPerDay: 1 });
    const urea = run(p, { oralWaterLPerDay: 1, ureaGPerDay: 30 });
    expect(naAt(urea, 48)).toBeGreaterThan(naAt(fr, 48) + 2);
  });

  it('tolvaptan causes an aquaresis', () => {
    const res = run(p, { oralWaterLPerDay: 2, tolvaptan: true }, 24);
    expect(res.change24).toBeGreaterThan(4);
    expect(urineOsm(122, 0, p, { ...EMPTY_REGIMEN, tolvaptan: true })).toBeLessThanOrEqual(200);
  });

  it('drinking more than urine + insensible losses lowers Na', () => {
    const res = run(p, { oralWaterLPerDay: 3 });
    expect(naAt(res, 48)).toBeLessThan(p.na0);
  });
});

describe('Hypovolemic hyponatremia', () => {
  const pr = preset('hypovolemic');

  it('NS restores volume, ADH switches off and Na overcorrects (> 10 in 24 h)', () => {
    const res = simulate(pr.patient, pr.regimen);
    expect(res.change24).toBeGreaterThan(10);
    expect(res.events.some((e) => e.includes('dilute'))).toBe(true);
  });

  it('a desmopressin clamp prevents the water diuresis', () => {
    const res = simulate(pr.patient, { ...pr.regimen, desmopressin: true });
    expect(res.change24).toBeLessThan(10);
    expect(res.change24).toBeGreaterThan(2);
  });
});

describe('Low solute intake', () => {
  const p = preset('potomania').patient;
  it('low solute + high water intake drives Na down', () => {
    const res = run(p, { diet: 'low-solute', oralWaterLPerDay: 4 });
    expect(naAt(res, 48)).toBeLessThan(p.na0);
  });
  it('feeding a normal diet produces rapid autocorrection', () => {
    const res = run(p, { diet: 'normal', oralWaterLPerDay: 1 }, 24);
    expect(res.change24).toBeGreaterThan(10);
  });
  it('desmopressin clamp limits it', () => {
    const res = run(p, { diet: 'normal', oralWaterLPerDay: 1, desmopressin: true }, 24);
    expect(res.change24).toBeLessThan(8);
  });
});

describe('AVP deficiency / resistance', () => {
  it('AVP-D without thirst: Na rises; desmopressin halts it', () => {
    const pr = preset('avp-d-icu');
    const off = simulate(pr.patient, pr.regimen, 24);
    const on = simulate(pr.patient, { ...pr.regimen, desmopressin: true }, 24);
    expect(off.change24).toBeGreaterThan(5);
    expect(Math.abs(on.change24)).toBeLessThan(off.change24);
  });

  it('desmopressin + hypotonic fluid causes hyponatremia', () => {
    const pr = preset('avp-d-icu');
    const res = simulate(pr.patient, { ...pr.regimen, desmopressin: true, ivFluid: 'd5w', ivRateMlPerH: 150 }, 48);
    expect(res.change48).toBeLessThan(-8);
  });

  it('intact thirst keeps Na near normal in AVP-D', () => {
    const pr = preset('avp-d-icu');
    const res = simulate({ ...pr.patient, thirst: true }, { ...pr.regimen, ivFluid: 'none', oralWaterLPerDay: 2 }, 48);
    const last = res.points[res.points.length - 1].na;
    expect(last).toBeLessThan(150);
    expect(last).toBeGreaterThan(138);
  });

  it('AVP-R does not respond to desmopressin; thiazide + low solute reduce urine volume', () => {
    const pr = preset('avp-r');
    const base = simulate(pr.patient, pr.regimen, 24);
    const ddavp = simulate(pr.patient, { ...pr.regimen, desmopressin: true }, 24);
    const thz = simulate(pr.patient, { ...pr.regimen, thiazide: true, diet: 'low-solute' }, 24);
    const flow = (r: ReturnType<typeof simulate>) => r.points[24].urineMlH;
    expect(Math.abs(flow(ddavp) - flow(base))).toBeLessThan(1);
    expect(flow(thz)).toBeLessThan(flow(base) * 0.6);
  });
});

describe('Hypertonic saline', () => {
  it('two 150 mL 3% boluses raise Na in a 55 kg woman by ≈ 3–6 mmol/L immediately', () => {
    const pr = preset('hypovolemic');
    const res = simulate(pr.patient, { ...EMPTY_REGIMEN, diet: 'npo', oralWaterLPerDay: 0, hts3Boluses: 2, bolusMl: 150 }, 1);
    const rise = res.points[0].na - pr.patient.na0;
    expect(rise).toBeGreaterThan(3);
    expect(rise).toBeLessThan(6);
  });
});

describe('Salt wasting', () => {
  it('ongoing natriuresis with little replacement lowers Na; generous salt replacement raises it', () => {
    const pr = preset('csw');
    const low = simulate(pr.patient, pr.regimen);
    const high = simulate(pr.patient, { ...pr.regimen, ivFluid: 'hts3', ivRateMlPerH: 20, saltTabsGPerDay: 6 });
    expect(low.change48).toBeLessThan(0);
    expect(high.change48).toBeGreaterThan(3);
  });
});

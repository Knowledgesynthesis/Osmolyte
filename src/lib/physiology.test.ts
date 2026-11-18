import { describe, expect, it } from 'vitest';
import * as P from './physiology';

describe('osmolality', () => {
  it('calculated osm: Na 140, glucose 90, BUN 14 ≈ 290', () => {
    expect(P.calculatedOsm(140, 90, 14)).toBeCloseTo(290, 0);
  });
  it('effective osm ignores urea — a uremic hyponatremic patient is still hypotonic', () => {
    const calc = P.calculatedOsm(125, 90, 100);
    const eff = P.effectiveOsm(125, 90);
    expect(calc).toBeGreaterThan(275); // looks "isotonic"
    expect(P.classifyTonicity(eff)).toBe('hypotonic');
  });
  it('ethanol adds ≈ 1 mOsm per 3.7 mg/dL', () => {
    expect(P.calculatedOsm(140, 90, 14, 370) - P.calculatedOsm(140, 90, 14)).toBeCloseTo(100, 5);
  });
  it('osmolal gap', () => {
    expect(P.osmolalGap(320, 290)).toBe(30);
  });
});

describe('glucose-corrected Na', () => {
  it('Na 128 at glucose 600 → ≈ 140 (Hillier 2.4)', () => {
    expect(P.correctedNaForGlucose(128, 600)).toBeCloseTo(140, 0);
  });
  it('Katz factor 1.6 gives a smaller correction', () => {
    expect(P.correctedNaForGlucose(128, 600, 1.6)).toBeCloseTo(136, 0);
  });
  it('no correction at normal glucose', () => {
    expect(P.correctedNaForGlucose(130, 95)).toBe(130);
  });
});

describe('TBW', () => {
  it.each([
    ['male', 40, 0.6],
    ['female', 40, 0.5],
    ['male', 70, 0.5],
    ['female', 70, 0.45],
  ] as const)('%s age %i → %f', (sex, age, f) => {
    expect(P.tbwFraction(sex, age)).toBe(f);
  });
});

describe('Adrogué–Madias and mass balance', () => {
  it('1 L of 3% in TBW 42 L at Na 120: +9.0 mmol/L', () => {
    expect(P.adrogueMadiasPerLitre(120, 42, 513)).toBeCloseTo(9.14, 1);
  });
  it('mass-balance equals A–M for 1 L', () => {
    expect(P.naAfterInfusion(120, 42, 513, 1) - 120).toBeCloseTo(P.adrogueMadiasPerLitre(120, 42, 513), 10);
  });
  it('D5W 1 L in TBW 42 at Na 160: −3.7', () => {
    expect(P.adrogueMadiasPerLitre(160, 42, 0)).toBeCloseTo(-3.72, 1);
  });
  it('1 mL/kg of 3% raises Na ≈ 1 mmol/L (rule of thumb)', () => {
    const tbw = 0.5 * 70; // 70 kg woman
    const rise = P.naAfterInfusion(120, tbw, 513, 0.07) - 120;
    expect(rise).toBeGreaterThan(0.6);
    expect(rise).toBeLessThan(1.1);
  });
  it('litresToTarget inverts the mass balance', () => {
    const v = P.litresToTarget(120, 126, 42, 513)!;
    expect(P.naAfterInfusion(120, 42, 513, v)).toBeCloseTo(126, 6);
  });
  it('cannot reach a target above the infusate', () => {
    expect(P.litresToTarget(120, 160, 42, 154)).toBeNull();
  });
});

describe('water balance', () => {
  it('free water deficit: 70 kg man, Na 160 → ≈ 6 L (to 140)', () => {
    expect(P.freeWaterDeficit(160, 42)).toBeCloseTo(6, 1);
  });
  it('EFWC is negative when urine Na+K exceeds serum Na', () => {
    expect(P.electrolyteFreeWaterClearance(1, 120, 60, 125)).toBeLessThan(0);
    expect(P.electrolyteFreeWaterClearance(1, 30, 20, 125)).toBeGreaterThan(0);
  });
  it('osmolar free water clearance is negative for concentrated urine', () => {
    expect(P.freeWaterClearance(1, 600, 280)).toBeLessThan(0);
  });
  it('urine volume = solute / Uosm: 800 mOsm at 50 → 16 L; 180 mOsm at 60 → 3 L', () => {
    expect(P.maxUrineVolume(800, 50)).toBe(16);
    expect(P.maxUrineVolume(180, 60)).toBe(3);
  });
});

describe('Furst ratio', () => {
  it.each([
    [20, 20, 125, 'restrict-1L'],
    [60, 40, 125, 'restrict-500'],
    [120, 60, 125, 'restriction-will-fail'],
  ] as const)('UNa %i UK %i SNa %i → %s', (u, k, s, tier) => {
    expect(P.furstRatio(u, k, s).tier).toBe(tier);
  });
});

describe('fractional excretion', () => {
  it('FEurate: U 40 / P 3 with U Cr 100 / P Cr 0.8 → 10.7%', () => {
    expect(P.fractionalExcretion(40, 3, 100, 0.8)).toBeCloseTo(10.67, 1);
  });
  it('returns NaN rather than Infinity on bad input', () => {
    expect(P.fractionalExcretion(40, 0, 100, 0.8)).toBeNaN();
  });
});

describe('classification', () => {
  it('EU severity bands', () => {
    expect(P.hyponatremiaSeverity(133)).toBe('mild');
    expect(P.hyponatremiaSeverity(127)).toBe('moderate');
    expect(P.hyponatremiaSeverity(124)).toBe('profound');
  });
  it('polyuria > 50 mL/kg/day or > 3 L', () => {
    expect(P.isPolyuric(3.2, 70)).toBe(true);
    expect(P.isPolyuric(2.5, 45)).toBe(true);
    expect(P.isPolyuric(2, 70)).toBe(false);
  });
});

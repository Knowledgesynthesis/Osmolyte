/**
 * Sodium correction monitor.
 *
 * Correction limits are about the CUMULATIVE change in each 24-hour treatment period,
 * not an extrapolated hourly rate. A deliberate 5 mmol/L rise in the first hour for
 * severe symptoms is the goal (EU 2014), not a violation — provided the total stays
 * within the daily limit.
 *
 * Hyponatremia limits (chronic, i.e. ≥ 48 h or unknown duration):
 *  - EU 2014: ≤ 10 mmol/L in the first 24 h, ≤ 8 mmol/L in every 24 h thereafter.
 *  - US 2013: normal ODS risk ≤ 10–12 /24 h and ≤ 18 /48 h; high ODS risk ≤ 8 in any 24 h.
 *  - Goal (US 2013): 4–8 /24 h (4–6 if high risk). A 4–6 mmol/L rise relieves most symptoms.
 * Hypernatremia (chronic): conventional ≤ 10–12 mmol/L per 24 h; adult cohorts (2019, 2023)
 * found no harm from faster correction, so treat this as a ceiling, not a target.
 */

export type Direction = 'hypo' | 'hyper';

export interface NaEntry {
  /** hours since start of treatment */
  t: number;
  na: number;
}

export interface MonitorContext {
  direction: Direction;
  /** true = acute (< 48 h, documented) */
  acute: boolean;
  /** high ODS risk: Na ≤ 105, hypokalemia, alcohol use disorder, malnutrition, advanced liver disease */
  highRisk: boolean;
}

export interface Limits {
  goal: [number, number] | null;
  first24: number | null;
  subsequent24: number | null;
  over48: number | null;
  label: string;
}

export function limitsFor(ctx: MonitorContext): Limits {
  if (ctx.direction === 'hypo') {
    if (ctx.acute) {
      return {
        goal: [4, 6],
        first24: null,
        subsequent24: null,
        over48: null,
        label:
          'Documented acute (< 48 h) hyponatremia: brain cells have not yet adapted, so ODS is not described with rapid correction. Raise Na promptly; limits do not apply.',
      };
    }
    if (ctx.highRisk) {
      return {
        goal: [4, 6],
        first24: 8,
        subsequent24: 8,
        over48: 16,
        label: 'Chronic, HIGH ODS risk: goal 4–6, limit 8 mmol/L in any 24 h (US 2013).',
      };
    }
    return {
      goal: [4, 8],
      first24: 10,
      subsequent24: 8,
      over48: 18,
      label: 'Chronic, standard risk: goal 4–8; limit 10 in the first 24 h, 8 in each later 24 h (EU 2014), ≤ 18 over 48 h (US 2013).',
    };
  }
  if (ctx.acute) {
    return {
      goal: null,
      first24: null,
      subsequent24: null,
      over48: null,
      label: 'Acute (< 48 h) hypernatremia, e.g. salt loading or new AVP deficiency: can be corrected rapidly (≈ 1 mmol/L/h) toward normal.',
    };
  }
  return {
    goal: null,
    first24: 12,
    subsequent24: 12,
    over48: 24,
    label: 'Chronic hypernatremia: conventional ceiling 10–12 mmol/L per 24 h (pediatric-derived). Under-treatment is the commoner error in adults.',
  };
}

/** Linear interpolation of Na at time t from sorted entries (clamped at the ends). */
export function naAt(entries: NaEntry[], t: number): number {
  const s = [...entries].sort((a, b) => a.t - b.t);
  if (s.length === 0) return NaN;
  if (t <= s[0].t) return s[0].na;
  for (let i = 1; i < s.length; i++) {
    if (t <= s[i].t) {
      const a = s[i - 1];
      const b = s[i];
      return a.na + ((b.na - a.na) * (t - a.t)) / (b.t - a.t);
    }
  }
  return s[s.length - 1].na;
}

export type Status = 'ok' | 'below-goal' | 'on-track' | 'approaching' | 'exceeded' | 'wrong-direction' | 'no-limit';

export interface PeriodReport {
  index: number;
  start: number;
  end: number;
  startNa: number;
  /** latest Na observed inside the period */
  latestNa: number;
  latestT: number;
  /** signed change in the corrective direction at the latest value (positive = correcting) */
  change: number;
  /** largest corrective excursion reached inside the period */
  peak: number;
  limit: number | null;
  remaining: number | null;
  status: Status;
  complete: boolean;
}

export interface MonitorReport {
  limits: Limits;
  baselineNa: number;
  totalChange: number;
  periods: PeriodReport[];
  over48Change: number | null;
  over48Exceeded: boolean;
  worst: Status;
  messages: string[];
  actions: string[];
}

const severity: Record<Status, number> = {
  'no-limit': 0,
  ok: 0,
  'on-track': 0,
  'below-goal': 1,
  approaching: 2,
  'wrong-direction': 3,
  exceeded: 4,
};

export function analyseCorrection(entriesIn: NaEntry[], ctx: MonitorContext): MonitorReport {
  const entries = [...entriesIn].filter((e) => Number.isFinite(e.na) && Number.isFinite(e.t)).sort((a, b) => a.t - b.t);
  const limits = limitsFor(ctx);
  const sign = ctx.direction === 'hypo' ? 1 : -1;
  const messages: string[] = [];
  const actions: string[] = [];

  if (entries.length === 0) {
    return { limits, baselineNa: NaN, totalChange: 0, periods: [], over48Change: null, over48Exceeded: false, worst: 'ok', messages, actions };
  }

  const t0 = entries[0].t;
  const baselineNa = entries[0].na;
  const last = entries[entries.length - 1];
  const totalChange = sign * (last.na - baselineNa);
  const nPeriods = Math.max(1, Math.ceil((last.t - t0) / 24) || 1);
  const periods: PeriodReport[] = [];

  for (let i = 0; i < nPeriods; i++) {
    const start = t0 + i * 24;
    const end = start + 24;
    const startNa = naAt(entries, start);
    const inside = entries.filter((e) => e.t > start && e.t <= end);
    const latest = inside.length ? inside[inside.length - 1] : { t: start, na: startNa };
    // Peak excursion inside the period matters: a rise to +12 that falls back to +9 still exceeded.
    const peakChange = inside.reduce((m, e) => Math.max(m, sign * (e.na - startNa)), sign * (latest.na - startNa));
    const change = sign * (latest.na - startNa);
    const limit = i === 0 ? limits.first24 : limits.subsequent24;
    let status: Status;
    if (limit === null) status = change < 0 ? 'wrong-direction' : 'no-limit';
    else if (peakChange > limit) status = 'exceeded';
    else if (change < -0.5) status = 'wrong-direction';
    else if (peakChange >= limit - 2) status = 'approaching';
    else if (limits.goal && last.t - start >= 24 && change < limits.goal[0]) status = 'below-goal';
    else status = 'on-track';
    periods.push({
      index: i,
      start,
      end,
      startNa,
      latestNa: latest.na,
      latestT: latest.t,
      change,
      peak: peakChange,
      limit,
      remaining: limit === null ? null : limit - peakChange,
      status,
      complete: last.t >= end,
    });
  }

  let over48Change: number | null = null;
  let over48Exceeded = false;
  if (limits.over48 !== null) {
    const naAt48 = last.t - t0 >= 48 ? naAt(entries, t0 + 48) : last.na;
    over48Change = sign * (naAt48 - baselineNa);
    const peak48 = entries.filter((e) => e.t - t0 <= 48).reduce((m, e) => Math.max(m, sign * (e.na - baselineNa)), -Infinity);
    over48Exceeded = peak48 > limits.over48;
  }

  let worst: Status = periods.reduce<Status>((w, p) => (severity[p.status] > severity[w] ? p.status : w), periods[periods.length - 1].status);
  if (over48Exceeded && severity.exceeded > severity[worst]) worst = 'exceeded';

  const current = periods[periods.length - 1];
  const hoursLeft = Math.max(0, current.end - last.t);

  if (ctx.direction === 'hypo') {
    if (worst === 'exceeded') {
      messages.push('Overcorrection: the cumulative rise has passed the limit for this 24-hour period.');
      actions.push('Stop all sodium-raising therapy (hypertonic/isotonic saline, salt, urea, vaptan).');
      actions.push('Re-lower: electrolyte-free water (e.g. D5W 10 mL/kg over 1 h — EU 2014; or ~3 mL/kg/h — US 2013), recheck Na hourly.');
      actions.push('Give desmopressin 2 µg IV/SC to stop the water diuresis (repeat no more often than every 6–8 h).');
      actions.push('Target: bring Na back below the limit; most experts re-lower even after the fact in high-risk patients.');
    } else if (worst === 'approaching') {
      messages.push(
        hoursLeft > 0
          ? `Close to the limit: ${current.remaining?.toFixed(1)} mmol/L of allowance left for the next ${hoursLeft.toFixed(0)} h.`
          : `Period complete at +${current.peak.toFixed(1)} — at the edge of the limit. The next 24 h allow ${limits.subsequent24 ?? '—'} mmol/L.`,
      );
      actions.push('Stop active correction; measure urine output hourly — a sudden dilute diuresis (> 100 mL/h) predicts overcorrection.');
      actions.push('Consider a desmopressin "clamp" (1–2 µg every 6–8 h) to halt aquaresis, replacing urine losses as needed.');
    } else if (worst === 'wrong-direction') {
      messages.push('Sodium is falling: the current regimen is adding free water or the cause is ongoing.');
      actions.push('Review all fluids (including drug diluents), urine Na+K vs serum Na, and intake.');
    } else if (current.status === 'on-track' || current.status === 'no-limit') {
      if (current.limit !== null)
        messages.push(
          hoursLeft > 0
            ? `On track: +${current.change.toFixed(1)} mmol/L this period; ${current.remaining?.toFixed(1)} mmol/L allowance left for the next ${hoursLeft.toFixed(0)} h.`
            : `Period complete: +${current.change.toFixed(1)} mmol/L. The next 24 h allow ${limits.subsequent24 ?? '—'} mmol/L.`,
        );
      else messages.push(`Change so far: ${current.change >= 0 ? '+' : ''}${current.change.toFixed(1)} mmol/L.`);
    } else if (current.status === 'below-goal') {
      messages.push('Below the minimum goal for the period — correction may be inadequate (slow correction is also associated with worse outcomes in observational data).');
    }
  } else {
    if (worst === 'exceeded') {
      messages.push('Faster than the conventional ceiling. In adults this is not clearly harmful (Chauhan 2019; Feigin 2023), but slow down and watch for new neurological signs, especially in infants and in brain injury with raised ICP.');
    } else if (worst === 'wrong-direction') {
      messages.push('Sodium is rising: free-water losses (urine, insensible) exceed replacement. Recalculate deficit + ongoing losses.');
    } else {
      messages.push(`Lowered by ${Math.max(0, current.change).toFixed(1)} mmol/L this period.`);
    }
  }

  return { limits, baselineNa, totalChange, periods, over48Change, over48Exceeded, worst, messages, actions };
}

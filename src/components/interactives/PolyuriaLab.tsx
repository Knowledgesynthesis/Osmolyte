import { useMemo, useState } from 'react';
import { clsx } from 'clsx';
import {
  DX_LABEL,
  POLYURIA_CASES,
  PolyuriaDx,
  deprivationCourse,
  deprivationStopCheck,
  desmopressinResponse,
  interpretCopeptin,
  interpretDeprivation,
} from '@/lib/polyuria';
import { Badge, Button, Stat } from '@/components/ui/primitives';
import { LineChart } from '@/components/lab/LineChart';
import { Widget } from './Calculators';

type Test = 'none' | 'wdt' | 'copeptin';

export function PolyuriaLab() {
  const [idx, setIdx] = useState(0);
  const [test, setTest] = useState<Test>('none');
  const [hours, setHours] = useState(0);
  const [desmo, setDesmo] = useState(false);
  const [copeptin, setCopeptin] = useState<{ baseline: boolean; hs: boolean; arg: boolean }>({ baseline: false, hs: false, arg: false });
  const [guess, setGuess] = useState<PolyuriaDx | null>(null);
  const c = POLYURIA_CASES[idx];
  const pts = useMemo(() => deprivationCourse(c, hours), [c, hours]);
  const last = pts[pts.length - 1];
  const stop = deprivationStopCheck(pts);
  const post = desmo ? desmopressinResponse(c, last.uOsm) : null;
  const wdtInterp = post !== null ? interpretDeprivation(last.uOsm, post) : null;

  const reset = (i: number) => {
    setIdx(i);
    setTest('none');
    setHours(0);
    setDesmo(false);
    setCopeptin({ baseline: false, hs: false, arg: false });
    setGuess(null);
  };

  return (
    <Widget title="Polyuria test bench" subtitle="Pick a patient, run a test, commit to a diagnosis">
      <div className="mb-3 flex flex-wrap items-center gap-1.5">
        {POLYURIA_CASES.map((p, i) => (
          <button
            key={p.id}
            aria-pressed={i === idx}
            onClick={() => reset(i)}
            className={clsx('rounded-full border px-2.5 py-1 text-xs', i === idx ? 'border-blue-500 bg-blue-50 font-semibold dark:bg-blue-950' : 'border-slate-300 hover:bg-slate-100 dark:border-slate-700 dark:hover:bg-slate-800')}
          >
            Patient {String.fromCharCode(65 + i)}
          </button>
        ))}
      </div>
      <p className="mb-3 text-sm text-slate-800 dark:text-slate-200">{c.vignette}</p>
      <div className="mb-4 grid grid-cols-2 gap-2 sm:grid-cols-4">
        <Stat label="24-h urine" value={`${c.urineLPerDay} L`} sub={`${Math.round((c.urineLPerDay * 1000) / c.weightKg)} mL/kg`} />
        <Stat label="Urine Osm" value={c.baseline.uOsm} sub="hypotonic < 300" />
        <Stat label="Serum Na" value={c.baseline.na} />
        <Stat label="Glucose / Ca" value="normal" />
      </div>

      <div className="mb-4 flex flex-wrap gap-2">
        <Button variant={test === 'wdt' ? 'primary' : 'secondary'} size="sm" onClick={() => setTest('wdt')}>
          Water deprivation test
        </Button>
        <Button variant={test === 'copeptin' ? 'primary' : 'secondary'} size="sm" onClick={() => setTest('copeptin')}>
          Copeptin tests
        </Button>
      </div>

      {test === 'wdt' && (
        <div className="space-y-3">
          <div className="flex flex-wrap items-center gap-2">
            <Button size="sm" onClick={() => setHours((h) => Math.min(18, h + 1))} disabled={desmo || hours >= 18}>
              Continue deprivation +1 h
            </Button>
            <Button size="sm" variant="secondary" onClick={() => setDesmo(true)} disabled={desmo || hours < 2}>
              Stop & give desmopressin
            </Button>
            <span className="num text-sm text-slate-600 dark:text-slate-400">t = {hours} h</span>
          </div>
          <div className="grid grid-cols-3 gap-2">
            <Stat label="Urine Osm" value={last.uOsm} tone={last.uOsm > 800 ? undefined : undefined} />
            <Stat label="Serum Na" value={last.na} tone={last.na > 147 ? 'bad' : last.na > 145 ? 'warn' : undefined} />
            <Stat label="Weight loss" value={`${last.weightLossPct}%`} tone={last.weightLossPct >= 3 ? 'bad' : undefined} />
          </div>
          {stop.stop && !desmo && (
            <p className="rounded-lg bg-amber-50 p-2.5 text-sm text-amber-900 dark:bg-amber-950/40 dark:text-amber-100" role="alert">
              Stop criterion reached: {stop.reasons.join('; ')}. Give desmopressin now.
            </p>
          )}
          {hours > 0 && (
            <LineChart
              ariaLabel="Urine osmolality during water deprivation"
              series={[{ id: 'u', label: 'Urine Osm', color: 'var(--viz-series-1)', points: pts.map((p) => ({ x: p.t, y: p.uOsm })) }]}
              refLines={[
                { y: 300, label: '300', tone: 'neutral' },
                { y: 800, label: '800', tone: 'neutral' },
              ]}
              xLabel="Hours of deprivation"
              yLabel="mOsm/kg"
              yUnit="mOsm/kg"
              height={190}
              xDomain={[0, Math.max(6, hours)]}
              yDomain={[0, 1000]}
              formatY={(v) => v.toFixed(0)}
            />
          )}
          {post !== null && wdtInterp && (
            <div className="rounded-xl border border-slate-200 p-3 text-sm dark:border-slate-800">
              <p>
                1 h after desmopressin: Uosm <span className="num font-semibold">{post}</span> (rise <span className="num font-semibold">{Math.round(((post - last.uOsm) / last.uOsm) * 100)}%</span>)
              </p>
              <p className="mt-1">
                <Badge tone={wdtInterp.confidence === 'clear' ? 'emerald' : 'amber'}>{wdtInterp.verdict}</Badge>
              </p>
              <p className="mt-1 text-slate-600 dark:text-slate-400">{wdtInterp.explanation}</p>
            </div>
          )}
        </div>
      )}

      {test === 'copeptin' && (
        <div className="space-y-2">
          {(
            [
              ['baseline', 'Unstimulated copeptin', c.baseline.copeptin, 'baseline'],
              ['hs', 'Hypertonic saline–stimulated (Na ≥ 150)', c.hsCopeptin, 'hypertonic'],
              ['arg', 'Arginine-stimulated (60 min)', c.arginineCopeptin, 'arginine'],
            ] as const
          ).map(([key, label, val, kind]) => {
            const shown = copeptin[key];
            const res = interpretCopeptin(kind, val);
            return (
              <div key={key} className="rounded-xl border border-slate-200 p-3 text-sm dark:border-slate-800">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="font-medium">{label}</span>
                  {shown ? (
                    <span className="num font-semibold">{val} pmol/L</span>
                  ) : (
                    <Button size="sm" variant="secondary" onClick={() => setCopeptin((s) => ({ ...s, [key]: true }))}>
                      Order
                    </Button>
                  )}
                </div>
                {shown && (
                  <p className="mt-1 text-slate-600 dark:text-slate-400">
                    <Badge tone={res.confidence === 'clear' ? 'emerald' : 'amber'}>{res.verdict}</Badge> {res.explanation}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      )}

      {test !== 'none' && (
        <div className="mt-4 border-t border-slate-200 pt-3 dark:border-slate-800">
          <p className="mb-2 text-sm font-semibold">Your diagnosis</p>
          <div className="flex flex-wrap gap-1.5">
            {(Object.keys(DX_LABEL) as PolyuriaDx[]).map((d) => (
              <button
                key={d}
                onClick={() => setGuess(d)}
                className={clsx(
                  'rounded-lg border px-2.5 py-1.5 text-xs',
                  guess === d
                    ? d === c.dx
                      ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950'
                      : 'border-rose-500 bg-rose-50 dark:bg-rose-950'
                    : 'border-slate-300 hover:bg-slate-100 dark:border-slate-700 dark:hover:bg-slate-800',
                )}
              >
                {DX_LABEL[d]}
              </button>
            ))}
          </div>
          {guess && (
            <p className="mt-2 text-sm" role="status">
              {guess === c.dx ? '✓ Correct. ' : `✕ Not quite — this patient has ${DX_LABEL[c.dx]}. `}
              {c.dx === 'avp-d-partial' && 'Partial AVP-D lands in the deprivation grey zone; hypertonic-saline copeptin settles it (arginine can miss it).'}
              {c.dx === 'primary-polydipsia' && 'Medullary washout keeps urine below 800 even with intact AVP; copeptin > 4.9 at Na ≥ 150 proves secretion is intact.'}
              {c.dx === 'avp-d-complete' && 'No concentration with deprivation, brisk response to desmopressin, copeptin undetectable under osmotic stress.'}
              {c.dx === 'avp-r' && 'Very high baseline copeptin with dilute urine: AVP is present but ineffective — no stimulation test needed.'}
            </p>
          )}
        </div>
      )}
    </Widget>
  );
}

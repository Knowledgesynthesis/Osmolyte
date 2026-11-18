import { useMemo, useState } from 'react';
import { analyseCorrection, Direction, NaEntry } from '@/lib/sodiumMonitor';
import { Badge, Button, Check, Segmented } from '@/components/ui/primitives';
import { LineChart, RefLine } from '@/components/lab/LineChart';
import { Widget } from './Calculators';

const EXAMPLES: Record<string, { label: string; dir: Direction; highRisk: boolean; acute: boolean; entries: NaEntry[] }> = {
  bolus: { label: 'Bolus then hold (correct)', dir: 'hypo', highRisk: false, acute: false, entries: [{ t: 0, na: 116 }, { t: 1, na: 121 }, { t: 6, na: 121 }, { t: 12, na: 122 }, { t: 22, na: 122 }] },
  overshoot: { label: 'Water diuresis overshoot', dir: 'hypo', highRisk: true, acute: false, entries: [{ t: 0, na: 112 }, { t: 6, na: 115 }, { t: 12, na: 118 }, { t: 18, na: 122 }] },
  day2: { label: 'Day-2 overshoot', dir: 'hypo', highRisk: false, acute: false, entries: [{ t: 0, na: 110 }, { t: 24, na: 118 }, { t: 36, na: 124 }, { t: 44, na: 128 }] },
  hyper: { label: 'Hypernatremia', dir: 'hyper', highRisk: false, acute: false, entries: [{ t: 0, na: 164 }, { t: 8, na: 160 }, { t: 16, na: 156 }, { t: 24, na: 153 }] },
};

export function CorrectionMonitor() {
  const [dir, setDir] = useState<Direction>('hypo');
  const [highRisk, setHighRisk] = useState(false);
  const [acute, setAcute] = useState(false);
  const [entries, setEntries] = useState<NaEntry[]>(EXAMPLES.bolus.entries);

  const clean = entries.filter((e) => Number.isFinite(e.t) && Number.isFinite(e.na));
  const report = useMemo(() => analyseCorrection(clean, { direction: dir, acute, highRisk }), [clean, dir, acute, highRisk]);

  const update = (i: number, k: keyof NaEntry, v: number) => setEntries((es) => es.map((e, j) => (j === i ? { ...e, [k]: v } : e)));
  const load = (key: string) => {
    const ex = EXAMPLES[key];
    setDir(ex.dir);
    setHighRisk(ex.highRisk);
    setAcute(ex.acute);
    setEntries(ex.entries);
  };

  const sign = dir === 'hypo' ? 1 : -1;
  const refs: RefLine[] = report.periods
    .filter((p) => p.limit !== null)
    .map((p) => ({ y: p.startNa + sign * (p.limit as number), x0: p.start, x1: p.end, label: `limit ${sign > 0 ? '+' : '−'}${p.limit}`, tone: dir === 'hypo' ? 'critical' : 'neutral' }));
  const maxT = Math.max(24, ...clean.map((e) => e.t));
  const statusTone = report.worst === 'exceeded' ? 'rose' : report.worst === 'approaching' ? 'amber' : report.worst === 'wrong-direction' ? 'violet' : 'emerald';

  return (
    <Widget title="Sodium flowsheet monitor" subtitle="Checks cumulative change in each 24-h treatment period — enter your own values">
      <div className="mb-3 flex flex-wrap gap-1.5">
        {Object.entries(EXAMPLES).map(([k, ex]) => (
          <button key={k} className="rounded-full border border-slate-300 px-2.5 py-1 text-xs hover:bg-slate-100 dark:border-slate-700 dark:hover:bg-slate-800" onClick={() => load(k)}>
            {ex.label}
          </button>
        ))}
      </div>
      <div className="grid gap-4 lg:grid-cols-[minmax(240px,300px)_1fr]">
        <div className="space-y-3">
          <Segmented label="Disorder" size="sm" value={dir} onChange={setDir} options={[{ value: 'hypo', label: 'Hyponatremia' }, { value: 'hyper', label: 'Hypernatremia' }]} />
          <div className="space-y-1.5">
            <Check label="Documented acute (< 48 h)" checked={acute} onChange={setAcute} />
            {dir === 'hypo' && <Check label="High ODS risk" checked={highRisk} onChange={setHighRisk} hint="Na ≤ 105, low K, alcohol, malnutrition, liver disease" />}
          </div>
          <table className="w-full text-sm">
            <thead>
              <tr className="text-xs text-slate-500">
                <th className="text-left font-medium">Hour</th>
                <th className="text-left font-medium">Na</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {entries.map((e, i) => (
                <tr key={i}>
                  <td className="pr-2 pb-1">
                    <input aria-label={`Hour of reading ${i + 1}`} type="number" className="input" value={Number.isFinite(e.t) ? e.t : ''} onChange={(ev) => update(i, 't', ev.target.value === '' ? NaN : Number(ev.target.value))} />
                  </td>
                  <td className="pr-2 pb-1">
                    <input aria-label={`Sodium of reading ${i + 1}`} type="number" className="input" value={Number.isFinite(e.na) ? e.na : ''} onChange={(ev) => update(i, 'na', ev.target.value === '' ? NaN : Number(ev.target.value))} />
                  </td>
                  <td className="pb-1">
                    <button aria-label={`Remove reading ${i + 1}`} className="rounded px-1.5 text-slate-500 hover:text-rose-600" onClick={() => setEntries((es) => es.filter((_, j) => j !== i))}>
                      ✕
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <Button
            size="sm"
            variant="secondary"
            onClick={() => {
              const last = entries[entries.length - 1];
              setEntries((es) => [...es, { t: (last?.t ?? 0) + 4, na: last?.na ?? 120 }]);
            }}
          >
            + Add reading
          </Button>
        </div>
        <div className="min-w-0 space-y-3" aria-live="polite">
          <div className="flex flex-wrap items-center gap-2">
            <Badge tone={statusTone}>
              {report.worst === 'exceeded' ? '✕ Limit exceeded' : report.worst === 'approaching' ? '! Approaching limit' : report.worst === 'wrong-direction' ? '↘ Wrong direction' : report.worst === 'below-goal' ? 'Below goal' : '✓ On track'}
            </Badge>
            <span className="text-xs text-slate-500 dark:text-slate-400">{report.limits.label}</span>
          </div>
          {clean.length > 0 && (
            <LineChart
              ariaLabel="Sodium readings over time with 24-hour limits"
              series={[{ id: 'na', label: 'Na', color: 'var(--viz-series-1)', points: clean.slice().sort((a, b) => a.t - b.t).map((e) => ({ x: e.t, y: e.na })) }]}
              refLines={refs}
              xLabel="Hours from start"
              yLabel="Na (mmol/L)"
              yUnit="mmol/L"
              height={210}
              xDomain={[0, Math.ceil(maxT / 6) * 6]}
              xTicks={Array.from({ length: Math.ceil(maxT / 6) + 1 }, (_, i) => i * 6)}
            />
          )}
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="text-xs text-slate-500">
                <tr>
                  <th className="text-left font-medium">Period</th>
                  <th className="text-right font-medium">Start Na</th>
                  <th className="text-right font-medium">Change</th>
                  <th className="text-right font-medium">Peak</th>
                  <th className="text-right font-medium">Limit</th>
                  <th className="text-right font-medium">Left</th>
                </tr>
              </thead>
              <tbody className="num">
                {report.periods.map((p) => (
                  <tr key={p.index} className="border-t border-slate-100 dark:border-slate-800">
                    <td className="py-1 text-left font-sans">
                      {p.start}–{p.end} h
                    </td>
                    <td className="text-right">{p.startNa.toFixed(1)}</td>
                    <td className="text-right">
                      {p.change >= 0 ? '+' : ''}
                      {p.change.toFixed(1)}
                    </td>
                    <td className="text-right">{p.peak.toFixed(1)}</td>
                    <td className="text-right">{p.limit ?? '—'}</td>
                    <td className={p.remaining !== null && p.remaining < 0 ? 'text-right text-rose-600' : 'text-right'}>{p.remaining === null ? '—' : p.remaining.toFixed(1)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {report.over48Change !== null && (
            <p className="text-xs text-slate-500">
              48-h cumulative: {report.over48Change >= 0 ? '+' : ''}
              {report.over48Change.toFixed(1)} (limit {report.limits.over48}){report.over48Exceeded ? ' — exceeded' : ''}
            </p>
          )}
          {report.messages.map((m) => (
            <p key={m} className="text-sm text-slate-800 dark:text-slate-200">
              {m}
            </p>
          ))}
          {report.actions.length > 0 && (
            <ul className="space-y-1 rounded-lg bg-slate-50 p-3 text-sm text-slate-700 dark:bg-slate-950 dark:text-slate-300">
              {report.actions.map((a) => (
                <li key={a}>→ {a}</li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </Widget>
  );
}

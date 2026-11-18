import { useMemo, useState } from 'react';
import { clsx } from 'clsx';
import { DEFAULT_HYPO_INPUTS, Ecf, HypoInputs, navigateHyponatremia, Onset, Symptoms } from '@/lib/hyponatremiaNavigator';
import { Callout, Check, NumberField, Segmented } from '@/components/ui/primitives';
import { Widget } from './Calculators';

const EXAMPLES: Record<string, { label: string; x: Partial<HypoInputs> }> = {
  siad: { label: 'SIAD', x: {} },
  diarrhea: { label: 'Diarrhea', x: { na: 127, measuredOsm: 262, bun: 28, uOsm: 480, uNa: 12, ecf: 'normal' } },
  potomania: { label: 'Beer potomania', x: { na: 109, measuredOsm: 228, bun: 4, uOsm: 72, uNa: 9, alcoholOrMalnutrition: true, hypokalemia: true, symptoms: 'moderate' } },
  thiazide: { label: 'Thiazide', x: { na: 118, measuredOsm: 246, uOsm: 380, uNa: 64, diuretics: true, hypokalemia: true } },
  hyperglycemia: { label: 'Hyperglycemia', x: { na: 126, glucose: 750, bun: 30, measuredOsm: 305, uOsm: 600, uNa: 40 } },
  sah: { label: 'Salt wasting after SAH', x: { na: 128, measuredOsm: 264, uOsm: 560, uNa: 140, ecf: 'reduced', cnsInsult: true } },
  seizure: { label: 'Seizure', x: { na: 114, measuredOsm: 240, symptoms: 'severe' } },
  uremia: { label: 'Uremia', x: { na: 125, glucose: 100, bun: 110, measuredOsm: 292, uOsm: 320, uNa: 45, kidneyDisease: true } },
};

const statusIcon = { pass: '✓', stop: '■', alert: '!', missing: '?' } as const;

export function HypoNavigator() {
  const [x, setX] = useState<HypoInputs>(DEFAULT_HYPO_INPUTS);
  const r = useMemo(() => navigateHyponatremia(x), [x]);
  const set = <K extends keyof HypoInputs>(k: K, v: HypoInputs[K]) => setX((p) => ({ ...p, [k]: v }));
  const num = (k: 'na' | 'glucose' | 'bun') => (v: number) => set(k, v);
  const opt = (k: 'measuredOsm' | 'uOsm' | 'uNa') => (v: number) => set(k, Number.isFinite(v) ? v : null);

  return (
    <Widget title="Hyponatremia navigator" subtitle="European guideline order: symptoms → tonicity → urine Osm → urine Na → diuretics → volume">
      <div className="mb-3 flex flex-wrap gap-1.5">
        {Object.entries(EXAMPLES).map(([k, ex]) => (
          <button key={k} className="rounded-full border border-slate-300 px-2.5 py-1 text-xs hover:bg-slate-100 dark:border-slate-700 dark:hover:bg-slate-800" onClick={() => setX({ ...DEFAULT_HYPO_INPUTS, ...ex.x })}>
            {ex.label}
          </button>
        ))}
      </div>
      <div className="grid gap-5 lg:grid-cols-[minmax(260px,320px)_1fr]">
        <div className="space-y-3">
          <div className="grid grid-cols-3 gap-2">
            <NumberField label="Na" value={x.na} onChange={num('na')} />
            <NumberField label="Glucose" unit="mg/dL" value={x.glucose} onChange={num('glucose')} />
            <NumberField label="BUN" unit="mg/dL" value={x.bun} onChange={num('bun')} />
          </div>
          <div className="grid grid-cols-3 gap-2">
            <NumberField label="Serum Osm" value={x.measuredOsm ?? NaN} onChange={opt('measuredOsm')} hint="blank = not done" />
            <NumberField label="Urine Osm" value={x.uOsm ?? NaN} onChange={opt('uOsm')} />
            <NumberField label="Urine Na" value={x.uNa ?? NaN} onChange={opt('uNa')} />
          </div>
          <Segmented<Symptoms>
            label="Symptoms"
            size="sm"
            value={x.symptoms}
            onChange={(v) => set('symptoms', v)}
            options={[
              { value: 'none', label: 'None' },
              { value: 'mild', label: 'Mild' },
              { value: 'moderate', label: 'Mod. severe' },
              { value: 'severe', label: 'Severe' },
            ]}
          />
          <Segmented<Onset>
            label="Onset"
            size="sm"
            value={x.onset}
            onChange={(v) => set('onset', v)}
            options={[
              { value: 'acute', label: '< 48 h' },
              { value: 'chronic', label: '≥ 48 h' },
              { value: 'unknown', label: 'Unknown' },
            ]}
          />
          <Segmented<Ecf>
            label="Clinical ECF volume"
            size="sm"
            value={x.ecf}
            onChange={(v) => set('ecf', v)}
            options={[
              { value: 'reduced', label: 'Reduced' },
              { value: 'normal', label: 'Normal' },
              { value: 'expanded', label: 'Edema' },
              { value: 'unsure', label: 'Unsure' },
            ]}
          />
          <div className="grid grid-cols-1 gap-1.5 sm:grid-cols-2">
            <Check label="Diuretic use" checked={x.diuretics} onChange={(v) => set('diuretics', v)} />
            <Check label="Kidney disease" checked={x.kidneyDisease} onChange={(v) => set('kidneyDisease', v)} />
            <Check label="SAH / neurosurgery / TBI" checked={x.cnsInsult} onChange={(v) => set('cnsInsult', v)} />
            <Check label="Hypokalemia" checked={x.hypokalemia} onChange={(v) => set('hypokalemia', v)} />
            <Check label="Alcohol / malnutrition" checked={x.alcoholOrMalnutrition} onChange={(v) => set('alcoholOrMalnutrition', v)} />
            <Check label="Advanced liver disease" checked={x.liverDisease} onChange={(v) => set('liverDisease', v)} />
          </div>
        </div>

        <div className="min-w-0 space-y-3" aria-live="polite">
          {r.emergency && (
            <div className={clsx('rounded-xl border-2 p-3 text-sm', r.emergency.level === 'severe' ? 'border-rose-400 bg-rose-50 dark:border-rose-700 dark:bg-rose-950/40' : 'border-amber-400 bg-amber-50 dark:border-amber-700 dark:bg-amber-950/40')}>
              <p className="font-semibold">{r.emergency.level === 'severe' ? 'Treat now — before the diagnosis' : 'Moderately severe symptoms'}</p>
              <p className="mt-0.5">{r.emergency.action}</p>
            </div>
          )}
          <ol className="space-y-2">
            {r.steps.map((s, i) => (
              <li key={s.id} className="flex gap-3">
                <span
                  aria-label={s.status}
                  className={clsx(
                    'mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-bold',
                    s.status === 'pass' && 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-200',
                    s.status === 'stop' && 'bg-blue-600 text-white',
                    s.status === 'alert' && 'bg-amber-100 text-amber-900 dark:bg-amber-950 dark:text-amber-200',
                    s.status === 'missing' && 'bg-slate-200 text-slate-700 dark:bg-slate-800 dark:text-slate-300',
                  )}
                >
                  {statusIcon[s.status]}
                </span>
                <div className="min-w-0">
                  <p className="text-sm font-semibold">
                    {i + 1}. {s.question}
                  </p>
                  <p className="text-sm text-slate-800 dark:text-slate-200">{s.finding}</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">{s.why}</p>
                </div>
              </li>
            ))}
          </ol>
          <div className="rounded-xl bg-slate-900 p-3 text-sm text-white dark:bg-slate-100 dark:text-slate-900">
            <p className="text-[11px] font-semibold tracking-wide uppercase opacity-70">Conclusion</p>
            <p className="font-medium">{r.conclusion}</p>
          </div>
          {r.differential.length > 0 && (
            <div>
              <p className="label mb-1">Consider</p>
              <ul className="list-disc space-y-0.5 pl-5 text-sm text-slate-700 dark:text-slate-300">
                {r.differential.map((d) => (
                  <li key={d}>{d}</li>
                ))}
              </ul>
            </div>
          )}
          {r.nextTests.length > 0 && (
            <div>
              <p className="label mb-1">Next</p>
              <ul className="list-disc space-y-0.5 pl-5 text-sm text-slate-700 dark:text-slate-300">
                {r.nextTests.map((d) => (
                  <li key={d}>{d}</li>
                ))}
              </ul>
            </div>
          )}
          {r.flips.length > 0 && (
            <Callout tone="pearl" title="What would change my mind">
              <ul className="space-y-1">
                {r.flips.map((f) => (
                  <li key={f}>{f}</li>
                ))}
              </ul>
            </Callout>
          )}
          {r.odsRisk.high && (
            <Callout tone="pitfall" title="High ODS risk">
              {r.odsRisk.reasons.join(', ')} — limit the rise to 8 mmol/L in any 24 h; consider a desmopressin clamp.
            </Callout>
          )}
        </div>
      </div>
    </Widget>
  );
}

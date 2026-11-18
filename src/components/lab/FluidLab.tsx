import { useMemo, useState } from 'react';
import { clsx } from 'clsx';
import { AdhMode, DIETS, Diet, Patient, PRESETS, Regimen, simulate } from '@/lib/fluidLab';
import { FLUID_LIST, FluidId } from '@/lib/fluids';
import { analyseCorrection } from '@/lib/sodiumMonitor';
import { totalBodyWater } from '@/lib/physiology';
import { Badge, Button, Card, Check, NumberField, Segmented, SliderField, Stat } from '@/components/ui/primitives';
import { LineChart, RefLine } from './LineChart';

const sameRegimen = (a: Regimen, b: Regimen) => JSON.stringify(a) === JSON.stringify(b);

export function FluidLab({ initialPreset }: { initialPreset?: string }) {
  const startIdx = Math.max(0, PRESETS.findIndex((p) => p.patient.id === initialPreset));
  const [presetIdx, setPresetIdx] = useState(startIdx);
  const preset = PRESETS[presetIdx];
  const [patient, setPatient] = useState<Patient>(preset.patient);
  const [regimen, setRegimen] = useState<Regimen>(preset.regimen);
  const [highRisk, setHighRisk] = useState(preset.patient.id === 'hypovolemic' || preset.patient.id === 'potomania');
  const [showTable, setShowTable] = useState(false);

  const load = (i: number) => {
    setPresetIdx(i);
    setPatient(PRESETS[i].patient);
    setRegimen(PRESETS[i].regimen);
    setHighRisk(PRESETS[i].patient.id === 'hypovolemic' || PRESETS[i].patient.id === 'potomania');
  };

  const valid = Number.isFinite(patient.na0) && patient.na0 > 90 && patient.na0 < 190 && patient.weightKg > 20 && patient.weightKg < 250 && Number.isFinite(patient.age);
  const sim = useMemo(() => (valid ? simulate(patient, regimen) : null), [patient, regimen, valid]);
  const baseline = useMemo(() => (valid && !sameRegimen(regimen, preset.regimen) ? simulate(patient, preset.regimen) : null), [patient, regimen, preset, valid]);

  const direction = patient.na0 < 135 ? 'hypo' : patient.na0 > 145 ? 'hyper' : null;
  const hypo = direction === 'hypo';
  const report = useMemo(
    () => (sim && direction ? analyseCorrection(sim.points.map((p) => ({ t: p.t, na: p.na })), { direction, acute: false, highRisk }) : null),
    [sim, direction, highRisk],
  );
  const outOfRange = sim ? sim.points.some((p) => p.na < 135 || p.na > 145) : false;

  const setP = <K extends keyof Patient>(k: K, v: Patient[K]) => setPatient((p) => ({ ...p, [k]: v }));
  const setR = <K extends keyof Regimen>(k: K, v: Regimen[K]) => setRegimen((r) => ({ ...r, [k]: v }));

  const refLines: RefLine[] = [];
  if (sim && report) {
    const l = report.limits;
    if (hypo && l.first24 !== null) {
      refLines.push({ y: patient.na0 + l.first24, x0: 0, x1: 24, label: `24-h limit +${l.first24}`, tone: 'critical' });
      if (l.over48 !== null) refLines.push({ y: patient.na0 + l.over48, x0: 24, x1: 48, label: `48-h limit +${l.over48}`, tone: 'critical' });
    } else if (!hypo && l.first24 !== null) {
      refLines.push({ y: patient.na0 - l.first24, x0: 0, x1: 24, label: `conventional −${l.first24}/24 h`, tone: 'neutral' });
    }
  }

  const peakUrine = sim ? Math.max(...sim.points.map((p) => p.urineMlH)) : 0;
  const worst = report?.worst ?? (outOfRange ? 'wrong-direction' : 'ok');
  const tbw = totalBodyWater(patient.weightKg, patient.sex, patient.age);

  return (
    <div className="space-y-6">
      <header>
        <p className="label">Simulator</p>
        <h1 className="text-3xl font-bold tracking-tight">Fluid Lab</h1>
        <p className="mt-1 max-w-3xl text-slate-600 dark:text-slate-400">
          An hour-by-hour mass-balance model: serum Na = (Na + K) ÷ water, and urine volume = solute ÷ urine osmolality. Change the patient or the treatment and watch 48 hours unfold — including the water diuresis that causes most overcorrection.
        </p>
      </header>

      <nav aria-label="Scenarios" className="scrollbar-none -mx-1 flex gap-2 overflow-x-auto px-1 pb-1">
        {PRESETS.map((p, i) => (
          <button
            key={p.patient.id}
            onClick={() => load(i)}
            aria-pressed={i === presetIdx}
            className={clsx(
              'min-w-52 shrink-0 rounded-xl border px-3 py-2 text-left transition-colors',
              i === presetIdx ? 'border-blue-500 bg-blue-50 dark:border-blue-400 dark:bg-blue-950/50' : 'border-slate-200 bg-white hover:border-slate-300 dark:border-slate-800 dark:bg-slate-900 dark:hover:border-slate-700',
            )}
          >
            <span className="block text-sm font-semibold">{p.patient.label}</span>
            <span className="block text-xs text-slate-600 dark:text-slate-400">{p.patient.summary}</span>
          </button>
        ))}
      </nav>

      <div className="grid gap-6 lg:grid-cols-[minmax(300px,360px)_1fr]">
        {/* Controls (after results on small screens, so the chart is visible first) */}
        <div className="order-last space-y-4 lg:order-none">
          <Card className="space-y-3 p-4">
            <div className="flex items-center justify-between">
              <h2 className="font-semibold">Patient</h2>
              <span className="num text-xs text-slate-500">TBW {tbw.toFixed(1)} L</span>
            </div>
            <div className="grid grid-cols-3 gap-2">
              <NumberField label="Na₀" unit="" value={patient.na0} onChange={(v) => setP('na0', v)} min={95} max={185} />
              <NumberField label="Weight" unit="kg" value={patient.weightKg} onChange={(v) => setP('weightKg', v)} min={30} max={200} />
              <NumberField label="Age" value={patient.age} onChange={(v) => setP('age', v)} min={16} max={100} />
            </div>
            <Segmented label="Sex" size="sm" value={patient.sex} onChange={(v) => setP('sex', v)} options={[{ value: 'male', label: 'Male' }, { value: 'female', label: 'Female' }]} />
            <Segmented<AdhMode>
              label="ADH state"
              size="sm"
              value={patient.adh}
              onChange={(v) => setP('adh', v)}
              options={[
                { value: 'physiologic', label: 'Physiologic' },
                { value: 'siad', label: 'SIAD' },
                { value: 'avp-d', label: 'AVP-D' },
                { value: 'avp-r', label: 'AVP-R' },
              ]}
            />
            <p className="text-[11px] leading-snug text-slate-500 dark:text-slate-400">
              {patient.adh === 'physiologic' && 'ADH follows Na (off < 135, max by 145) and is switched on by a volume deficit > 5–10% of ECF.'}
              {patient.adh === 'siad' && 'Urine osmolality is fixed regardless of Na or volume.'}
              {patient.adh === 'avp-d' && 'No endogenous AVP: urine stays dilute unless desmopressin is given.'}
              {patient.adh === 'avp-r' && 'Kidney cannot respond to AVP or desmopressin.'}
            </p>
            {patient.adh === 'siad' && <SliderField label="Fixed urine osmolality" unit="mOsm/kg" value={patient.siadUosm} min={200} max={900} step={10} onChange={(v) => setP('siadUosm', v)} />}
            {patient.adh === 'avp-d' && <SliderField label="Urine osmolality without desmopressin" unit="mOsm/kg" value={patient.avpDUosm} min={60} max={400} step={10} onChange={(v) => setP('avpDUosm', v)} />}
            {patient.adh === 'avp-r' && <SliderField label="Maximum urine osmolality" unit="mOsm/kg" value={patient.avpRUosm} min={80} max={300} step={10} onChange={(v) => setP('avpRUosm', v)} />}
            <SliderField
              label="ECF volume vs euvolemia"
              unit="L"
              value={Math.round((patient.volumeNa0 / 140) * 10) / 10}
              min={-5}
              max={3}
              step={0.5}
              format={(v) => (v > 0 ? `+${v}` : `${v}`)}
              onChange={(v) => setP('volumeNa0', v * 140)}
            />
            <SliderField label="Renal salt wasting" unit="mmol/day" value={patient.saltWastingPerDay} min={0} max={400} step={25} onChange={(v) => setP('saltWastingPerDay', v)} />
            <Check label="Intact thirst and access to water" checked={patient.thirst} onChange={(v) => setP('thirst', v)} hint="Drinks automatically when Na > 141" />
          </Card>

          <Card className="space-y-3 p-4">
            <div className="flex items-center justify-between">
              <h2 className="font-semibold">Treatment (from t = 0)</h2>
              <Button size="sm" variant="ghost" onClick={() => setRegimen(preset.regimen)}>
                Reset
              </Button>
            </div>
            <Segmented<Diet>
              label="Diet (solute intake)"
              size="sm"
              value={regimen.diet}
              onChange={(v) => setR('diet', v)}
              options={(Object.keys(DIETS) as Diet[]).map((d) => ({ value: d, label: DIETS[d].label }))}
            />
            <p className="-mt-2 text-[11px] text-slate-500 dark:text-slate-400">{DIETS[regimen.diet].note}</p>
            <SliderField label="Oral water / drinks" unit="L/day" value={regimen.oralWaterLPerDay} min={0} max={8} step={0.1} onChange={(v) => setR('oralWaterLPerDay', v)} />
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="mb-1 block text-xs font-medium text-slate-600 dark:text-slate-400" htmlFor="ivfluid">
                  IV fluid
                </label>
                <select id="ivfluid" className="input" value={regimen.ivFluid} onChange={(e) => setR('ivFluid', e.target.value as FluidId | 'none')}>
                  <option value="none">None</option>
                  {FLUID_LIST.map((f) => (
                    <option key={f.id} value={f.id}>
                      {f.short} — Na+K {f.naK}
                    </option>
                  ))}
                </select>
              </div>
              <NumberField label="Rate" unit="mL/h" value={regimen.ivRateMlPerH} onChange={(v) => setR('ivRateMlPerH', Math.max(0, v || 0))} min={0} max={500} step={10} />
            </div>
            {regimen.ivFluid !== 'none' && <SliderField label="IV duration" unit="h" value={regimen.ivHours} min={1} max={48} onChange={(v) => setR('ivHours', v)} />}
            <div className="grid grid-cols-2 gap-2">
              <NumberField label="3% boluses at t = 0" value={regimen.hts3Boluses} onChange={(v) => setR('hts3Boluses', Math.max(0, Math.min(3, Math.round(v || 0))))} min={0} max={3} />
              <NumberField label="Bolus volume" unit="mL" value={regimen.bolusMl} onChange={(v) => setR('bolusMl', Math.max(0, v || 0))} min={50} max={300} step={50} />
            </div>
            <SliderField label="NaCl tablets" unit="g/day" value={regimen.saltTabsGPerDay} min={0} max={12} onChange={(v) => setR('saltTabsGPerDay', v)} />
            <SliderField label="Oral urea" unit="g/day" value={regimen.ureaGPerDay} min={0} max={60} step={5} onChange={(v) => setR('ureaGPerDay', v)} />
            <SliderField label="KCl replacement" unit="mmol/day" value={regimen.kclMmolPerDay} min={0} max={200} step={10} onChange={(v) => setR('kclMmolPerDay', v)} />
            <div className="grid grid-cols-2 gap-2 pt-1">
              <Check label="Desmopressin" checked={regimen.desmopressin} onChange={(v) => setR('desmopressin', v)} hint="Uosm ≥ 700" />
              <Check label="Tolvaptan" checked={regimen.tolvaptan} onChange={(v) => setR('tolvaptan', v)} hint="Uosm ≤ 200" />
              <Check label="Loop diuretic" checked={regimen.loop} onChange={(v) => setR('loop', v)} hint="Uosm ≈ 300, natriuresis" />
              <Check label="Thiazide" checked={regimen.thiazide} onChange={(v) => setR('thiazide', v)} hint="Impairs dilution" />
            </div>
          </Card>
        </div>

        {/* Results */}
        <div className="min-w-0 space-y-4">
          <Card className="p-4">
            <p className="text-sm leading-relaxed text-slate-700 dark:text-slate-300">
              <span className="font-semibold text-slate-900 dark:text-white">Lesson. </span>
              {preset.lesson}
            </p>
          </Card>

          {!sim ? (
            <Card className="p-6 text-sm text-rose-700 dark:text-rose-300">Enter a plausible Na (95–185), weight and age to run the model.</Card>
          ) : (
            <>
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-4" aria-live="polite">
                <Stat label="Na at 24 h" value={sim.points[24].na.toFixed(1)} sub={`Δ ${sim.change24 >= 0 ? '+' : ''}${sim.change24.toFixed(1)}`} tone={worst === 'exceeded' ? 'bad' : worst === 'approaching' ? 'warn' : undefined} />
                <Stat label="Na at 48 h" value={sim.points[48].na.toFixed(1)} sub={`Δ ${sim.change48 >= 0 ? '+' : ''}${sim.change48.toFixed(1)}`} tone={report?.over48Exceeded ? 'bad' : undefined} />
                <Stat label="Peak urine flow" value={`${peakUrine.toFixed(0)}`} sub="mL/h" tone={peakUrine > 250 ? 'warn' : undefined} />
                <Stat label="Net water (48 h)" value={`${(sim.points[48].inL - sim.points[48].outL >= 0 ? '+' : '')}${(sim.points[48].inL - sim.points[48].outL).toFixed(1)}`} sub="L in − out" />
              </div>

              <Card className="p-4">
                <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
                  <h2 className="font-semibold">Serum sodium</h2>
                  <div className="flex items-center gap-3">
                    {hypo && <Check label="High ODS risk (limit 8)" checked={highRisk} onChange={setHighRisk} />}
                    <Badge tone={worst === 'exceeded' ? 'rose' : worst === 'approaching' ? 'amber' : worst === 'wrong-direction' ? 'violet' : 'emerald'}>
                      {!direction
                        ? outOfRange
                          ? '! Left the normal range'
                          : '✓ Stays 135–145'
                        : worst === 'exceeded'
                          ? '✕ Limit exceeded'
                          : worst === 'approaching'
                            ? '! Near limit'
                            : worst === 'wrong-direction'
                              ? '↘ Worsening'
                              : '✓ Within limits'}
                    </Badge>
                  </div>
                </div>
                <LineChart
                  ariaLabel={`Serum sodium over 48 hours, from ${patient.na0} to ${sim.points[48].na.toFixed(1)} mmol/L`}
                  series={[
                    ...(baseline ? [{ id: 'base', label: 'Scenario as loaded', color: 'var(--viz-muted-series)', points: baseline.points.map((p) => ({ x: p.t, y: p.na })), muted: true }] : []),
                    { id: 'na', label: baseline ? 'Your regimen' : 'Serum Na', color: 'var(--viz-series-1)', points: sim.points.map((p) => ({ x: p.t, y: p.na })) },
                  ]}
                  refLines={refLines}
                  xLabel="Hours"
                  yLabel="Na (mmol/L)"
                  yUnit="mmol/L"
                  xDomain={[0, 48]}
                  xTicks={[0, 6, 12, 18, 24, 30, 36, 42, 48]}
                />
                <ul className="mt-3 space-y-1 text-sm text-slate-700 dark:text-slate-300">
                  {(report?.messages ?? []).map((m) => (
                    <li key={m}>{m}</li>
                  ))}
                </ul>
              </Card>

              <Card className="p-4">
                <h2 className="mb-2 font-semibold">Urine output</h2>
                <LineChart
                  ariaLabel="Urine flow over 48 hours"
                  series={[{ id: 'u', label: 'Urine flow', color: 'var(--viz-series-3)', points: sim.points.slice(1).map((p) => ({ x: p.t, y: p.urineMlH })) }]}
                  refLines={[{ y: 100, label: '100 mL/h — alarm if dilute', tone: 'neutral' }]}
                  xLabel="Hours"
                  yLabel="mL/h"
                  yUnit="mL/h"
                  height={190}
                  xDomain={[0, 48]}
                  xTicks={[0, 6, 12, 18, 24, 30, 36, 42, 48]}
                  formatY={(v) => v.toFixed(0)}
                />
              </Card>

              <div className="grid gap-4 md:grid-cols-2">
                <Card className="p-4">
                  <h2 className="mb-2 font-semibold">What happened</h2>
                  {sim.events.length ? (
                    <ul className="space-y-1.5 text-sm text-slate-700 dark:text-slate-300">
                      {sim.events.map((e) => (
                        <li key={e}>• {e}</li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-sm text-slate-500">No change in urine concentrating state during the run.</p>
                  )}
                  {report && report.actions.length > 0 && (
                    <div className="mt-3 rounded-lg bg-rose-50 p-3 text-sm dark:bg-rose-950/40">
                      <p className="mb-1 font-semibold text-rose-800 dark:text-rose-200">What to do in real life</p>
                      <ul className="space-y-1 text-rose-900 dark:text-rose-100">
                        {report.actions.map((a) => (
                          <li key={a}>• {a}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </Card>
                <Card className="p-4">
                  <h2 className="mb-2 font-semibold">Try this</h2>
                  <ol className="list-decimal space-y-1.5 pl-5 text-sm text-slate-700 dark:text-slate-300">
                    {preset.tryThis.map((t) => (
                      <li key={t}>{t}</li>
                    ))}
                  </ol>
                </Card>
              </div>

              <Card className="p-4">
                <button className="text-sm font-semibold text-blue-700 hover:underline dark:text-blue-300" onClick={() => setShowTable((v) => !v)} aria-expanded={showTable}>
                  {showTable ? 'Hide' : 'Show'} data table
                </button>
                {showTable && (
                  <div className="mt-3 overflow-x-auto">
                    <table className="w-full text-right text-sm">
                      <thead className="text-xs text-slate-500">
                        <tr>
                          <th className="py-1 text-left font-medium">Hour</th>
                          <th className="font-medium">Na</th>
                          <th className="font-medium">Urine mL/h</th>
                          <th className="font-medium">Uosm</th>
                          <th className="font-medium">Urine Na+K</th>
                          <th className="font-medium">In (L)</th>
                          <th className="font-medium">Out (L)</th>
                        </tr>
                      </thead>
                      <tbody className="num">
                        {sim.points
                          .filter((p) => p.t % 4 === 0 && p.t > 0)
                          .map((p) => (
                            <tr key={p.t} className="border-t border-slate-100 dark:border-slate-800">
                              <td className="py-1 text-left">{p.t}</td>
                              <td>{p.na.toFixed(1)}</td>
                              <td>{p.urineMlH.toFixed(0)}</td>
                              <td>{p.uOsm.toFixed(0)}</td>
                              <td>{p.uNaK.toFixed(0)}</td>
                              <td>{p.inL.toFixed(2)}</td>
                              <td>{p.outL.toFixed(2)}</td>
                            </tr>
                          ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </Card>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Model assumptions: single compartment (Edelman); surplus Na+K excreted with a 16-h time constant; insensible loss 0.6 L/day; urea excreted as ingested. Real patients add variability — which is why Na is measured, not predicted.
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}


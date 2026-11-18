import { ReactNode, useState } from 'react';
import * as P from '@/lib/physiology';
import { FLUID_LIST, FLUIDS, FluidId } from '@/lib/fluids';
import { Badge, Card, NumberField, Segmented, SliderField, Stat } from '@/components/ui/primitives';

export function Widget({ title, subtitle, children, id }: { title: string; subtitle?: string; children: ReactNode; id?: string }) {
  return (
    <Card as="section" className="overflow-hidden border-blue-200 dark:border-blue-900">
      <div id={id} className="border-b border-blue-100 bg-blue-50/70 px-4 py-2.5 dark:border-blue-950 dark:bg-blue-950/30">
        <p className="text-[11px] font-semibold tracking-wide text-blue-700 uppercase dark:text-blue-300">Interactive</p>
        <h3 className="font-semibold text-slate-900 dark:text-white">{title}</h3>
        {subtitle && <p className="text-xs text-slate-600 dark:text-slate-400">{subtitle}</p>}
      </div>
      <div className="p-4">{children}</div>
    </Card>
  );
}

const fin = (v: number) => Number.isFinite(v);
const fmt = (v: number, d = 1) => (fin(v) ? v.toFixed(d) : '—');

// ─────────────────────────────────────── Solute explorer
export function SoluteExplorer() {
  const [solute, setSolute] = useState(800);
  const [uosm, setUosm] = useState(60);
  const [intake, setIntake] = useState(3);
  const vol = P.maxUrineVolume(solute, uosm);
  const insensible = 0.6;
  const net = intake - vol - insensible;
  const tbw = 42;
  const naChange = -(135 * net) / (tbw + net); // per day, from Na 135
  const presets = [
    { label: 'Normal diet, ADH off', s: 800, u: 60, i: 3 },
    { label: 'Beer potomania', s: 200, u: 60, i: 5 },
    { label: 'SIAD (Uosm 600)', s: 800, u: 600, i: 2 },
    { label: 'SIAD + urea 30 g', s: 1300, u: 600, i: 2 },
  ];
  return (
    <Widget title="Solute–water explorer" subtitle="Urine volume = solute ÷ urine osmolality">
      <div className="mb-3 flex flex-wrap gap-1.5">
        {presets.map((p) => (
          <button
            key={p.label}
            className="rounded-full border border-slate-300 px-2.5 py-1 text-xs hover:bg-slate-100 dark:border-slate-700 dark:hover:bg-slate-800"
            onClick={() => {
              setSolute(p.s);
              setUosm(p.u);
              setIntake(p.i);
            }}
          >
            {p.label}
          </button>
        ))}
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-3">
          <SliderField label="Solute excreted" unit="mOsm/day" value={solute} min={100} max={1600} step={20} onChange={setSolute} />
          <SliderField label="Urine osmolality" unit="mOsm/kg" value={uosm} min={50} max={1200} step={10} onChange={setUosm} />
          <SliderField label="Water intake" unit="L/day" value={intake} min={0} max={10} step={0.1} onChange={setIntake} />
        </div>
        <div className="space-y-3" aria-live="polite">
          <div className="grid grid-cols-2 gap-2">
            <Stat label="Urine volume possible" value={`${fmt(vol)} L`} sub="per day" />
            <Stat label="Net water balance" value={`${net >= 0 ? '+' : ''}${fmt(net)} L`} sub="intake − urine − 0.6 L insensible" tone={net > 0.2 ? 'bad' : undefined} />
          </div>
          <WaterBar intake={intake} urine={vol} insensible={insensible} />
          <p className="text-sm text-slate-700 dark:text-slate-300">
            {net > 0.05
              ? `Water accumulates: in a 70 kg man starting at Na 135, Na falls ≈ ${fmt(-naChange)} mmol/L per day.`
              : net < -0.05
                ? `Net water loss: Na rises ≈ ${fmt(naChange)} mmol/L per day (70 kg man from 135).`
                : 'Balanced: Na stays stable.'}
          </p>
        </div>
      </div>
    </Widget>
  );
}

function WaterBar({ intake, urine, insensible }: { intake: number; urine: number; insensible: number }) {
  const max = Math.max(intake, urine + insensible, 1);
  const w = (v: number) => `${Math.min(100, (v / max) * 100)}%`;
  return (
    <div className="space-y-1.5 text-xs" aria-hidden>
      <div>
        <span className="text-slate-500">In</span>
        <div className="mt-0.5 h-3 rounded-full bg-slate-100 dark:bg-slate-800">
          <div className="h-3 rounded-full" style={{ width: w(intake), background: 'var(--viz-series-1)' }} />
        </div>
      </div>
      <div>
        <span className="text-slate-500">Out (urine + insensible)</span>
        <div className="mt-0.5 flex h-3 gap-0.5 rounded-full bg-slate-100 dark:bg-slate-800">
          <div className="h-3 rounded-l-full" style={{ width: w(urine), background: 'var(--viz-series-3)' }} />
          <div className="h-3 rounded-r-full" style={{ width: w(insensible), background: 'var(--viz-muted-series)' }} />
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────── Tonicity calculator
export function TonicityCalc() {
  const [na, setNa] = useState(126);
  const [glu, setGlu] = useState(100);
  const [bun, setBun] = useState(14);
  const [etoh, setEtoh] = useState(0);
  const [meas, setMeas] = useState<number>(NaN);
  const calc = P.calculatedOsm(na, glu, bun, etoh);
  const eff = P.effectiveOsm(na, glu);
  const gap = fin(meas) ? P.osmolalGap(meas, calc) : NaN;
  const corr = P.correctedNaForGlucose(na, glu);
  const corrKatz = P.correctedNaForGlucose(na, glu, 1.6);
  const ton = P.classifyTonicity(eff);
  const notes: string[] = [];
  if (glu > 200) notes.push(`Glucose-corrected Na ≈ ${fmt(corr)} (Hillier 2.4) or ${fmt(corrKatz)} (Katz 1.6). ${corr >= 135 ? 'Not hypotonic: translocational hyponatremia.' : 'Still hyponatremic after correction.'}`);
  if (fin(meas) && meas >= 275 && ton === 'hypotonic') notes.push('Measured osmolality looks normal but effective osmolality is low: ineffective osmoles (urea, ethanol) — the patient is hypotonic.');
  if (fin(gap) && gap > 10) notes.push(`Osmolal gap ${fmt(gap, 0)} > 10: unmeasured osmoles (ethanol if not entered, methanol, ethylene glycol, mannitol, glycine, sorbitol).`);
  if (fin(meas) && meas >= 275 && ton !== 'hypotonic' && glu <= 200 && (!fin(gap) || gap <= 10)) notes.push('Normal measured osmolality without hyperglycemia or gap: suspect pseudohyponatremia — remeasure Na by direct ISE (blood gas).');
  if (na < 135 && ton === 'hypotonic' && notes.length === 0) notes.push('True hypotonic hyponatremia — proceed to urine osmolality and urine Na.');
  return (
    <Widget title="Osmolality, tonicity & corrected Na" subtitle="Effective osmolality excludes urea and ethanol">
      <div className="grid gap-4 md:grid-cols-[1fr_1.2fr]">
        <div className="grid grid-cols-2 gap-2">
          <NumberField label="Na" unit="mmol/L" value={na} onChange={setNa} />
          <NumberField label="Glucose" unit="mg/dL" value={glu} onChange={setGlu} />
          <NumberField label="BUN" unit="mg/dL" value={bun} onChange={setBun} />
          <NumberField label="Ethanol" unit="mg/dL" value={etoh} onChange={setEtoh} />
          <div className="col-span-2">
            <NumberField label="Measured osmolality (optional)" unit="mOsm/kg" value={meas} onChange={setMeas} />
          </div>
        </div>
        <div className="space-y-3" aria-live="polite">
          <div className="grid grid-cols-2 gap-2">
            <Stat label="Calculated Osm" value={fmt(calc, 0)} sub="2Na + glu/18 + BUN/2.8 + EtOH/3.7" />
            <Stat label="Effective Osm" value={fmt(eff, 0)} sub={<Badge tone={ton === 'hypotonic' ? 'blue' : ton === 'hypertonic' ? 'rose' : 'slate'}>{ton}</Badge>} />
            <Stat label="Osmolal gap" value={fin(gap) ? fmt(gap, 0) : '—'} sub="measured − calculated" tone={gap > 10 ? 'warn' : undefined} />
            <Stat label="Corrected Na" value={fmt(corr)} sub="for glucose (×2.4)" />
          </div>
          <ul className="space-y-1.5 text-sm text-slate-700 dark:text-slate-300">
            {notes.map((n) => (
              <li key={n}>→ {n}</li>
            ))}
          </ul>
        </div>
      </div>
    </Widget>
  );
}

// ─────────────────────────────────────── Correction planner (Adrogué–Madias)
export function CorrectionPlanner() {
  const [weight, setWeight] = useState(70);
  const [sex, setSex] = useState<P.Sex>('female');
  const [age, setAge] = useState(70);
  const [na, setNa] = useState(118);
  const [fluid, setFluid] = useState<FluidId>('hts3');
  const [ml, setMl] = useState(150);
  const [target, setTarget] = useState(5);
  const tbw = P.totalBodyWater(weight, sex, age);
  const f = FLUIDS[fluid];
  const after = P.naAfterInfusion(na, tbw, f.naK, ml / 1000);
  const perL = P.adrogueMadiasPerLitre(na, tbw, f.naK);
  const need = P.litresToTarget(na, na + target, tbw, f.naK);
  const mlPerKg = ml / weight;
  return (
    <Widget title="Correction planner" subtitle="Adrogué–Madias / mass balance — assumes no urine output">
      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-3">
          <div className="grid grid-cols-3 gap-2">
            <NumberField label="Weight" unit="kg" value={weight} onChange={setWeight} />
            <NumberField label="Age" value={age} onChange={setAge} />
            <NumberField label="Na" value={na} onChange={setNa} />
          </div>
          <Segmented label="Sex" size="sm" value={sex} onChange={setSex} options={[{ value: 'male', label: 'Male' }, { value: 'female', label: 'Female' }]} />
          <div>
            <label htmlFor="cp-fluid" className="mb-1 block text-xs font-medium text-slate-600 dark:text-slate-400">
              Fluid
            </label>
            <select id="cp-fluid" className="input" value={fluid} onChange={(e) => setFluid(e.target.value as FluidId)}>
              {FLUID_LIST.map((x) => (
                <option key={x.id} value={x.id}>
                  {x.name} (Na+K {x.naK})
                </option>
              ))}
            </select>
          </div>
          <SliderField label="Volume" unit="mL" value={ml} min={50} max={2000} step={50} onChange={setMl} />
          <SliderField label="Desired rise" unit="mmol/L" value={target} min={1} max={10} onChange={setTarget} />
        </div>
        <div className="space-y-3" aria-live="polite">
          <div className="grid grid-cols-2 gap-2">
            <Stat label="TBW" value={`${fmt(tbw)} L`} sub={`${P.tbwFraction(sex, age)} × weight`} />
            <Stat label="Δ Na per litre" value={`${perL >= 0 ? '+' : ''}${fmt(perL, 2)}`} sub="A–M" />
            <Stat label={`After ${ml} mL`} value={fmt(after)} sub={`Δ ${after - na >= 0 ? '+' : ''}${fmt(after - na)} (${fmt(mlPerKg, 1)} mL/kg)`} />
            <Stat label={`Volume for +${target}`} value={need === null ? '—' : `${(need * 1000).toFixed(0)} mL`} sub={need === null ? 'this fluid cannot raise Na' : f.short} />
          </div>
          <p className="rounded-lg bg-amber-50 p-3 text-sm text-amber-900 dark:bg-amber-950/40 dark:text-amber-100">
            The real rise is usually larger: once the cause of ADH release resolves, dilute urine adds a further rise the formula cannot see. Recheck Na at 1–2 h after hypertonic boluses and every 2–4 h after that; count any KCl as sodium.
          </p>
        </div>
      </div>
    </Widget>
  );
}

// ─────────────────────────────────────── Furst ratio + EFWC
export function FurstCalc() {
  const [una, setUna] = useState(80);
  const [uk, setUk] = useState(40);
  const [sna, setSna] = useState(126);
  const [vol, setVol] = useState(1.5);
  const r = P.furstRatio(una, uk, sna);
  const efwc = P.electrolyteFreeWaterClearance(vol, una, uk, sna);
  return (
    <Widget title="Will fluid restriction work?" subtitle="Urine/serum electrolyte ratio (Furst) and electrolyte-free water clearance">
      <div className="grid gap-4 md:grid-cols-2">
        <div className="grid grid-cols-2 gap-2">
          <NumberField label="Urine Na" unit="mmol/L" value={una} onChange={setUna} />
          <NumberField label="Urine K" unit="mmol/L" value={uk} onChange={setUk} />
          <NumberField label="Serum Na" unit="mmol/L" value={sna} onChange={setSna} />
          <NumberField label="Urine volume" unit="L/day" value={vol} onChange={setVol} step={0.1} />
        </div>
        <div className="space-y-3" aria-live="polite">
          <div className="grid grid-cols-2 gap-2">
            <Stat label="(U_Na + U_K) / S_Na" value={fmt(r.ratio, 2)} tone={r.tier === 'restriction-will-fail' ? 'bad' : r.tier === 'restrict-500' ? 'warn' : undefined} />
            <Stat label="EFWC" value={`${efwc >= 0 ? '+' : ''}${fmt(efwc, 2)} L/day`} sub={efwc >= 0 ? 'urine removes free water' : 'urine adds free water back'} tone={efwc < 0 ? 'bad' : undefined} />
          </div>
          <p className="text-sm text-slate-700 dark:text-slate-300">{r.advice}</p>
          <p className="text-xs text-slate-500">Cut-offs: &lt; 0.5 → ≤ 1 L/day; 0.5–1 → ≤ 500 mL/day; &gt; 1 → restriction will fail (US 2013, Furst 2000).</p>
        </div>
      </div>
    </Widget>
  );
}

// ─────────────────────────────────────── Fractional excretion
export function FECalc() {
  const [which, setWhich] = useState<'urate' | 'na' | 'urea'>('urate');
  const [ux, setUx] = useState(40);
  const [px, setPx] = useState(3);
  const [ucr, setUcr] = useState(80);
  const [pcr, setPcr] = useState(0.7);
  const fe = P.fractionalExcretion(ux, px, ucr, pcr);
  const interp =
    which === 'urate'
      ? fe > 12
        ? 'FE urate > 12%: supports SIAD (valid even on diuretics, Fenske 2008) — also high in salt wasting.'
        : fe < 4
          ? 'Low: volume depletion likely.'
          : 'Normal range (≈ 4–11%).'
      : which === 'na'
        ? fe < 0.5
          ? 'FE Na < 0.5%: Na avidity (low effective arterial volume) — unreliable on diuretics.'
          : 'FE Na > 0.5%: consistent with SIAD, diuretics, or renal salt loss.'
        : fe > 55
          ? 'FE urea > 55%: supports SIAD.'
          : fe < 35
            ? 'FE urea < 35%: suggests low effective arterial volume (works on diuretics).'
            : 'Indeterminate.';
  const units = which === 'na' ? 'mmol/L' : 'mg/dL';
  return (
    <Widget title="Fractional excretion" subtitle="FE = (U_x × P_Cr) ÷ (P_x × U_Cr) × 100">
      <Segmented
        label="Solute"
        size="sm"
        value={which}
        onChange={setWhich}
        options={[
          { value: 'urate', label: 'Urate' },
          { value: 'na', label: 'Sodium' },
          { value: 'urea', label: 'Urea' },
        ]}
      />
      <div className="mt-3 grid gap-4 md:grid-cols-2">
        <div className="grid grid-cols-2 gap-2">
          <NumberField label={`Urine ${which}`} unit={units} value={ux} onChange={setUx} />
          <NumberField label={`Serum ${which}`} unit={units} value={px} onChange={setPx} />
          <NumberField label="Urine creatinine" unit="mg/dL" value={ucr} onChange={setUcr} />
          <NumberField label="Serum creatinine" unit="mg/dL" value={pcr} onChange={setPcr} step={0.1} />
        </div>
        <div aria-live="polite" className="space-y-2">
          <Stat label={`FE ${which}`} value={fin(fe) ? `${fmt(fe)}%` : '—'} />
          <p className="text-sm text-slate-700 dark:text-slate-300">{fin(fe) ? interp : 'Enter positive values.'}</p>
        </div>
      </div>
    </Widget>
  );
}

// ─────────────────────────────────────── Free-water planner (hypernatremia)
export function FreeWaterPlanner() {
  const [weight, setWeight] = useState(60);
  const [sex, setSex] = useState<P.Sex>('female');
  const [age, setAge] = useState(80);
  const [na, setNa] = useState(160);
  const [drop, setDrop] = useState(10);
  const [urineL, setUrineL] = useState(1.5);
  const [uNaK, setUNaK] = useState(60);
  const [insensible, setInsensible] = useState(0.8);
  const [fluid, setFluid] = useState<'water' | 'd5w' | 'half'>('d5w');
  const tbw = P.totalBodyWater(weight, sex, age);
  const target = na - drop;
  const deficit = P.freeWaterDeficit(na, tbw, 140);
  const c = fluid === 'half' ? 77 : 0;
  // exact 24-h mass balance: (Na·TBW + c·V − U_E) / (TBW + V − Vu − Vi) = target
  const ue = urineL * uNaK;
  const V = (target * (tbw - urineL - insensible) - na * tbw + ue) / (c - target);
  const rate = (V * 1000) / 24;
  return (
    <Widget title="Free-water planner" subtitle="Deficit + ongoing losses, solved as an exact 24-h mass balance">
      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-3">
          <div className="grid grid-cols-3 gap-2">
            <NumberField label="Weight" unit="kg" value={weight} onChange={setWeight} />
            <NumberField label="Age" value={age} onChange={setAge} />
            <NumberField label="Na" value={na} onChange={setNa} />
          </div>
          <Segmented label="Sex" size="sm" value={sex} onChange={setSex} options={[{ value: 'male', label: 'Male' }, { value: 'female', label: 'Female' }]} />
          <SliderField label="Planned fall in 24 h" unit="mmol/L" value={drop} min={4} max={16} onChange={setDrop} />
          <div className="grid grid-cols-3 gap-2">
            <NumberField label="Urine" unit="L/day" value={urineL} onChange={setUrineL} step={0.1} />
            <NumberField label="Urine Na+K" unit="mmol/L" value={uNaK} onChange={setUNaK} />
            <NumberField label="Insensible" unit="L/day" value={insensible} onChange={setInsensible} step={0.1} />
          </div>
          <Segmented
            label="Replacement fluid"
            size="sm"
            value={fluid}
            onChange={setFluid}
            options={[
              { value: 'water', label: 'Enteral water' },
              { value: 'd5w', label: 'D5W' },
              { value: 'half', label: '0.45% NaCl' },
            ]}
          />
        </div>
        <div className="space-y-3" aria-live="polite">
          <div className="grid grid-cols-2 gap-2">
            <Stat label="TBW" value={`${fmt(tbw)} L`} />
            <Stat label="Total deficit (to 140)" value={`${fmt(deficit)} L`} sub="TBW × (Na/140 − 1)" />
            <Stat label="Volume over 24 h" value={fin(V) && V > 0 ? `${fmt(V)} L` : '—'} sub={`to reach ${target}`} />
            <Stat label="Rate" value={fin(rate) && rate > 0 ? `${rate.toFixed(0)} mL/h` : '—'} sub={fluid === 'half' ? '0.45% is half free water' : 'free water'} />
          </div>
          <p className="text-sm text-slate-700 dark:text-slate-300">
            Ongoing losses often exceed the deficit itself. Recheck Na every 4–6 h and re-solve. With D5W at high rates, watch glucose — hyperglycemia triggers an osmotic diuresis.
          </p>
          <p className="text-xs text-slate-500">
            Chronic hypernatremia: ≈ 10–12 mmol/L per day is conventional; adult cohorts found no harm from faster correction. Acute (&lt; 48 h): correct quickly.
          </p>
        </div>
      </div>
    </Widget>
  );
}


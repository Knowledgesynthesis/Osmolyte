import { useEffect, useMemo, useState } from 'react';
import { clsx } from 'clsx';
import { DRUGS } from '@/data/drugs';
import { REFERENCES, REF_NUMBER } from '@/data/references';
import type { Reference as Ref } from '@/data/types';
import { Badge, Card, Segmented } from '@/components/ui/primitives';
import { Cite } from '@/components/ui/RichText';

type Tab = 'evidence' | 'drugs' | 'numbers';

const KIND_LABEL: Record<Ref['kind'], string> = {
  guideline: 'Guideline',
  statement: 'Statement',
  rct: 'RCT',
  meta: 'Meta-analysis',
  cohort: 'Cohort',
  diagnostic: 'Diagnostic study',
  review: 'Review',
  physiology: 'Physiology',
};

const KEY_NUMBERS: [string, string][] = [
  ['Hyponatremia', 'Na < 135; mild 130–134, moderate 125–129, profound < 125'],
  ['Acute vs chronic', '48 h (unknown = chronic)'],
  ['Hypotonic', 'Effective Osm < 275 mOsm/kg'],
  ['Maximally dilute urine', 'Uosm ≤ 100 mOsm/kg'],
  ['Low effective arterial volume', 'Urine Na ≤ 30 mmol/L'],
  ['FE urate in SIAD', '> 12%'],
  ['Glucose correction', '+2.4 Na per 100 mg/dL glucose above 100'],
  ['3% NaCl bolus', '150 mL/20 min (EU) · 100 mL/10 min (US) · 2–4 mL/kg (SALSA)'],
  ['1 mL/kg 3% NaCl', '≈ +1 mmol/L'],
  ['Chronic hypo limits', 'EU 10 then 8/24 h · US 10–12/24 h, 18/48 h · high risk 8/24 h'],
  ['Overcorrection alarm', 'Dilute urine > 100 mL/h'],
  ['Relowering', 'D5W 10 mL/kg/1 h + desmopressin 2 µg IV'],
  ['Fluid restriction (Furst)', 'ratio < 0.5 → 1 L; 0.5–1 → 500 mL; > 1 → will fail'],
  ['Polyuria', '> 50 mL/kg/day (≈ 3 L)'],
  ['Solute diuresis', 'Uosm > 300 and > 1000 mOsm/day'],
  ['Baseline copeptin', '> 21.4 pmol/L → AVP resistance'],
  ['Hypertonic-saline copeptin', '≤ 4.9 pmol/L at Na ≥ 150 → AVP deficiency'],
  ['Arginine copeptin', '≤ 3.8 pmol/L at 60 min → AVP deficiency (74% accurate)'],
  ['Water deprivation stop', 'Na > 147, weight −3%, or Uosm plateau'],
  ['Free-water deficit', 'TBW × (Na/140 − 1)'],
  ['TBW fraction', '0.6 young ♂ · 0.5 young ♀ / older ♂ · 0.45 older ♀'],
  ['Hypernatremia ceiling (chronic)', '10–12 mmol/L/day conventional'],
];

export function ReferencePage({ focus }: { focus?: string }) {
  const [tab, setTab] = useState<Tab>('evidence');
  const [q, setQ] = useState('');
  useEffect(() => {
    if (!focus) return;
    const t = setTimeout(() => document.getElementById(`ref-${focus}`)?.scrollIntoView({ block: 'center', behavior: 'smooth' }), 50);
    return () => clearTimeout(t);
  }, [focus]);

  const refs = useMemo(() => {
    const s = q.toLowerCase();
    return REFERENCES.filter((r) => !s || r.citation.toLowerCase().includes(s) || r.takeaway.toLowerCase().includes(s));
  }, [q]);
  const drugs = useMemo(() => {
    const s = q.toLowerCase();
    return DRUGS.filter((d) => !s || JSON.stringify(d).toLowerCase().includes(s));
  }, [q]);

  return (
    <div className="space-y-6">
      <header>
        <p className="label">Reference</p>
        <h1 className="text-3xl font-bold tracking-tight">Evidence, drugs & key numbers</h1>
        <p className="mt-1 max-w-3xl text-slate-600 dark:text-slate-400">Every claim in the course links here. Citations open the source (DOI or PubMed).</p>
      </header>
      <div className="flex flex-wrap items-end gap-3">
        <div className="min-w-64 flex-1 sm:max-w-md">
          <Segmented<Tab>
            label="Section"
            value={tab}
            onChange={setTab}
            options={[
              { value: 'evidence', label: `Evidence (${REFERENCES.length})` },
              { value: 'drugs', label: `Drugs (${DRUGS.length})` },
              { value: 'numbers', label: 'Key numbers' },
            ]}
          />
        </div>
        {tab !== 'numbers' && <input className="input max-w-xs" placeholder="Filter…" aria-label="Filter" value={q} onChange={(e) => setQ(e.target.value)} />}
      </div>

      {tab === 'evidence' && (
        <ol className="space-y-2">
          {refs.map((r) => (
            <li key={r.id} id={`ref-${r.id}`} className={clsx('card scroll-mt-28 p-4', focus === r.id && 'ring-2 ring-blue-500')}>
              <div className="flex gap-3">
                <span className="num w-8 shrink-0 text-sm font-semibold text-slate-500">[{REF_NUMBER[r.id]}]</span>
                <div className="min-w-0 space-y-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <Badge tone={r.kind === 'guideline' || r.kind === 'statement' ? 'blue' : r.kind === 'rct' || r.kind === 'meta' ? 'emerald' : 'slate'}>{KIND_LABEL[r.kind]}</Badge>
                    <span className="num text-xs text-slate-500">{r.year}</span>
                  </div>
                  <p className="text-sm font-medium text-slate-900 dark:text-white">{r.takeaway}</p>
                  <p className="text-xs leading-relaxed text-slate-600 dark:text-slate-400">
                    {r.citation}{' '}
                    <a href={r.url} target="_blank" rel="noreferrer" className="font-medium text-blue-700 hover:underline dark:text-blue-300">
                      Source ↗
                    </a>
                  </p>
                </div>
              </div>
            </li>
          ))}
        </ol>
      )}

      {tab === 'drugs' && (
        <div className="grid gap-4 lg:grid-cols-2">
          {drugs.map((d) => (
            <Card key={d.id} as="article" className="p-5">
              <h2 className="text-lg font-semibold">{d.name}</h2>
              <p className="mb-3 text-xs text-slate-500">{d.class}</p>
              <dl className="space-y-2 text-sm">
                {(
                  [
                    ['Use', d.use],
                    ['Mechanism', d.mechanism],
                    ['Dosing (adult)', d.dosing],
                    ['Evidence', d.evidence],
                    ['Monitor', d.monitoring],
                    ['Cautions', d.cautions],
                  ] as const
                ).map(([k, v]) => (
                  <div key={k} className="grid grid-cols-[96px_1fr] gap-2">
                    <dt className="text-xs font-semibold text-slate-500">{k}</dt>
                    <dd className="leading-relaxed text-slate-700 dark:text-slate-300">
                      {v}
                      {k === 'Evidence' && d.refs?.map((r) => <Cite key={r} id={r} />)}
                    </dd>
                  </div>
                ))}
              </dl>
            </Card>
          ))}
        </div>
      )}

      {tab === 'numbers' && (
        <Card className="overflow-hidden">
          <table className="w-full text-sm">
            <tbody>
              {KEY_NUMBERS.map(([k, v]) => (
                <tr key={k} className="border-t border-slate-100 first:border-0 dark:border-slate-800">
                  <th scope="row" className="w-2/5 px-4 py-2.5 text-left font-medium text-slate-900 dark:text-white">
                    {k}
                  </th>
                  <td className="px-4 py-2.5 text-slate-700 dark:text-slate-300">{v}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      )}
    </div>
  );
}

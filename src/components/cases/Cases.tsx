import { useState } from 'react';
import { clsx } from 'clsx';
import { CASES } from '@/data/cases';
import type { ClinicalCase } from '@/data/types';
import { useProgress } from '@/store/progress';
import { href } from '@/hooks/useRoute';
import { Badge, Button, Card, LinkButton } from '@/components/ui/primitives';
import { Cite } from '@/components/ui/RichText';

export function CaseList() {
  const done = useProgress((s) => s.cases);
  return (
    <div className="space-y-6">
      <header>
        <p className="label">Apply</p>
        <h1 className="text-3xl font-bold tracking-tight">Clinical cases</h1>
        <p className="mt-1 max-w-3xl text-slate-600 dark:text-slate-400">Decide at each step, see why, then read the debrief. Several cases open straight into the Fluid Lab so you can test alternatives.</p>
      </header>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {CASES.map((c) => {
          const rec = done[c.id];
          return (
            <a key={c.id} href={href(`cases/${c.id}`)} className="card group flex flex-col p-5 transition-colors hover:border-blue-400 dark:hover:border-blue-700">
              <div className="mb-2 flex items-center gap-2">
                <Badge tone={c.level === 'Core' ? 'emerald' : c.level === 'Advanced' ? 'amber' : 'rose'}>{c.level}</Badge>
                <span className="text-xs text-slate-500">{c.setting}</span>
                {rec && (
                  <span className="num ml-auto text-xs font-semibold text-emerald-700 dark:text-emerald-300">
                    ✓ {rec.score}/{rec.total}
                  </span>
                )}
              </div>
              <h2 className="font-semibold text-slate-900 group-hover:text-blue-700 dark:text-white dark:group-hover:text-blue-300">{c.title}</h2>
              <p className="mt-1 flex-1 text-sm text-slate-600 dark:text-slate-400">{c.hook}</p>
              <div className="mt-3 flex flex-wrap gap-1">
                {c.topics.map((t) => (
                  <Badge key={t}>{t}</Badge>
                ))}
              </div>
            </a>
          );
        })}
      </div>
    </div>
  );
}

export function CasePlayer({ c }: { c: ClinicalCase }) {
  const [stage, setStage] = useState(0);
  const [choice, setChoice] = useState<Record<number, string>>({});
  const [firstTry, setFirstTry] = useState<Record<number, boolean>>({});
  const complete = useProgress((s) => s.completeCase);
  const finished = stage >= c.stages.length;

  const pick = (optId: string, correct: boolean) => {
    setChoice((s) => ({ ...s, [stage]: optId }));
    setFirstTry((s) => (stage in s ? s : { ...s, [stage]: correct }));
  };
  const st = c.stages[stage];
  const chosen = st ? st.options.find((o) => o.id === choice[stage]) : undefined;

  const next = () => {
    if (stage + 1 >= c.stages.length) {
      const score = Object.values({ ...firstTry }).filter(Boolean).length;
      complete(c.id, score, c.stages.length);
    }
    setStage((s) => s + 1);
  };

  return (
    <div className="mx-auto max-w-3xl space-y-5">
      <a href={href('cases')} className="text-sm text-blue-700 hover:underline dark:text-blue-300">
        ← All cases
      </a>
      <header>
        <div className="mb-1 flex items-center gap-2">
          <Badge tone={c.level === 'Core' ? 'emerald' : c.level === 'Advanced' ? 'amber' : 'rose'}>{c.level}</Badge>
          <span className="text-xs text-slate-500">{c.setting}</span>
        </div>
        <h1 className="text-3xl font-bold tracking-tight">{c.title}</h1>
        <p className="mt-1 text-lg text-slate-600 dark:text-slate-400">{c.hook}</p>
      </header>

      <ol className="flex gap-1.5" aria-label="Case progress">
        {c.stages.map((s, i) => (
          <li key={s.title} className={clsx('h-1.5 flex-1 rounded-full', i < stage ? (firstTry[i] ? 'bg-emerald-500' : 'bg-amber-500') : i === stage ? 'bg-blue-600' : 'bg-slate-200 dark:bg-slate-800')}>
            <span className="sr-only">
              Stage {i + 1}: {s.title}
            </span>
          </li>
        ))}
      </ol>

      {!finished && st && (
        <Card className="space-y-4 p-5">
          <p className="label">
            Step {stage + 1} of {c.stages.length} · {st.title}
          </p>
          {st.narrative && <p className="leading-relaxed text-slate-800 dark:text-slate-200">{st.narrative}</p>}
          {st.data && (
            <dl className="grid grid-cols-2 gap-2 sm:grid-cols-3">
              {st.data.map((d) => (
                <div key={d.label} className="rounded-lg bg-slate-50 px-3 py-2 dark:bg-slate-950">
                  <dt className="text-[11px] text-slate-500">{d.label}</dt>
                  <dd className={clsx('num text-sm font-semibold', d.flag === 'high' && 'text-rose-700 dark:text-rose-300', d.flag === 'low' && 'text-blue-700 dark:text-blue-300')}>
                    {d.value}
                    {d.flag && <span className="sr-only"> ({d.flag})</span>}
                    {d.flag === 'high' && ' ↑'}
                    {d.flag === 'low' && ' ↓'}
                  </dd>
                </div>
              ))}
            </dl>
          )}
          <p className="font-semibold text-slate-900 dark:text-white">{st.question}</p>
          <div className="space-y-2" role="radiogroup" aria-label={st.question}>
            {st.options.map((o) => {
              const sel = choice[stage] === o.id;
              return (
                <button
                  key={o.id}
                  role="radio"
                  aria-checked={sel}
                  onClick={() => pick(o.id, o.correct)}
                  className={clsx(
                    'w-full rounded-xl border px-3 py-2.5 text-left text-sm transition-colors',
                    sel && o.correct && 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/40',
                    sel && !o.correct && 'border-rose-500 bg-rose-50 dark:bg-rose-950/40',
                    !sel && 'border-slate-200 hover:border-slate-300 hover:bg-slate-50 dark:border-slate-800 dark:hover:bg-slate-800/50',
                  )}
                >
                  {o.text}
                  {sel && <span className={clsx('mt-1 block text-xs', o.correct ? 'text-emerald-800 dark:text-emerald-300' : 'text-rose-800 dark:text-rose-300')}>{o.feedback}</span>}
                </button>
              );
            })}
          </div>
          {chosen && !chosen.correct && <p className="text-sm text-slate-600 dark:text-slate-400">Try another option — your first choice is what counts for the score.</p>}
          {chosen?.correct && (
            <div className="space-y-3">
              <p className="rounded-lg bg-blue-50 p-3 text-sm text-blue-950 dark:bg-blue-950/40 dark:text-blue-100">
                <span className="font-semibold">Teaching point. </span>
                {st.teaching}
              </p>
              <Button onClick={next}>{stage + 1 < c.stages.length ? 'Next step →' : 'See debrief →'}</Button>
            </div>
          )}
        </Card>
      )}

      {finished && (
        <div className="space-y-4">
          <Card className="p-5">
            <p className="label">Debrief</p>
            <p className="num mt-1 text-sm text-slate-500">
              First-try score: {Object.values(firstTry).filter(Boolean).length}/{c.stages.length}
            </p>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              {(
                [
                  ['Core concept', c.summary.concept],
                  ['Clinical reasoning', c.summary.reasoning],
                  ['Management', c.summary.management],
                  ['Follow-up', c.summary.followUp],
                ] as const
              ).map(([t, v]) => (
                <div key={t}>
                  <p className="text-sm font-semibold text-slate-900 dark:text-white">{t}</p>
                  <p className="text-sm leading-relaxed text-slate-700 dark:text-slate-300">{v}</p>
                </div>
              ))}
            </div>
            <div className="mt-4">
              <p className="text-sm font-semibold">Pearls</p>
              <ul className="mt-1 list-disc space-y-0.5 pl-5 text-sm text-slate-700 dark:text-slate-300">
                {c.summary.pearls.map((p) => (
                  <li key={p}>{p}</li>
                ))}
              </ul>
            </div>
            {c.refs && c.refs.length > 0 && (
              <p className="mt-3 text-xs text-slate-500">
                Evidence:
                {c.refs.map((r) => (
                  <Cite key={r} id={r} />
                ))}
              </p>
            )}
          </Card>
          <div className="flex flex-wrap gap-2">
            {c.labPreset && <LinkButton href={href(`lab?preset=${c.labPreset}`)}>Replay in Fluid Lab</LinkButton>}
            <Button
              variant="secondary"
              onClick={() => {
                setStage(0);
                setChoice({});
                setFirstTry({});
              }}
            >
              Restart case
            </Button>
            <LinkButton variant="secondary" href={href('cases')}>
              More cases
            </LinkButton>
          </div>
        </div>
      )}
    </div>
  );
}

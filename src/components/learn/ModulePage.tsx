import { useEffect, useState } from 'react';
import { clsx } from 'clsx';
import type { Block, Module } from '@/data/types';
import { MODULES } from '@/data/modules';
import { QUESTION_INDEX } from '@/data/questions';
import { moduleMastery, useProgress } from '@/store/progress';
import { href } from '@/hooks/useRoute';
import { Callout, LinkButton, ProgressRing } from '@/components/ui/primitives';
import { RichText } from '@/components/ui/RichText';
import { Interactive } from '@/components/interactives';
import { QuestionCard } from '@/components/practice/QuestionCard';

export function BlockView({ b }: { b: Block }) {
  switch (b.kind) {
    case 'p':
      return (
        <p className="leading-relaxed text-slate-700 dark:text-slate-300">
          <RichText text={b.text} />
        </p>
      );
    case 'points':
      return (
        <div>
          {b.title && <p className="mb-1.5 font-semibold text-slate-900 dark:text-white">{b.title}</p>}
          <ul className="space-y-1.5">
            {b.items.map((i) => (
              <li key={i} className="flex gap-2 leading-relaxed text-slate-700 dark:text-slate-300">
                <span className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-blue-500" aria-hidden />
                <span>
                  <RichText text={i} />
                </span>
              </li>
            ))}
          </ul>
        </div>
      );
    case 'table':
      return (
        <figure className="overflow-hidden rounded-xl border border-slate-200 dark:border-slate-800">
          {b.caption && (
            <figcaption className="border-b border-slate-200 bg-slate-50 px-3 py-2 text-xs font-medium text-slate-600 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-400">
              <RichText text={b.caption} />
            </figcaption>
          )}
          <div className="overflow-x-auto">
            <table className="w-full min-w-[520px] text-left text-sm">
              <thead className="bg-slate-50 dark:bg-slate-900">
                <tr>
                  {b.head.map((h, i) => (
                    <th key={i} scope="col" className="px-3 py-2 text-xs font-semibold text-slate-600 dark:text-slate-400">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {b.rows.map((r, i) => (
                  <tr key={i} className="border-t border-slate-100 align-top dark:border-slate-800">
                    {r.map((c, j) => (
                      <td key={j} className={clsx('px-3 py-2 leading-relaxed text-slate-700 dark:text-slate-300', j === 0 && 'font-medium text-slate-900 dark:text-white')}>
                        <RichText text={c} />
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </figure>
      );
    case 'callout':
      return (
        <Callout tone={b.tone} title={b.title}>
          <RichText text={b.text} />
        </Callout>
      );
    case 'equation':
      return (
        <div className="rounded-xl border border-slate-200 bg-white px-4 py-3 dark:border-slate-800 dark:bg-slate-900">
          <p className="text-[11px] font-semibold tracking-wide text-slate-500 uppercase">{b.label}</p>
          <p className="num mt-0.5 text-[15px] font-medium text-slate-900 dark:text-white">{b.formula}</p>
          {b.note && (
            <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
              <RichText text={b.note} />
            </p>
          )}
        </div>
      );
    case 'steps':
      return (
        <div>
          {b.title && <p className="mb-2 font-semibold">{b.title}</p>}
          <ol className="relative space-y-3 border-l-2 border-blue-100 pl-5 dark:border-blue-950">
            {b.items.map((s) => (
              <li key={s.title} className="relative">
                <span className="absolute top-1.5 -left-[27px] h-3 w-3 rounded-full border-2 border-white bg-blue-500 dark:border-slate-950" aria-hidden />
                <p className="font-semibold text-slate-900 dark:text-white">{s.title}</p>
                <p className="leading-relaxed text-slate-700 dark:text-slate-300">
                  <RichText text={s.text} />
                </p>
              </li>
            ))}
          </ol>
        </div>
      );
    case 'patterns':
      return (
        <div className="rounded-xl border border-amber-200 bg-amber-50/60 p-4 dark:border-amber-900 dark:bg-amber-950/20">
          <p className="mb-2 text-xs font-semibold tracking-wide text-amber-800 uppercase dark:text-amber-300">Rapid patterns — see → think → do</p>
          <ul className="space-y-2">
            {b.items.map((it) => (
              <li key={it.see} className="grid gap-1 text-sm sm:grid-cols-[1.2fr_1fr_1.3fr] sm:gap-3">
                <span className="text-slate-900 dark:text-white">{it.see}</span>
                <span className="font-semibold text-amber-900 dark:text-amber-200">→ {it.think}</span>
                <span className="text-slate-700 dark:text-slate-300">→ {it.do}</span>
              </li>
            ))}
          </ul>
        </div>
      );
    case 'interactive':
      return <Interactive id={b.id} preset={b.preset} />;
  }
}

function MasteryCheck({ m }: { m: Module }) {
  const answers = useProgress((s) => s.answers);
  const mastery = moduleMastery(m.id, answers);
  const [round, setRound] = useState(0);
  const qs = m.check.map((id) => QUESTION_INDEX[id]);
  return (
    <section id="mastery" className="scroll-mt-24 space-y-4">
      <div className="flex flex-wrap items-center gap-4 rounded-2xl bg-slate-900 p-5 text-white dark:bg-slate-100 dark:text-slate-900">
        <ProgressRing value={mastery.done / mastery.total} size={52} label={`Mastery ${mastery.done} of ${mastery.total}`} />
        <div className="min-w-0 flex-1">
          <h2 className="text-xl font-bold">Mastery check</h2>
          <p className="text-sm opacity-80">
            {mastery.mastered ? 'Mastered — every question answered correctly on its latest attempt.' : `Answer all ${mastery.total} correctly to master this module. Wrong answers return to the Practice queue.`}
          </p>
        </div>
        <button className="rounded-lg border border-white/30 px-3 py-1.5 text-sm hover:bg-white/10 dark:border-slate-900/30 dark:hover:bg-slate-900/10" onClick={() => setRound((r) => r + 1)}>
          Retake
        </button>
      </div>
      <div className="space-y-4" key={round}>
        {qs.map((q, i) => (
          <QuestionCard key={q.id} q={q} index={i} total={qs.length} />
        ))}
      </div>
    </section>
  );
}

export function ModulePage({ m }: { m: Module }) {
  const visit = useProgress((s) => s.visit);
  useEffect(() => visit(m.id), [m.id, visit]);
  const i = MODULES.findIndex((x) => x.id === m.id);
  const prev = MODULES[i - 1];
  const next = MODULES[i + 1];

  return (
    <div className="grid gap-8 lg:grid-cols-[220px_1fr]">
      <aside className="hidden lg:block">
        <nav aria-label="On this page" className="sticky top-24 space-y-1 text-sm">
          <p className="label mb-2">Module {m.number}</p>
          {m.sections.map((s) => (
            <a key={s.id} href={`#${s.id}`} onClick={(e) => { e.preventDefault(); document.getElementById(s.id)?.scrollIntoView({ behavior: 'smooth' }); }} className="block rounded-md px-2 py-1 text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-white">
              {s.title}
            </a>
          ))}
          <a href="#mastery" onClick={(e) => { e.preventDefault(); document.getElementById('mastery')?.scrollIntoView({ behavior: 'smooth' }); }} className="block rounded-md px-2 py-1 font-semibold text-blue-700 hover:bg-blue-50 dark:text-blue-300 dark:hover:bg-blue-950">
            Mastery check →
          </a>
        </nav>
      </aside>

      <article className="min-w-0 max-w-4xl space-y-10">
        <header className="space-y-3">
          <p className="label">
            Module {m.number} of {MODULES.length} · {m.minutes} min
          </p>
          <h1 className="text-3xl font-bold tracking-tight text-balance sm:text-4xl">{m.title}</h1>
          <p className="text-lg text-slate-600 dark:text-slate-400">{m.tagline}</p>
          <div className="rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
            <p className="label mb-2">After this module you can</p>
            <ul className="grid gap-1.5 sm:grid-cols-2">
              {m.objectives.map((o) => (
                <li key={o} className="flex gap-2 text-sm text-slate-700 dark:text-slate-300">
                  <span className="text-emerald-600" aria-hidden>
                    ✓
                  </span>
                  {o}
                </li>
              ))}
            </ul>
          </div>
        </header>

        {m.sections.map((s) => (
          <section key={s.id} id={s.id} className="scroll-mt-24 space-y-4">
            <h2 className="text-2xl font-bold tracking-tight">{s.title}</h2>
            {s.blocks.map((b, j) => (
              <BlockView key={j} b={b} />
            ))}
          </section>
        ))}

        <MasteryCheck m={m} />

        <nav className="flex flex-wrap justify-between gap-3 border-t border-slate-200 pt-6 dark:border-slate-800" aria-label="Module navigation">
          {prev ? (
            <LinkButton variant="secondary" href={href(`learn/${prev.id}`)}>
              ← {prev.number}. {prev.title}
            </LinkButton>
          ) : (
            <span />
          )}
          {next ? (
            <LinkButton href={href(`learn/${next.id}`)}>
              {next.number}. {next.title} →
            </LinkButton>
          ) : (
            <LinkButton href={href('cases')}>Apply it: clinical cases →</LinkButton>
          )}
        </nav>
      </article>
    </div>
  );
}

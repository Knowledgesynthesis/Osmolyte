import { MODULES } from '@/data/modules';
import { CASES } from '@/data/cases';
import { CARDS } from '@/data/cards';
import { QUESTIONS } from '@/data/questions';
import { isDue } from '@/lib/srs';
import { moduleMastery, useProgress } from '@/store/progress';
import { href } from '@/hooks/useRoute';
import { Card, ProgressRing } from '@/components/ui/primitives';
import { Cite } from '@/components/ui/RichText';

const UPDATES: { year: string; text: string; ref: string }[] = [
  { year: '2026', text: 'HIT trial: normalising Na in hospitalised chronic hyponatremia did not reduce 30-day death or readmission.', ref: 'hit2026' },
  { year: '2025', text: 'Meta-analysis: faster correction of severe hyponatremia associated with lower mortality; ODS rare. Guideline limits unchanged.', ref: 'ayus2025' },
  { year: '2023', text: 'CARGO: hypertonic-saline-stimulated copeptin beats arginine (96% vs 74%) for AVP deficiency vs primary polydipsia.', ref: 'cargo2023' },
  { year: '2023', text: 'ODS occurred in 0.05% of 22,858 hyponatremic admissions — over half without rapid correction.', ref: 'macmillan2023' },
  { year: '2023', text: 'Faster correction of severe hypernatremia in adults associated with lower mortality, no neurological harm.', ref: 'feigin2023' },
  { year: '2023', text: 'AHA/ASA SAH guideline: mineralocorticoids reasonable for natriuresis and hyponatremia.', ref: 'aha-sah2023' },
  { year: '2022', text: 'Central / nephrogenic DI renamed AVP deficiency / AVP resistance.', ref: 'rename2022' },
];

export function Home() {
  const answers = useProgress((s) => s.answers);
  const cards = useProgress((s) => s.cards);
  const cases = useProgress((s) => s.cases);
  const mastery = MODULES.map((m) => ({ m, ...moduleMastery(m.id, answers) }));
  const masteredCount = mastery.filter((x) => x.mastered).length;
  const nextModule = mastery.find((x) => !x.mastered)?.m ?? MODULES[0];
  const due = CARDS.filter((c) => isDue(cards[c.id])).length;
  const started = Object.keys(answers).length > 0;

  return (
    <div className="space-y-12">
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 px-6 py-10 text-white sm:px-10 sm:py-14">
        <div className="relative max-w-3xl space-y-4">
          <p className="text-sm font-semibold tracking-wide text-blue-300 uppercase">Sodium & water disorders</p>
          <h1 className="text-4xl font-bold tracking-tight text-balance sm:text-5xl">Reason through any sodium problem from first principles.</h1>
          <p className="text-lg text-slate-300">
            Two equations, eight modules, a physiological simulator, ten branching cases and {QUESTIONS.length} questions with a rationale for every option — built on the European and US guidelines and the trials published through 2026.
          </p>
          <div className="flex flex-wrap gap-3 pt-2">
            <a href={href(`learn/${nextModule.id}`)} className="inline-flex items-center rounded-lg bg-white px-4 py-2 text-sm font-semibold text-slate-900 hover:bg-blue-50">
              {started ? `Continue: Module ${nextModule.number}` : 'Start Module 1'} →
            </a>
            <a href={href('lab')} className="inline-flex items-center rounded-lg border border-white/30 px-4 py-2 text-sm font-medium hover:bg-white/10">
              Open the Fluid Lab
            </a>
          </div>
        </div>
        <svg aria-hidden viewBox="0 0 400 400" className="pointer-events-none absolute -right-20 -bottom-24 h-96 w-96 opacity-20">
          <path d="M200 30c60 85 110 150 110 210a110 110 0 0 1-220 0c0-60 50-125 110-210z" fill="none" stroke="#93c5fd" strokeWidth="3" />
          <path d="M200 90c40 55 72 100 72 140a72 72 0 0 1-144 0c0-40 32-85 72-140z" fill="none" stroke="#93c5fd" strokeWidth="2" />
          <text x="200" y="270" textAnchor="middle" fontSize="72" fontWeight="700" fill="#93c5fd">
            Na⁺
          </text>
        </svg>
      </section>

      <section className="grid gap-3 sm:grid-cols-4">
        <Card className="p-4">
          <p className="label">Modules mastered</p>
          <p className="num text-2xl font-bold">
            {masteredCount}/{MODULES.length}
          </p>
        </Card>
        <Card className="p-4">
          <p className="label">Questions correct</p>
          <p className="num text-2xl font-bold">
            {QUESTIONS.filter((q) => answers[q.id]?.correct).length}/{QUESTIONS.length}
          </p>
        </Card>
        <Card className="p-4">
          <p className="label">Cases completed</p>
          <p className="num text-2xl font-bold">
            {Object.keys(cases).length}/{CASES.length}
          </p>
        </Card>
        <a href={href('cards')} className="card p-4 hover:border-blue-300 dark:hover:border-blue-800">
          <p className="label">Flashcards due</p>
          <p className="num text-2xl font-bold">{due}</p>
        </a>
      </section>

      <section>
        <div className="mb-4 flex items-end justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">The course</h2>
            <p className="text-slate-600 dark:text-slate-400">Each module ends with a mastery check. About 3 hours end to end.</p>
          </div>
        </div>
        <ol className="grid gap-3 md:grid-cols-2">
          {mastery.map(({ m, done, total, mastered }) => (
            <li key={m.id}>
              <a href={href(`learn/${m.id}`)} className="card group flex h-full items-start gap-4 p-4 transition-colors hover:border-blue-400 dark:hover:border-blue-700">
                <ProgressRing value={done / total} label={`${m.title}: ${done} of ${total} mastery questions correct`} />
                <div className="min-w-0">
                  <p className="text-xs font-medium text-slate-500">
                    Module {m.number} · {m.minutes} min {mastered && <span className="text-emerald-600 dark:text-emerald-400">· mastered</span>}
                  </p>
                  <h3 className="font-semibold text-slate-900 group-hover:text-blue-700 dark:text-white dark:group-hover:text-blue-300">{m.title}</h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400">{m.tagline}</p>
                </div>
              </a>
            </li>
          ))}
        </ol>
      </section>

      <section className="grid gap-6 lg:grid-cols-[1.2fr_1fr]">
        <div>
          <h2 className="mb-3 text-2xl font-bold tracking-tight">Practise like it’s real</h2>
          <div className="grid gap-3 sm:grid-cols-2">
            {[
              { to: 'lab', t: 'Fluid Lab', d: 'Simulate 48 hours of any fluid plan — see the water diuresis coming.' },
              { to: 'cases', t: 'Branching cases', d: 'Ten cases from ED to neuro-ICU, with a debrief for each.' },
              { to: 'practice', t: 'Question bank', d: 'Review queue, module filters and a timed pattern drill.' },
              { to: 'tools', t: 'Bedside tools', d: 'Navigator, correction monitor, free-water planner and more.' },
            ].map((x) => (
              <a key={x.to} href={href(x.to)} className="card p-4 transition-colors hover:border-blue-400 dark:hover:border-blue-700">
                <p className="font-semibold">{x.t} →</p>
                <p className="text-sm text-slate-600 dark:text-slate-400">{x.d}</p>
              </a>
            ))}
          </div>
        </div>
        <Card className="p-5">
          <h2 className="mb-3 text-lg font-bold">What changed recently</h2>
          <ol className="space-y-3">
            {UPDATES.map((u) => (
              <li key={u.text} className="flex gap-3 text-sm">
                <span className="num w-10 shrink-0 font-semibold text-blue-700 dark:text-blue-300">{u.year}</span>
                <span className="text-slate-700 dark:text-slate-300">
                  {u.text}
                  <Cite id={u.ref} />
                </span>
              </li>
            ))}
          </ol>
        </Card>
      </section>
    </div>
  );
}

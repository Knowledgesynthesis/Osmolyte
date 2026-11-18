import { useEffect, useMemo, useState } from 'react';
import { clsx } from 'clsx';
import { QUESTIONS } from '@/data/questions';
import { MODULES } from '@/data/modules';
import type { Question } from '@/data/types';
import { useProgress } from '@/store/progress';
import { Badge, Button, Card, Segmented } from '@/components/ui/primitives';
import { QuestionCard } from './QuestionCard';

type Mode = 'queue' | 'all' | 'drill';

function shuffle<T>(a: T[]): T[] {
  const b = [...a];
  for (let i = b.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [b[i], b[j]] = [b[j], b[i]];
  }
  return b;
}

const DRILL_SECONDS = 25;

export function Practice() {
  const answers = useProgress((s) => s.answers);
  const [mode, setMode] = useState<Mode>('queue');
  const [moduleId, setModuleId] = useState<string>('all');
  const [session, setSession] = useState<Question[] | null>(null);
  const [pos, setPos] = useState(0);
  const [results, setResults] = useState<boolean[]>([]);

  const pool = useMemo(() => {
    let qs = QUESTIONS.filter((q) => moduleId === 'all' || q.module === moduleId);
    if (mode === 'drill') qs = qs.filter((q) => q.drill);
    return qs;
  }, [moduleId, mode]);

  const queue = useMemo(() => pool.filter((q) => !answers[q.id] || !answers[q.id].correct), [pool, answers]);
  const answered = QUESTIONS.filter((q) => answers[q.id]).length;
  const correctNow = QUESTIONS.filter((q) => answers[q.id]?.correct).length;

  const start = () => {
    const base = mode === 'queue' ? queue : pool;
    const s = shuffle(base).slice(0, mode === 'drill' ? 10 : base.length);
    setSession(s);
    setPos(0);
    setResults([]);
  };

  if (session) {
    const done = pos >= session.length;
    return (
      <div className="mx-auto max-w-3xl space-y-4">
        <div className="flex items-center justify-between">
          <Button variant="ghost" onClick={() => setSession(null)}>
            ← Back
          </Button>
          <span className="num text-sm text-slate-500">
            {results.filter(Boolean).length}/{results.length} correct
          </span>
        </div>
        {done ? (
          <Card className="p-6 text-center">
            <p className="label">Session complete</p>
            <p className="num mt-2 text-4xl font-bold">
              {results.filter(Boolean).length}/{results.length}
            </p>
            <p className="mt-2 text-slate-600 dark:text-slate-400">Missed questions stay in your review queue until you answer them correctly.</p>
            <div className="mt-4 flex justify-center gap-2">
              <Button onClick={start}>Another round</Button>
              <Button variant="secondary" onClick={() => setSession(null)}>
                Done
              </Button>
            </div>
          </Card>
        ) : (
          <SessionItem
            key={session[pos].id + pos}
            q={session[pos]}
            index={pos}
            total={session.length}
            timed={mode === 'drill'}
            onAnswered={(ok) => setResults((r) => [...r, ok])}
            onNext={() => setPos((p) => p + 1)}
          />
        )}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <header>
        <p className="label">Practice</p>
        <h1 className="text-3xl font-bold tracking-tight">Question bank</h1>
        <p className="mt-1 max-w-3xl text-slate-600 dark:text-slate-400">
          {QUESTIONS.length} board-style questions with a rationale for every option. Your review queue holds everything unanswered or last answered wrong — clear it to lock knowledge in.
        </p>
      </header>

      <div className="grid gap-3 sm:grid-cols-3">
        <Card className="p-4">
          <p className="label">Answered</p>
          <p className="num text-2xl font-bold">
            {answered}/{QUESTIONS.length}
          </p>
        </Card>
        <Card className="p-4">
          <p className="label">Currently correct</p>
          <p className="num text-2xl font-bold">{correctNow}</p>
        </Card>
        <Card className="p-4">
          <p className="label">In review queue</p>
          <p className="num text-2xl font-bold">{QUESTIONS.length - correctNow}</p>
        </Card>
      </div>

      <Card className="space-y-4 p-5">
        <Segmented<Mode>
          label="Mode"
          value={mode}
          onChange={setMode}
          options={[
            { value: 'queue', label: 'Review queue' },
            { value: 'all', label: 'All questions' },
            { value: 'drill', label: `Speed drill (${DRILL_SECONDS} s)` },
          ]}
        />
        <div>
          <label htmlFor="pm" className="mb-1 block text-xs font-medium text-slate-600 dark:text-slate-400">
            Module
          </label>
          <select id="pm" className="input max-w-md" value={moduleId} onChange={(e) => setModuleId(e.target.value)}>
            <option value="all">All modules</option>
            {MODULES.map((m) => (
              <option key={m.id} value={m.id}>
                {m.number}. {m.title}
              </option>
            ))}
          </select>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <Button onClick={start} disabled={(mode === 'queue' ? queue : pool).length === 0}>
            Start {mode === 'drill' ? '10-question drill' : `${(mode === 'queue' ? queue : pool).length} questions`}
          </Button>
          {mode === 'queue' && queue.length === 0 && <span className="text-sm text-emerald-700 dark:text-emerald-300">Queue clear for this selection 🎉</span>}
        </div>
      </Card>

      <section>
        <h2 className="mb-3 text-lg font-semibold">By module</h2>
        <div className="grid gap-2 sm:grid-cols-2">
          {MODULES.map((m) => {
            const qs = QUESTIONS.filter((q) => q.module === m.id);
            const ok = qs.filter((q) => answers[q.id]?.correct).length;
            return (
              <button
                key={m.id}
                onClick={() => {
                  setModuleId(m.id);
                  setMode('all');
                }}
                className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white p-3 text-left hover:border-slate-300 dark:border-slate-800 dark:bg-slate-900 dark:hover:border-slate-700"
              >
                <span className="num w-6 text-sm text-slate-500">{m.number}</span>
                <span className="min-w-0 flex-1 text-sm font-medium">{m.title}</span>
                <span className="h-1.5 w-20 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800" aria-hidden>
                  <span className="block h-full bg-emerald-500" style={{ width: `${(ok / qs.length) * 100}%` }} />
                </span>
                <span className="num w-10 text-right text-xs text-slate-500">
                  {ok}/{qs.length}
                </span>
              </button>
            );
          })}
        </div>
      </section>
    </div>
  );
}

function SessionItem({ q, index, total, timed, onAnswered, onNext }: { q: Question; index: number; total: number; timed: boolean; onAnswered: (ok: boolean) => void; onNext: () => void }) {
  const [left, setLeft] = useState(DRILL_SECONDS);
  const [answered, setAnswered] = useState(false);
  useEffect(() => {
    if (!timed || answered) return;
    const t = setInterval(() => setLeft((l) => Math.max(0, l - 1)), 1000);
    return () => clearInterval(t);
  }, [timed, answered]);
  const timeUp = timed && left === 0;
  return (
    <div className="space-y-3">
      {timed && !answered && (
        <div className="h-1.5 overflow-hidden rounded-full bg-slate-200 dark:bg-slate-800" role="timer" aria-label={`${left} seconds left`}>
          <div className={clsx('h-full transition-all duration-1000 ease-linear', left <= 5 ? 'bg-rose-500' : 'bg-blue-600')} style={{ width: `${(left / DRILL_SECONDS) * 100}%` }} />
        </div>
      )}
      <QuestionCard
        q={q}
        index={index}
        total={total}
        timeLimitSec={timed ? DRILL_SECONDS : undefined}
        onDone={(ok) => {
          setAnswered(true);
          onAnswered(ok);
        }}
      />
      {answered && (
        <div className="flex items-center justify-between">
          {timeUp ? <Badge tone="rose">Time up</Badge> : <span />}
          <Button onClick={onNext}>{index + 1 < total ? 'Next question →' : 'Finish'}</Button>
        </div>
      )}
    </div>
  );
}

import { useEffect, useId, useRef, useState } from 'react';
import { clsx } from 'clsx';
import type { Question } from '@/data/types';
import { useProgress } from '@/store/progress';
import { Badge, Button } from '@/components/ui/primitives';
import { Cite, RichText } from '@/components/ui/RichText';

export function gradeQuestion(q: Question, selected: string[], numeric: number): boolean {
  if (q.type === 'numeric') return q.numeric ? Math.abs(numeric - q.numeric.value) <= q.numeric.tolerance : false;
  const ans = q.answer ?? [];
  return ans.length === selected.length && ans.every((a) => selected.includes(a));
}

interface Props {
  q: Question;
  index?: number;
  total?: number;
  onDone?: (correct: boolean) => void;
  /** auto-submit after this many seconds (speed drill) */
  timeLimitSec?: number;
  compact?: boolean;
}

export function QuestionCard({ q, index, total, onDone, timeLimitSec, compact }: Props) {
  const [selected, setSelected] = useState<string[]>([]);
  const [numeric, setNumeric] = useState<string>('');
  const [submitted, setSubmitted] = useState(false);
  const [correct, setCorrect] = useState(false);
  const record = useProgress((s) => s.recordAnswer);
  const prev = useProgress((s) => s.answers[q.id]);
  const nameId = useId();

  const submit = () => {
    if (submitted) return;
    const ok = gradeQuestion(q, selected, Number(numeric));
    setCorrect(ok);
    setSubmitted(true);
    record(q.id, ok);
    onDone?.(ok);
  };

  const submitRef = useRef(submit);
  useEffect(() => {
    submitRef.current = submit;
  });
  useEffect(() => {
    if (!timeLimitSec || submitted) return;
    const t = setTimeout(() => submitRef.current(), timeLimitSec * 1000);
    return () => clearTimeout(t);
  }, [timeLimitSec, submitted]);

  const toggle = (id: string) => {
    if (submitted) return;
    if (q.type === 'single') setSelected([id]);
    else setSelected((s) => (s.includes(id) ? s.filter((x) => x !== id) : [...s, id]));
  };

  const canSubmit = q.type === 'numeric' ? numeric.trim() !== '' && Number.isFinite(Number(numeric)) : selected.length > 0;

  return (
    <article data-question={q.id} className={clsx('card', compact ? 'p-4' : 'p-5')} aria-labelledby={`${nameId}-stem`}>
      <div className="mb-3 flex flex-wrap items-center gap-2 text-xs">
        {index !== undefined && total !== undefined && (
          <span className="num text-slate-500">
            {index + 1}/{total}
          </span>
        )}
        <Badge tone={q.difficulty === 1 ? 'emerald' : q.difficulty === 2 ? 'amber' : 'rose'}>{q.difficulty === 1 ? 'Core' : q.difficulty === 2 ? 'Applied' : 'Advanced'}</Badge>
        {q.type === 'multi' && <Badge tone="violet">Select all that apply</Badge>}
        {q.type === 'numeric' && <Badge tone="blue">Calculate</Badge>}
        {prev && !submitted && <span className="text-slate-500">{prev.correct ? 'Last attempt: correct' : 'Last attempt: incorrect'}</span>}
      </div>
      <p id={`${nameId}-stem`} className="mb-4 font-medium leading-relaxed text-slate-900 dark:text-white">
        <RichText text={q.stem} />
      </p>

      {q.type === 'numeric' ? (
        <div className="flex items-center gap-2">
          <input
            className="input max-w-40"
            inputMode="decimal"
            aria-label="Your answer"
            value={numeric}
            disabled={submitted}
            onChange={(e) => setNumeric(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && canSubmit && submit()}
          />
          <span className="text-sm text-slate-500">{q.numeric?.unit}</span>
        </div>
      ) : (
        <div role={q.type === 'single' ? 'radiogroup' : 'group'} aria-labelledby={`${nameId}-stem`} className="space-y-2">
          {q.options!.map((o) => {
            const isSel = selected.includes(o.id);
            const isAns = q.answer!.includes(o.id);
            return (
              <div key={o.id}>
                <button
                  type="button"
                  role={q.type === 'single' ? 'radio' : 'checkbox'}
                  aria-checked={isSel}
                  disabled={submitted}
                  onClick={() => toggle(o.id)}
                  className={clsx(
                    'flex w-full items-start gap-3 rounded-xl border px-3 py-2.5 text-left text-sm transition-colors',
                    !submitted && (isSel ? 'border-blue-500 bg-blue-50 dark:border-blue-400 dark:bg-blue-950/40' : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50 dark:border-slate-800 dark:hover:border-slate-700 dark:hover:bg-slate-800/50'),
                    submitted && isAns && 'border-emerald-500 bg-emerald-50 dark:border-emerald-600 dark:bg-emerald-950/40',
                    submitted && isSel && !isAns && 'border-rose-500 bg-rose-50 dark:border-rose-600 dark:bg-rose-950/40',
                    submitted && !isSel && !isAns && 'border-slate-200 opacity-80 dark:border-slate-800',
                  )}
                >
                  <span
                    aria-hidden
                    className={clsx(
                      'mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center border text-[11px] font-bold',
                      q.type === 'single' ? 'rounded-full' : 'rounded',
                      isSel ? 'border-blue-600 bg-blue-600 text-white' : 'border-slate-400 text-transparent',
                      submitted && isAns && 'border-emerald-600 bg-emerald-600 text-white',
                    )}
                  >
                    {submitted ? (isAns ? '✓' : isSel ? '✕' : '') : isSel ? '✓' : ''}
                  </span>
                  <span className="text-slate-800 dark:text-slate-200">{o.text}</span>
                </button>
                {submitted && o.why && (isSel || isAns) && <p className={clsx('mt-1 ml-8 text-xs', isAns ? 'text-emerald-800 dark:text-emerald-300' : 'text-rose-800 dark:text-rose-300')}>{o.why}</p>}
              </div>
            );
          })}
        </div>
      )}

      {!submitted ? (
        <div className="mt-4">
          <Button onClick={submit} disabled={!canSubmit}>
            Check answer
          </Button>
        </div>
      ) : (
        <div className={clsx('mt-4 rounded-xl p-3 text-sm', correct ? 'bg-emerald-50 dark:bg-emerald-950/40' : 'bg-rose-50 dark:bg-rose-950/40')} role="status" aria-live="polite">
          <p className={clsx('font-semibold', correct ? 'text-emerald-800 dark:text-emerald-200' : 'text-rose-800 dark:text-rose-200')}>
            {correct ? '✓ Correct' : '✕ Not quite'}
            {q.type === 'numeric' && q.numeric && (
              <span className="num ml-2 font-normal">
                Answer: {q.numeric.value} {q.numeric.unit}
              </span>
            )}
          </p>
          <p className="mt-1 leading-relaxed text-slate-700 dark:text-slate-300">
            <RichText text={q.explanation} />
            {q.refs?.map((r) => <Cite key={r} id={r} />)}
          </p>
        </div>
      )}
    </article>
  );
}

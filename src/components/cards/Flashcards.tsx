import { useMemo, useState } from 'react';
import { clsx } from 'clsx';
import { CARDS } from '@/data/cards';
import type { Card as CardT } from '@/data/types';
import { isDue, MAX_BOX, orderDeck } from '@/lib/srs';
import { useProgress } from '@/store/progress';
import { Button, Card } from '@/components/ui/primitives';

const DECKS: { id: CardT['deck'] | 'all'; label: string }[] = [
  { id: 'all', label: 'All' },
  { id: 'physiology', label: 'Physiology' },
  { id: 'hyponatremia', label: 'Hyponatremia' },
  { id: 'treatment', label: 'Treatment' },
  { id: 'polyuria', label: 'Polyuria' },
  { id: 'hypernatremia', label: 'Hypernatremia' },
  { id: 'special', label: 'Special' },
];

export function Flashcards() {
  const states = useProgress((s) => s.cards);
  const review = useProgress((s) => s.reviewCard);
  const [deck, setDeck] = useState<(typeof DECKS)[number]['id']>('all');
  const [flipped, setFlipped] = useState(false);
  const [sessionSeen, setSessionSeen] = useState(0);
  const [lastId, setLastId] = useState<string | null>(null);

  const cards = useMemo(() => CARDS.filter((c) => deck === 'all' || c.deck === deck), [deck]);
  // Recompute order only when the deck or session advances, so the current card doesn't jump.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const ordered = useMemo(() => orderDeck(cards, states), [cards, sessionSeen]);
  const due = cards.filter((c) => isDue(states[c.id])).length;
  const mastered = cards.filter((c) => (states[c.id]?.box ?? 0) >= MAX_BOX).length;
  const dueCards = ordered.filter((c) => isDue(states[c.id]));
  const current = dueCards.find((c) => c.id !== lastId) ?? dueCards[0] ?? null;

  const answer = (remembered: boolean) => {
    if (!current) return;
    review(current.id, remembered);
    setLastId(current.id);
    setFlipped(false);
    setSessionSeen((n) => n + 1);
  };

  const boxes = [1, 2, 3, 4, 5].map((b) => cards.filter((c) => (states[c.id]?.box ?? 0) === b).length);
  const fresh = cards.filter((c) => !states[c.id]).length;

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <header>
        <p className="label">Retain</p>
        <h1 className="text-3xl font-bold tracking-tight">Flashcards</h1>
        <p className="mt-1 text-slate-600 dark:text-slate-400">Spaced repetition: cards you know come back after 1, 3, 7 and 16 days; misses come straight back.</p>
      </header>

      <div className="scrollbar-none -mx-1 flex gap-1.5 overflow-x-auto px-1">
        {DECKS.map((d) => (
          <button
            key={d.id}
            aria-pressed={deck === d.id}
            onClick={() => {
              setDeck(d.id);
              setFlipped(false);
            }}
            className={clsx('shrink-0 rounded-full border px-3 py-1 text-sm', deck === d.id ? 'border-blue-600 bg-blue-600 text-white' : 'border-slate-300 hover:bg-slate-100 dark:border-slate-700 dark:hover:bg-slate-800')}
          >
            {d.label}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-3 gap-2 text-center">
        <Card className="p-3">
          <p className="label">Due now</p>
          <p className="num text-2xl font-bold">{due}</p>
        </Card>
        <Card className="p-3">
          <p className="label">New</p>
          <p className="num text-2xl font-bold">{fresh}</p>
        </Card>
        <Card className="p-3">
          <p className="label">Mastered</p>
          <p className="num text-2xl font-bold">
            {mastered}/{cards.length}
          </p>
        </Card>
      </div>

      {current ? (
        <div className="space-y-3">
          <button
            onClick={() => setFlipped((f) => !f)}
            aria-label={flipped ? 'Hide answer' : 'Show answer'}
            className="card flex min-h-56 w-full flex-col items-center justify-center gap-4 p-8 text-center transition-colors hover:border-blue-300 dark:hover:border-blue-800"
          >
            <span className="label">{current.deck}</span>
            <span className="text-xl font-semibold text-balance text-slate-900 dark:text-white">{current.front}</span>
            {flipped ? (
              <span className="max-w-xl border-t border-slate-200 pt-4 text-lg leading-relaxed text-balance text-slate-700 dark:border-slate-800 dark:text-slate-200" aria-live="polite">
                {current.back}
              </span>
            ) : (
              <span className="text-sm text-slate-500">Tap or press Enter to reveal</span>
            )}
          </button>
          {flipped && (
            <div className="grid grid-cols-2 gap-2">
              <Button variant="secondary" onClick={() => answer(false)}>
                ✕ Again
              </Button>
              <Button onClick={() => answer(true)}>✓ Knew it</Button>
            </div>
          )}
        </div>
      ) : (
        <Card className="p-8 text-center">
          <p className="text-xl font-semibold">All caught up</p>
          <p className="mt-1 text-slate-600 dark:text-slate-400">No cards due in this deck. Come back tomorrow, or pick another deck.</p>
        </Card>
      )}

      <div aria-label="Leitner boxes" className="flex items-end gap-2">
        {boxes.map((n, i) => (
          <div key={i} className="flex-1 text-center">
            <div className="mx-auto w-full rounded-t-md bg-blue-500/80" style={{ height: `${Math.max(4, (n / Math.max(1, cards.length)) * 80)}px` }} aria-hidden />
            <p className="mt-1 text-[11px] text-slate-500">
              Box {i + 1}: <span className="num">{n}</span>
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

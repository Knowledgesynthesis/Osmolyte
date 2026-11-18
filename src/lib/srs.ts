/**
 * Leitner-style spaced repetition. Box 1 = review now, box 5 = mastered.
 * Intervals roughly double: 0, 1, 3, 7, 16 days.
 */

export const BOX_INTERVAL_DAYS = [0, 0, 1, 3, 7, 16] as const;
export const MAX_BOX = 5;

export interface CardState {
  box: number;
  due: number; // epoch ms
  seen: number;
}

const DAY = 86_400_000;

export function review(state: CardState | undefined, remembered: boolean, now = Date.now()): CardState {
  const box = remembered ? Math.min(MAX_BOX, (state?.box ?? 1) + 1) : 1;
  return { box, due: now + BOX_INTERVAL_DAYS[box] * DAY, seen: (state?.seen ?? 0) + 1 };
}

export function isDue(state: CardState | undefined, now = Date.now()): boolean {
  return !state || state.due <= now;
}

/** Order: due cards first (lowest box first), then new cards, then not-due by due date. */
export function orderDeck<T extends { id: string }>(cards: T[], states: Record<string, CardState>, now = Date.now()): T[] {
  return [...cards].sort((a, b) => {
    const sa = states[a.id];
    const sb = states[b.id];
    const da = isDue(sa, now) ? 0 : 1;
    const db = isDue(sb, now) ? 0 : 1;
    if (da !== db) return da - db;
    if (!sa && sb) return da === 0 ? 1 : -1;
    if (sa && !sb) return da === 0 ? -1 : 1;
    if (sa && sb) return sa.box - sb.box || sa.due - sb.due;
    return 0;
  });
}

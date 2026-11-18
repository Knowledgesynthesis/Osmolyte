import { describe, expect, it } from 'vitest';
import { isDue, orderDeck, review } from './srs';

describe('spaced repetition', () => {
  const now = 1_000_000_000_000;
  it('promotes on recall and resets on a miss', () => {
    const a = review(undefined, true, now);
    expect(a.box).toBe(2);
    const b = review(a, true, now);
    expect(b.box).toBe(3);
    expect(review(b, false, now).box).toBe(1);
  });
  it('caps at box 5', () => {
    let s = review(undefined, true, now);
    for (let i = 0; i < 10; i++) s = review(s, true, now);
    expect(s.box).toBe(5);
  });
  it('due logic', () => {
    expect(isDue(undefined, now)).toBe(true);
    expect(isDue(review(undefined, true, now - 2 * 86_400_000), now)).toBe(true);
    expect(isDue(review({ box: 3, due: 0, seen: 1 }, true, now), now)).toBe(false);
  });
  it('orders due cards before future cards', () => {
    const cards = [{ id: 'future' }, { id: 'new' }, { id: 'due' }];
    const states = {
      future: { box: 4, due: now + 5 * 86_400_000, seen: 3 },
      due: { box: 1, due: now - 1, seen: 1 },
    };
    const order = orderDeck(cards, states, now).map((c) => c.id);
    expect(order.indexOf('future')).toBe(2);
    expect(order[0]).toBe('due');
  });
});

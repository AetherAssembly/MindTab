// Inline implementations - the extension uses no module system, so functions are
// copied here to run in Vitest's Node environment.

function cardKey(c) {
  let h = 5381;
  for (let i = 0; i < c.q.length; i++) h = (h * 33 ^ c.q.charCodeAt(i)) >>> 0;
  return h.toString(36);
}

const DAY_MS = 24 * 60 * 60 * 1000;

function recordResultPure(srs, key, gotIt, now) {
  const data = srs[key] ? { ...srs[key] } : { ease: 2.5, interval: 1 };
  if (gotIt) {
    data.ease     = Math.min(3.0, data.ease + 0.1);
    data.interval = Math.max(1, Math.round(data.interval * data.ease));
  } else {
    data.ease     = Math.max(1.3, data.ease - 0.2);
    data.interval = 1;
  }
  data.nextDue = now + data.interval * DAY_MS;
  return { ...srs, [key]: data };
}

function pickCardPure(cards, srs, lastCard, now) {
  if (cards.length === 1) return cards[0];
  const due = cards.filter(c => {
    const d = srs[cardKey(c)];
    return !d || d.nextDue <= now;
  });
  const pool = due.length > 0 ? due : cards;
  let pick = pool[Math.floor(Math.random() * pool.length)];
  if (pool.length > 1 && cardKey(pick) === lastCard) {
    const others = pool.filter(c => cardKey(c) !== lastCard);
    if (others.length) pick = others[Math.floor(Math.random() * others.length)];
  }
  return pick;
}

// ─── cardKey ──────────────────────────────────────────────────────────────────

describe('cardKey', () => {
  it('returns a non-empty string', () => {
    expect(cardKey({ q: 'What is 2+2?' })).toBeTruthy();
  });

  it('returns the same key for the same question', () => {
    const c = { q: 'What is the capital of France?' };
    expect(cardKey(c)).toBe(cardKey(c));
  });

  it('returns different keys for questions that share the first 40 characters', () => {
    const prefix = 'A'.repeat(40);
    const c1 = { q: prefix + 'X' };
    const c2 = { q: prefix + 'Y' };
    expect(cardKey(c1)).not.toBe(cardKey(c2));
  });

  it('handles empty question string without throwing', () => {
    expect(() => cardKey({ q: '' })).not.toThrow();
  });

  it('produces consistent keys regardless of surrounding card fields', () => {
    expect(cardKey({ q: 'Hello?', a: 'foo' })).toBe(cardKey({ q: 'Hello?', a: 'bar' }));
  });

  it('produces a consistent key for questions with special characters and emoji', () => {
    const c = { q: 'What is 50% of 100? 🤔 "Trick" & <test>!' };
    expect(cardKey(c)).toBe(cardKey(c));
    expect(typeof cardKey(c)).toBe('string');
    expect(cardKey(c).length).toBeGreaterThan(0);
  });
});

// ─── recordResult (pure) ──────────────────────────────────────────────────────

describe('recordResult', () => {
  const card = { q: 'Test question', a: 'Test answer' };
  const key  = cardKey(card);
  const now  = Date.now();

  it('initialises a new card with default ease and interval on first result', () => {
    const srs = recordResultPure({}, key, true, now);
    expect(srs[key].ease).toBeGreaterThan(2.5);
    expect(srs[key].interval).toBeGreaterThanOrEqual(1);
  });

  it('increases ease and interval on "got it"', () => {
    let srs = {};
    srs = recordResultPure(srs, key, true, now);
    const ease1     = srs[key].ease;
    const interval1 = srs[key].interval;
    srs = recordResultPure(srs, key, true, now);
    expect(srs[key].ease).toBeGreaterThanOrEqual(ease1);
    expect(srs[key].interval).toBeGreaterThanOrEqual(interval1);
  });

  it('resets interval to 1 and decreases ease on skip', () => {
    let srs = recordResultPure({}, key, true, now);
    srs = recordResultPure(srs, key, false, now);
    expect(srs[key].interval).toBe(1);
    expect(srs[key].ease).toBeLessThan(2.5);
  });

  it('clamps ease above 1.3 on repeated skips', () => {
    let srs = {};
    for (let i = 0; i < 20; i++) srs = recordResultPure(srs, key, false, now);
    expect(srs[key].ease).toBeGreaterThanOrEqual(1.3);
  });

  it('clamps ease below 3.0 on repeated successes', () => {
    let srs = {};
    for (let i = 0; i < 20; i++) srs = recordResultPure(srs, key, true, now);
    expect(srs[key].ease).toBeLessThanOrEqual(3.0);
  });

  it('sets nextDue at least one day in the future', () => {
    const srs = recordResultPure({}, key, true, now);
    expect(srs[key].nextDue).toBeGreaterThan(now);
  });
});

// ─── pickCard (pure) ──────────────────────────────────────────────────────────

describe('pickCard', () => {
  const cards = [
    { q: 'Alpha', a: '1' },
    { q: 'Beta',  a: '2' },
    { q: 'Gamma', a: '3' },
  ];
  const now = Date.now();

  // Pin Math.random to 0 so pool[Math.floor(0 * n)] = pool[0] — deterministic picks.
  beforeEach(() => { vi.spyOn(Math, 'random').mockReturnValue(0); });
  afterEach(() => { vi.restoreAllMocks(); });

  it('returns the only card when pool has one entry', () => {
    expect(pickCardPure([cards[0]], {}, null, now)).toBe(cards[0]);
  });

  it('prefers a due card over a non-due card', () => {
    const futureKey = cardKey(cards[0]);
    const srs = { [futureKey]: { nextDue: now + DAY_MS * 10 } };
    const result = pickCardPure(cards.slice(0, 2), srs, null, now);
    expect(result).toBe(cards[1]);
  });

  it('avoids repeating the last-shown card when alternatives exist', () => {
    const last = cardKey(cards[0]);
    const result = pickCardPure(cards, {}, last, now);
    expect(cardKey(result)).not.toBe(last);
  });

  it('falls back to full pool when all cards are not due', () => {
    const srs = {};
    cards.forEach(c => { srs[cardKey(c)] = { nextDue: now + DAY_MS * 10 }; });
    const result = pickCardPure(cards, srs, null, now);
    expect(cards).toContain(result);
  });
});

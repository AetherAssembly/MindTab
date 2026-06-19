// Tests for the selector integrity check inside updateFilterLists() in background.js.
// The pure predicate is extracted here for unit testing.

import { describe, it, expect } from 'vitest';

// Inlined from the conditional in updateFilterLists():
//   if (cachedTotal > 0 && newTotal < cachedTotal * 0.7) → keep cache (return false)
//   otherwise → write new data (return true)
function shouldUpdateCache(newTotal, cachedTotal) {
  return !(cachedTotal > 0 && newTotal < cachedTotal * 0.7);
}

// ─── Filter integrity check ───────────────────────────────────────────────────

describe('filter integrity check (shouldUpdateCache)', () => {
  it('returns false when newTotal drops below 70% of cachedTotal', () => {
    expect(shouldUpdateCache(600, 1000)).toBe(false);
  });

  it('returns true when newTotal is at least 70% of cachedTotal', () => {
    expect(shouldUpdateCache(750, 1000)).toBe(true);
  });

  it('returns true at exactly the 70% boundary', () => {
    expect(shouldUpdateCache(700, 1000)).toBe(true);
  });

  it('returns false just below the 70% boundary', () => {
    expect(shouldUpdateCache(699, 1000)).toBe(false);
  });

  it('returns true when there is no cached data (cachedTotal = 0)', () => {
    expect(shouldUpdateCache(500, 0)).toBe(true);
  });
});

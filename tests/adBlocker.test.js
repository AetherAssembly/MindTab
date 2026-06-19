// Tests for isMalicious() from content_scripts/maliciousAdBlocker.js.
// Function is inlined here — the extension uses no module system.
// @vitest-environment jsdom

import { describe, it, expect } from 'vitest';

const textKeywords = ['download now', 'virus detected', 'free prize', 'you have won'];
const hrefPatterns = ['free-prize', 'malware-scan', 'virus-alert', 'click-here-win'];

function isMalicious(el) {
  const text = (el.textContent || '').toLowerCase().trim().slice(0, 120);
  const href = (el instanceof HTMLAnchorElement ? el.href :
                el instanceof HTMLIFrameElement  ? el.src  : '').toLowerCase();
  return textKeywords.some(k => text.includes(k)) ||
         hrefPatterns.some(p => href.includes(p));
}

// ─── isMalicious ─────────────────────────────────────────────────────────────

describe('isMalicious', () => {
  it('returns true for an anchor whose href matches an hrefPattern', () => {
    const a = document.createElement('a');
    a.href = 'https://example.com/free-prize/claim';
    expect(isMalicious(a)).toBe(true);
  });

  it('returns true for an anchor whose text matches a textKeyword', () => {
    const a = document.createElement('a');
    a.href = 'https://safe-site.com/page';
    a.textContent = 'Download Now for Free!';
    expect(isMalicious(a)).toBe(true);
  });

  it('returns false for a clean anchor element', () => {
    const a = document.createElement('a');
    a.href = 'https://wikipedia.org/wiki/Cats';
    a.textContent = 'Learn about cats';
    expect(isMalicious(a)).toBe(false);
  });

  it('handles empty href and empty textContent without throwing', () => {
    const a = document.createElement('a');
    expect(() => isMalicious(a)).not.toThrow();
    expect(isMalicious(a)).toBe(false);
  });

  it('does not match a keyword placed beyond the 120-character text limit', () => {
    const a = document.createElement('a');
    a.href = 'https://safe-site.com/';
    a.textContent = 'x'.repeat(121) + 'virus detected';
    expect(isMalicious(a)).toBe(false);
  });

  it('returns true for an iframe whose src matches an hrefPattern', () => {
    const iframe = document.createElement('iframe');
    iframe.src = 'https://evil.com/malware-scan/run';
    expect(isMalicious(iframe)).toBe(true);
  });
});

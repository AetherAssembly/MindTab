// Tests for the ABP/uBlock cosmetic filter list parser from background.js.

import { describe, it, expect } from 'vitest';

// ── Inlined from background.js ────────────────────────────────────────────────

const TARGET_DOMAINS = ['youtube.com', 'instagram.com', 'facebook.com'];

function parseFilterList(text) {
  const result = {};
  for (const d of TARGET_DOMAINS) result[d] = new Set();

  for (const raw of text.split('\n')) {
    const line = raw.trim();
    if (!line || line.startsWith('!') || line.startsWith('[') || line.startsWith('@@')) continue;

    const sep = line.indexOf('##');
    if (sep === -1) continue;

    const domainsPart = line.substring(0, sep);
    if (!domainsPart) continue;

    const selector = line.substring(sep + 2);
    if (!selector) continue;

    if (selector.includes(':matches') || selector.includes(':upward(') ||
        selector.includes(':is(') && selector.includes(':not(') ||
        (selector.startsWith(':') && selector.includes('('))) continue;

    const lineDomains = domainsPart.split(',').map(d => d.trim().toLowerCase());

    for (const target of TARGET_DOMAINS) {
      if (lineDomains.some(d => {
        if (d.startsWith('~')) return false;
        return d === target || target.endsWith('.' + d);
      })) {
        result[target].add(selector);
      }
    }
  }

  return Object.fromEntries(
    Object.entries(result).map(([k, v]) => [k, [...v]])
  );
}

// ── Tests ─────────────────────────────────────────────────────────────────────

describe('parseFilterList', () => {
  it('parses a basic domain##selector rule', () => {
    const input = 'youtube.com##ytd-rich-shelf-renderer[is-shorts]';
    const result = parseFilterList(input);
    expect(result['youtube.com']).toContain('ytd-rich-shelf-renderer[is-shorts]');
  });

  it('ignores comment lines starting with !', () => {
    const input = '! This is a comment\nyoutube.com##.some-class';
    const result = parseFilterList(input);
    expect(result['youtube.com']).toContain('.some-class');
    expect(result['youtube.com'].length).toBe(1);
  });

  it('ignores lines starting with @@  (exception rules)', () => {
    const input = '@@youtube.com##.some-class';
    const result = parseFilterList(input);
    expect(result['youtube.com'].length).toBe(0);
  });

  it('ignores global rules with no domain part', () => {
    const input = '##.global-selector';
    const result = parseFilterList(input);
    for (const domain of TARGET_DOMAINS) {
      expect(result[domain].length).toBe(0);
    }
  });

  it('ignores exclusion domain rules (~domain)', () => {
    const input = '~youtube.com##.excluded-element';
    const result = parseFilterList(input);
    expect(result['youtube.com'].length).toBe(0);
  });

  it('matches rules with multiple domains', () => {
    const input = 'youtube.com,instagram.com##.shorts-reel-element';
    const result = parseFilterList(input);
    expect(result['youtube.com']).toContain('.shorts-reel-element');
    expect(result['instagram.com']).toContain('.shorts-reel-element');
    expect(result['facebook.com'].length).toBe(0);
  });

  it('skips procedural/extended filter selectors', () => {
    const proc = [
      'youtube.com##:matches-css(display: block)',
      'youtube.com##:upward(div)',
    ];
    for (const line of proc) {
      const result = parseFilterList(line);
      expect(result['youtube.com'].length).toBe(0);
    }
  });

  it('deduplicates identical selectors', () => {
    const input = 'youtube.com##.dup\nyoutube.com##.dup\nyoutube.com##.dup';
    const result = parseFilterList(input);
    expect(result['youtube.com'].filter(s => s === '.dup').length).toBe(1);
  });

  it('handles empty input gracefully', () => {
    const result = parseFilterList('');
    for (const domain of TARGET_DOMAINS) {
      expect(Array.isArray(result[domain])).toBe(true);
      expect(result[domain].length).toBe(0);
    }
  });

  it('handles lines with no ## separator', () => {
    const input = 'youtube.com/some-network-rule';
    const result = parseFilterList(input);
    expect(result['youtube.com'].length).toBe(0);
  });

  it('does not assign rules to non-target domains', () => {
    const input = 'twitter.com##.tweet-ad';
    const result = parseFilterList(input);
    for (const domain of TARGET_DOMAINS) {
      expect(result[domain].length).toBe(0);
    }
  });

  it('does not capture subdomain rules under their parent target', () => {
    // The parser checks target.endsWith('.' + d), not d.endsWith('.' + target).
    // A rule for www.youtube.com is more specific than our youtube.com target bucket
    // and is correctly NOT captured — callers add www.youtube.com rules separately.
    const input = 'www.youtube.com##.shorts-shelf';
    const result = parseFilterList(input);
    expect(result['youtube.com']).not.toContain('.shorts-shelf');
  });

  it('ignores lines starting with [', () => {
    const input = '[Adblock Plus 2.0]\nyoutube.com##.shorts';
    const result = parseFilterList(input);
    expect(result['youtube.com']).toContain('.shorts');
    expect(result['youtube.com'].length).toBe(1);
  });
});

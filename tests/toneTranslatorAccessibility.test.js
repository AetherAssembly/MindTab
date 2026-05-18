import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';

const source = readFileSync(new URL('../content_scripts/toneTranslator.js', import.meta.url), 'utf8');

describe('writing assistant accessibility live regions', () => {
  it('does not make the entire panel a live region', () => {
    expect(source).not.toContain("panel.setAttribute('aria-live', 'polite')");
  });

  it('scopes polite announcements to the suggestions container', () => {
    expect(source).toContain('id="mt-suggestions" aria-live="polite" aria-atomic="false"');
  });
});

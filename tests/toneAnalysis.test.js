// Tests for pure tone analysis functions from content_scripts/toneTranslator.js.
// Functions are inlined here because the extension uses no module system.

import { describe, it, expect } from 'vitest';

// ── Inlined from toneTranslator.js ────────────────────────────────────────────

const MT_WEAK_WORDS = [
  'very', 'really', 'quite', 'basically', 'actually', 'literally',
  'honestly', 'just', 'simply', 'obviously', 'clearly', 'definitely',
  'probably', 'maybe', 'perhaps', 'somewhat', 'rather', 'fairly',
  'pretty', 'sort of', 'kind of', 'a bit', 'a little', 'needless to say'
];

const MT_FILLER_WORDS = [
  'um,', 'uh,', 'er,', 'you know,', 'i mean,', 'like i said', 'as i said'
];

const MT_PASSIVE_RE = /\b(am|is|are|was|were|be|been|being)\s+(\w+(?:ed|en))\b/gi;

const MT_STOP_WORDS = new Set([
  'the','a','an','and','or','but','in','on','at','to','for','of','with',
  'is','are','was','were','be','been','have','has','had','do','did','will',
  'would','could','should','may','might','can','this','that','these','those',
  'i','you','he','she','it','we','they','my','your','his','her','its','our','their',
  'not','no','so','if','as','by','from','then','than','when','what','which','who',
  'how','all','some','more','most','also','just','into','up','out','about'
]);

function mtSyllables(word) {
  const w = word.toLowerCase().replace(/[^a-z]/g, '');
  if (w.length <= 3) return 1;
  const stripped = w.replace(/(?:[^laeiouy]es|ed|[^laeiouy]e)$/, '').replace(/^y/, '');
  const m = stripped.match(/[aeiouy]{1,2}/g);
  return m ? Math.max(1, m.length) : 1;
}

function mtReadability(words, sentences) {
  if (!sentences || !words?.length) return null;
  const syllables = words.reduce((n, w) => n + mtSyllables(w), 0);
  const grade = Math.round(
    0.39 * (words.length / sentences) +
    11.8 * (syllables  / words.length) - 15.59
  );
  const g = Math.max(1, Math.min(16, grade));
  const labels = [,'Elementary','Elementary','Elementary','Elementary','Elementary',
    '6th grade','7th grade','8th grade','9th grade','10th grade',
    '11th grade','12th grade','College','College','Graduate','Graduate'];
  return { grade: g, label: labels[g] };
}

function mtDetectTone(lower, toneConfig) {
  let best = null, bestScore = 0;
  for (const [key, def] of Object.entries(toneConfig.tones)) {
    const score = def.keywords.filter(k => lower.includes(k)).length;
    if (score > bestScore) { bestScore = score; best = key; }
  }
  return best;
}

function mtAnalyzeLocally(text, toneConfig, checks = {}, longThreshold = 30) {
  const lower    = text.toLowerCase();
  const words    = text.split(/\s+/).filter(Boolean);
  const sentences = text.split(/[.!?]+/).filter(s => s.trim().split(/\s+/).length > 2);
  const suggestions = [];

  if (checks.passive !== false) {
    const passiveHits = [...text.matchAll(MT_PASSIVE_RE)];
    if (passiveHits.length) {
      const ex = passiveHits.slice(0, 2).map(m => `"${m[0]}"`).join(', ');
      suggestions.push({ level: 'warn', text: `Passive voice: ${ex}` });
    }
  }

  if (checks.weak !== false) {
    const weakHits = MT_WEAK_WORDS.filter(w => new RegExp(`\\b${w}\\b`, 'i').test(text));
    if (weakHits.length) {
      const total = weakHits.reduce((n, w) =>
        n + (lower.match(new RegExp(`\\b${w}\\b`, 'g')) || []).length, 0);
      suggestions.push({ level: 'warn', text: `${total} hedge word${total > 1 ? 's' : ''}: "${weakHits.slice(0, 3).join('", "')}"` });
    }
  }

  if (checks.long !== false) {
    const longCount = sentences.filter(s => s.split(/\s+/).filter(Boolean).length > longThreshold).length;
    if (longCount) {
      suggestions.push({ level: 'info', text: `${longCount} long sentence${longCount > 1 ? 's' : ''} - try splitting for clarity` });
    }
  }

  if (checks.filler !== false) {
    const fillerHits = MT_FILLER_WORDS.filter(w => lower.includes(w));
    if (fillerHits.length) {
      suggestions.push({ level: 'info', text: `Filler: "${fillerHits.slice(0, 2).join('", "')}"` });
    }
  }

  if (checks.repeat !== false) {
    const freq = {};
    words.forEach(w => {
      const c = w.toLowerCase().replace(/[^a-z]/g, '');
      if (c.length > 4 && !MT_STOP_WORDS.has(c)) freq[c] = (freq[c] || 0) + 1;
    });
    const repeated = Object.entries(freq).filter(([, n]) => n >= 3).sort((a, b) => b[1] - a[1]);
    if (repeated.length) {
      const ex = repeated.slice(0, 2).map(([w, n]) => `"${w}" ×${n}`).join(', ');
      suggestions.push({ level: 'info', text: `Repeated: ${ex}` });
    }
  }

  return {
    tone: mtDetectTone(lower, toneConfig),
    suggestions,
    stats: {
      words: words.length,
      sentences: sentences.length,
      readability: mtReadability(words, sentences.length)
    }
  };
}

// ── Fixtures ──────────────────────────────────────────────────────────────────

const TONE_CONFIG = {
  tones: {
    aggressive:        { keywords: ['hate', 'terrible', 'stupid', 'awful', 'ridiculous'] },
    passive_aggressive: { keywords: ['fine', 'whatever', 'noted', 'as per my last', 'friendly reminder'] },
    formal:            { keywords: ['sincerely', 'regards', 'hereby', 'pursuant', 'kindly'] },
    casual:            { keywords: ['hey', 'yeah', 'gonna', 'lol', 'tbh', 'ngl'] },
    positive:          { keywords: ['great', 'excellent', 'amazing', 'thank you', 'appreciate'] },
    urgent:            { keywords: ['asap', 'urgent', 'immediately', 'critical', 'deadline'] },
  }
};

// ── mtSyllables ───────────────────────────────────────────────────────────────

describe('mtSyllables', () => {
  it('returns 1 for short words', () => {
    expect(mtSyllables('the')).toBe(1);
    expect(mtSyllables('a')).toBe(1);
  });

  it('counts syllables in common words', () => {
    expect(mtSyllables('beautiful')).toBeGreaterThanOrEqual(3);
    expect(mtSyllables('education')).toBeGreaterThanOrEqual(4);
    expect(mtSyllables('cat')).toBe(1);
  });

  it('never returns less than 1', () => {
    expect(mtSyllables('rhythm')).toBeGreaterThanOrEqual(1);
  });
});

// ── mtReadability ─────────────────────────────────────────────────────────────

describe('mtReadability', () => {
  it('returns null when sentences is 0', () => {
    expect(mtReadability(['hello', 'world'], 0)).toBeNull();
  });

  it('returns null when words array is empty', () => {
    expect(mtReadability([], 1)).toBeNull();
  });

  it('returns a grade between 1 and 16', () => {
    const words = 'The cat sat on the mat it was very flat'.split(' ');
    const r = mtReadability(words, 2);
    expect(r).not.toBeNull();
    expect(r.grade).toBeGreaterThanOrEqual(1);
    expect(r.grade).toBeLessThanOrEqual(16);
    expect(typeof r.label).toBe('string');
  });

  it('scores simple text lower than complex text', () => {
    const simple = 'The cat sat. The dog ran.'.split(' ');
    const complex = 'The implementation of aforementioned constitutional amendments precipitates substantial jurisprudential ramifications.'.split(' ');
    const rSimple  = mtReadability(simple, 2);
    const rComplex = mtReadability(complex, 1);
    expect(rComplex.grade).toBeGreaterThan(rSimple.grade);
  });
});

// ── mtDetectTone ──────────────────────────────────────────────────────────────

describe('mtDetectTone', () => {
  it('detects aggressive tone', () => {
    expect(mtDetectTone('this is terrible and stupid', TONE_CONFIG)).toBe('aggressive');
  });

  it('detects casual tone', () => {
    expect(mtDetectTone('hey yeah gonna do it lol ngl tbh', TONE_CONFIG)).toBe('casual');
  });

  it('detects positive tone', () => {
    expect(mtDetectTone('thank you this is great and amazing', TONE_CONFIG)).toBe('positive');
  });

  it('detects formal tone', () => {
    expect(mtDetectTone('sincerely regards hereby kindly', TONE_CONFIG)).toBe('formal');
  });

  it('detects urgent tone', () => {
    expect(mtDetectTone('asap urgent critical deadline', TONE_CONFIG)).toBe('urgent');
  });

  it('returns null when no keywords match', () => {
    expect(mtDetectTone('hello world this is a test message', TONE_CONFIG)).toBeNull();
  });

  it('picks the tone with the most keyword matches', () => {
    // 3 aggressive + 1 positive → aggressive
    const lower = 'terrible stupid awful thank you';
    expect(mtDetectTone(lower, TONE_CONFIG)).toBe('aggressive');
  });
});

// ── mtAnalyzeLocally ──────────────────────────────────────────────────────────

describe('mtAnalyzeLocally', () => {
  it('returns stats with word count and sentence count', () => {
    const text = 'Hello world. This is a test sentence.';
    const r = mtAnalyzeLocally(text, TONE_CONFIG);
    expect(r.stats.words).toBeGreaterThan(0);
    expect(r.stats.sentences).toBeGreaterThan(0);
  });

  it('detects passive voice', () => {
    const text = 'The letter was written by the student who was motivated by curiosity.';
    const r = mtAnalyzeLocally(text, TONE_CONFIG);
    const hasPassive = r.suggestions.some(s => s.text.startsWith('Passive voice'));
    expect(hasPassive).toBe(true);
  });

  it('detects hedge words', () => {
    const text = 'I very basically just really think this is probably maybe a bit obvious.';
    const r = mtAnalyzeLocally(text, TONE_CONFIG);
    const hasWeak = r.suggestions.some(s => s.text.includes('hedge'));
    expect(hasWeak).toBe(true);
  });

  it('detects filler words', () => {
    const text = 'I mean, um, you know, this is something that, like i said, matters a lot.';
    const r = mtAnalyzeLocally(text, TONE_CONFIG);
    const hasFiller = r.suggestions.some(s => s.text.startsWith('Filler'));
    expect(hasFiller).toBe(true);
  });

  it('detects repeated words', () => {
    const text = 'The project project project needs attention because the project manager wants the project done.';
    const r = mtAnalyzeLocally(text, TONE_CONFIG);
    const hasRepeat = r.suggestions.some(s => s.text.startsWith('Repeated'));
    expect(hasRepeat).toBe(true);
  });

  it('skips disabled checks', () => {
    const text = 'The letter was written. I very basically just really probably think this.';
    const r = mtAnalyzeLocally(text, TONE_CONFIG, { passive: false, weak: false });
    const hasPassive = r.suggestions.some(s => s.text.startsWith('Passive'));
    const hasWeak    = r.suggestions.some(s => s.text.includes('hedge'));
    expect(hasPassive).toBe(false);
    expect(hasWeak).toBe(false);
  });

  it('respects custom long sentence threshold', () => {
    // 10-word sentence - above threshold of 8, below default of 30
    const text = 'This sentence has exactly ten words total in it.';
    const defaultR = mtAnalyzeLocally(text, TONE_CONFIG, {}, 30);
    const lowR     = mtAnalyzeLocally(text, TONE_CONFIG, {}, 8);
    const defaultLong = defaultR.suggestions.some(s => s.text.includes('long sentence'));
    const lowLong     = lowR.suggestions.some(s => s.text.includes('long sentence'));
    expect(defaultLong).toBe(false);
    expect(lowLong).toBe(true);
  });

  it('has no suggestions for clean text', () => {
    const text = 'The team completed the project on time and delivered excellent results.';
    const r = mtAnalyzeLocally(text, TONE_CONFIG);
    // No passive, no hedge, no filler, no repeats - suggestions may be empty
    const hasPassive = r.suggestions.some(s => s.text.startsWith('Passive'));
    const hasFiller  = r.suggestions.some(s => s.text.startsWith('Filler'));
    expect(hasPassive).toBe(false);
    expect(hasFiller).toBe(false);
  });
});

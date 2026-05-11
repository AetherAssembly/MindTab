// MindTab — Writing Assistant
// Local analysis (always) + optional LanguageTool-compatible server for grammar/spelling.
// Server field in popup accepts any LanguageTool v2 endpoint, including self-hosted.

// ─── Analysis data ────────────────────────────────────────────────────────────

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

// ─── Analysis helpers ─────────────────────────────────────────────────────────

function mtSyllables(word) {
  const w = word.toLowerCase().replace(/[^a-z]/g, '');
  if (w.length <= 3) return 1;
  const stripped = w.replace(/(?:[^laeiouy]es|ed|[^laeiouy]e)$/, '').replace(/^y/, '');
  const m = stripped.match(/[aeiouy]{1,2}/g);
  return m ? Math.max(1, m.length) : 1;
}

function mtReadability(words, sentences) {
  if (!sentences || !words) return null;
  const syllables = words.reduce((n, w) => n + mtSyllables(w), 0);
  const grade = Math.round(
    0.39 * (words.length / sentences.length) +
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

function mtAnalyzeLocally(text, toneConfig) {
  const lower    = text.toLowerCase();
  const words    = text.split(/\s+/).filter(Boolean);
  const sentences = text.split(/[.!?]+/).filter(s => s.trim().split(/\s+/).length > 2);
  const suggestions = [];

  // Passive voice
  const passiveHits = [...text.matchAll(MT_PASSIVE_RE)];
  if (passiveHits.length) {
    const ex = passiveHits.slice(0, 2).map(m => `"${m[0]}"`).join(', ');
    suggestions.push({ level: 'warn', text: `Passive voice: ${ex}` });
  }

  // Hedge words
  const weakHits = MT_WEAK_WORDS.filter(w => new RegExp(`\\b${w}\\b`, 'i').test(text));
  if (weakHits.length) {
    const total = weakHits.reduce((n, w) =>
      n + (lower.match(new RegExp(`\\b${w}\\b`, 'g')) || []).length, 0);
    suggestions.push({ level: 'warn', text: `${total} hedge word${total > 1 ? 's' : ''}: "${weakHits.slice(0, 3).join('", "')}"` });
  }

  // Long sentences (>30 words)
  const longCount = sentences.filter(s => s.split(/\s+/).filter(Boolean).length > 30).length;
  if (longCount) {
    suggestions.push({ level: 'info', text: `${longCount} long sentence${longCount > 1 ? 's' : ''} — try splitting for clarity` });
  }

  // Filler words
  const fillerHits = MT_FILLER_WORDS.filter(w => lower.includes(w));
  if (fillerHits.length) {
    suggestions.push({ level: 'info', text: `Filler: "${fillerHits.slice(0, 2).join('", "')}"` });
  }

  // Repeated meaningful words (3+ times)
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

// ─── Panel UI ─────────────────────────────────────────────────────────────────

function mtBuildPanel() {
  const style = document.createElement('style');
  style.textContent = `
    #mt-panel {
      position: fixed;
      bottom: 20px;
      right: 20px;
      width: 272px;
      background: #131322;
      border: 1px solid rgba(74,144,226,0.35);
      border-radius: 14px;
      z-index: 2147483647;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
      font-size: 13px;
      color: #e0e0f0;
      box-shadow: 0 8px 32px rgba(0,0,0,0.55);
      display: none;
      overflow: hidden;
    }
    #mt-panel.mt-minimized #mt-body { display: none; }
    #mt-panel-head {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 9px 13px;
      background: rgba(74,144,226,0.08);
      border-bottom: 1px solid rgba(74,144,226,0.15);
      cursor: default;
    }
    #mt-panel-title {
      font-size: 10px;
      font-weight: 700;
      letter-spacing: 1.2px;
      text-transform: uppercase;
      color: #4A90E2;
    }
    .mt-hbtn {
      background: none; border: none; color: #555;
      font-size: 14px; cursor: pointer; padding: 0 2px;
      line-height: 1; transition: color 0.15s;
    }
    .mt-hbtn:hover { color: #ddd; }
    #mt-body { padding: 11px 13px; }
    #mt-tone-row {
      display: flex; align-items: center; gap: 8px;
      padding-bottom: 10px;
      border-bottom: 1px solid rgba(255,255,255,0.05);
      margin-bottom: 10px;
    }
    #mt-tone-label { font-size: 11px; color: #666; }
    #mt-tone-val { font-weight: 600; }
    #mt-suggestions { display: flex; flex-direction: column; gap: 5px; margin-bottom: 10px; }
    .mt-sug {
      display: flex; gap: 7px; align-items: flex-start;
      font-size: 11.5px; line-height: 1.45; color: #bbb;
    }
    .mt-sug-icon { flex-shrink: 0; margin-top: 1px; }
    .mt-sug.warn .mt-sug-icon { color: #e0a050; }
    .mt-sug.info .mt-sug-icon { color: #4A90E2; }
    .mt-ok { font-size: 11.5px; color: #27ae60; text-align: center; padding: 4px 0; }
    #mt-lt-section { margin-bottom: 10px; }
    #mt-lt-section h4 {
      font-size: 10px; color: #666; text-transform: uppercase;
      letter-spacing: 1px; margin-bottom: 6px;
    }
    .mt-lt-issue {
      font-size: 11px; color: #ddd; line-height: 1.4;
      background: rgba(231,76,60,0.08);
      border-left: 2px solid #c0392b;
      padding: 5px 8px; border-radius: 0 5px 5px 0;
      margin-bottom: 4px;
    }
    .mt-lt-issue strong { color: #e88; display: block; margin-bottom: 2px; }
    .mt-lt-issue span { color: #27ae60; }
    #mt-stats {
      display: flex; gap: 10px; flex-wrap: wrap;
      font-size: 10.5px; color: #555;
      padding-top: 9px;
      border-top: 1px solid rgba(255,255,255,0.05);
    }
    .mt-stat-val { color: #888; }
    #mt-analyzing {
      font-size: 11px; color: #555; text-align: center; padding: 4px 0;
    }
  `;
  document.head.appendChild(style);

  const panel = document.createElement('div');
  panel.id = 'mt-panel';
  panel.setAttribute('aria-live', 'polite');
  panel.innerHTML = `
    <div id="mt-panel-head">
      <span id="mt-panel-title">⚡ MindTab</span>
      <div style="display:flex;gap:6px">
        <button class="mt-hbtn" id="mt-min-btn" title="Minimize">−</button>
        <button class="mt-hbtn" id="mt-close-btn" title="Close">✕</button>
      </div>
    </div>
    <div id="mt-body">
      <div id="mt-tone-row">
        <span id="mt-tone-label">Tone</span>
        <span id="mt-tone-val">—</span>
      </div>
      <div id="mt-suggestions"></div>
      <div id="mt-lt-section" style="display:none">
        <h4>Grammar &amp; Spelling</h4>
        <div id="mt-lt-issues"></div>
      </div>
      <div id="mt-stats"></div>
    </div>
  `;
  document.body.appendChild(panel);
  return panel;
}

// ─── Panel rendering ──────────────────────────────────────────────────────────

function mtRenderLocal(result, toneConfig) {
  const toneVal  = document.getElementById('mt-tone-val');
  const sugsEl   = document.getElementById('mt-suggestions');

  // Tone
  if (result.tone) {
    const def = toneConfig.tones[result.tone];
    toneVal.innerHTML = `<span style="margin-right:4px">${def.emoji}</span><span style="color:${def.color};font-weight:700">${def.label}</span>`;
  } else {
    toneVal.textContent = '—';
  }

  // Suggestions
  sugsEl.innerHTML = '';
  if (result.suggestions.length === 0) {
    sugsEl.innerHTML = '<div class="mt-ok">✓ Looks good!</div>';
  } else {
    result.suggestions.forEach(s => {
      const icon = s.level === 'warn' ? '⚠' : 'ℹ';
      sugsEl.insertAdjacentHTML('beforeend',
        `<div class="mt-sug ${s.level}"><span class="mt-sug-icon">${icon}</span><span>${s.text}</span></div>`);
    });
  }

  // Stats
  const r = result.stats.readability;
  document.getElementById('mt-stats').innerHTML = `
    <span><span class="mt-stat-val">${result.stats.words}</span> words</span>
    <span><span class="mt-stat-val">${result.stats.sentences}</span> sentences</span>
    ${r ? `<span>~<span class="mt-stat-val">${r.label}</span></span>` : ''}
  `;
}

function mtRenderLT(matches) {
  const section  = document.getElementById('mt-lt-section');
  const issuesEl = document.getElementById('mt-lt-issues');
  issuesEl.innerHTML = '';

  if (!matches || matches.length === 0) {
    section.style.display = 'none';
    return;
  }

  section.style.display = 'block';
  // Show up to 6 issues to avoid overwhelming
  matches.slice(0, 6).forEach(m => {
    const replacements = (m.replacements || []).slice(0, 3).map(r => r.value).join(', ');
    issuesEl.insertAdjacentHTML('beforeend', `
      <div class="mt-lt-issue">
        <strong>${escHtml(m.message)}</strong>
        ${replacements ? `<span>Suggestion: ${escHtml(replacements)}</span>` : ''}
      </div>
    `);
  });
}

function escHtml(s) {
  return (s || '').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}

// ─── Main init ────────────────────────────────────────────────────────────────

function initToneTranslator() {
  if (!window.__MindTab?.state?.toneTranslator) return;

  const toneConfig = window.__MindTab.toneConfig;
  if (!toneConfig) return;

  const serverUrl = (window.__MindTab.state.toneApiUrl || '').trim();
  const minWords  = toneConfig.minWords || 15;

  const panel  = mtBuildPanel();
  let hidden   = false;   // user closed it for this page session
  let minimized = false;
  let debouncer, abortCtrl;
  let activeEl  = null;

  // Header buttons
  document.getElementById('mt-min-btn').addEventListener('click', () => {
    minimized = !minimized;
    panel.classList.toggle('mt-minimized', minimized);
    document.getElementById('mt-min-btn').textContent = minimized ? '+' : '−';
  });

  document.getElementById('mt-close-btn').addEventListener('click', () => {
    panel.style.display = 'none';
    hidden = true;
  });

  async function analyze(text) {
    // Local analysis (instant)
    const local = mtAnalyzeLocally(text, toneConfig);
    mtRenderLocal(local, toneConfig);

    // LanguageTool server (if configured)
    if (serverUrl) {
      // Cancel previous in-flight request
      if (abortCtrl) abortCtrl.abort();
      abortCtrl = new AbortController();

      try {
        const body = new URLSearchParams({
          text: text.slice(0, 5000),
          language: 'en-US'
        });
        const res = await fetch(`${serverUrl}/v2/check`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          body: body.toString(),
          signal: abortCtrl.signal
        });
        const data = await res.json();
        mtRenderLT(data.matches);
      } catch (e) {
        if (e.name !== 'AbortError') {
          mtRenderLT(null);
        }
      }
    } else {
      document.getElementById('mt-lt-section').style.display = 'none';
    }
  }

  function getText(el) {
    return (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA')
      ? el.value
      : el.innerText;
  }

  function onInput(e) {
    activeEl = e.target;
    const text = getText(activeEl);
    clearTimeout(debouncer);

    const wordCount = text.split(/\s+/).filter(Boolean).length;

    if (wordCount < minWords) {
      panel.style.display = 'none';
      return;
    }

    if (!hidden) panel.style.display = 'block';

    debouncer = setTimeout(() => {
      if (!hidden) analyze(text);
    }, 750);
  }

  function onFocus(e) {
    activeEl = e.target;
    const text = getText(activeEl);
    if (!hidden && text.split(/\s+/).filter(Boolean).length >= minWords) {
      panel.style.display = 'block';
    }
  }

  function onBlur() {
    // Small delay so clicking panel buttons doesn't instantly hide it
    setTimeout(() => {
      if (document.activeElement !== activeEl &&
          !panel.contains(document.activeElement)) {
        panel.style.display = 'none';
      }
    }, 200);
  }

  function attach(el) {
    if (el.dataset.mtTone) return;
    // Skip password, hidden, search fields
    if (el.type === 'password' || el.type === 'hidden' || el.type === 'search') return;
    el.dataset.mtTone = '1';
    el.addEventListener('input', onInput);
    el.addEventListener('focus', onFocus);
    el.addEventListener('blur', onBlur);
  }

  function attachAll() {
    document.querySelectorAll(
      'textarea, input[type="text"], input[type="email"], [contenteditable="true"]'
    ).forEach(attach);
  }

  attachAll();
  let attachDebounce;
  new MutationObserver(() => {
    clearTimeout(attachDebounce);
    attachDebounce = setTimeout(attachAll, 300);
  }).observe(document.documentElement, { childList: true, subtree: true });
}

if (window.__MindTab?.ready) {
  initToneTranslator();
} else {
  window.addEventListener('mindtab:ready', initToneTranslator, { once: true });
}

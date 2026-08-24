// @ts-check
const DEFAULT_FILTER_LISTS = [
  'https://raw.githubusercontent.com/uBlockOrigin/uAssets/master/filters/annoyances-social.txt',
  'https://raw.githubusercontent.com/uBlockOrigin/uAssets/master/filters/quick-fixes.txt',
  'https://raw.githubusercontent.com/AdguardTeam/AdguardFilters/master/AnnoyancesFilter/sections/social-widget.txt'
];

const DEFAULTS = {
  feedSanitizer: true,
  adBlocker: true,
  toneTranslator: true,
  flashcards: true,
  toneApiUrl: '',
  theme: 'system',
  toneChecks: { passive: true, weak: true, long: true, filler: true, repeat: true },
  longSentenceThreshold: 30,
  filterListUrls: null  // null means use DEFAULT_FILTER_LISTS
};

async function getState() {
  const { mindtab } = await chrome.storage.sync.get('mindtab');
  return { ...DEFAULTS, ...(mindtab || {}) };
}

async function setState(patch) {
  const current = await getState();
  await chrome.storage.sync.set({ mindtab: { ...current, ...patch } });
}

// ─── Theme ────────────────────────────────────────────────────────────────────

function applyTheme(theme) {
  const root = document.documentElement;
  if (theme === 'light' || theme === 'dark') {
    root.setAttribute('data-theme', theme);
  } else {
    root.removeAttribute('data-theme');
  }
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatTimestamp(ms) {
  if (!ms) return 'Never';
  const diff = Date.now() - ms;
  if (diff < 60_000)    return 'Just now';
  if (diff < 3600_000)  return `${Math.floor(diff / 60_000)} min ago`;
  if (diff < 86400_000) return `${Math.floor(diff / 3600_000)} h ago`;
  return new Date(ms).toLocaleDateString();
}

function showMsg(id, text, type, duration = 3000) {
  const el = document.getElementById(id);
  el.textContent = text;
  el.className = `status-msg ${type}`;
  setTimeout(() => { el.textContent = ''; el.className = 'status-msg'; }, duration);
}

async function refreshFilterStatus() {
  const statusEl = document.getElementById('filter-status');
  chrome.runtime.sendMessage({ type: 'GET_FILTER_STATUS' }, result => {
    if (chrome.runtime.lastError || !result) {
      statusEl.textContent = 'Status unavailable';
      return;
    }
    const time = result.mindtabFiltersUpdated;
    const msg  = result.mindtabFiltersStatus || '';
    statusEl.textContent = time
      ? `Last updated: ${formatTimestamp(time)}${msg ? ' - ' + msg : ''}`
      : 'Not yet fetched';
  });
}

function showConnResult(ok, headline, detail) {
  const box = document.getElementById('conn-result');
  box.innerHTML = '';
  box.className = 'conn-result visible';

  const h = document.createElement('span');
  h.className = ok ? 'conn-ok' : 'conn-err';
  h.textContent = headline;
  box.appendChild(h);

  if (detail) {
    const d = document.createElement('span');
    d.className = 'conn-detail';
    d.textContent = detail;
    box.appendChild(d);
  }
}

// ─── Filter URL list UI ───────────────────────────────────────────────────────

function renderUrlList(urls) {
  const list = document.getElementById('filter-url-list');
  list.innerHTML = '';
  urls.forEach((url, i) => {
    const li   = document.createElement('li');
    li.className = 'url-item';
    const span = document.createElement('span');
    span.textContent = url;
    const del  = document.createElement('button');
    del.className = 'url-del';
    del.setAttribute('aria-label', 'Remove URL');
    del.textContent = '✕';
    del.addEventListener('click', async () => {
      const state = await getState();
      const current = state.filterListUrls || DEFAULT_FILTER_LISTS;
      const updated = current.filter((_, j) => j !== i);
      await setState({ filterListUrls: updated.length ? updated : DEFAULT_FILTER_LISTS });
      renderUrlList(updated.length ? updated : DEFAULT_FILTER_LISTS);
      showMsg('url-msg', 'Removed. Update filters to apply.', 'warn');
    });
    li.append(span, del);
    list.appendChild(li);
  });
}

// ─── Main ─────────────────────────────────────────────────────────────────────

document.addEventListener('DOMContentLoaded', async () => {
  const state = await getState();

  // Apply stored theme immediately
  applyTheme(state.theme || 'system');

  // ── Theme selector ──────────────────────────────────────────────────────────
  const themeRadios = document.querySelectorAll('input[name="theme"]');
  themeRadios.forEach(r => {
    if (r.value === (state.theme || 'system')) r.checked = true;
    r.addEventListener('change', async () => {
      const theme = r.value;
      applyTheme(theme);
      await setState({ theme });
      showMsg('theme-msg', 'Theme saved!', 'ok');
    });
  });

  // ── Grammar server URL ──────────────────────────────────────────────────────
  const apiInput = document.getElementById('tone-api-url');
  apiInput.value = state.toneApiUrl || '';

  document.getElementById('btn-save').addEventListener('click', async () => {
    const val = apiInput.value.trim();
    if (val && !apiInput.validity.valid) {
      showMsg('save-msg', 'Invalid URL - include https://', 'error');
      return;
    }
    await setState({ toneApiUrl: val });
    showMsg('save-msg', 'Saved!', 'ok');
  });

  document.getElementById('btn-test').addEventListener('click', async () => {
    const val = apiInput.value.trim();
    if (!val) { showConnResult(false, 'Enter a server URL first.'); return; }
    if (!apiInput.validity.valid) { showConnResult(false, 'Invalid URL - include https://'); return; }

    const testBtn = document.getElementById('btn-test');
    testBtn.disabled = true;
    testBtn.textContent = '…';

    const connResult = document.getElementById('conn-result');
    connResult.className = 'conn-result visible';
    connResult.innerHTML = '<span class="conn-detail">Connecting…</span>';

    const t0 = Date.now();
    try {
      const cleanUrl = val.replace(/\/$/, '');
      const res = await fetch(`${cleanUrl}/health`, { signal: AbortSignal.timeout(8000) });
      const latency = Date.now() - t0;

      if (res.ok) {
        const data = await res.json().catch(() => ({}));
        const detail = [`${latency} ms`, data.upstream ? `upstream: ${data.upstream}` : ''].filter(Boolean).join(' · ');
        showConnResult(true, 'Connected', detail);
      } else {
        showConnResult(false, `Server responded with ${res.status}`, 'Check that the MindTab proxy server is running.');
      }
    } catch (e) {
      const msg = e.name === 'TimeoutError' ? 'Request timed out (8 s)' : e.message || 'Could not reach server';
      showConnResult(false, 'Connection failed', msg);
    } finally {
      testBtn.disabled = false;
      testBtn.textContent = 'Test';
    }
  });

  // ── Writing checks ──────────────────────────────────────────────────────────
  const checks = state.toneChecks || DEFAULTS.toneChecks;
  document.getElementById('chk-passive').checked = checks.passive !== false;
  document.getElementById('chk-weak').checked    = checks.weak    !== false;
  document.getElementById('chk-long').checked    = checks.long    !== false;
  document.getElementById('chk-filler').checked  = checks.filler  !== false;
  document.getElementById('chk-repeat').checked  = checks.repeat  !== false;

  const thresholdSlider = document.getElementById('long-threshold');
  const thresholdVal    = document.getElementById('threshold-val');
  thresholdSlider.value = state.longSentenceThreshold || 30;
  thresholdVal.textContent = thresholdSlider.value;
  thresholdSlider.addEventListener('input', () => {
    thresholdVal.textContent = thresholdSlider.value;
  });

  document.getElementById('btn-save-checks').addEventListener('click', async () => {
    await setState({
      toneChecks: {
        passive: document.getElementById('chk-passive').checked,
        weak:    document.getElementById('chk-weak').checked,
        long:    document.getElementById('chk-long').checked,
        filler:  document.getElementById('chk-filler').checked,
        repeat:  document.getElementById('chk-repeat').checked,
      },
      longSentenceThreshold: parseInt(thresholdSlider.value, 10),
    });
    showMsg('checks-msg', 'Saved!', 'ok');
  });

  // ── Ad Blocker ───────────────────────────────────────────────────────────────
  function renderSimpleList(listId, items, onRemove) {
    const ul = document.getElementById(listId);
    ul.innerHTML = '';
    items.forEach((item, i) => {
      const li   = document.createElement('li');
      li.className = 'url-item';
      const span = document.createElement('span');
      span.textContent = item;
      const del  = document.createElement('button');
      del.className = 'url-del';
      del.setAttribute('aria-label', 'Remove');
      del.textContent = '✕';
      del.addEventListener('click', () => onRemove(i));
      li.append(span, del);
      ul.appendChild(li);
    });
  }

  function renderAllowlist(list) {
    renderSimpleList('allowlist-list', list, async i => {
      const st = await getState();
      const updated = (st.adBlockerAllowlist || []).filter((_, j) => j !== i);
      await setState({ adBlockerAllowlist: updated });
      renderAllowlist(updated);
      showMsg('allowlist-msg', 'Removed.', 'ok');
    });
  }

  renderAllowlist(state.adBlockerAllowlist || []);

  function renderKeywords(list) {
    renderSimpleList('keyword-list', list, async i => {
      const st = await getState();
      const updated = (st.customAdKeywords || []).filter((_, j) => j !== i);
      await setState({ customAdKeywords: updated });
      renderKeywords(updated);
      showMsg('keyword-msg', 'Removed.', 'ok');
    });
  }

  renderKeywords(state.customAdKeywords || []);

  document.getElementById('btn-add-keyword').addEventListener('click', async () => {
    const input = document.getElementById('keyword-input');
    const val   = input.value.trim().toLowerCase();
    if (!val) return;
    const st      = await getState();
    const updated = [...(st.customAdKeywords || []), val];
    await setState({ customAdKeywords: updated });
    renderKeywords(updated);
    input.value = '';
    showMsg('keyword-msg', 'Added.', 'ok');
  });

  document.getElementById('keyword-input').addEventListener('keydown', e => {
    if (e.key === 'Enter') document.getElementById('btn-add-keyword').click();
  });

  function renderHrefPatterns(list) {
    renderSimpleList('href-pattern-list', list, async i => {
      const st = await getState();
      const updated = (st.customAdHrefPatterns || []).filter((_, j) => j !== i);
      await setState({ customAdHrefPatterns: updated });
      renderHrefPatterns(updated);
      showMsg('href-msg', 'Removed.', 'ok');
    });
  }

  renderHrefPatterns(state.customAdHrefPatterns || []);

  document.getElementById('btn-add-href').addEventListener('click', async () => {
    const input = document.getElementById('href-pattern-input');
    const val   = input.value.trim().toLowerCase();
    if (!val) return;
    const st      = await getState();
    const updated = [...(st.customAdHrefPatterns || []), val];
    await setState({ customAdHrefPatterns: updated });
    renderHrefPatterns(updated);
    input.value = '';
    showMsg('href-msg', 'Added.', 'ok');
  });

  document.getElementById('href-pattern-input').addEventListener('keydown', e => {
    if (e.key === 'Enter') document.getElementById('btn-add-href').click();
  });

  // Listen for allowlist changes made from the popup
  chrome.storage.onChanged.addListener((changes, area) => {
    if (area === 'sync' && changes.mindtab?.newValue?.adBlockerAllowlist) {
      renderAllowlist(changes.mindtab.newValue.adBlockerAllowlist);
    }
  });

  // ── Flashcard timing ────────────────────────────────────────────────────────
  const showAfterSlider    = document.getElementById('show-after');
  const showAfterVal       = document.getElementById('show-after-val');
  const displayDurSlider   = document.getElementById('display-duration');
  const displayDurVal      = document.getElementById('display-duration-val');

  showAfterSlider.value  = state.showAfterMinutes || 15;
  showAfterVal.textContent = showAfterSlider.value;
  displayDurSlider.value = state.displayDurationSeconds || 12;
  displayDurVal.textContent = displayDurSlider.value;

  showAfterSlider.addEventListener('input',  () => { showAfterVal.textContent  = showAfterSlider.value; });
  displayDurSlider.addEventListener('input', () => { displayDurVal.textContent = displayDurSlider.value; });

  document.getElementById('btn-save-flash').addEventListener('click', async () => {
    await setState({
      showAfterMinutes:      parseInt(showAfterSlider.value, 10),
      displayDurationSeconds: parseInt(displayDurSlider.value, 10),
    });
    showMsg('flash-msg', 'Saved!', 'ok');
  });

  // ── Site exceptions ──────────────────────────────────────────────────────────
  function renderExceptions(exceptions) {
    const list = document.getElementById('exceptions-list');
    list.innerHTML = '';
    const entries = Object.entries(exceptions);
    if (entries.length === 0) return;

    entries.forEach(([domain, flags]) => {
      const disabled = [];
      if (flags.feedSanitizer   === false) disabled.push('Feed Sanitizer');
      if (flags.adBlocker        === false) disabled.push('Ad Blocker');
      if (flags.toneTranslator   === false) disabled.push('Tone Translator');
      if (flags.flashcards       === false) disabled.push('Flashcards');
      if (disabled.length === 0) return;

      const li   = document.createElement('li');
      li.className = 'url-item';
      const span = document.createElement('span');
      span.textContent = `${domain} — ${disabled.join(', ')} disabled`;
      const del  = document.createElement('button');
      del.className = 'url-del';
      del.setAttribute('aria-label', 'Remove exception');
      del.textContent = '✕';
      del.addEventListener('click', async () => {
        const st = await getState();
        const ex = { ...(st.siteExceptions || {}) };
        delete ex[domain];
        await setState({ siteExceptions: ex });
        renderExceptions(ex);
        showMsg('exception-msg', 'Exception removed.', 'ok');
      });
      li.append(span, del);
      list.appendChild(li);
    });
  }

  renderExceptions(state.siteExceptions || {});

  document.getElementById('btn-add-exception').addEventListener('click', async () => {
    const domainInput = document.getElementById('exception-domain');
    const domain = domainInput.value.trim().toLowerCase().replace(/^https?:\/\//, '').replace(/\/.*$/, '');
    if (!domain || !domain.includes('.')) {
      showMsg('exception-msg', 'Enter a valid domain (e.g. github.com).', 'error'); return;
    }

    const flags = {};
    if (document.getElementById('exc-feed').checked)  flags.feedSanitizer  = false;
    if (document.getElementById('exc-ad').checked)    flags.adBlocker       = false;
    if (document.getElementById('exc-tone').checked)  flags.toneTranslator  = false;
    if (document.getElementById('exc-flash').checked) flags.flashcards      = false;

    if (Object.keys(flags).length === 0) {
      showMsg('exception-msg', 'Select at least one feature to disable.', 'error'); return;
    }

    const st = await getState();
    const ex = { ...(st.siteExceptions || {}), [domain]: flags };
    await setState({ siteExceptions: ex });
    renderExceptions(ex);
    domainInput.value = '';
    ['exc-feed','exc-ad','exc-tone','exc-flash'].forEach(id => { document.getElementById(id).checked = false; });
    showMsg('exception-msg', `Exception added for ${domain}.`, 'ok');
  });

  document.getElementById('exception-domain').addEventListener('keydown', e => {
    if (e.key === 'Enter') document.getElementById('btn-add-exception').click();
  });

  // ── Filter list status ──────────────────────────────────────────────────────
  await refreshFilterStatus();

  document.getElementById('btn-update-filters').addEventListener('click', () => {
    const updateBtn = document.getElementById('btn-update-filters');
    updateBtn.disabled = true;
    updateBtn.textContent = 'Updating…';

    chrome.runtime.sendMessage({ type: 'UPDATE_FILTERS' }, result => {
      updateBtn.disabled = false;
      updateBtn.textContent = 'Update Now';

      if (chrome.runtime.lastError || !result?.ok) {
        showMsg('filter-msg', 'Update failed - check your connection.', 'error');
      } else {
        showMsg('filter-msg', 'Filter lists updated!', 'ok');
      }
      refreshFilterStatus();
    });
  });

  // ── Custom filter URLs ──────────────────────────────────────────────────────
  const currentUrls = state.filterListUrls || DEFAULT_FILTER_LISTS;
  renderUrlList(currentUrls);

  document.getElementById('btn-add-url').addEventListener('click', async () => {
    const input = document.getElementById('filter-url-input');
    const val   = input.value.trim();
    if (!val) return;
    try { new URL(val); } catch { showMsg('url-msg', 'Invalid URL.', 'error'); return; }

    const st = await getState();
    const urls = [...(st.filterListUrls || DEFAULT_FILTER_LISTS), val];
    await setState({ filterListUrls: urls });
    renderUrlList(urls);
    input.value = '';
    showMsg('url-msg', 'Added. Update filters to apply.', 'ok');
  });

  document.getElementById('filter-url-input').addEventListener('keydown', e => {
    if (e.key === 'Enter') document.getElementById('btn-add-url').click();
  });

  document.getElementById('btn-reset-urls').addEventListener('click', async () => {
    if (!confirm('Reset filter sources to defaults?')) return;
    await setState({ filterListUrls: null });
    renderUrlList(DEFAULT_FILTER_LISTS);
    showMsg('url-msg', 'Reset to defaults.', 'ok');
  });

  // ── Back button ─────────────────────────────────────────────────────────────
  document.getElementById('btn-back').addEventListener('click', () => window.close());
});

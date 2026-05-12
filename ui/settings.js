const DEFAULTS = {
  feedSanitizer: true,
  adBlocker: true,
  toneTranslator: true,
  flashcards: true,
  toneApiUrl: ''
};

async function getState() {
  const { mindtab } = await chrome.storage.sync.get('mindtab');
  return { ...DEFAULTS, ...(mindtab || {}) };
}

async function setState(patch) {
  const current = await getState();
  await chrome.storage.sync.set({ mindtab: { ...current, ...patch } });
}

function formatTimestamp(ms) {
  if (!ms) return 'Never';
  const diff = Date.now() - ms;
  if (diff < 60_000)    return 'Just now';
  if (diff < 3600_000)  return `${Math.floor(diff / 60_000)} min ago`;
  if (diff < 86400_000) return `${Math.floor(diff / 3600_000)} h ago`;
  return new Date(ms).toLocaleDateString();
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
      ? `Last updated: ${formatTimestamp(time)}${msg ? ' — ' + msg : ''}`
      : 'Not yet fetched';
  });
}

function showSaveMsg(text, type) {
  const el = document.getElementById('save-msg');
  el.textContent = text;
  el.className = `status-msg ${type}`;
  setTimeout(() => { el.textContent = ''; el.className = 'status-msg'; }, 3000);
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

document.addEventListener('DOMContentLoaded', async () => {
  const state = await getState();

  // Grammar server URL
  const apiInput = document.getElementById('tone-api-url');
  apiInput.value = state.toneApiUrl || '';

  // Save
  document.getElementById('btn-save').addEventListener('click', async () => {
    const val = apiInput.value.trim();
    if (val && !apiInput.validity.valid) {
      showSaveMsg('Invalid URL — include https://', 'error');
      return;
    }
    await setState({ toneApiUrl: val });
    showSaveMsg('Saved!', 'ok');
  });

  // Test connection
  document.getElementById('btn-test').addEventListener('click', async () => {
    const val = apiInput.value.trim();
    if (!val) {
      showConnResult(false, 'Enter a server URL first.');
      return;
    }
    if (!apiInput.validity.valid) {
      showConnResult(false, 'Invalid URL — include https://');
      return;
    }

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
        const detail = [
          `${latency} ms`,
          data.upstream ? `upstream: ${data.upstream}` : ''
        ].filter(Boolean).join(' · ');
        showConnResult(true, 'Connected', detail);
      } else {
        showConnResult(false, `Server responded with ${res.status}`, 'Check that the MindTab proxy server is running.');
      }
    } catch (e) {
      const msg = e.name === 'TimeoutError'
        ? 'Request timed out (8 s)'
        : e.message || 'Could not reach server';
      showConnResult(false, 'Connection failed', msg);
    } finally {
      testBtn.disabled = false;
      testBtn.textContent = 'Test';
    }
  });

  // Filter list update
  const updateBtn = document.getElementById('btn-update-filters');
  const filterMsg = document.getElementById('filter-msg');
  let filterTimer;

  await refreshFilterStatus();

  updateBtn.addEventListener('click', () => {
    updateBtn.disabled = true;
    updateBtn.textContent = 'Updating…';
    filterMsg.textContent = '';

    chrome.runtime.sendMessage({ type: 'UPDATE_FILTERS' }, result => {
      updateBtn.disabled = false;
      updateBtn.textContent = 'Update Now';

      if (chrome.runtime.lastError || !result?.ok) {
        filterMsg.textContent = 'Update failed — check your connection.';
        filterMsg.className = 'status-msg error';
      } else {
        filterMsg.textContent = 'Filter lists updated!';
        filterMsg.className = 'status-msg ok';
      }

      clearTimeout(filterTimer);
      filterTimer = setTimeout(() => {
        filterMsg.textContent = '';
        filterMsg.className = 'status-msg';
      }, 3000);
      refreshFilterStatus();
    });
  });

  // Back / close button
  document.getElementById('btn-back').addEventListener('click', () => window.close());
});

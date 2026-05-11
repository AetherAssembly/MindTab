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
  if (diff < 60_000)  return 'Just now';
  if (diff < 3600_000) return `${Math.floor(diff / 60_000)} min ago`;
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

document.addEventListener('DOMContentLoaded', async () => {
  const state = await getState();

  // Feature toggles
  document.querySelectorAll('[data-key]').forEach(input => {
    input.checked = !!state[input.dataset.key];
    input.addEventListener('change', () => setState({ [input.dataset.key]: input.checked }));
  });

  // Grammar server URL
  const apiInput = document.getElementById('tone-api-url');
  apiInput.value = state.toneApiUrl || '';

  const saveBtn    = document.getElementById('btn-save-settings');
  const savedLabel = document.getElementById('settings-saved');
  let savedTimer;

  saveBtn.addEventListener('click', async () => {
    const val = apiInput.value.trim();
    if (val && !apiInput.validity.valid) {
      savedLabel.style.color = '#e74c3c';
      savedLabel.textContent = 'Invalid URL — include https://';
      clearTimeout(savedTimer);
      savedTimer = setTimeout(() => { savedLabel.textContent = ''; }, 3000);
      return;
    }
    await setState({ toneApiUrl: val });
    savedLabel.style.color = '#27ae60';
    savedLabel.textContent = 'Saved!';
    clearTimeout(savedTimer);
    savedTimer = setTimeout(() => { savedLabel.textContent = ''; }, 2000);
  });

  // Filter list update
  const updateBtn   = document.getElementById('btn-update-filters');
  const updateMsg   = document.getElementById('filter-update-msg');
  let updateTimer;

  await refreshFilterStatus();

  updateBtn.addEventListener('click', () => {
    updateBtn.disabled = true;
    updateBtn.textContent = 'Updating…';
    updateMsg.textContent = '';

    chrome.runtime.sendMessage({ type: 'UPDATE_FILTERS' }, result => {
      updateBtn.disabled = false;
      updateBtn.textContent = 'Update Now';

      if (chrome.runtime.lastError || !result?.ok) {
        updateMsg.style.color = '#e74c3c';
        updateMsg.textContent = 'Update failed — check your connection.';
      } else {
        updateMsg.style.color = '#27ae60';
        updateMsg.textContent = 'Filter lists updated!';
      }

      clearTimeout(updateTimer);
      updateTimer = setTimeout(() => { updateMsg.textContent = ''; }, 3000);
      refreshFilterStatus();
    });
  });

  // Flashcard manager
  document.getElementById('btn-cards').addEventListener('click', () => {
    chrome.tabs.create({ url: chrome.runtime.getURL('ui/cards.html') });
  });
});

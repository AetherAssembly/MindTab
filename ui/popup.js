// Keep in sync with DEFAULTS in background.js
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

document.addEventListener('DOMContentLoaded', async () => {
  const state = await getState();

  // Feature toggles
  document.querySelectorAll('[data-key]').forEach(input => {
    input.checked = !!state[input.dataset.key];
    input.addEventListener('change', () => setState({ [input.dataset.key]: input.checked }));
  });

  // Flashcard manager
  document.getElementById('btn-cards').addEventListener('click', () => {
    chrome.tabs.create({ url: chrome.runtime.getURL('ui/cards.html') });
  });

  // Settings page
  document.getElementById('btn-settings').addEventListener('click', () => {
    chrome.tabs.create({ url: chrome.runtime.getURL('ui/settings.html') });
  });
});

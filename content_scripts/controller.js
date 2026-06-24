// MindTab - controller, always loaded first.
// Loads bundled configs, merges community-fetched selectors, fires 'mindtab:ready'.

window.__MindTab = window.__MindTab || {};

(async () => {
  try {
    const [syncResult, localResult] = await Promise.all([
      chrome.storage.sync.get('mindtab'),
      chrome.storage.local.get('mindtabExternalFilters')
    ]);

    window.__MindTab.state = syncResult.mindtab || {
      feedSanitizer: true,
      adBlocker: true,
      toneTranslator: true,
      flashcards: true,
      toneApiUrl: ''
    };

    async function loadJSON(url, label) {
      try {
        const res = await fetch(url);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return await res.json();
      } catch (e) {
        console.warn(`[MindTab] Failed to load ${label}:`, e.message);
        return null;
      }
    }

    const [filtersData, toneData, flashData] = await Promise.all([
      loadJSON(chrome.runtime.getURL('config/filters.json'),    'filters.json'),
      loadJSON(chrome.runtime.getURL('config/toneConfig.json'), 'toneConfig.json'),
      loadJSON(chrome.runtime.getURL('config/flashcards.json'), 'flashcards.json'),
    ]);

    window.__MindTab.filters    = filtersData  || { feedSanitizer: {}, adBlocker: { textKeywords: [], hrefPatterns: [] } };
    window.__MindTab.toneConfig = toneData     || { tones: {}, minWords: 15 };
    window.__MindTab.flashConfig = flashData   || { settings: { showAfterMinutes: 15, displayDurationSeconds: 12, position: 'bottom-left' }, defaultCards: [] };

    // Override flashcard timing with user-configured values if set.
    const state = window.__MindTab.state;
    if (state.showAfterMinutes)      window.__MindTab.flashConfig.settings.showAfterMinutes      = state.showAfterMinutes;
    if (state.displayDurationSeconds) window.__MindTab.flashConfig.settings.displayDurationSeconds = state.displayDurationSeconds;

    // Merge community-maintained selectors on top of the bundled ones.
    // External selectors are keyed by bare domain (e.g. 'youtube.com').
    const external = localResult.mindtabExternalFilters;
    if (external && window.__MindTab.filters.feedSanitizer) {
      const map = {
        'youtube.com': 'youtube', 'instagram.com': 'instagram', 'facebook.com': 'facebook',
        'reddit.com': 'reddit', 'linkedin.com': 'linkedin', 'tiktok.com': 'tiktok', 'threads.net': 'threads'
      };
      for (const [domain, key] of Object.entries(map)) {
        if (external[domain]?.length) {
          const existing = new Set(window.__MindTab.filters.feedSanitizer[key] || []);
          external[domain].forEach(s => existing.add(s));
          window.__MindTab.filters.feedSanitizer[key] = [...existing];
        }
      }
    }

    window.__MindTab.ready = true;
    window.dispatchEvent(new CustomEvent('mindtab:ready'));
  } catch (e) {
    console.warn('[MindTab] Controller init failed:', e);
    window.__MindTab.ready = true;
    window.dispatchEvent(new CustomEvent('mindtab:ready'));
  }
})();

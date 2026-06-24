// DEFAULTS loaded from config/defaults.js via popup.html script tag

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

  // Daily stats
  chrome.runtime.sendMessage({ type: 'GET_DAILY_STATS' }, stats => {
    if (chrome.runtime.lastError || !stats) return;
    const count = stats.count || 0;
    if (count > 0) {
      const statsBar  = document.getElementById('stats-bar');
      const statsText = document.getElementById('stats-text');
      statsBar.style.display = 'block';
      statsText.textContent  = `${count} element${count !== 1 ? 's' : ''} hidden today`;
    }
  });

  // Trust this site (allowlist)
  if (state.adBlocker) {
    chrome.tabs.query({ active: true, currentWindow: true }, async ([tab]) => {
      if (!tab?.url) return;
      let origin;
      try { origin = new URL(tab.url); } catch { return; }
      if (origin.protocol !== 'http:' && origin.protocol !== 'https:') return;

      const domain    = origin.hostname.replace(/^www\./, '');
      const trustBar  = document.getElementById('trust-bar');
      const trustBtn  = document.getElementById('btn-trust');
      const allowlist = state.adBlockerAllowlist || [];
      const trusted   = allowlist.includes(domain);

      trustBar.style.display = 'block';
      trustBtn.textContent   = trusted ? `✓ ${domain} trusted` : `Trust this site (${domain})`;
      trustBtn.classList.toggle('trusted', trusted);

      trustBtn.addEventListener('click', async () => {
        const current = await getState();
        const list    = current.adBlockerAllowlist || [];
        if (list.includes(domain)) {
          await setState({ adBlockerAllowlist: list.filter(d => d !== domain) });
          trustBtn.textContent = `Trust this site (${domain})`;
          trustBtn.classList.remove('trusted');
        } else {
          await setState({ adBlockerAllowlist: [...list, domain] });
          trustBtn.textContent = `✓ ${domain} trusted`;
          trustBtn.classList.add('trusted');
        }
      });
    });
  }

  // Flashcard manager
  document.getElementById('btn-cards').addEventListener('click', () => {
    chrome.tabs.create({ url: chrome.runtime.getURL('ui/cards.html') });
  });

  // Stats page
  document.getElementById('btn-stats').addEventListener('click', () => {
    chrome.tabs.create({ url: chrome.runtime.getURL('ui/stats.html') });
  });

  // Settings page
  document.getElementById('btn-settings').addEventListener('click', () => {
    chrome.tabs.create({ url: chrome.runtime.getURL('ui/settings.html') });
  });
});

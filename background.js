// MindTab background service worker

const DEFAULTS = {
  feedSanitizer: true,
  adBlocker: true,
  toneTranslator: true,
  flashcards: true,
  toneApiUrl: ''
};

// Community-maintained filter lists in standard ABP/uBlock cosmetic format.
// uBlock Origin: updated continuously by the community, hosted on GitHub.
// AdGuard:       same format, broader coverage of social media annoyances.
const DEFAULT_FILTER_LISTS = [
  'https://raw.githubusercontent.com/uBlockOrigin/uAssets/master/filters/annoyances-social.txt',
  'https://raw.githubusercontent.com/uBlockOrigin/uAssets/master/filters/quick-fixes.txt',
  'https://raw.githubusercontent.com/AdguardTeam/AdguardFilters/master/AnnoyancesFilter/sections/social-widget.txt'
];

// Domains to extract cosmetic selectors for.
const TARGET_DOMAINS = ['youtube.com', 'instagram.com', 'facebook.com'];

// ─── Filter list parser ───────────────────────────────────────────────────────
// Parses standard ABP/uBlock cosmetic filter lines (domain##selector).
// Skips network rules, procedural filters, and global (no-domain) rules.

function parseFilterList(text) {
  const result = {};
  for (const d of TARGET_DOMAINS) result[d] = new Set();

  for (const raw of text.split('\n')) {
    const line = raw.trim();
    if (!line || line.startsWith('!') || line.startsWith('[') || line.startsWith('@@')) continue;

    const sep = line.indexOf('##');
    if (sep === -1) continue;

    const domainsPart = line.substring(0, sep);
    if (!domainsPart) continue; // global rule — skip to avoid over-blocking

    const selector = line.substring(sep + 2);
    if (!selector) continue;

    // Procedural/extended filters like :has(), :matches-css() can't be used
    // as plain querySelectorAll selectors — skip them.
    if (selector.includes(':matches') || selector.includes(':upward(') ||
        selector.includes(':is(') && selector.includes(':not(') ||
        (selector.startsWith(':') && selector.includes('('))) continue;

    const lineDomains = domainsPart.split(',').map(d => d.trim().toLowerCase());

    for (const target of TARGET_DOMAINS) {
      if (lineDomains.some(d => {
        if (d.startsWith('~')) return false; // exclusion rule
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

// ─── Fetcher ──────────────────────────────────────────────────────────────────

async function updateFilterLists() {
  const { mindtab } = await chrome.storage.sync.get('mindtab');
  const urls = mindtab?.filterListUrls ?? DEFAULT_FILTER_LISTS;

  const merged = {};
  for (const d of TARGET_DOMAINS) merged[d] = new Set();

  let successCount = 0;
  let lastError = null;

  for (const url of urls) {
    try {
      const res  = await fetch(url, { cache: 'no-store' });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const text = await res.text();
      const parsed = parseFilterList(text);

      for (const [domain, selectors] of Object.entries(parsed)) {
        selectors.forEach(s => merged[domain].add(s));
      }
      successCount++;
    } catch (e) {
      console.warn(`[MindTab] Filter list fetch failed (${url}):`, e.message);
      lastError = e.message;
    }
  }

  const totals = Object.fromEntries(
    Object.entries(merged).map(([k, v]) => [k, v.size])
  );

  await chrome.storage.local.set({
    mindtabExternalFilters: Object.fromEntries(
      Object.entries(merged).map(([k, v]) => [k, [...v]])
    ),
    mindtabFiltersUpdated: Date.now(),
    mindtabFiltersStatus: successCount > 0
      ? `Updated — ${Object.values(totals).reduce((a, b) => a + b, 0)} selectors across ${Object.keys(totals).length} sites`
      : `All ${urls.length} sources failed. Last error: ${lastError}`
  });

  console.log('[MindTab] Filter lists updated:', totals);
}

// ─── Lifecycle ────────────────────────────────────────────────────────────────

chrome.runtime.onInstalled.addListener(async () => {
  const { mindtab } = await chrome.storage.sync.get('mindtab');
  if (!mindtab) {
    await chrome.storage.sync.set({ mindtab: DEFAULTS });
  }
  // Fetch immediately on install, then set up daily alarm.
  await updateFilterLists();
  chrome.alarms.create('mindtab-filter-update', { periodInMinutes: 1440 });
});

chrome.alarms.onAlarm.addListener(alarm => {
  if (alarm.name === 'mindtab-filter-update') updateFilterLists();
});

// Allow the popup to trigger a manual update and read status.
chrome.runtime.onMessage.addListener((msg, _sender, reply) => {
  if (msg.type === 'UPDATE_FILTERS') {
    updateFilterLists().then(() => reply({ ok: true })).catch(e => reply({ ok: false, error: e.message }));
    return true;
  }
  if (msg.type === 'GET_FILTER_STATUS') {
    chrome.storage.local.get(['mindtabFiltersUpdated', 'mindtabFiltersStatus']).then(reply);
    return true;
  }
});

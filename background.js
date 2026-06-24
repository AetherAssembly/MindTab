// MindTab background service worker
// In Chrome (service worker), importScripts loads the shared constant.
// In Firefox, manifest.json background.scripts lists defaults.js first, so it's already defined.
if (typeof DEFAULTS === 'undefined') importScripts('config/defaults.js');

// Community-maintained filter lists in standard ABP/uBlock cosmetic format.
// uBlock Origin: updated continuously by the community, hosted on GitHub.
// AdGuard:       same format, broader coverage of social media annoyances.
const DEFAULT_FILTER_LISTS = [
  'https://raw.githubusercontent.com/uBlockOrigin/uAssets/master/filters/annoyances-social.txt',
  'https://raw.githubusercontent.com/uBlockOrigin/uAssets/master/filters/quick-fixes.txt',
  'https://raw.githubusercontent.com/AdguardTeam/AdguardFilters/master/AnnoyancesFilter/sections/social-widget.txt'
];

// Domains to extract cosmetic selectors for.
const TARGET_DOMAINS = ['youtube.com', 'instagram.com', 'facebook.com', 'reddit.com', 'linkedin.com', 'tiktok.com', 'threads.net'];

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
    if (!domainsPart) continue; // global rule - skip to avoid over-blocking

    const selector = line.substring(sep + 2);
    if (!selector) continue;

    // Procedural/extended filters like :has(), :matches-css() can't be used
    // as plain querySelectorAll selectors - skip them.
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
      const res  = await fetch(url, { cache: 'no-store', signal: AbortSignal.timeout(10000) });
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

  if (successCount > 0) {
    const newTotal = [...Object.values(merged)].reduce((n, s) => n + s.size, 0);

    // Integrity check: if selector count drops >30% vs cache, keep cached data.
    // Guards against truncated fetches or a compromised filter list source.
    const { mindtabExternalFilters: cached } = await chrome.storage.local.get('mindtabExternalFilters');
    const cachedTotal = cached
      ? Object.values(cached).reduce((n, a) => n + a.length, 0)
      : 0;

    if (cachedTotal > 0 && newTotal < cachedTotal * 0.7) {
      console.warn(`[MindTab] Selector count dropped unexpectedly (${cachedTotal} → ${newTotal}) - keeping cached selectors.`);
      await chrome.storage.local.set({
        mindtabFiltersStatus: `Warning: selector count dropped unexpectedly (${cachedTotal} → ${newTotal}) - keeping cached selectors`
      });
      return;
    }

    const totals = Object.fromEntries(
      Object.entries(merged).map(([k, v]) => [k, v.size])
    );
    await chrome.storage.local.set({
      mindtabExternalFilters: Object.fromEntries(
        Object.entries(merged).map(([k, v]) => [k, [...v]])
      ),
      mindtabFiltersUpdated: Date.now(),
      mindtabFiltersStatus: `Updated - ${newTotal} selectors across ${Object.keys(totals).length} sites`
    });
    console.log('[MindTab] Filter lists updated:', totals);
  } else {
    await chrome.storage.local.set({
      mindtabFiltersStatus: `All ${urls.length} sources failed. Last error: ${lastError}`
    });
    console.warn('[MindTab] All filter list sources failed - keeping cached selectors.');
  }
}

// ─── Lifecycle ────────────────────────────────────────────────────────────────

chrome.runtime.onInstalled.addListener(async ({ reason }) => {
  const { mindtab } = await chrome.storage.sync.get('mindtab');
  if (!mindtab) {
    await chrome.storage.sync.set({ mindtab: DEFAULTS });
  }
  // Fetch immediately on install, then set up daily alarm.
  await updateFilterLists();
  chrome.alarms.create('mindtab-filter-update', { periodInMinutes: 1440 });
  if (reason === 'install') {
    chrome.tabs.create({ url: chrome.runtime.getURL('ui/onboarding.html') });
  }
});

// Wrap in an async IIFE so Chrome's service worker lifetime tracking sees
// the pending promise and keeps the worker alive until the fetch completes.
chrome.alarms.onAlarm.addListener(alarm => {
  if (alarm.name === 'mindtab-filter-update') (async () => { await updateFilterLists(); })();
});

// ─── Badge counter ────────────────────────────────────────────────────────────

const tabCounts = {};

function updateBadge(tabId) {
  const n = tabCounts[tabId] || 0;
  const text = n === 0 ? '' : n > 999 ? '999+' : String(n);
  chrome.action.setBadgeText({ text, tabId });
  chrome.action.setBadgeBackgroundColor({ color: '#4A90E2', tabId });
}

chrome.tabs.onUpdated.addListener((tabId, info) => {
  if (info.status === 'loading') {
    tabCounts[tabId] = 0;
    chrome.action.setBadgeText({ text: '', tabId });
  }
});

chrome.tabs.onRemoved.addListener(tabId => { delete tabCounts[tabId]; });

// ─── Messages ─────────────────────────────────────────────────────────────────

// Allow the popup to trigger a manual update and read status.
chrome.runtime.onMessage.addListener((msg, sender, reply) => {
  if (msg.type === 'UPDATE_FILTERS') {
    updateFilterLists().then(() => reply({ ok: true })).catch(e => reply({ ok: false, error: e.message }));
    return true;
  }
  if (msg.type === 'GET_FILTER_STATUS') {
    chrome.storage.local.get(['mindtabFiltersUpdated', 'mindtabFiltersStatus']).then(reply);
    return true;
  }
  if (msg.type === 'BADGE_COUNT' && sender.tab?.id) {
    tabCounts[sender.tab.id] = (tabCounts[sender.tab.id] || 0) + msg.delta;
    updateBadge(sender.tab.id);
    // Accumulate daily stats
    const today = new Date().toISOString().slice(0, 10);
    chrome.storage.local.get('mindtabDailyStats').then(({ mindtabDailyStats }) => {
      const stats = (mindtabDailyStats?.date === today) ? mindtabDailyStats : { date: today, count: 0 };
      stats.count += msg.delta;
      chrome.storage.local.set({ mindtabDailyStats: stats });
    });
  }
  if (msg.type === 'GET_DAILY_STATS') {
    chrome.storage.local.get('mindtabDailyStats').then(({ mindtabDailyStats }) => {
      const today = new Date().toISOString().slice(0, 10);
      reply(mindtabDailyStats?.date === today ? mindtabDailyStats : { date: today, count: 0 });
    });
    return true;
  }
});

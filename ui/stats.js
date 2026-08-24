// @ts-check
function cardKey(c) {
  let h = 5381;
  for (let i = 0; i < c.q.length; i++) h = (h * 33 ^ c.q.charCodeAt(i)) >>> 0;
  return h.toString(36);
}

document.addEventListener('DOMContentLoaded', async () => {
  document.getElementById('btn-back').addEventListener('click', () => window.close());

  const [syncData, localData] = await Promise.all([
    chrome.storage.sync.get(['mindtab', 'mindtabCards', 'mindtabDeletedDefaults']),
    chrome.storage.local.get(['mindtabDailyStats', 'mindtabSRS'])
  ]);

  const state           = syncData.mindtab || {};
  const customCards     = syncData.mindtabCards || [];
  const deletedDefaults = new Set(syncData.mindtabDeletedDefaults || []);
  const daily           = localData.mindtabDailyStats;
  const srs             = localData.mindtabSRS || {};
  const today           = new Date().toISOString().slice(0, 10);

  // Load default cards to compute totals
  let defaultCards = [];
  try {
    const res  = await fetch(chrome.runtime.getURL('config/flashcards.json'));
    const data = await res.json();
    defaultCards = (data.defaultCards || []).filter(c => !deletedDefaults.has(cardKey(c)));
  } catch (_) {}

  // ── Blocking ──────────────────────────────────────────────────────────────
  const hiddenCount  = (daily?.date === today ? daily.count : 0);
  const allowlistLen = (state.adBlockerAllowlist || []).length;

  document.getElementById('stat-hidden').textContent  = hiddenCount.toLocaleString();
  document.getElementById('stat-trusted').textContent = allowlistLen.toLocaleString();

  // ── Flashcards ────────────────────────────────────────────────────────────
  const totalCards    = defaultCards.length + customCards.length;
  const customCount   = customCards.length;
  const defaultCount  = defaultCards.length;

  document.getElementById('stat-total').textContent     = totalCards.toLocaleString();
  document.getElementById('stat-total-sub').textContent = `${defaultCount} default · ${customCount} custom`;

  const allCards  = [...defaultCards, ...customCards];
  const srsKeys   = Object.keys(srs);
  const reviewed  = srsKeys.length;
  const now       = Date.now();
  const dueCards  = allCards.filter(c => {
    const d = srs[cardKey(c)];
    return !d || d.nextDue <= now;
  });

  document.getElementById('stat-reviewed').textContent = reviewed.toLocaleString();
  document.getElementById('stat-due').textContent      = dueCards.length.toLocaleString();

  if (reviewed === 0) {
    document.getElementById('srs-empty').style.display = 'block';
    document.getElementById('stat-ease').textContent   = '—';
  } else {
    const avgEase = srsKeys.reduce((sum, k) => sum + (srs[k].ease || 2.5), 0) / srsKeys.length;
    document.getElementById('stat-ease').textContent = avgEase.toFixed(2);

    // Ease range is roughly 1.3–3.0; map to 0–100%
    const pct   = Math.round(Math.min(100, Math.max(0, (avgEase - 1.3) / (3.0 - 1.3) * 100)));
    const label = avgEase >= 2.6 ? 'Mastering' : avgEase >= 2.0 ? 'On track' : 'Struggling';
    const cls   = avgEase >= 2.6 ? 'mastering' : avgEase >= 2.0 ? 'learning' : 'struggling';

    document.getElementById('stat-ease-label').textContent = label;
    const bar     = document.getElementById('ease-bar');
    const barWrap = document.getElementById('ease-bar-wrap');
    bar.style.width = pct + '%';
    bar.className   = `ease-bar ${cls}`;
    barWrap.style.display = 'block';
  }
});

// @ts-check
function initFeedSanitizer() {
  if (!window.__MindTab?.state?.feedSanitizer) return;

  // Check per-site exception
  const exceptions = window.__MindTab.state.siteExceptions || {};
  const bareHost = location.hostname.replace(/^www\./, '');
  const ex = exceptions[bareHost] || exceptions[location.hostname] || {};
  if (ex.feedSanitizer === false) return;

  const filters = window.__MindTab.filters?.feedSanitizer;
  if (!filters) return;

  const host = location.hostname;
  let selectors = [];

  if (host === 'youtube.com'    || host.endsWith('.youtube.com'))   selectors = filters.youtube   || [];
  else if (host === 'instagram.com' || host.endsWith('.instagram.com')) selectors = filters.instagram || [];
  else if (host === 'facebook.com'  || host.endsWith('.facebook.com'))  selectors = filters.facebook  || [];
  else if (host === 'reddit.com'    || host.endsWith('.reddit.com'))    selectors = filters.reddit    || [];
  else if (host === 'linkedin.com'  || host.endsWith('.linkedin.com'))  selectors = filters.linkedin  || [];
  else if (host === 'tiktok.com'    || host.endsWith('.tiktok.com'))    selectors = filters.tiktok    || [];
  else if (host === 'threads.net'   || host.endsWith('.threads.net'))   selectors = filters.threads   || [];

  if (selectors.length === 0) return;

  const query = selectors.join(', ');

  function clean() {
    let delta = 0;
    try {
      document.querySelectorAll(query).forEach(el => {
        let target = el;
        // For plain <a> links, walk up to the nearest custom element (ytd-*) or
        // small container - the <a> itself is never the right thing to hide.
        if (el.tagName === 'A') {
          let p = el.parentElement;
          while (p && p !== document.body) {
            if (p.tagName.includes('-') || p.children.length <= 3) {
              target = p;
              break;
            }
            p = p.parentElement;
          }
        }
        if (!target.dataset.mtHidden) {
          target.dataset.mtHidden = '1';
          target.style.setProperty('display', 'none', 'important');
          delta++;
        }
      });
    } catch (_) {}
    if (delta > 0) chrome.runtime.sendMessage({ type: 'BADGE_COUNT', delta }).catch(() => {});
  }

  clean();

  // YouTube is a SPA - re-run after each client-side navigation.
  if (host === 'youtube.com' || host.endsWith('.youtube.com')) {
    window.addEventListener('yt-navigate-finish', clean);
  }

  let debounce;
  const observer = new MutationObserver(() => {
    clearTimeout(debounce);
    debounce = setTimeout(clean, 250);
  });
  observer.observe(document.documentElement, { childList: true, subtree: true });
}

if (window.__MindTab?.ready) {
  initFeedSanitizer();
} else {
  window.addEventListener('mindtab:ready', initFeedSanitizer, { once: true });
}

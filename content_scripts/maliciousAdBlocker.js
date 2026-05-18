function initAdBlocker() {
  if (!window.__MindTab?.state?.adBlocker) return;

  const config = window.__MindTab.filters?.adBlocker;
  if (!config) return;

  const textKeywords = config.textKeywords.map(k => k.toLowerCase());
  const hrefPatterns = config.hrefPatterns;

  function isMalicious(el) {
    const text = (el.textContent || '').toLowerCase().trim().slice(0, 120);
    const href = (el instanceof HTMLAnchorElement ? el.href : '').toLowerCase();
    return textKeywords.some(k => text.includes(k)) ||
           hrefPatterns.some(p => href.includes(p));
  }

  function scan() {
    let delta = 0;
    document.querySelectorAll('a[href], iframe[src]').forEach(el => {
      if (el.dataset.mtChecked) return;
      el.dataset.mtChecked = '1';

      if (!isMalicious(el)) return;

      // Hide the element or its nearest small container
      let target = el;
      const p = el.parentElement;
      if (p && p !== document.body && p.children.length <= 3) target = p;
      target.style.setProperty('display', 'none', 'important');
      delta++;
    });
    if (delta > 0) chrome.runtime.sendMessage({ type: 'BADGE_COUNT', delta }).catch(() => {});
  }

  scan();

  let debounce;
  const observer = new MutationObserver(mutations => {
    // For attribute/characterData mutations the affected element may already
    // be stamped with data-mt-checked from the initial scan. Clear the stamp
    // so scan() will re-evaluate it with its updated href or text content.
    for (const mutation of mutations) {
      if (mutation.type === 'attributes' || mutation.type === 'characterData') {
        const target = mutation.type === 'characterData'
          ? mutation.target.parentElement
          : mutation.target;
        if (target && target.dataset) {
          delete target.dataset.mtChecked;
        }
      }
    }
    clearTimeout(debounce);
    debounce = setTimeout(scan, 400);
  });
  observer.observe(document.documentElement, {
    childList: true,
    subtree: true,
    attributes: true,
    attributeFilter: ['href', 'src'],
    characterData: true,
  });
}

if (window.__MindTab?.ready) {
  initAdBlocker();
} else {
  window.addEventListener('mindtab:ready', initAdBlocker, { once: true });
}

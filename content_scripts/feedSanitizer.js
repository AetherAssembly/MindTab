function initFeedSanitizer() {
  if (!window.__MindTab?.state?.feedSanitizer) return;

  const filters = window.__MindTab.filters?.feedSanitizer;
  if (!filters) return;

  const host = location.hostname;
  let selectors = [];

  if (host.includes('youtube.com'))   selectors = filters.youtube  || [];
  else if (host.includes('instagram.com')) selectors = filters.instagram || [];
  else if (host.includes('facebook.com')) selectors = filters.facebook  || [];

  if (selectors.length === 0) return;

  const query = selectors.join(', ');

  function clean() {
    try {
      document.querySelectorAll(query).forEach(el => {
        // Walk up to hide the nearest meaningful container
        let target = el;
        const p = el.parentElement;
        if (p && p !== document.body && p.children.length <= 4) target = p;
        target.style.setProperty('display', 'none', 'important');
      });
    } catch (_) {}
  }

  clean();

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

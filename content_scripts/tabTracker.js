// content_scripts/tabTracker.js

// Lightweight idle detector that will request the background to open flashcards
// after a short period of idle browsing. This is intentionally conservative and
// only signals the background; the background will throttle and decide whether
// to open a tab.

(function () {
  const IDLE_MS = 60 * 1000; // 1 minute of no activity
  let lastActivity = Date.now();
  let timer = null;

  function resetTimer() {
    lastActivity = Date.now();
    if (timer) clearTimeout(timer);
    timer = setTimeout(checkIdle, IDLE_MS);
  }

  function checkIdle() {
    const since = Date.now() - lastActivity;
    if (since >= IDLE_MS) {
      // Ask background to maybe open flashcards (background will throttle)
      try {
        chrome.runtime.sendMessage({ action: 'maybeOpenFlashcard' });
      } catch (e) {
        console.warn('tabTracker: sendMessage failed', e);
      }
    }
    // continue watching
    timer = setTimeout(checkIdle, IDLE_MS);
  }

  ['mousemove', 'keydown', 'scroll', 'touchstart'].forEach(evt => {
    window.addEventListener(evt, resetTimer, { passive: true });
  });

  // start timer
  resetTimer();
})();

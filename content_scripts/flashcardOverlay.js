// content_scripts/flashcardOverlay.js

// Inject a small flashcard overlay into the page when authorized by background.
// The overlay is lightweight and reads flashcards from chrome.storage.local.

(function () {
  const OVERLAY_ID = 'mindtab-flashcard-overlay';

  async function shouldShow() {
    try {
      const resp = await new Promise((resolve) => {
        try {
          chrome.runtime.sendMessage({ action: 'maybeOpenFlashcard' }, resolve);
        } catch (e) {
          console.warn('sendMessage failed', e);
          resolve({ opened: false });
        }
      });
      return resp && resp.opened;
    } catch (e) {
      return false;
    }
  }

  function buildOverlay(cards) {
    removeOverlay();
    const overlay = document.createElement('div');
    overlay.id = OVERLAY_ID;
    overlay.className = 'mindtab-flash-overlay';
    overlay.setAttribute('role', 'dialog');
    overlay.setAttribute('aria-label', 'Flashcards');

    const header = document.createElement('div');
    header.className = 'mfo-header';
    header.textContent = 'Flashcards';
    overlay.appendChild(header);

    const close = document.createElement('button');
    close.className = 'mfo-close';
    close.textContent = '\u2715';
    close.addEventListener('click', removeOverlay);
    overlay.appendChild(close);

    const container = document.createElement('div');
    container.className = 'mfo-container';

    cards.forEach((c, i) => {
      const card = document.createElement('div');
      card.className = 'mfo-card';
      card.tabIndex = 0;

      const q = document.createElement('div');
      q.className = 'mfo-q';
      q.textContent = c.question || '';
      const a = document.createElement('div');
      a.className = 'mfo-a';
      a.textContent = c.answer || '';
      a.style.display = 'none';

      card.appendChild(q);
      card.appendChild(a);

      card.addEventListener('click', () => {
        a.style.display = a.style.display === 'none' ? 'block' : 'none';
      });

      container.appendChild(card);
    });

    overlay.appendChild(container);

    // Basic styles injected here to keep overlay self-contained
    const style = document.createElement('style');
    style.textContent = `
      .mindtab-flash-overlay { position: fixed; right: 16px; bottom: 16px; width: 320px; max-height: 60vh; overflow: auto; background: rgba(20,20,20,0.95); color: #fff; border-radius: 10px; box-shadow: 0 8px 24px rgba(0,0,0,0.6); padding: 10px; z-index: 2147483647; font-family: Arial, sans-serif; }
      .mindtab-flash-overlay .mfo-header { font-weight: 600; margin-bottom: 8px; }
      .mindtab-flash-overlay .mfo-close { position: absolute; top: 6px; right: 8px; background: transparent; border: none; color: #ddd; cursor: pointer; }
      .mindtab-flash-overlay .mfo-container { display: flex; flex-direction: column; gap: 8px; }
      .mindtab-flash-overlay .mfo-card { padding: 8px; background: #1f1f1f; border-radius: 8px; border: 1px solid #333; cursor: pointer; }
      .mindtab-flash-overlay .mfo-card:focus { outline: 2px solid rgba(53,122,189,0.6); }
      .mindtab-flash-overlay .mfo-q { font-weight: 600; }
      .mindtab-flash-overlay .mfo-a { margin-top: 6px; color: #dcdcdc; }
    `;

    overlay.appendChild(style);

    document.body.appendChild(overlay);
  }

  function removeOverlay() {
    const existing = document.getElementById(OVERLAY_ID);
    if (existing) existing.remove();
  }

  async function loadAndShow() {
    try {
      const data = await new Promise((resolve) => {
        try { chrome.storage.local.get(['flashcards', 'flashcardsEnabled'], resolve); } catch (e) { resolve({}); }
      });
      const enabled = typeof data.flashcardsEnabled === 'boolean' ? data.flashcardsEnabled : true;
      if (!enabled) return;
      const cards = (data && data.flashcards) || [];
      if (!cards || !cards.length) return;
      buildOverlay(cards);
    } catch (e) {
      console.warn('flashcardOverlay load failed', e);
    }
  }

  // Listen for message from tabTracker to maybe show.
  // When the tracker signals, ask background for authorization, then show overlay.
  chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
    if (msg && msg.action === 'triggerFlashcardNow') {
      shouldShow().then(ok => { if (ok) loadAndShow(); });
    }
  });

  // Also check on load (useful when users open a page while eligible)
  shouldShow().then(ok => { if (ok) loadAndShow(); });

})();

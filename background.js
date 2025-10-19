// background.js

// Simple promise wrappers for chrome.storage.local
const storageGet = (keys) => new Promise(resolve => chrome.storage.local.get(keys, resolve));
const storageSet = (obj) => new Promise(resolve => chrome.storage.local.set(obj, resolve));

// Default throttle (milliseconds)
const DEFAULT_FLASHCARD_THROTTLE_MS = 30 * 60 * 1000; // 30 minutes

async function seedDefaults() {
  const defaults = {
    toneEnabled: true,
    flashcardsEnabled: true,
    lastFlashcardOpen: 0,
    flashcardThrottleMs: DEFAULT_FLASHCARD_THROTTLE_MS
  };

  const data = await storageGet(Object.keys(defaults));
  const toSet = {};
  for (const k of Object.keys(defaults)) {
    if (typeof data[k] === 'undefined') toSet[k] = defaults[k];
  }

  // Seed flashcards from bundled config if not present
  if (typeof data.flashcards === 'undefined') {
    try {
      const res = await fetch(chrome.runtime.getURL('flashcard/config.json'));
      const cards = await res.json();
      toSet.flashcards = cards;
    } catch (e) {
      console.warn('Could not load bundled flashcard config', e);
    }
  }

  if (Object.keys(toSet).length) await storageSet(toSet);
}

chrome.runtime.onInstalled.addListener(() => {
  console.log('MindTab Extension Installed');
  // Seed defaults asynchronously
  seedDefaults().catch(err => console.warn('seedDefaults failed', err));
});

// Optional: Listen for keyboard shortcuts (if reintroduced)
chrome.commands.onCommand.addListener((command) => {
  if (command === 'open_flashcard') {
    chrome.tabs.create({ url: chrome.runtime.getURL('flashcard/flashcard.html') });
  }
});

// Handle requests from content scripts to 'maybe' show flashcards.
// Background does not open tabs; it only authorizes the content script to render an overlay.
chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  if (!msg || msg.action !== 'maybeOpenFlashcard') return;

  (async () => {
    try {
      const data = await storageGet(['lastFlashcardOpen', 'flashcardsEnabled', 'flashcardThrottleMs']);
      const enabled = typeof data.flashcardsEnabled === 'boolean' ? data.flashcardsEnabled : true;
      if (!enabled) { sendResponse({ opened: false, reason: 'disabled' }); return; }

      const last = data && data.lastFlashcardOpen ? data.lastFlashcardOpen : 0;
      const throttle = typeof data.flashcardThrottleMs === 'number' ? data.flashcardThrottleMs : DEFAULT_FLASHCARD_THROTTLE_MS;
      const now = Date.now();

      if (now - last > throttle) {
        await storageSet({ lastFlashcardOpen: now });
        sendResponse({ opened: true });
      } else {
        sendResponse({ opened: false, nextAllowed: last + throttle });
      }
    } catch (e) {
      console.warn('maybeOpenFlashcard failed', e);
      sendResponse({ opened: false });
    }
  })();

  return true; // keep message channel open for async sendResponse
});

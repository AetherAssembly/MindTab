async function initFlashcards() {
  if (!window.__MindTab?.state?.flashcards) return;

  const flashConfig = window.__MindTab.flashConfig;
  if (!flashConfig) return;

  // Don't inject on extension-internal pages
  const proto = location.protocol;
  if (proto === 'chrome-extension:' || proto === 'moz-extension:' || proto === 'about:') return;

  const { settings, defaultCards } = flashConfig;

  // --- Position ---
  const POS_MAP = {
    'bottom-left':  { bottom: '20px', left: '20px',  top: '',      right: '' },
    'bottom-right': { bottom: '20px', right: '20px', top: '',      left: '' },
    'top-left':     { top: '20px',    left: '20px',  bottom: '',   right: '' },
    'top-right':    { top: '20px',    right: '20px', bottom: '',   left: '' },
  };
  const pos = POS_MAP[settings.position] || POS_MAP['bottom-left'];

  // --- Styles ---
  const style = document.createElement('style');
  style.textContent = `
    #mt-card {
      position: fixed;
      ${pos.top    ? `top: ${pos.top};`       : ''}
      ${pos.bottom ? `bottom: ${pos.bottom};` : ''}
      ${pos.left   ? `left: ${pos.left};`     : ''}
      ${pos.right  ? `right: ${pos.right};`   : ''}
      width: 290px;
      background: #1a1a2e;
      border: 1px solid #4A90E2;
      border-radius: 14px;
      padding: 16px;
      z-index: 2147483646;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
      color: #eee;
      box-shadow: 0 6px 24px rgba(0,0,0,0.5);
      display: none;
      animation: mt-slidein 0.3s ease;
    }
    @keyframes mt-slidein {
      from { transform: translateY(16px); opacity: 0; }
      to   { transform: translateY(0);    opacity: 1; }
    }
    #mt-card .mt-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: 11px;
      color: #4A90E2;
      text-transform: uppercase;
      letter-spacing: 1px;
      margin-bottom: 10px;
    }
    #mt-card .mt-header-left {
      display: flex;
      align-items: center;
      gap: 8px;
    }
    #mt-card .mt-due-badge {
      font-size: 10px;
      background: rgba(74,144,226,0.15);
      color: #4A90E2;
      border-radius: 10px;
      padding: 1px 7px;
      letter-spacing: 0;
      text-transform: none;
    }
    #mt-card .mt-close {
      background: none;
      border: none;
      color: #666;
      font-size: 16px;
      cursor: pointer;
      padding: 0;
      line-height: 1;
    }
    #mt-card .mt-close:hover { color: #eee; }
    #mt-card .mt-question {
      font-size: 14px;
      line-height: 1.5;
      min-height: 44px;
      margin-bottom: 12px;
    }
    #mt-card .mt-answer {
      font-size: 13px;
      color: #4A90E2;
      padding-top: 10px;
      border-top: 1px solid rgba(74,144,226,0.25);
      margin-bottom: 12px;
      display: none;
    }
    #mt-card .mt-actions {
      display: flex;
      gap: 8px;
    }
    #mt-card .mt-btn {
      flex: 1;
      padding: 7px;
      border-radius: 8px;
      border: none;
      cursor: pointer;
      font-size: 12px;
      font-weight: 600;
      transition: opacity 0.15s;
    }
    #mt-card .mt-btn:hover { opacity: 0.8; }
    #mt-card .mt-reveal  { background: #4A90E2; color: #fff; }
    #mt-card .mt-got-it  { background: #27ae60; color: #fff; }
    #mt-card .mt-skip    { background: #2a2a40; color: #aaa; }
    #mt-card kbd {
      font-family: inherit;
      font-size: 10px;
      font-weight: normal;
      opacity: 0.45;
      margin-left: 4px;
    }
    #mt-card.mt-card-light {
      background: #ffffff;
      border-color: #1a73e8;
      color: #202124;
      box-shadow: 0 6px 24px rgba(0,0,0,0.15);
    }
    #mt-card.mt-card-light .mt-header { color: #1a73e8; }
    #mt-card.mt-card-light .mt-close  { color: #5f6368; }
    #mt-card.mt-card-light .mt-close:hover { color: #202124; }
    #mt-card.mt-card-light .mt-answer { color: #1a73e8; border-top-color: rgba(26,115,232,0.25); }
    #mt-card.mt-card-light .mt-skip   { background: #f1f3f4; color: #5f6368; }
    #mt-card.mt-card-light .mt-due-badge { background: rgba(26,115,232,0.1); color: #1a73e8; }
  `;
  document.head.appendChild(style);

  // --- Card DOM ---
  const card = document.createElement('div');
  card.id = 'mt-card';
  card.setAttribute('role', 'dialog');
  card.setAttribute('aria-modal', 'true');
  card.setAttribute('aria-label', 'Flashcard');
  card.innerHTML = `
    <div class="mt-header">
      <div class="mt-header-left">
        <span>⚡ MindTab</span>
        <span class="mt-due-badge" id="mt-due-badge" style="display:none"></span>
      </div>
      <button class="mt-close" aria-label="Close">✕ <kbd>Esc</kbd></button>
    </div>
    <div class="mt-question"></div>
    <div class="mt-answer"></div>
    <div class="mt-actions">
      <button class="mt-btn mt-reveal">Reveal <kbd>Space</kbd></button>
      <button class="mt-btn mt-skip">Skip <kbd>2</kbd></button>
    </div>
  `;
  document.body.appendChild(card);

  const questionEl = card.querySelector('.mt-question');
  const answerEl   = card.querySelector('.mt-answer');
  const revealBtn  = card.querySelector('.mt-reveal');
  const skipBtn    = card.querySelector('.mt-skip');
  const closeBtn   = card.querySelector('.mt-close');
  const dueBadge   = card.querySelector('#mt-due-badge');

  let autoHideTimer;
  let showing = false;
  let currentCard = null;

  // --- SRS helpers ---
  const SRS_KEY = 'mindtabSRS';
  const DAY_MS  = 24 * 60 * 60 * 1000;

  function cardKey(c) {
    let h = 5381;
    for (let i = 0; i < c.q.length; i++) h = (h * 33 ^ c.q.charCodeAt(i)) >>> 0;
    return h.toString(36);
  }

  async function migrateSRS() {
    try {
      const { mindtabSRS } = await chrome.storage.sync.get(SRS_KEY);
      if (!mindtabSRS) return;
      const local = await chrome.storage.local.get(SRS_KEY);
      if (!local[SRS_KEY]) await chrome.storage.local.set({ [SRS_KEY]: mindtabSRS });
      await chrome.storage.sync.remove(SRS_KEY);
    } catch (e) {
      console.error('[MindTab] SRS migration failed:', e);
    }
  }

  async function getSRS() {
    try {
      const { mindtabSRS } = await chrome.storage.local.get(SRS_KEY);
      return mindtabSRS || {};
    } catch (e) {
      console.error('[MindTab] getSRS failed:', e);
      return {};
    }
  }

  async function saveSRS(srs) {
    try {
      await chrome.storage.local.set({ [SRS_KEY]: srs });
    } catch (e) {
      console.error('[MindTab] saveSRS failed:', e);
    }
  }

  async function recordResult(c, gotIt) {
    try {
      const srs = await getSRS();
      const key = cardKey(c);
      const data = srs[key] || { ease: 2.5, interval: 1 };

      if (gotIt) {
        data.ease     = Math.min(3.0, data.ease + 0.1);
        data.interval = Math.max(1, Math.round(data.interval * data.ease));
      } else {
        data.ease     = Math.max(1.3, data.ease - 0.2);
        data.interval = 1;
      }
      data.nextDue = Date.now() + data.interval * DAY_MS;
      srs[key] = data;
      await saveSRS(srs);
    } catch (e) {
      console.error('[MindTab] recordResult failed:', e);
    }
  }

  async function getAllCards() {
    const { mindtabCards } = await chrome.storage.sync.get('mindtabCards');
    return [...defaultCards, ...(mindtabCards || [])];
  }

  async function pickCard(cards) {
    if (cards.length === 1) return cards[0];
    const srs = await getSRS();
    const now = Date.now();

    // Prefer cards that are due (new cards or past their interval)
    const due = cards.filter(c => {
      const d = srs[cardKey(c)];
      return !d || d.nextDue <= now;
    });

    const pool = due.length > 0 ? due : cards;

    // Avoid repeating the last-shown card
    const { mindtabLastCard } = await chrome.storage.local.get('mindtabLastCard');
    let pick = pool[Math.floor(Math.random() * pool.length)];
    if (pool.length > 1 && cardKey(pick) === mindtabLastCard) {
      const others = pool.filter(c => cardKey(c) !== mindtabLastCard);
      if (others.length) pick = others[Math.floor(Math.random() * others.length)];
    }

    await chrome.storage.local.set({ mindtabLastCard: cardKey(pick) });

    // Show due count in badge
    if (due.length > 0) {
      dueBadge.textContent = `${due.length} due`;
      dueBadge.style.display = 'inline';
    } else {
      dueBadge.style.display = 'none';
    }

    return pick;
  }

  async function showCard() {
    if (showing) return;
    const cards = await getAllCards();
    currentCard = await pickCard(cards);

    questionEl.textContent = currentCard.q;
    answerEl.textContent   = currentCard.a;
    answerEl.style.display = 'none';
    revealBtn.innerHTML    = 'Reveal <kbd>Space</kbd>';
    revealBtn.className    = 'mt-btn mt-reveal';

    card.style.display = 'block';
    applyCardTheme();
    showing = true;

    // Move focus to the card for accessibility
    revealBtn.focus();

    autoHideTimer = setTimeout(() => {
      // Timeout counts as a skip (card not recalled)
      if (currentCard) recordResult(currentCard, false);
      dismiss();
    }, settings.displayDurationSeconds * 1000);
  }

  function dismiss() {
    clearTimeout(autoHideTimer);
    card.style.display = 'none';
    showing = false;
    currentCard = null;
    schedule();
  }

  function schedule() {
    setTimeout(showCard, settings.showAfterMinutes * 60 * 1000);
  }

  revealBtn.addEventListener('click', () => {
    if (answerEl.style.display === 'none') {
      clearTimeout(autoHideTimer);
      answerEl.style.display = 'block';
      revealBtn.innerHTML    = 'Got it ✓ <kbd>1</kbd>';
      revealBtn.className    = 'mt-btn mt-got-it';
    } else {
      if (currentCard) recordResult(currentCard, true);
      dismiss();
    }
  });

  skipBtn.addEventListener('click', () => {
    if (currentCard) recordResult(currentCard, false);
    dismiss();
  });

  closeBtn.addEventListener('click', dismiss);

  // Focus trap + keyboard navigation inside the dialog (B04 / F06)
  card.addEventListener('keydown', e => {
    if (!showing) return;
    if (e.key === 'Escape') { dismiss(); return; }
    if (e.key === ' ' || e.key === 'Enter') { e.preventDefault(); revealBtn.click(); return; }
    if (e.key === '1') { revealBtn.click(); return; }
    if (e.key === '2') { skipBtn.click(); return; }
    if (e.key !== 'Tab') return;
    const focusable = [closeBtn, revealBtn, skipBtn];
    const idx = focusable.indexOf(document.activeElement);
    e.preventDefault();
    const next = e.shiftKey
      ? focusable[(idx - 1 + focusable.length) % focusable.length]
      : focusable[(idx + 1) % focusable.length];
    next.focus();
  });

  // Alt+Shift+F triggers a card on demand
  document.addEventListener('keydown', e => {
    if (e.altKey && e.shiftKey && e.key === 'F' && !showing) showCard();
  });

  // F01: apply theme class matching the user's current theme selection
  function applyCardTheme() {
    const theme = window.__MindTab?.state?.theme || 'system';
    const isLight = theme === 'light' ||
      (theme === 'system' && window.matchMedia('(prefers-color-scheme: light)').matches);
    card.classList.toggle('mt-card-light', isLight);
  }

  chrome.storage.onChanged.addListener((changes, area) => {
    if (area === 'sync' && changes.mindtab?.newValue?.theme !== undefined) {
      window.__MindTab.state.theme = changes.mindtab.newValue.theme;
      applyCardTheme();
    }
  });

  await migrateSRS();
  schedule();
}

if (window.__MindTab?.ready) {
  initFlashcards();
} else {
  window.addEventListener('mindtab:ready', initFlashcards, { once: true });
}

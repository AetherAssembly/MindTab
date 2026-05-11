function initFlashcards() {
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
  `;
  document.head.appendChild(style);

  // --- Card DOM ---
  const card = document.createElement('div');
  card.id = 'mt-card';
  card.innerHTML = `
    <div class="mt-header">
      <span>⚡ MindTab</span>
      <button class="mt-close" aria-label="Close">✕</button>
    </div>
    <div class="mt-question"></div>
    <div class="mt-answer"></div>
    <div class="mt-actions">
      <button class="mt-btn mt-reveal">Reveal</button>
      <button class="mt-btn mt-skip">Skip</button>
    </div>
  `;
  document.body.appendChild(card);

  const questionEl = card.querySelector('.mt-question');
  const answerEl   = card.querySelector('.mt-answer');
  const revealBtn  = card.querySelector('.mt-reveal');
  const skipBtn    = card.querySelector('.mt-skip');
  const closeBtn   = card.querySelector('.mt-close');

  let autoHideTimer;
  let showing = false;

  async function getAllCards() {
    const { mindtabCards } = await chrome.storage.sync.get('mindtabCards');
    return [...defaultCards, ...(mindtabCards || [])];
  }

  async function pickCard(cards) {
    const { mindtabCardIdx } = await chrome.storage.local.get('mindtabCardIdx');
    const next = ((mindtabCardIdx ?? -1) + 1) % cards.length;
    await chrome.storage.local.set({ mindtabCardIdx: next });
    return cards[next];
  }

  async function showCard() {
    if (showing) return;
    const cards = await getAllCards();
    const current = await pickCard(cards);

    questionEl.textContent = current.q;
    answerEl.textContent   = current.a;
    answerEl.style.display = 'none';
    revealBtn.textContent  = 'Reveal';
    revealBtn.className    = 'mt-btn mt-reveal';

    card.style.display = 'block';
    showing = true;

    autoHideTimer = setTimeout(dismiss, settings.displayDurationSeconds * 1000);
  }

  function dismiss() {
    clearTimeout(autoHideTimer);
    card.style.display = 'none';
    showing = false;
    schedule();
  }

  function schedule() {
    setTimeout(showCard, settings.showAfterMinutes * 60 * 1000);
  }

  revealBtn.addEventListener('click', () => {
    if (answerEl.style.display === 'none') {
      clearTimeout(autoHideTimer);
      answerEl.style.display = 'block';
      revealBtn.textContent  = 'Got it ✓';
      revealBtn.className    = 'mt-btn mt-got-it';
    } else {
      dismiss();
    }
  });

  skipBtn.addEventListener('click', dismiss);
  closeBtn.addEventListener('click', dismiss);

  schedule();
}

if (window.__MindTab?.ready) {
  initFlashcards();
} else {
  window.addEventListener('mindtab:ready', initFlashcards, { once: true });
}

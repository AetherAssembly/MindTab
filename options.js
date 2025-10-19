// options.js

document.addEventListener('DOMContentLoaded', async () => {
  const toneEl = document.getElementById('toneEnabled');
  const flashEl = document.getElementById('flashcardsEnabled');
  const cardsEl = document.getElementById('cards');
  const addCardBtn = document.getElementById('addCard');
  const saveBtn = document.getElementById('save');
  const throttleEl = document.getElementById('throttle');

  function createCardRow(card) {
    const row = document.createElement('div');
    row.className = 'card-row';
    const q = document.createElement('input'); q.type = 'text'; q.placeholder = 'Question'; q.value = card && card.question ? card.question : '';
    const a = document.createElement('input'); a.type = 'text'; a.placeholder = 'Answer'; a.value = card && card.answer ? card.answer : '';
    const del = document.createElement('button'); del.textContent = 'Remove'; del.addEventListener('click', () => row.remove());
    row.appendChild(q); row.appendChild(a); row.appendChild(del);
    return row;
  }

  addCardBtn.addEventListener('click', () => {
    cardsEl.appendChild(createCardRow({}));
  });

  // small non-blocking feedback
  const feedback = document.createElement('div'); feedback.style.marginTop = '8px';
  document.querySelector('main').appendChild(feedback);

  saveBtn.addEventListener('click', async () => {
    try {
      const rows = Array.from(cardsEl.querySelectorAll('.card-row'));
      const flashcards = rows.map(r => ({ question: r.children[0].value.trim(), answer: r.children[1].value.trim() })).filter(c => c.question || c.answer);
      const toneEnabled = toneEl.checked;
      const flashcardsEnabled = flashEl.checked;
      const throttleMinutes = Math.max(1, parseInt(throttleEl.value || '30', 10));

      await new Promise((resolve) => {
        try { chrome.storage.local.set({ toneEnabled, flashcardsEnabled, flashcards, flashcardThrottleMs: throttleMinutes * 60 * 1000 }, resolve); }
        catch (e) { console.warn('storage.set failed', e); resolve(); }
      });

      feedback.textContent = 'Settings saved.';
      setTimeout(() => feedback.textContent = '', 2000);
    } catch (e) {
      console.error('Failed to save settings', e);
      feedback.textContent = 'Failed to save settings.';
    }
  });

  // load
  chrome.storage.local.get(['toneEnabled', 'flashcardsEnabled', 'flashcards', 'flashcardThrottleMs'], (data) => {
    toneEl.checked = typeof data.toneEnabled === 'boolean' ? data.toneEnabled : true;
    flashEl.checked = typeof data.flashcardsEnabled === 'boolean' ? data.flashcardsEnabled : true;
    const cards = data && data.flashcards ? data.flashcards : [];
    cards.forEach(c => cardsEl.appendChild(createCardRow(c)));
    if (!cards.length) cardsEl.appendChild(createCardRow({}));
    const thrott = typeof data.flashcardThrottleMs === 'number' ? Math.round(data.flashcardThrottleMs / 60000) : 30;
    throttleEl.value = thrott;
  });
});

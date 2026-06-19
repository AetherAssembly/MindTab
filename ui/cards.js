async function getCustomCards() {
  const { mindtabCards } = await chrome.storage.sync.get('mindtabCards');
  return mindtabCards || [];
}

async function saveCustomCards(cards) {
  await chrome.storage.sync.set({ mindtabCards: cards });
}

async function getDefaultCards() {
  const res = await fetch(chrome.runtime.getURL('config/flashcards.json'));
  const data = await res.json();
  return data.defaultCards || [];
}

function makeCardItem(card, index, onDelete) {
  const li = document.createElement('li');
  li.className = 'card-item';

  const q = document.createElement('span');
  q.className = 'card-q';
  q.textContent = card.q;

  const a = document.createElement('span');
  a.className = 'card-a';
  a.textContent = card.a;

  li.append(q, a);

  if (onDelete) {
    const btn = document.createElement('button');
    btn.className = 'card-del';
    btn.setAttribute('aria-label', 'Delete card');
    btn.textContent = '✕';
    btn.addEventListener('click', () => onDelete(index));
    li.appendChild(btn);
  }

  return li;
}

async function render() {
  const [customCards, defaultCards] = await Promise.all([getCustomCards(), getDefaultCards()]);

  const customList  = document.getElementById('custom-list');
  const defaultList = document.getElementById('default-list');
  const emptyMsg    = document.getElementById('empty-msg');
  const countEl     = document.getElementById('custom-count');
  const defCountEl  = document.getElementById('default-count');
  const clearBtn    = document.getElementById('btn-clear');

  countEl.textContent    = customCards.length;
  defCountEl.textContent = defaultCards.length;
  clearBtn.style.display = customCards.length > 0 ? 'block' : 'none';

  // Custom cards
  customList.innerHTML = '';
  if (customCards.length === 0) {
    emptyMsg.style.display = 'block';
    customList.appendChild(emptyMsg);
  } else {
    emptyMsg.style.display = 'none';
    customCards.forEach((card, i) => {
      customList.appendChild(makeCardItem(card, i, async (idx) => {
        const updated = customCards.filter((_, j) => j !== idx);
        await saveCustomCards(updated);
        render();
      }));
    });
  }

  // Default cards (read-only)
  defaultList.innerHTML = '';
  defaultCards.forEach(card => {
    defaultList.appendChild(makeCardItem(card, -1, null));
  });
}

document.addEventListener('DOMContentLoaded', async () => {
  await render();

  // Add card
  const qInput  = document.getElementById('input-q');
  const aInput  = document.getElementById('input-a');
  const addBtn  = document.getElementById('btn-add');
  const addMsg  = document.getElementById('add-msg');
  let msgTimer;

  function showMsg(text, color = '#27ae60') {
    addMsg.style.color = color;
    addMsg.textContent = text;
    clearTimeout(msgTimer);
    msgTimer = setTimeout(() => { addMsg.textContent = ''; }, 2500);
  }

  addBtn.addEventListener('click', async () => {
    const q = qInput.value.trim();
    const a = aInput.value.trim();
    if (!q || !a) { showMsg('Both fields are required.', '#e74c3c'); return; }

    const cards = await getCustomCards();
    const newCards = [...cards, { q, a }];
    if (JSON.stringify(newCards).length > 7500) {
      showMsg('Storage limit reached. Delete some cards first.', '#e74c3c');
      return;
    }
    await saveCustomCards(newCards);

    qInput.value = '';
    aInput.value = '';
    qInput.focus();
    showMsg(`Card added! (${newCards.length} total)`);
    render();
  });

  // Allow Enter key to submit from answer field
  aInput.addEventListener('keydown', e => { if (e.key === 'Enter') addBtn.click(); });

  // Clear all
  document.getElementById('btn-clear').addEventListener('click', async () => {
    if (!confirm('Delete all custom cards?')) return;
    await saveCustomCards([]);
    render();
  });

  // Export custom cards + SRS progress as JSON
  document.getElementById('btn-export').addEventListener('click', async () => {
    const cards = await getCustomCards();
    if (cards.length === 0) { showMsg('No custom cards to export.', '#e0a050'); return; }
    const { mindtabSRS } = await chrome.storage.local.get('mindtabSRS');
    const exportData = { version: 1, cards, srs: mindtabSRS || {} };
    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement('a');
    a.href     = url;
    a.download = 'mindtab-cards.json';
    a.click();
    URL.revokeObjectURL(url);
    showMsg(`Exported ${cards.length} card${cards.length !== 1 ? 's' : ''} with progress!`);
  });

  // Import cards from JSON file (supports legacy plain-array format and v1 {cards, srs} format)
  document.getElementById('import-file').addEventListener('change', async e => {
    const file = e.target.files[0];
    if (!file) return;
    try {
      const text = await file.text();
      const data = JSON.parse(text);

      let cardData, srsData = null;
      if (Array.isArray(data)) {
        cardData = data;
      } else if (data.version === 1 && Array.isArray(data.cards)) {
        cardData = data.cards;
        srsData = (data.srs && typeof data.srs === 'object') ? data.srs : null;
      } else {
        throw new Error('Expected a JSON array or {version, cards} object');
      }

      const valid = cardData.filter(c => typeof c?.q === 'string' && typeof c?.a === 'string' && c.q.trim() && c.a.trim());
      if (valid.length === 0) throw new Error('No valid {q, a} entries found');

      const current = await getCustomCards();
      const merged = [...current, ...valid];
      if (JSON.stringify(merged).length > 7500) {
        throw new Error('Import would exceed storage limit. Delete some cards first.');
      }
      await saveCustomCards(merged);

      if (srsData) {
        const { mindtabSRS } = await chrome.storage.local.get('mindtabSRS');
        // Existing local progress takes priority; imported data fills in gaps
        await chrome.storage.local.set({ mindtabSRS: { ...srsData, ...(mindtabSRS || {}) } });
      }

      const progressNote = srsData ? ' with progress' : '';
      showMsg(`Imported ${valid.length} card${valid.length !== 1 ? 's' : ''}${progressNote}!`);
      render();
    } catch (err) {
      showMsg(`Import failed: ${err.message}`, '#e74c3c');
    }
    e.target.value = '';
  });
});

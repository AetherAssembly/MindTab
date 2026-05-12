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
    cards.push({ q, a });
    await saveCustomCards(cards);

    qInput.value = '';
    aInput.value = '';
    qInput.focus();
    showMsg('Card added!');
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
});

// @ts-check
const STORAGE_LIMIT = 7500;

function cardKey(c) {
  let h = 5381;
  for (let i = 0; i < c.q.length; i++) h = (h * 33 ^ c.q.charCodeAt(i)) >>> 0;
  return h.toString(36);
}

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

async function getDeletedDefaults() {
  const { mindtabDeletedDefaults } = await chrome.storage.sync.get('mindtabDeletedDefaults');
  return mindtabDeletedDefaults || [];
}

async function saveDeletedDefaults(keys) {
  await chrome.storage.sync.set({ mindtabDeletedDefaults: keys });
}

function makeCardItem(card, { onDelete, onEdit } = {}) {
  const li = document.createElement('li');
  li.className = 'card-item';

  const q = document.createElement('span');
  q.className = 'card-q';
  q.textContent = card.q;

  const a = document.createElement('span');
  a.className = 'card-a';
  a.textContent = card.a;

  li.append(q, a);

  const actions = document.createElement('div');
  actions.className = 'card-actions';

  if (onEdit) {
    const editBtn = document.createElement('button');
    editBtn.className = 'card-edit';
    editBtn.setAttribute('aria-label', 'Edit card');
    editBtn.textContent = '✎';
    editBtn.addEventListener('click', () => onEdit(li, card));
    actions.appendChild(editBtn);
  }

  if (onDelete) {
    const delBtn = document.createElement('button');
    delBtn.className = 'card-del';
    delBtn.setAttribute('aria-label', 'Delete card');
    delBtn.textContent = '✕';
    delBtn.addEventListener('click', onDelete);
    actions.appendChild(delBtn);
  }

  li.appendChild(actions);
  return li;
}

function showInlineEditForm(li, card, onSave) {
  const form = document.createElement('div');
  form.className = 'card-edit-form';

  const inputs = document.createElement('div');
  inputs.className = 'edit-inputs';

  const qInput = document.createElement('input');
  qInput.type = 'text';
  qInput.value = card.q;
  qInput.maxLength = 200;
  qInput.placeholder = 'Question';

  const aInput = document.createElement('input');
  aInput.type = 'text';
  aInput.value = card.a;
  aInput.maxLength = 300;
  aInput.placeholder = 'Answer';

  inputs.append(qInput, aInput);

  const editActions = document.createElement('div');
  editActions.className = 'edit-actions';

  const saveBtn = document.createElement('button');
  saveBtn.className = 'btn-save-edit';
  saveBtn.textContent = 'Save';

  const cancelBtn = document.createElement('button');
  cancelBtn.className = 'btn-cancel-edit';
  cancelBtn.textContent = 'Cancel';

  editActions.append(saveBtn, cancelBtn);
  form.append(inputs, editActions);

  // Replace li content with edit form
  const originalContent = [...li.childNodes];
  li.innerHTML = '';
  li.appendChild(form);
  qInput.focus();
  qInput.select();

  cancelBtn.addEventListener('click', () => {
    li.innerHTML = '';
    originalContent.forEach(n => li.appendChild(n));
  });

  saveBtn.addEventListener('click', async () => {
    const newQ = qInput.value.trim();
    const newA = aInput.value.trim();
    if (!newQ || !newA) return;
    await onSave({ q: newQ, a: newA });
  });

  aInput.addEventListener('keydown', e => { if (e.key === 'Enter') saveBtn.click(); });
  qInput.addEventListener('keydown', e => { if (e.key === 'Tab' && !e.shiftKey) { e.preventDefault(); aInput.focus(); } });
}

function updateStorageMeter(customCards) {
  const used = JSON.stringify(customCards).length;
  const pct  = Math.min(100, Math.round(used / STORAGE_LIMIT * 100));
  const bar  = document.getElementById('storage-bar');
  const text = document.getElementById('storage-text');

  bar.style.width = pct + '%';
  bar.className   = 'storage-bar' + (pct >= 90 ? ' danger' : pct >= 65 ? ' warn' : '');
  text.textContent = `Custom card storage: ${used.toLocaleString()} / ${STORAGE_LIMIT.toLocaleString()} bytes (${pct}%)`;
}

let _searchQuery = '';

async function render() {
  const [customCards, allDefaultCards, deletedKeys] = await Promise.all([
    getCustomCards(), getDefaultCards(), getDeletedDefaults()
  ]);

  const deletedSet     = new Set(deletedKeys);
  const activeDefaults = allDefaultCards.filter(c => !deletedSet.has(cardKey(c)));
  const hasCustom      = customCards.length > 0;

  const q = _searchQuery.toLowerCase().trim();

  const customList   = document.getElementById('custom-list');
  const defaultList  = document.getElementById('default-list');
  const emptyMsg     = document.getElementById('empty-msg');
  const countEl      = document.getElementById('custom-count');
  const defCountEl   = document.getElementById('default-count');
  const clearBtn     = document.getElementById('btn-clear');
  const readonlyTag  = document.getElementById('readonly-tag');
  const defaultsHint = document.getElementById('defaults-hint');

  countEl.textContent    = customCards.length;
  defCountEl.textContent = activeDefaults.length;
  clearBtn.style.display = hasCustom ? 'block' : 'none';

  // Show/hide delete buttons on defaults based on whether user has custom cards
  if (readonlyTag)  readonlyTag.style.display  = hasCustom ? 'none' : '';
  if (defaultsHint) defaultsHint.style.display = hasCustom ? 'block' : 'none';

  // Storage meter
  updateStorageMeter(customCards);

  // Custom cards — preserve original indices for delete/edit even when filtered
  const indexedCustom = customCards.map((card, i) => ({ card, i }));
  const visibleCustom = q
    ? indexedCustom.filter(({ card }) => card.q.toLowerCase().includes(q) || card.a.toLowerCase().includes(q))
    : indexedCustom;

  customList.innerHTML = '';
  if (customCards.length === 0) {
    emptyMsg.style.display = 'block';
    emptyMsg.textContent = 'No custom cards yet. Add one above!';
    customList.appendChild(emptyMsg);
  } else if (visibleCustom.length === 0) {
    emptyMsg.style.display = 'block';
    emptyMsg.textContent = 'No cards match your search.';
    customList.appendChild(emptyMsg);
  } else {
    emptyMsg.style.display = 'none';
    emptyMsg.textContent = 'No custom cards yet. Add one above!';
    visibleCustom.forEach(({ card, i }) => {
      customList.appendChild(makeCardItem(card, {
        onDelete: async () => {
          await saveCustomCards(customCards.filter((_, j) => j !== i));
          render();
        },
        onEdit: (li, c) => {
          showInlineEditForm(li, c, async updated => {
            const cards = await getCustomCards();
            cards[i] = updated;
            if (JSON.stringify(cards).length > STORAGE_LIMIT) {
              render();
              showStatusMsg('add-msg', 'Edit would exceed storage limit.', '#e74c3c');
              return;
            }
            await saveCustomCards(cards);
            render();
          });
        }
      }));
    });
  }

  // Default cards (also filtered by search)
  const visibleDefaults = q
    ? activeDefaults.filter(c => c.q.toLowerCase().includes(q) || c.a.toLowerCase().includes(q))
    : activeDefaults;

  defaultList.innerHTML = '';
  visibleDefaults.forEach(card => {
    defaultList.appendChild(makeCardItem(card, hasCustom ? {
      onDelete: async () => {
        const key = cardKey(card);
        const updated = [...deletedKeys.filter(k => k !== key), key];
        await saveDeletedDefaults(updated);
        render();
      }
    } : {}));
  });
}

let msgTimer;
function showStatusMsg(id, text, color = '#27ae60') {
  const el = document.getElementById(id);
  if (!el) return;
  el.style.color = color;
  el.textContent = text;
  clearTimeout(msgTimer);
  msgTimer = setTimeout(() => { el.textContent = ''; }, 2500);
}

document.addEventListener('DOMContentLoaded', async () => {
  await render();

  // Add card
  const qInput = document.getElementById('input-q');
  const aInput = document.getElementById('input-a');
  const addBtn = document.getElementById('btn-add');

  addBtn.addEventListener('click', async () => {
    const q = qInput.value.trim();
    const a = aInput.value.trim();
    if (!q || !a) { showStatusMsg('add-msg', 'Both fields are required.', '#e74c3c'); return; }

    const cards    = await getCustomCards();
    const newCards = [...cards, { q, a }];
    if (JSON.stringify(newCards).length > STORAGE_LIMIT) {
      showStatusMsg('add-msg', 'Storage limit reached. Delete some cards first.', '#e74c3c');
      return;
    }
    await saveCustomCards(newCards);

    qInput.value = '';
    aInput.value = '';
    qInput.focus();
    showStatusMsg('add-msg', `Card added! (${newCards.length} total)`);
    render();
  });

  aInput.addEventListener('keydown', e => { if (e.key === 'Enter') addBtn.click(); });

  // Search / filter
  document.getElementById('search-input').addEventListener('input', e => {
    _searchQuery = e.target.value;
    render();
  });

  // Clear all custom cards
  document.getElementById('btn-clear').addEventListener('click', async () => {
    if (!confirm('Delete all custom cards?')) return;
    await saveCustomCards([]);
    render();
  });

  // Export as Anki-compatible CSV (Front,Back)
  document.getElementById('btn-export-csv').addEventListener('click', async () => {
    const cards = await getCustomCards();
    if (cards.length === 0) { showStatusMsg('add-msg', 'No custom cards to export.', '#e0a050'); return; }
    const rows = cards.map(c => `"${c.q.replace(/"/g, '""')}","${c.a.replace(/"/g, '""')}"`);
    const csv  = 'Front,Back\n' + rows.join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement('a');
    a.href     = url;
    a.download = 'mindtab-cards.csv';
    a.click();
    URL.revokeObjectURL(url);
    showStatusMsg('add-msg', `Exported ${cards.length} card${cards.length !== 1 ? 's' : ''} as CSV!`);
  });

  // Export custom cards + SRS progress as JSON
  document.getElementById('btn-export').addEventListener('click', async () => {
    const cards = await getCustomCards();
    if (cards.length === 0) { showStatusMsg('add-msg', 'No custom cards to export.', '#e0a050'); return; }
    const { mindtabSRS } = await chrome.storage.local.get('mindtabSRS');
    const exportData = { version: 1, cards, srs: mindtabSRS || {} };
    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement('a');
    a.href     = url;
    a.download = 'mindtab-cards.json';
    a.click();
    URL.revokeObjectURL(url);
    showStatusMsg('add-msg', `Exported ${cards.length} card${cards.length !== 1 ? 's' : ''} with progress!`);
  });

  // Import cards from JSON file
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
      const merged  = [...current, ...valid];
      if (JSON.stringify(merged).length > STORAGE_LIMIT) {
        throw new Error('Import would exceed storage limit. Delete some cards first.');
      }
      await saveCustomCards(merged);

      if (srsData) {
        const { mindtabSRS } = await chrome.storage.local.get('mindtabSRS');
        await chrome.storage.local.set({ mindtabSRS: { ...srsData, ...(mindtabSRS || {}) } });
      }

      showStatusMsg('add-msg', `Imported ${valid.length} card${valid.length !== 1 ? 's' : ''}${srsData ? ' with progress' : ''}!`);
      render();
    } catch (err) {
      showStatusMsg('add-msg', `Import failed: ${err.message}`, '#e74c3c');
    }
    e.target.value = '';
  });
});

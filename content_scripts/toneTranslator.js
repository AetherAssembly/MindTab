(function () {
  // Full refactor: clearer, accessible suggestion UI with keyboard nav,
  // debounce, safe clipboard handling, and improved storage messaging.

  let toneConfig = null;
  let suggestionBox = null;
  let activeEditable = null; // element that triggered suggestions
  let lastSuggestions = null;

  // Small debounce helper
  function debounce(fn, wait) {
    let t = null;
    return function (...args) {
      clearTimeout(t);
      t = setTimeout(() => fn.apply(this, args), wait);
    };
  }

  // Read user setting for tone translator; default true
  async function isToneEnabled() {
    try {
      if (!chrome || !chrome.storage || !chrome.storage.local) return true;
      const data = await new Promise(resolve => chrome.storage.local.get('toneEnabled', resolve));
      return typeof data.toneEnabled === 'boolean' ? data.toneEnabled : true;
    } catch (e) {
      console.warn('isToneEnabled check failed', e);
      return true;
    }
  }

  // Safe loader: don't fail if helper isn't available
  if (typeof loadToneConfig === 'function') {
    loadToneConfig().then(config => { toneConfig = config; }).catch(err => {
      console.warn('loadToneConfig failed', err);
    });
  } else {
    console.warn('loadToneConfig() not available. toneConfig will be null.');
  }

  function isEditableTarget(el) {
    if (!el) return false;
    const tag = el.tagName || '';
    return tag === 'TEXTAREA' || tag === 'INPUT' || el.isContentEditable === true;
  }

  function getTargetText(el) {
    if (!el) return '';
    if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') return el.value || '';
    if (el.isContentEditable) return el.innerText || '';
    return '';
  }

  // Ensure classifyTone exists before calling it
  function runClassification(text) {
    if (!text) return [];
    if (typeof classifyTone === 'function') {
      try {
        return classifyTone(text, toneConfig) || [];
      } catch (err) {
        console.warn('classifyTone failed', err);
        return [];
      }
    }
    console.warn('classifyTone() not available');
    return [];
  }

  async function copyToClipboard(text, feedbackEl) {
    if (!navigator.clipboard) {
      try {
        // fallback using execCommand if available
        const ta = document.createElement('textarea');
        ta.value = text;
        ta.style.position = 'fixed';
        ta.style.opacity = '0';
        document.body.appendChild(ta);
        ta.select();
        document.execCommand('copy');
        ta.remove();
        if (feedbackEl) showTransientFeedback(feedbackEl, 'Copied');
        return true;
      } catch (e) {
        if (feedbackEl) showTransientFeedback(feedbackEl, 'Copy failed');
        return false;
      }
    }

    try {
      await navigator.clipboard.writeText(text);
      if (feedbackEl) showTransientFeedback(feedbackEl, 'Copied');
      return true;
    } catch (err) {
      console.warn('clipboard.writeText failed', err);
      if (feedbackEl) showTransientFeedback(feedbackEl, 'Copy failed');
      return false;
    }
  }

  function showTransientFeedback(el, msg, ms = 1800) {
    if (!el) return;
    const prev = el.textContent;
    el.textContent = msg;
    setTimeout(() => { el.textContent = prev; }, ms);
  }

  function removeSuggestionBox() {
    if (suggestionBox && suggestionBox.parentNode) suggestionBox.remove();
    suggestionBox = null;
    lastSuggestions = null;
    activeEditable = null;
    document.removeEventListener('mousedown', onDocumentMouseDown, true);
    document.removeEventListener('keydown', onKeyDown, true);
  }

  function onDocumentMouseDown(e) {
    if (!suggestionBox) return;
    if (!suggestionBox.contains(e.target)) removeSuggestionBox();
  }

  function onKeyDown(e) {
    if (!suggestionBox) return;
    if (e.key === 'Escape') {
      removeSuggestionBox();
      return;
    }
    const focused = document.activeElement;
    const options = suggestionBox.querySelectorAll('.tone-option');
    if (!options || options.length === 0) return;

    const idx = Array.prototype.indexOf.call(options, focused);
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      const next = options[Math.min(options.length - 1, idx + 1)] || options[0];
      next.focus();
      return;
    }
    if (e.key === 'ArrowUp') {
      e.preventDefault();
      const prev = options[Math.max(0, idx - 1)] || options[options.length - 1];
      prev.focus();
      return;
    }
    if (e.key === 'Enter') {
      e.preventDefault();
      if (idx >= 0) options[idx].click();
    }
  }

  function buildSuggestionBox(suggestions, sourceText) {
    removeSuggestionBox();

    suggestionBox = document.createElement('div');
    suggestionBox.className = 'tone-suggestions';
    suggestionBox.setAttribute('role', 'listbox');
    suggestionBox.setAttribute('aria-label', 'Tone suggestions');

    const header = document.createElement('div');
    header.className = 'ts-header';
    header.textContent = `Suggestions (${suggestions.length})`;
    suggestionBox.appendChild(header);

    const feedback = document.createElement('div');
    feedback.className = 'ts-feedback';
    suggestionBox.appendChild(feedback);

    suggestions.forEach((s, i) => {
      const option = document.createElement('div');
      option.className = 'tone-option';
      option.setAttribute('role', 'option');
      option.setAttribute('tabindex', '0');
      option.dataset.index = String(i);
      // display label and truncated text for readability
      const label = s.label || `Option ${i + 1}`;
      const text = s.text || '';
      option.textContent = `${label}: ${text}`;

      option.addEventListener('click', async (ev) => {
        // Prefer inserting into the active editable if same origin and editable
        if (activeEditable && isEditableTarget(activeEditable)) {
          // If it's an input/textarea replace selection or append
          try {
            if (activeEditable.tagName === 'INPUT' || activeEditable.tagName === 'TEXTAREA') {
              const el = activeEditable;
              const start = el.selectionStart || el.value.length;
              const end = el.selectionEnd || start;
              el.setRangeText(text, start, end, 'end');
              el.focus();
            } else if (activeEditable.isContentEditable) {
              // insert at caret
              const sel = window.getSelection();
              if (sel && sel.rangeCount > 0) {
                sel.deleteFromDocument();
                sel.getRangeAt(0).insertNode(document.createTextNode(text));
              } else {
                activeEditable.appendChild(document.createTextNode(text));
              }
            }
            showTransientFeedback(feedback, 'Inserted');
          } catch (e) {
            // fallback to clipboard
            await copyToClipboard(text, feedback);
          }
        } else {
          await copyToClipboard(text, feedback);
        }
      });

      option.addEventListener('keydown', (ev) => {
        // prevent propagation to page
        ev.stopPropagation();
      });

      suggestionBox.appendChild(option);
    });

    const closeBtn = document.createElement('button');
    closeBtn.className = 'ts-close';
    closeBtn.setAttribute('aria-label', 'Close suggestions');
    closeBtn.textContent = '\u2715';
    closeBtn.addEventListener('click', removeSuggestionBox);
    suggestionBox.appendChild(closeBtn);

    // append to document
    document.body.appendChild(suggestionBox);

    // position fixed top-right like original
    suggestionBox.style.position = 'fixed';
    suggestionBox.style.top = '20px';
    suggestionBox.style.right = '20px';

    // event hooks
    document.addEventListener('mousedown', onDocumentMouseDown, true);
    document.addEventListener('keydown', onKeyDown, true);

    // store last suggestions in storage for popup access
    try {
      chrome.storage.local.set({ toneData: { ts: suggestions, at: Date.now(), source: sourceText } });
    } catch (e) {
      // ignore storage errors in content script contexts
    }

    lastSuggestions = suggestions;
  }

  // Debounced UI triggers
  const debouncedShowForSelection = debounce(async (text) => {
    try {
      if (!await isToneEnabled()) return;
      const t = (text || '').trim();
      if (!t) return;
      const suggestions = runClassification(t);
      if (suggestions && suggestions.length) {
        activeEditable = document.activeElement && isEditableTarget(document.activeElement) ? document.activeElement : null;
        buildSuggestionBox(suggestions, t);
      }
    } catch (e) {
      console.warn('debouncedShowForSelection failed', e);
    }
  }, 230);

  const debouncedShowForInput = debounce(async (el) => {
    try {
      if (!await isToneEnabled()) return;
      const text = getTargetText(el).trim();
      if (!text) return;
      const suggestions = runClassification(text);
      if (suggestions && suggestions.length) {
        activeEditable = el;
        buildSuggestionBox(suggestions, text);
      }
    } catch (e) {
      console.warn('debouncedShowForInput failed', e);
    }
  }, 350);

  // Mouse selection handling
  document.addEventListener('mouseup', (ev) => {
    // ignore if config not loaded but still allow classify without it
    try {
      const sel = window.getSelection();
      if (!sel) return;
      const txt = sel.toString();
      if (!txt || !txt.trim()) return;
      // don't show if clicking inside our own UI
      if (suggestionBox && suggestionBox.contains(ev.target)) return;
      debouncedShowForSelection(txt);
    } catch (e) {
      console.warn('selection handling failed', e);
    }
  }, true);

  // Input handling: listen globally but filter to editable targets
  document.addEventListener('input', (e) => {
    const t = e.target;
    if (!isEditableTarget(t)) return;
    debouncedShowForInput(t);
  }, true);

  // Message listener: return last stored toneData if requested
  chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
    if (msg && msg.action === 'getToneData') {
      try {
        chrome.storage.local.get('toneData', (data) => {
          sendResponse({ toneData: data && data.toneData ? data.toneData : lastSuggestions || null });
        });
        return true;
      } catch (e) {
        sendResponse({ toneData: lastSuggestions || null });
        return false;
      }
    }
    return false;
  });

})();
# Privacy Policy for MindTab

**Effective date:** 2026-06-17

MindTab is a browser extension that provides feed sanitization, malicious ad blocking, tone-aware writing assistance, and spaced-repetition flashcards. This policy explains what data is collected, where it goes, and what stays on your device.

---

## Data we do NOT collect

MindTab does not collect, transmit, sell, or share any personal information with the developer. There are no analytics, telemetry, crash reporters, or tracking of any kind built into the extension.

---

## Data stored locally on your device

MindTab uses your browser's built-in storage APIs to save your preferences and flashcard progress. This data never leaves your device except through your browser's normal sync mechanism (see below).

| What | Where | Why |
| ---- | ----- | --- |
| Feature toggles, API URL, theme, tone-check settings | Browser sync storage (`mindtab`) | Remembers your preferences |
| Custom flashcards you create | Browser sync storage (`mindtabCards`) | Persists your card deck |
| Spaced-repetition state (due dates, intervals) | Browser local storage (`mindtabSRS`) | Tracks your learning progress per device |
| Last card shown | Browser local storage (`mindtabLastCard`) | Avoids repeating the same card |
| Cached community filter selectors | Browser local storage (`mindtabExternalFilters`) | Reduces redundant network requests |
| Timestamp of last filter list fetch | Browser local storage (`mindtabFiltersUpdated`) | Enforces the 24-hour refresh interval |

**Sync storage note:** If you have browser sync enabled (e.g., Firefox Sync or a Google account in Chrome), your preferences and custom flashcards may be synced to your browser provider's servers according to their own privacy policy. Spaced-repetition state and filter caches are stored in local storage only and are never synced.

---

## Network requests made by the extension

### Community filter lists

Once every 24 hours, the extension fetches CSS selector lists from the URLs configured in `config/filters.json`. These are plain HTTP GET requests. No identifying information is sent — the request looks identical to a normal browser page load.

### Grammar / tone checking (optional)

The writing assistant feature can send selected text to a LanguageTool-compatible server for grammar checking. This is **disabled by default** and only activates if you manually enter a server URL in Settings.

- The text you are editing (up to 5,000 characters) and the language code `en-US` are sent to that server via HTTPS POST.
- If you use a public LanguageTool instance, their privacy policy applies to that data.
- If you run your own local LanguageTool server, the data never leaves your device.
- You can clear the server URL in Settings at any time to disable this feature.

No other network requests are made by the extension.

---

## Permissions

| Permission | Why it is needed |
| ---------- | --------------- |
| `storage` | Save your settings and flashcard data locally |
| `tabs` | Update the badge counter on the extension icon |
| `alarms` | Schedule the 24-hour filter list refresh |
| `<all_urls>` (host permission) | Run the feed sanitizer and ad blocker on every page you visit |

The `<all_urls>` host permission means the extension's content scripts execute on all pages. These scripts only read and modify the DOM to hide unwanted elements and monitor text you are actively typing in editable fields. They do not capture keystrokes, passwords, form submissions, or page content and send it anywhere.

---

## Children's privacy

MindTab does not knowingly collect any information from anyone, including children under 13.

---

## Changes to this policy

If this policy changes in a meaningful way, the effective date at the top will be updated and a note will appear in the extension's release notes.

---

## Contact

Questions or concerns: [support@aetherassembly.org](mailto:support@aetherassembly.org)

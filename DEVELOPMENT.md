# MindTab — Developer Notes

Personal reference for installation, setup, and customization. Not intended for end users.

---

## Loading the extension

### Firefox (primary target)
```bash
# Live-reloading dev session (recommended)
npm install -g web-ext
cd MindTab/
web-ext run
```

Or manually:
1. `about:debugging` → This Firefox → Load Temporary Add-on → select `manifest.json`

For a signed permanent install:
```bash
npx web-ext sign --api-key=YOUR_KEY --api-secret=YOUR_SECRET
```

### Chrome / Edge
1. `chrome://extensions` → Enable Developer Mode
2. Load Unpacked → select the `MindTab/` folder
3. Hit the reload button after any change

### Safari
```bash
xcrun safari-web-extension-converter MindTab/ --project-location . --app-name MindTab
```
Open the generated Xcode project, build it, enable in Safari settings.

> Safari may reject SVG icons — convert to PNG (128, 48, 32, 16px) and update `manifest.json` if the toolbar icon is missing.

---

## Project structure

```
MindTab/
├── config/
│   ├── filters.json          # Feed selectors (bundled fallback) + filter list URLs
│   ├── toneConfig.json       # Tone keyword definitions
│   └── flashcards.json       # Default card deck + timing settings
├── content_scripts/
│   ├── controller.js         # Loads configs, merges external filters, fires mindtab:ready
│   ├── feedSanitizer.js      # MutationObserver-based Shorts/Reels hider
│   ├── maliciousAdBlocker.js # Keyword + href pattern scanner
│   ├── toneTranslator.js     # Writing assistant panel (local + LanguageTool)
│   └── flashcard.js          # Timed flashcard overlay
├── icons/
│   └── mindtab{16,32,48,128}.svg
├── sources/                  # Translated READMEs (ES, FR, DE, PT)
├── ui/
│   ├── popup.{html,css,js}   # Extension popup
│   └── cards.{html,css,js}   # Flashcard manager page
├── .github/
│   ├── ISSUE_TEMPLATE/
│   └── PULL_REQUEST_TEMPLATE.md
├── background.js             # Service worker: storage init, filter list fetcher, alarms
└── manifest.json             # MV3, Firefox 109+, Chrome, Safari
```

---

## How the filter list updater works

`background.js` fetches three filter lists on install and every 24 hours via `chrome.alarms`:

| Source | URL |
|--------|-----|
| uBlock Origin social annoyances | `uBlockOrigin/uAssets/filters/annoyances-social.txt` |
| uBlock Origin quick-fixes | `uBlockOrigin/uAssets/filters/quick-fixes.txt` |
| AdGuard social widgets | `AdguardTeam/AdguardFilters/AnnoyancesFilter/sections/social-widget.txt` |

The parser pulls out `domain##selector` cosmetic filter lines for `youtube.com`, `instagram.com`, and `facebook.com`. Procedural filters (`:has()`, `:upward()`, etc.) are skipped since they can't be used as plain `querySelectorAll` selectors.

Parsed selectors are stored in `chrome.storage.local` as `mindtabExternalFilters`. On each page load, `controller.js` reads them and merges them into `window.__MindTab.filters.feedSanitizer` on top of the bundled fallback selectors in `config/filters.json`.

To add or change the filter list URLs without rebuilding, write to storage directly:
```javascript
chrome.storage.sync.get('mindtab', d => {
  d.mindtab.filterListUrls = ['https://your-url/list.txt'];
  chrome.storage.sync.set({ mindtab: d.mindtab });
});
```

---

## Grammar server (LanguageTool on Pi 5)

**1. Install Java**
```bash
sudo apt update && sudo apt install -y default-jre
```

**2. Download LanguageTool**
```bash
wget https://languagetool.org/download/LanguageTool-stable.zip
unzip LanguageTool-stable.zip && cd LanguageTool-*/
```

**3. Start the server**
```bash
java -cp languagetool-server.jar org.languagetool.server.HTTPServer \
  --port 8081 --allow-origin "*"
```

**4. Expose with cloudflared**
```bash
cloudflared tunnel --url http://localhost:8081
```
Copy the `https://....trycloudflare.com` URL.

**5. Add to MindTab**
Popup → Settings → Grammar Server URL → paste the base URL (no `/v2/check` — the extension appends the path) → Save.

The extension POSTs to `{url}/v2/check` with `Content-Type: application/x-www-form-urlencoded` and body `text=...&language=en-US`. Change `en-US` in `toneTranslator.js` if you want a different locale. LanguageTool supports 30+ languages.

---

## Customization

### Adding feed filter selectors (bundled fallback)
Edit `config/filters.json` under `feedSanitizer`. Standard CSS selectors, one per array entry. Use DevTools on the target site to find updated ones when the external lists lag.

### Adding ad block patterns
- Text patterns: `adBlocker.textKeywords` — matched against element `textContent`
- URL patterns: `adBlocker.hrefPatterns` — matched against `href`

### Changing flashcard timing
```json
"settings": {
  "showAfterMinutes": 15,
  "displayDurationSeconds": 12
}
```

### Adding a tone category
```json
"sarcastic": {
  "label": "Sarcastic",
  "emoji": "🙄",
  "color": "#95a5a6",
  "keywords": ["oh great", "totally", "yeah right", "absolutely not", "good for you"]
}
```

### Content script initialization order
All five content scripts are injected in order. `controller.js` runs first and does async config loading, then fires `window.dispatchEvent(new CustomEvent('mindtab:ready'))`. Every other script checks `window.__MindTab?.ready` and either runs immediately or waits on the event:

```javascript
if (window.__MindTab?.ready) {
  init();
} else {
  window.addEventListener('mindtab:ready', init, { once: true });
}
```

---

## Manifest permissions

| Permission | Why |
|---|---|
| `storage` | Saves feature toggle states and custom flashcards |
| `tabs` | Opens the flashcard manager in a new tab from the popup |
| `alarms` | 24-hour filter list refresh |
| `host_permissions: <all_urls>` | Content scripts run on all pages; background fetches filter lists from GitHub |

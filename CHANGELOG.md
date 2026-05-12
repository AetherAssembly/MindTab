# Changelog

All notable changes to MindTab will be documented here.

The format follows [Keep a Changelog](https://keepachangelog.com/en/1.0.0/).
MindTab uses [Semantic Versioning](https://semver.org/).

---

## [1.1.2] — 2026-05-12

### Added

- **Dedicated Settings page** — settings moved out of the popup collapsible into a full-page `ui/settings.html`, opened in a new tab via a Settings button in the popup
- **Test Connection button** — verifies the grammar server URL by pinging `/health`, showing latency and upstream URL on success or a descriptive error on failure
- **Tone Translator server status dot** — small indicator in the writing assistant panel header shows connection state: green (connected), orange (unavailable), gray (not configured)
- **Tone Translator offline/error states** — grammar section now shows contextual messages instead of silently hiding: "Local analysis only" when no server is configured, "Checking grammar…" while a request is in-flight, "✓ No grammar issues found" on a clean result, and "Server unavailable" with a Retry button on failure

### Fixed

- **Incomplete URL sanitization** — `feedSanitizer.js` used `host.includes('youtube.com')` which matched spoofed domains like `fake-youtube.com`; replaced with exact match + `.endsWith()` checks (resolves CodeQL alerts #3–6)
- **Permissive CORS** — grammar proxy server defaulted to `Access-Control-Allow-Origin: *`, allowing any website to use the proxy; origin is now unconditionally validated against `moz-extension://`, `chrome-extension://`, and `localhost` — the `CORS_ORIGIN` env var bypass has been removed (resolves CodeQL alert #7)

### Changed

- Manifest icons updated to PNG for broader Safari Web Extension compatibility
- Bump version to 1.1.2

---

## [1.1.0] — 2026-05-12

### Added

- **Badge counter** — toolbar icon now shows a live count of elements blocked on the current page, resetting on each navigation (like uBlock Origin)
- **Light mode** — popup and flashcard manager now respect `prefers-color-scheme: light` with a full light palette
- **Shared `utils.js`** — `escHtml` utility loaded as first content script, eliminating duplicate definitions
- Flashcard selection is now random (avoiding the last-shown card) instead of sequential round-robin

### Fixed

- **Firefox load failure** — extension failed to install with `background.service_worker is currently disabled`; added `background.scripts` for Firefox MV3 compatibility
- **Readability score always blank** — Flesch-Kincaid grade was silently producing `NaN` due to a parameter mismatch in `mtReadability()` (passed `sentences.length` but function called `.length` on it again)
- **YouTube Shorts shelf not hidden** — `is-shorts` attribute lives on `ytd-rich-shelf-renderer`, not `ytd-rich-section-renderer`; updated selectors accordingly
- **YouTube sidebar Shorts link not hidden** — `a[href='/shorts']` never matched because YouTube sidebar links use JS navigation without an `href`; replaced with `a[title='Shorts']`
- **Shorts reappearing after navigation** — YouTube is a SPA; feed sanitizer now listens for `yt-navigate-finish` and re-runs on each client-side navigation
- Feed sanitizer only walked up one parent level for link-based selectors, frequently hiding the wrong (too-small) element; now climbs to the nearest custom element (`ytd-*`) or small container
- Filter list fetch no longer overwrites cached selectors with empty data when all sources fail; cached filters are preserved until a successful fetch

### Security

- All `innerHTML` and `insertAdjacentHTML` calls replaced with explicit DOM methods (`createElement`, `textContent`, `appendChild`) — no dynamic HTML injection anywhere in the codebase

### Compatibility

- Added `data_collection_permissions: { required: ["none"] }` to gecko settings (Firefox AMO requirement)
- Added `background.scripts` alongside `service_worker` for cross-browser background compatibility

---

## [1.0.0] — 2025-05-09

### Added

- **Feed Sanitizer** — removes YouTube Shorts, Instagram Reels, and Facebook Reels via MutationObserver
- **Malicious Ad Blocker** — keyword and href-pattern based scanning for scam ads and fake alerts
- **Writing Assistant** — local Grammarly-style panel with:
  - Tone detection (Aggressive, Passive-Aggressive, Formal, Casual, Positive, Urgent)
  - Passive voice detection via regex
  - Hedge/weak word count
  - Long sentence warnings (30+ words)
  - Filler word detection
  - Repeated word detection
  - Live stats: word count, sentence count, Flesch-Kincaid readability grade
  - Optional LanguageTool-compatible server integration for grammar/spelling
- **Flash Learning** — configurable flashcard overlay with 30 default general knowledge cards
- **Flashcard Manager** — full-page editor to add, delete, and view custom and default cards
- **Popup UI** — four independent feature toggles + grammar server URL setting
- Manifest V3, compatible with Firefox 109+, Chrome, and Safari (via Xcode conversion)
- README in English, Español, Français, Deutsch, and Português

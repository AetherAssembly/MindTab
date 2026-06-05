# Changelog

All notable changes to MindTab will be documented here.

The format follows [Keep a Changelog](https://keepachangelog.com/en/1.0.0/).
MindTab uses [Semantic Versioning](https://semver.org/).

## [1.3.0] - 2026-06-05

### Fixed

- **cardKey collision** - `cardKey()` now uses a djb2 hash of the full question string instead of truncating to 40 characters; eliminates silent SRS data overwrites for cards sharing a long prefix (issue #10)
- **SRS storage quota** - SRS state migrated from `chrome.storage.sync` to `chrome.storage.local`; existing data is automatically migrated on first load; prevents silent data loss as card sets grow (issue #11)
- **Silent storage errors** - `getSRS`, `saveSRS`, and `recordResult` now wrap storage calls in try/catch and log failures to console; SRS tracking no longer silently breaks mid-session on storage errors (issue #12)
- **Flashcard focus trap** - flashcard dialog now traps Tab/Shift+Tab focus within the three buttons (Close, Reveal, Skip), honouring the `aria-modal="true"` contract; Escape also dismisses the card (issue #13)

### Added

- **Flashcard keyboard navigation** - Space/Enter reveals a card; 1 marks "Got it"; 2 skips; keyboard hints shown on buttons
- **Flashcard light theme** - flashcard widget reads the user theme from extension state and applies a light palette when light or system-light is active; updates live without a page reload (issue #16)

### Changed

- **Persist writing assistant collapse state** - the panel's minimized/expanded state is now saved to `chrome.storage.local` and restored on each page load
- **Shared DEFAULTS constant** - `DEFAULTS` extracted to `config/defaults.js` loaded by both the background service worker and popup; eliminates the duplicated "keep in sync" definitions in `background.js` and `popup.js` (issue #18)

---

## [1.2.1] - 2026-05-12

### Fixed

- Issue #14, added `aria-live="polite"` (thanks @web3blind!)

### Changed

- Updated Extenstion name in docs to match store listing
- Bump version to 1.2.1

---

## [1.2.0] - 2026-05-16

### Added

- **Spaced repetition (SM-2)** - Flashcards now use a lightweight SM-2 algorithm. "Got it" increases a card's interval; "Skip" or timeout resets it. Due cards are shown first, and a badge on the overlay shows how many cards are currently due
- **Flashcard export / import** - Custom cards can now be exported as JSON and imported back (or shared as a deck). Import merges into existing cards, with schema validation
- **Writing check controls** - Settings page now lets you toggle each Tone Translator check independently (passive voice, hedge words, long sentences, filler words, repeated words) and configure the long-sentence word threshold (15–50 words)
- **Manual theme override** - Settings page has a System / Light / Dark segmented control that overrides `prefers-color-scheme`; preference persisted in sync storage
- **Custom filter list sources** - Settings page exposes the three filter list URLs with add/remove UI; previously only configurable programmatically. Changes take effect on next update
- **CodeQL security scanning** - Added `.github/workflows/codeql.yml` for automated JavaScript SAST on every PR and weekly
- **CONTRIBUTING.md** - Architecture overview, local dev setup, code style and security guidelines, PR checklist
- **Vitest test suite** - 43 unit tests across tone analysis (`mtDetectTone`, `mtAnalyzeLocally`, `mtReadability`, `mtSyllables`), filter list parser (`parseFilterList`), and CORS origin validation

### Changed

- **Keyboard shortcuts** - `Esc` closes the Tone Translator panel; `Alt+Shift+F` triggers a flashcard on demand
- **ARIA improvements** - Tone panel has `role="complementary"` + `aria-label`; flashcard overlay has `role="dialog"` + `aria-modal="true"`; flashcard buttons receive focus on card show
- **Grammar server cooldown** - Added a 750 ms post-analysis cooldown to prevent hammering the grammar server during rapid typing (on top of the existing debounce)
- **Filter list integrity check** - If a fetched update drops the total selector count by more than 30% vs. the cached set, the update is rejected and the cache is preserved
- **Branding** - Credit updated to AetherAssembly across all UI pages, linking to `https://aetherassembly.org/about`
- Bump version to 1.2.0

---

## [1.1.2] - 2026-05-12

### Added

- **Dedicated Settings page** - settings moved out of the popup collapsible into a full-page `ui/settings.html`, opened in a new tab via a Settings button in the popup
- **Test Connection button** - verifies the grammar server URL by pinging `/health`, showing latency and upstream URL on success or a descriptive error on failure
- **Tone Translator server status dot** - small indicator in the writing assistant panel header shows connection state: green (connected), orange (unavailable), gray (not configured)
- **Tone Translator offline/error states** - grammar section now shows contextual messages instead of silently hiding: "Local analysis only" when no server is configured, "Checking grammar…" while a request is in-flight, "✓ No grammar issues found" on a clean result, and "Server unavailable" with a Retry button on failure

### Fixed

- **Incomplete URL sanitization** - `feedSanitizer.js` used `host.includes('youtube.com')` which matched spoofed domains like `fake-youtube.com`; replaced with exact match + `.endsWith()` checks (resolves CodeQL alerts #3–6)
- **Permissive CORS** - grammar proxy server defaulted to `Access-Control-Allow-Origin: *`, allowing any website to use the proxy; origin is now unconditionally validated against `moz-extension://`, `chrome-extension://`, and `localhost` - the `CORS_ORIGIN` env var bypass has been removed (resolves CodeQL alert #7)

### Changed

- Manifest icons updated to PNG for broader Safari Web Extension compatibility
- Bump version to 1.1.2

---

## [1.1.0] - 2026-05-12

### Added

- **Badge counter** - toolbar icon now shows a live count of elements blocked on the current page, resetting on each navigation (like uBlock Origin)
- **Light mode** - popup and flashcard manager now respect `prefers-color-scheme: light` with a full light palette
- **Shared `utils.js`** - `escHtml` utility loaded as first content script, eliminating duplicate definitions
- Flashcard selection is now random (avoiding the last-shown card) instead of sequential round-robin

### Fixed

- **Firefox load failure** - extension failed to install with `background.service_worker is currently disabled`; added `background.scripts` for Firefox MV3 compatibility
- **Readability score always blank** - Flesch-Kincaid grade was silently producing `NaN` due to a parameter mismatch in `mtReadability()` (passed `sentences.length` but function called `.length` on it again)
- **YouTube Shorts shelf not hidden** - `is-shorts` attribute lives on `ytd-rich-shelf-renderer`, not `ytd-rich-section-renderer`; updated selectors accordingly
- **YouTube sidebar Shorts link not hidden** - `a[href='/shorts']` never matched because YouTube sidebar links use JS navigation without an `href`; replaced with `a[title='Shorts']`
- **Shorts reappearing after navigation** - YouTube is a SPA; feed sanitizer now listens for `yt-navigate-finish` and re-runs on each client-side navigation
- Feed sanitizer only walked up one parent level for link-based selectors, frequently hiding the wrong (too-small) element; now climbs to the nearest custom element (`ytd-*`) or small container
- Filter list fetch no longer overwrites cached selectors with empty data when all sources fail; cached filters are preserved until a successful fetch

### Security

- All `innerHTML` and `insertAdjacentHTML` calls replaced with explicit DOM methods (`createElement`, `textContent`, `appendChild`) - no dynamic HTML injection anywhere in the codebase

### Compatibility

- Added `data_collection_permissions: { required: ["none"] }` to gecko settings (Firefox AMO requirement)
- Added `background.scripts` alongside `service_worker` for cross-browser background compatibility

---

## [1.0.0] - 2025-05-09

### Added

- **Feed Sanitizer** - removes YouTube Shorts, Instagram Reels, and Facebook Reels via MutationObserver
- **Malicious Ad Blocker** - keyword and href-pattern based scanning for scam ads and fake alerts
- **Writing Assistant** - local Grammarly-style panel with:
  - Tone detection (Aggressive, Passive-Aggressive, Formal, Casual, Positive, Urgent)
  - Passive voice detection via regex
  - Hedge/weak word count
  - Long sentence warnings (30+ words)
  - Filler word detection
  - Repeated word detection
  - Live stats: word count, sentence count, Flesch-Kincaid readability grade
  - Optional LanguageTool-compatible server integration for grammar/spelling
- **Flash Learning** - configurable flashcard overlay with 30 default general knowledge cards
- **Flashcard Manager** - full-page editor to add, delete, and view custom and default cards
- **Popup UI** - four independent feature toggles + grammar server URL setting
- Manifest V3, compatible with Firefox 109+, Chrome, and Safari (via Xcode conversion)
- README in English, Español, Français, Deutsch, and Português

# Contributing to MindTab

Thanks for your interest in improving MindTab! This guide covers everything you need to get started.

## Architecture overview

MindTab is a **Manifest V3 browser extension** with no build step - all files are loaded directly by the browser.

```bash
background.js           Service worker: filter list fetching, badge counter, alarm scheduling
utils.js                Shared utility (escHtml)
content_scripts/
  controller.js         Loads config + state, dispatches mindtab:ready event
  feedSanitizer.js      Removes Shorts/Reels via CSS selector matching + MutationObserver
  maliciousAdBlocker.js Hides scam ads by keyword/href pattern
  toneTranslator.js     Writing assistant panel - local analysis + optional grammar server
  flashcard.js          Flashcard overlay with SM-2 spaced repetition
config/
  filters.json          Bundled CSS selectors + filter list URLs
  toneConfig.json       Tone keyword definitions
  flashcards.json       Default flashcard deck + display settings
ui/
  popup.html/js/css     Main popup (feature toggles)
  settings.html/js/css  Settings page (server URL, theme, writing checks, filter sources)
  cards.html/js/css     Flashcard manager (add/delete/export/import)
server/
  index.js              Optional CORS proxy for LanguageTool (Node.js/Express)
tests/
  toneAnalysis.test.js  Vitest tests for tone detection and analysis
  filterParser.test.js  Vitest tests for ABP/uBlock filter list parser
  corsOrigin.test.js    Vitest tests for server CORS origin validation
```

## Loading the extension locally

**Chrome / Edge**

1. Open `chrome://extensions`
2. Enable **Developer mode** (top-right toggle)
3. Click **Load unpacked** and select this repository folder

**Firefox**

1. Open `about:debugging#/runtime/this-firefox`
2. Click **Load Temporary Add-on**
3. Select `manifest.json`

No build step needed - changes to any file take effect after reloading the extension.

## Running tests

```sh
npm install
npm test          # run once
npm run test:watch  # watch mode
```

Tests use [Vitest](https://vitest.dev/) and cover the pure logic functions in `toneTranslator.js`, `background.js`, and `server/index.js`. They run in Node without a browser environment.

## How the filter list parser works

`background.js` fetches three community-maintained ABP/uBlock cosmetic filter lists daily and parses them into plain CSS selectors per target domain. The parser (`parseFilterList`) processes lines like:

```bash
youtube.com##ytd-rich-shelf-renderer[is-shorts]
```

It skips:

- Lines starting with `!` (comments), `[` (metadata), or `@@` (exception rules)
- Rules with no domain prefix (global rules - too broad)
- Procedural filters (`:matches-css`, `:upward(`, etc.) - not valid as `querySelectorAll` selectors
- Exclusion domain rules (`~domain`)

Parsed selectors are stored in `chrome.storage.local` and merged with the bundled fallback selectors in `config/filters.json` on each page load.

## Adding or editing tone keywords

Tone keywords live in [`config/toneConfig.json`](config/toneConfig.json). Each tone has a `keywords` array of lowercase strings. The detector picks whichever tone has the most keyword hits in the lowercased input text.

To add a keyword, add it to the relevant array - no code changes needed. To add a new tone, add a new entry with `label`, `emoji`, `color`, and `keywords`, then reference it in the tone panel CSS if you want a custom colour.

## Default flashcards

Default cards live in [`config/flashcards.json`](config/flashcards.json) under `defaultCards`. Each card is `{ "q": "Question?", "a": "Answer" }`. They are read-only from the user's perspective (custom cards are separate).

## Code style

- Vanilla JavaScript only - no frameworks, no bundler, no TypeScript
- No external dependencies in extension code (only `server/` uses npm packages)
- Prefer `document.createElement` + `textContent`/`appendChild` over `innerHTML` with dynamic data
- Use `chrome.storage.sync` for user preferences (syncs across devices), `chrome.storage.local` for cached/transient data

## Security guidelines

- Never use `innerHTML`, `insertAdjacentHTML`, or `eval` with any user-controlled or external data
- Validate origin strictly in the server (see `server/index.js`) - do not use `*` for CORS
- Use exact match or `.endsWith('.' + domain)` for domain checks - never `.includes()`
- All filter list selectors are used only as `querySelectorAll` arguments, never injected as HTML

## Commit message prefixes

MindTab uses [Conventional Commits](https://www.conventionalcommits.org/) style. Start every commit message with one of these prefixes so the history stays scannable and the changelog easy to write.

| Prefix | When to use | Example |
| ------ | ----------- | ------- |
| `feat:` | A new user-facing feature or behaviour | `feat: add SM-2 spaced repetition to flashcards` |
| `fix:` | A bug fix | `fix: passive voice regex missing plural forms` |
| `chore:` | Maintenance that isn't a feature or bug fix - dependency bumps, version bumps, file moves, deleting dead code | `chore: bump version to 1.2.0` |
| `ci:` | Changes to GitHub Actions workflows or CI config only | `ci: add weekly CodeQL scan` |
| `docs:` | Documentation only - README, CHANGELOG, CONTRIBUTING, code comments | `docs: add architecture overview to CONTRIBUTING` |
| `refactor:` | Code restructuring with no behaviour change | `refactor: extract mtAnalyzeLocally into its own module` |
| `test:` | Adding or updating tests, no production code change | `test: add filter parser edge-case coverage` |
| `security:` | Security-focused patches - CORS, input validation, XSS hardening | `security: reject spoofed extension origins in CORS check` |

**Tips:**

- Keep the subject line under 72 characters.
- Use the imperative mood: "add X", "fix Y", not "added X" or "fixes Y".
- If a commit touches multiple concerns, split it into separate commits.
- A `!` after the prefix (e.g. `feat!:`) signals a breaking change.

### PR labels

Labels on pull requests are applied automatically by the [labeler workflow](.github/workflows/auto-label.yml) based on which files changed. You don't need to set them manually - they exist for filtering and release-note generation.

| Label | Files that trigger it |
| ----- | --------------------- |
| `filters` | `config/filters.json` |
| `content-script` | `content_scripts/**` |
| `ui` | `ui/**` |
| `manifest` | `manifest.json` |
| `background` | `background.js`, `utils.js` |
| `docs` | `*.md`, `sources/**` |
| `config` | `config/**` |

## Pull request checklist

- [ ] `npm test` passes (no new test failures)
- [ ] `web-ext lint` passes (or run CI lint locally with `npx web-ext lint`)
- [ ] New features have a corresponding entry in `CHANGELOG.md`
- [ ] Version in `manifest.json` and `package.json` are bumped if this is a release PR
- [ ] No `innerHTML` / `eval` with external data introduced
- [ ] PR description is at least 2 sentences explaining what and why

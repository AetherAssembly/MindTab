# Contributing to MindTab

Thanks for wanting to help! MindTab is intentionally small and modular, so most contributions are straightforward. Here's everything you need to know.

---

## Ways to contribute

- **Bug reports** — use the [bug report template](.github/ISSUE_TEMPLATE/bug_report.md)
- **Feature requests** — use the [feature request template](.github/ISSUE_TEMPLATE/feature_request.md)
- **Filter updates** — YouTube/Instagram/Facebook update their markup often; PRs that fix broken selectors in `config/filters.json` are always welcome
- **New flashcard decks** — subject-specific decks (science, history, math, etc.) as separate JSON files
- **Translations** — new languages added to `sources/`
- **UI improvements** — the popup and card manager are straightforward HTML/CSS
- **Writing assistant** — better tone keyword lists, new tone categories, improved passive-voice detection

---

## Ground rules

- Keep it lightweight. MindTab has no build step and no external dependencies — keep it that way.
- Don't add tracking, analytics, or external requests without explicit opt-in from the user.
- All text processing in the writing assistant must fail safely (i.e. if analysis throws, the page should still work normally).
- Test in Firefox first (primary target), then Chrome.

---

## Development setup

No build tools needed — just load the extension directly.

**Firefox:**

```bash
# Install web-ext for a live-reloading dev experience
npm install -g web-ext
cd MindTab/
web-ext run
```

**Chrome:**

1. `chrome://extensions` → Developer Mode → Load Unpacked → select `MindTab/`
2. Click the reload button after making changes

---

## Pull request process

1. Fork the repo and create a branch from `main`:

   ```bash
   git checkout -b fix/youtube-shorts-selector
   ```

2. Make your changes. If touching content scripts, test on the affected site.
3. Keep commits focused — one logical change per commit.
4. Open a PR against `main` with a clear description of what changed and why.
5. PRs that touch `config/` files only (filter/flashcard updates) don't need extensive testing notes — just confirm it works.

---

## Updating/Adding a language translation

1. Copy `sources/README-es.md` as a starting point
2. Name it `sources/README-{code}.md` using the ISO 639-1 language code
3. Translate the content — machine translation is fine as a first pass, but human review is preferred
4. Add a badge link in the main `README.md` language row and in all other translated READMEs

---

## Code style

- Plain JavaScript (ES2020+), no TypeScript, no bundler
- `camelCase` for variables and functions
- Module-local functions prefixed with the module name (e.g. `mtAnalyzeLocally` in `toneTranslator.js`)
- No comments explaining what the code does — only why, when the reason isn't obvious

---

## Credit

If you use MindTab as a base for your own project and publish it anywhere, please include a credit to [AetherAssembly](https://aetherassembly.org/about). It's not legally required by the MIT license, but it's appreciated.

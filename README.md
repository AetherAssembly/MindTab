# MindTab

> Free, open-source browser extension that sanitizes your feed, blocks scam ads, helps you write better, and runs passive flashcards. No data leaves your device.

[![Tests](https://img.shields.io/github/actions/workflow/status/AetherAssembly/MindTab/lint.yml?label=Tests)](https://github.com/AetherAssembly/MindTab/actions/workflows/lint.yml)
[![CodeQL](https://img.shields.io/github/actions/workflow/status/AetherAssembly/MindTab/codeql.yml?label=CodeQL)](https://github.com/AetherAssembly/MindTab/actions/workflows/codeql.yml)
[![Firefox Add-on](https://img.shields.io/amo/v/mindtab?label=Firefox&logo=firefox-browser&logoColor=white)](https://addons.mozilla.org/firefox/addon/mindtab/)
[![Version](https://img.shields.io/badge/version-1.4.0-4A90E2)](https://github.com/AetherAssembly/MindTab/releases)
[![License: MIT](https://img.shields.io/badge/license-MIT-blue)](LICENSE)

[![Wiki](https://img.shields.io/badge/wiki-documentation-555555?logo=github&logoColor=white)](https://aetherassembly.org/wiki/mindtab)
[![Manifest V3](https://img.shields.io/badge/Manifest-V3-f97316)](https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/manifest.json)

Firefox-first (MV3), also works in Chrome and Edge.

---

## Features

### Feed Sanitizer

Removes YouTube Shorts, Instagram Reels, and Facebook Reels from your feed using community-maintained filter lists (uBlock Origin + AdGuard) that refresh automatically every 24 hours. A live counter on the toolbar icon shows how many elements have been removed on the current page.

### Ad Blocker

Scans pages for scam ad patterns — fake download buttons, "you've won" pop-ups, fake virus warnings, phishing links — and hides them before you can accidentally click them.

### Writing Assistant

A lightweight panel that appears whenever you're typing in a text field with at least 15 words. Runs entirely locally — no text is sent anywhere.

Checks: tone detection (aggressive / passive-aggressive / formal / casual / positive / urgent), passive voice, hedge words, long sentences, filler words, repeated words, and Flesch-Kincaid readability grade. Optional: connect a self-hosted [LanguageTool](https://languagetool.org/) server for full grammar and spelling suggestions.

Keyboard shortcuts: `Alt+Shift+T` reopens the panel. `Esc` closes it.

### Flashcards

A small overlay appears after 15 minutes of browsing with a spaced-repetition flashcard. Ships with 30 general knowledge cards; add your own from the card manager. Space/Enter to reveal, 1 to mark correct, 2 to skip, Esc to close. `Alt+Shift+F` triggers a card on demand.

---

## Installation

### Firefox

Install from the [Firefox Add-ons store](https://addons.mozilla.org/firefox/addon/mindtab/).

### Chrome / Edge

Search for **MindTab** on the Chrome Web Store and click Add to Chrome.

### Load manually (all browsers)

- **Firefox:** `about:debugging` → This Firefox → Load Temporary Add-on → pick `manifest.json`
- **Chrome/Edge:** `chrome://extensions` → Developer Mode → Load Unpacked → pick the MindTab folder
- **Safari:** convert through Xcode — see the developer docs

---

## Writing Assistant

The panel appears at the bottom-right whenever you're typing with at least 15 words. Click **−** to collapse it (preference remembered across pages), **✕** to hide it for the session. It reopens automatically on the next page.

For full grammar and spelling checking, point MindTab at a self-hosted LanguageTool server in Settings. Local analysis works without any server.

---

## Flashcard Manager

Click **Manage Flashcards** in the popup to open the card editor. Add custom Q&A pairs, delete cards, or browse the 30 default cards. Cards and spaced-repetition progress can be exported as JSON and imported back — useful for moving between devices.

---

## Customization

All four features toggle independently from the popup. Filter lists update in the background every 24 hours; hit **Update Now** in Settings to force a refresh. Custom filter list URLs can be added or removed from the advanced section of Settings.

---

## Contributing

Bug reports, filter selector updates, new flashcard decks, and translations are welcome — open an issue or pull request. If you remix this for your school, workplace, or community, a credit to [AetherAssembly](https://aetherassembly.org/about) is appreciated (not required by the MIT license).

---

## License

[MIT](LICENSE)

---

<div align="center">
  <p>Built with ethics and simplicity by <a href="https://aetherassembly.org/about">AetherAssembly</a></p>
</div>

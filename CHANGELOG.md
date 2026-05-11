# Changelog

All notable changes to MindTab will be documented here.

The format follows [Keep a Changelog](https://keepachangelog.com/en/1.0.0/).
MindTab uses [Semantic Versioning](https://semver.org/).

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

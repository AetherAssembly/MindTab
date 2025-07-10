# MindTab

**MindTab** is a unified browser extension that enhances productivity through:

- 🚪 **"What Was That Tab?"** – Visual tab memory with thumbnails, smart tagging, and instant restore.
- 💬 **Tone Translator** – Injected tone summaries for emails and posts to improve communication awareness.
- 📚 **Flash Learning** – Micro-flashcards triggered during idle or browsing moments to build knowledge passively.

Built with modular architecture, aesthetic flexibility, and designed for users who value smart tools with minimal disruption.

---

## 🚀 Features

- **Tab History Tracker**  
  View and restore recently closed tabs with thumbnails, titles, and timestamps.

- **Tone Analyzer**  
  Subtle tone detection embedded into your digital communication experience.

- **Flashcard Popups**  
  Custom learning cards for tech tips, languages, and more, shown in lightweight overlays.

- **SVG-Driven UI**  
  Sleek and customizable interface using handcrafted SVG icons for clarity and personalization.

---

## 📁 Project Structure

MindTab/
├── manifest.json
├── background.js
├── popup/
│   ├── popup.html
│   ├── popup.js
│   └── popup.css
├── icons/
│   ├── mindtab.svg
│   ├── restore.svg
│   ├── tone.svg
│   └── flashcard.svg
├── content_scripts/
│   ├── toneTranslator.js
│   └── tabTracker.js
├── flashcard/
│   ├── flashcard.js
│   └── config.json
├── utils/
│   ├── toneUtils.js
│   ├── storageUtils.js
│   └── tagger.js
|
├── README.md
|
└── LICENCE


---

## 🧑‍💻 Developer Setup

1. Clone the repo  
   `git clone https://github.com/aster1630/mindtab.git`

2. Load the extension  
   - Go to `chrome://extensions`
   - Enable Developer Mode
   - Click "Load unpacked" and select the `MindTab/` directory

3. Customize flashcards, tone logic, or inject new SVGs!

---
## 💻 Normal Extention

1. Go to `https://chromewebstore.google.com/`

2. Search for ------ by ------



---

## 📝 License
[LICENSE]

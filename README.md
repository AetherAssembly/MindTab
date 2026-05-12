# MindTab

<div align="center">
  <img src="icons/mindtab128.svg" alt="MindTab Logo" width="128" height="128">

  **MindTab** is a free, open-source browser extension that cleans up your feed, blocks scam ads, helps you write better, and keeps you learning — all without sending your data anywhere.

  <br>

  <a href="sources/README-es.md"><img src="https://img.shields.io/badge/lang-es-red?style=for-the-badge&logo=googletranslate&logoColor=white" alt="Español"></a>
  <a href="sources/README-fr.md"><img src="https://img.shields.io/badge/lang-fr-white?style=for-the-badge&logo=googletranslate&logoColor=black" alt="Français"></a>
  <a href="sources/README-de.md"><img src="https://img.shields.io/badge/lang-de-black?style=for-the-badge&logo=googletranslate&logoColor=white" alt="Deutsch"></a>
  <a href="sources/README-pt.md"><img src="https://img.shields.io/badge/lang-pt--br-green?style=for-the-badge&logo=googletranslate&logoColor=white" alt="Português"></a>

  <a href="#-features"><img src="https://img.shields.io/badge/Features-4A90E2?style=for-the-badge&logo=star&logoColor=white" alt="Features"></a>
  <a href="#-installation"><img src="https://img.shields.io/badge/Install-FF6B6B?style=for-the-badge&logo=googlechrome&logoColor=white" alt="Install"></a>
  <a href="#-writing-assistant"><img src="https://img.shields.io/badge/Writing_Assistant-9B59B6?style=for-the-badge&logo=pencil&logoColor=white" alt="Writing Assistant"></a>
  <a href="#-contributing"><img src="https://img.shields.io/badge/Contributing-27AE60?style=for-the-badge&logo=github&logoColor=white" alt="Contributing"></a>
  <a href="https://github.com/aster1630"><img src="https://img.shields.io/badge/GitHub-181717?style=for-the-badge&logo=github&logoColor=white" alt="GitHub Profile"></a>
  <a href="https://aetherassembly.org/wiki/"><img src="https://img.shields.io/badge/Wiki-9B59B6?style=for-the-badge&logo=user&logoColor=white" alt="Wiki"></a>
</div>

---

## 🚀 Features

### 🧹 Feed Sanitizer

Removes YouTube Shorts, Instagram Reels, and Facebook Reels from your feed. MindTab uses community-maintained filter lists (from uBlock Origin and AdGuard) that update automatically every 24 hours, so it stays working even when those sites change their layouts. A live counter on the toolbar icon shows how many elements have been removed on the current page.

### 🛡️ Ad Blocker

Scans pages for scam ad patterns — fake download buttons, "you've won" pop-ups, fake virus warnings, and phishing links — and hides them before you can accidentally click them. Designed for school environments and anyone who doesn't want to be tricked.

### ✍️ Writing Assistant

A lightweight, free alternative to Grammarly. A small panel appears whenever you're typing in an email, social post, or text field and gives you instant feedback — no account needed, no text sent to any server.

**What it checks:**

- **Tone** — detects if your message reads as aggressive, passive-aggressive, formal, casual, positive, or urgent
- **Passive voice** — flags constructions like "the report was completed" and suggests active alternatives
- **Weak words** — catches hedges like "very," "basically," and "literally" that dilute your writing
- **Long sentences** — warns when a single sentence exceeds 30 words
- **Repeated words** — highlights words you've used too many times
- **Readability grade** — estimates the reading level of your text (Flesch-Kincaid)
- **Live stats** — word count and sentence count as you type

**Optional grammar server:** If you want full grammar and spelling checking (like LanguageTool), you can point MindTab at a self-hosted server in the extension settings. This is entirely optional — local analysis works without any server.

### ⚡ Flashcards

A small flashcard overlay appears after 15 minutes of browsing to help you learn passively. It comes with 30 general knowledge cards and you can add your own from the built-in card manager. Nothing interrupts what you're doing — just flip, answer, and dismiss.

---

## 🛠️ Installation

### Firefox

MindTab targets Firefox first. Install it from the [Firefox Add-ons store](https://addons.mozilla.org/firefox/addon/mindtab/) in one click.

### Chrome / Edge

Once it's on the Chrome Web Store, search for **"MindTab by Aster1630"** and click Add to Chrome.

### Loading it yourself (all browsers)

If the extension isn't on a store yet, you can load it manually:

- **Firefox:** `about:debugging` → This Firefox → Load Temporary Add-on → pick `manifest.json`
- **Chrome/Edge:** `chrome://extensions` → Developer Mode → Load Unpacked → pick the MindTab folder
- **Safari:** requires conversion through Xcode — see the developer docs

---

## ✍️ Writing Assistant
The panel appears at the bottom-right of your screen whenever you're typing somewhere with at least 15 words. It stays out of the way until you need it.

- Click **−** to collapse it to a title bar
- Click **✕** to hide it for the rest of the page session
- It reopens automatically the next time you start typing on a new page

### Optional: Grammar server

For full grammar and spelling suggestions (specific errors with fix suggestions, like a real Grammarly alternative), you can connect MindTab to a [LanguageTool](https://languagetool.org/) server. LanguageTool is free and open-source. Once you have a server running, paste its URL into **Settings** inside the MindTab popup. Without a server, everything still works — just without grammar/spelling error details.

---

## ⚡ Flashcard Manager

Click **Manage Flashcards** in the popup to open the card editor. From there you can:

- Add your own questions and answers
- Delete cards you don't want
- See all 30 default cards (these can't be deleted, but you can turn flashcards off entirely from the popup)

---

## ⚙️ Customization

All four features can be turned on or off independently from the popup. If you only want the writing assistant, switch everything else off. The filter lists update in the background automatically, but you can also hit **Update Now** in Settings to force a refresh.

The popup and flashcard manager automatically adapt to your system's light or dark mode preference.

---

## 🤝 Contributing

Feel free to remix this for your school, workplace, or community. If you publish it anywhere, please credit Aster1630.

Bug reports, filter selector updates, new flashcard decks, and translations are all welcome — open an issue or pull request on GitHub.

---

## 📝 License

Licensed under the [MIT License](LICENSE).

---

<div align="center">
  <p>Built with ethics and simplicity by <a href="https://aetherassembly.org/about/aster">Aster1630</a></p>
  <p>⭐ Star this repo if MindTab makes your browsing better!</p>
</div>

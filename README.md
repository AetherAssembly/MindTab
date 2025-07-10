# MindTab

**MindTab** is a unified browser extension that enhances productivity through:

- 💬 **Tone Translator** – Injected tone summaries for emails and posts to improve communication awareness.
- 📚 **Flash Learning** – Micro-flashcards triggered during idle or browsing moments to build knowledge passively.

Built with modular architecture, aesthetic flexibility, and designed for users who value smart tools with minimal disruption.

---

## 🚀 Features

- **Tone Analyzer**  
  Subtle tone detection embedded into your digital communication experience.

- **Flashcard Popups**  
  Custom learning cards for tech tips, languages, and more, shown in lightweight overlays.

- **SVG-Driven UI**  
  Sleek and customizable interface using handcrafted SVG icons for clarity and personalization.

---

## 📁 Project Structure

- MindTab/
  - config/
    - toneConfig.json
  - content_scripts/
    - toneTranslator.js
    - tabTracker.js
 - flashcard/ 
    - flashcard.js
    - config.json
  - icons/
    - mindtab/
      - mindtab.svg
      - mindtab16.svg
      - mindtab32.svg
      - mindtab48.svg
      - mindtab128.svg
      - mindtabA.svg
      - mindtabA32.svg
      - mindtabA48.svg
      - mindtabA128.svg
    - flashcard.svg 
    - tone.svg
  - utils/
    - toneUtils.js
  - background.js
  - LICENSE
  - manifest.json
  - README.md


---

## ⌨️ Make your own! 
***I FULLY SUPPORT YOU USING MINE TO MAKE YOUR OWN, BUT IF YOU POST IT ANYWHERE PLEASE CREDIT ME!***

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

2. Search for Mindtab by Aster1680

3. Install the Extention and Feel free to leave a review!

---

## 📝 License
[LICENSE](LICENSE)

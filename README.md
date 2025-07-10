# MindTab

<div align="center">
  <img src="icons/mindtab/mindtab128.svg" alt="MindTab Logo" width="128" height="128">
  
  **MindTab** is a unified browser extension that enhances productivity through intelligent communication and learning tools.

  <br>

  <!-- Language Translations -->
  <a href="#english"><img src="https://img.shields.io/badge/lang-en-blue?style=for-the-badge&logo=googletranslate&logoColor=white" alt="English"></a>
  <a href="sources/README-es.md"><img src="https://img.shields.io/badge/lang-es-red?style=for-the-badge&logo=googletranslate&logoColor=white" alt="Español"></a>
  <a href="sources/README-fr.md"><img src="https://img.shields.io/badge/lang-fr-white?style=for-the-badge&logo=googletranslate&logoColor=black" alt="Français"></a>
  <a href="sources/README-de.md"><img src="https://img.shields.io/badge/lang-de-black?style=for-the-badge&logo=googletranslate&logoColor=white" alt="Deutsch"></a>
  <a href="sources/README-pt.md"><img src="https://img.shields.io/badge/lang-pt--br-green?style=for-the-badge&logo=googletranslate&logoColor=white" alt="Português"></a>

  <br><br>

  <!-- Navigation Buttons -->
  <a href="#features"><img src="https://img.shields.io/badge/Features-4A90E2?style=for-the-badge&logo=star&logoColor=white" alt="Features"></a>
  <a href="#installation"><img src="https://img.shields.io/badge/Installation-7B68EE?style=for-the-badge&logo=download&logoColor=white" alt="Installation"></a>
  <a href="#project-structure"><img src="https://img.shields.io/badge/Structure-50C878?style=for-the-badge&logo=folder&logoColor=white" alt="Project Structure"></a>
  <a href="#contributing"><img src="https://img.shields.io/badge/Contributing-FF6B6B?style=for-the-badge&logo=github&logoColor=white" alt="Contributing"></a>
  <a href="https://aster1630.carrd.co"><img src="https://img.shields.io/badge/Portfolio-9B59B6?style=for-the-badge&logo=user&logoColor=white" alt="My Carrd"></a>
  <a href="https://github.com/aster1630"><img src="https://img.shields.io/badge/GitHub-181717?style=for-the-badge&logo=github&logoColor=white" alt="GitHub Profile"></a>
  <a href="asters.world"><img src="https://img.shields.io/badge/Discord-5865F2?style=for-the-badge&logo=discord&logoColor=white" alt="Discord"></a>

</div>

---

## 🚀 Features

- **💬 Tone Translator**  
  Injected tone summaries for emails and posts to improve communication awareness.

- **📚 Flash Learning**  
  Micro-flashcards triggered during idle or browsing moments to build knowledge passively.

- **🎨 SVG-Driven UI**  
  Sleek and customizable interface using handcrafted SVG icons for clarity and personalization.

- **🔧 Modular Architecture**  
  Built with flexibility in mind - easily customize and extend functionality.

---

## 📁 Project Structure

```
MindTab/
├── config/
│   └── toneConfig.json          # Tone analyzer configuration
├── content_scripts/
│   ├── toneTranslator.js        # Main tone translator script
│   └── tabTracker.js            # Tab activity tracking script
├── flashcard/
│   ├── flashcard.js             # Flashcard logic
│   └── config.json              # Flashcard configuration
├── icons/
│   ├── mindtab/
│   │   ├── mindtab.svg          # Main SVG logo
│   │   ├── mindtab16.svg        # 16x16 icon for toolbar
│   │   ├── mindtab32.svg        # 32x32 icon for extensions
│   │   ├── mindtab48.svg        # 48x48 icon for extension page
│   │   ├── mindtab128.svg       # 128x128 icon for Chrome Web Store
│   │   ├── mindtabA.svg         # Alternate logo variant
│   │   ├── mindtabA32.svg       # Alternate variant 32x32
│   │   ├── mindtabA48.svg       # Alternate variant 48x48
│   │   └── mindtabA128.svg      # Alternate variant 128x128
│   ├── flashcard.svg            # Icon for flashcards
│   └── tone.svg                 # Icon for tone analyzer
├── sources/                     # Translated documentation files
│   ├── README-es.md
│   ├── README-fr.md
│   ├── README-de.md
│   └── README-pt.md
├── utils/
│   └── toneUtils.js             # Utility functions for tone analysis
├── background.js                # Extension background script
├── LICENSE                      # Project license file
├── manifest.json                # Chrome extension manifest
└── README.md                    # Main project documentation
```

---

## 🛠️ Installation

### Quick Install (Chrome Web Store)
1. Visit the [Chrome Web Store](https://chromewebstore.google.com/)
2. Search for "MindTab by Aster1630"
3. Click "Add to Chrome" and enjoy!
4. Feel free to leave a review! ⭐

### Developer Installation
1. Clone the repository:
   ```bash
   git clone https://github.com/aster1630/mindtab.git
   ```

2. Load the extension:
   - Navigate to `chrome://extensions`
   - Enable Developer Mode
   - Click "Load unpacked" and select the `MindTab/` directory

3. Customize flashcards, tone logic, or inject new SVGs!

---

## 🤝 Contributing

***I FULLY SUPPORT YOU USING THIS TO MAKE YOUR OWN, BUT IF YOU POST IT ANYWHERE PLEASE CREDIT ME!***

Whether you're fixing bugs, adding features, or improving documentation, contributions are welcome! 

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📝 License

This project is licensed under the [LICENSE](LICENSE) file in the repository.

---

<div align="center">
  <p>Made with ❤️ by <a href="https://aster1630.carrd.co">Aster1630</a></p>
  <p>⭐ Star this repo if you found it helpful!</p>
</div>
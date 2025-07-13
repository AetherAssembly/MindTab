# MindTab

<div align="center">
  <img src="icons/mindtab/mindtab128.svg" alt="MindTab Logo" width="128" height="128">
  
  **MindTab** ist eine einheitliche Browser-Erweiterung, die die Produktivität durch intelligente Kommunikations- und Lernwerkzeuge verbessert.

  <br>

  <!-- Sprachübersetzungen -->
  <a href="../README.md"><img src="https://img.shields.io/badge/lang-en-blue?style=for-the-badge&logo=googletranslate&logoColor=white" alt="English"></a>
  <a href="README-es.md"><img src="https://img.shields.io/badge/lang-es-red?style=for-the-badge&logo=googletranslate&logoColor=white" alt="Español"></a>
  <a href="README-fr.md"><img src="https://img.shields.io/badge/lang-fr-white?style=for-the-badge&logo=googletranslate&logoColor=black" alt="Français"></a>
  <a href="README-de.md"><img src="https://img.shields.io/badge/lang-de-black?style=for-the-badge&logo=googletranslate&logoColor=white" alt="Deutsch"></a>
  <a href="README-pt.md"><img src="https://img.shields.io/badge/lang-pt--br-green?style=for-the-badge&logo=googletranslate&logoColor=white" alt="Português"></a>

  <br><br>

  <!-- Navigationsschaltflächen -->
  <a href="#-funktionen"><img src="https://img.shields.io/badge/Funktionen-4A90E2?style=for-the-badge&logo=star&logoColor=white" alt="Funktionen"></a>
  <a href="#-projektstruktur"><img src="https://img.shields.io/badge/Struktur-50C878?style=for-the-badge&logo=folder&logoColor=white" alt="Projektstruktur"></a>
  <a href="#-beitragen"><img src="https://img.shields.io/badge/Beitragen-FF6B6B?style=for-the-badge&logo=github&logoColor=white" alt="Beitragen"></a>
  <a href="https://aster1630.carrd.co"><img src="https://img.shields.io/badge/Portfolio-9B59B6?style=for-the-badge&logo=user&logoColor=white" alt="Mein Carrd"></a>
  <a href="https://github.com/aster1630"><img src="https://img.shields.io/badge/GitHub-181717?style=for-the-badge&logo=github&logoColor=white" alt="GitHub Profil"></a>
  <a href="https://discord.gg/yourinvite"><img src="https://img.shields.io/badge/Discord-5865F2?style=for-the-badge&logo=discord&logoColor=white" alt="Discord"></a>

</div>

---

## 🚀 Funktionen

- **💬 Ton-Übersetzer**  
  Integrierte Ton-Zusammenfassungen für E-Mails und Beiträge zur Verbesserung des Kommunikationsbewusstseins.

- **📚 Flash-Lernen**  
  Mikro-Karteikarten, die während Leerlauf- oder Browsing-Momenten ausgelöst werden, um passiv Wissen aufzubauen.

- **🎨 SVG-gesteuerte Benutzeroberfläche**  
  Schlanke und anpassbare Benutzeroberfläche mit handgefertigten SVG-Symbolen für Klarheit und Personalisierung.

- **🔧 Modulare Architektur**  
  Mit Flexibilität im Hinterkopf entwickelt: einfach zu personalisieren und Funktionalität zu erweitern.

---

## 📁 Projektstruktur

```
MindTab/
├── config/
│   └── toneConfig.json          # Konfiguration des Ton-Analyzers
├── content_scripts/
│   ├── toneTranslator.js        # Hauptskript des Ton-Übersetzers
│   └── tabTracker.js            # Tab-Aktivitäts-Verfolgung
├── flashcard/
│   ├── flashcard.js             # Logik der Karteikarten
│   └── config.json              # Konfiguration der Flashcards
├── icons/
│   ├── mindtab/
│   │   ├── mindtab.svg          # Haupt-SVG-Logo
│   │   ├── mindtab16.svg        # 16x16 Symbol für die Symbolleiste
│   │   ├── mindtab32.svg        # 32x32 Symbol für die Erweiterungsseite
│   │   ├── mindtab48.svg        # 48x48 Symbol für die Erweiterungsseite
│   │   ├── mindtab128.svg       # 128x128 Symbol für Chrome Web Store
│   │   ├── mindtabA.svg         # Alternative Logo-Variante
│   │   ├── mindtabA32.svg       # Alternative Variante 32x32
│   │   ├── mindtabA48.svg       # Alternative Variante 48x48
│   │   └── mindtabA128.svg      # Alternative Variante 128x128
│   ├── flashcard.svg            # Symbol für Karteikarten
│   └── tone.svg                 # Symbol für Ton-Analyzer
├── sources/
│   ├── README-es.md
│   ├── README-fr.md
│   ├── README-de.md
│   └── README-pt.md
├── utils/
│   └── toneUtils.js             # Hilfsfunktionen für Ton-Analyse
├── background.js                # Hintergrundskript der Erweiterung
├── LICENSE                      # Projektlizenz-Datei
├── manifest.json                # Chrome-Erweiterungsmanifest
└── README.md                    # Hauptdokumentation des Projekts
```

---

## 🛠️ Installation

### Schnelle Installation (Chrome Web Store)
1. Besuchen Sie den [Chrome Web Store](https://chromewebstore.google.com/)
2. Suchen Sie nach "MindTab by Aster1630"
3. Klicken Sie auf "Zu Chrome hinzufügen" und genießen Sie!
4. Hinterlassen Sie gerne eine Bewertung! ⭐

### Entwicklerinstallation
1. Klonen Sie das Repository:
   ```bash
   git clone https://github.com/aster1630/mindtab.git
   ```

2. Laden Sie die Erweiterung:
   - Navigieren Sie zu `chrome://extensions`
   - Aktivieren Sie den Entwicklermodus
   - Klicken Sie auf "Entpackte Erweiterung laden" und wählen Sie das `MindTab/` Verzeichnis

3. Personalisieren Sie Karteikarten, Ton-Logik oder injizieren Sie neue SVGs!

---

## 🤝 Beitragen

***ICH UNTERSTÜTZE VOLLSTÄNDIG, DASS SIE MEINE VERWENDEN, UM IHRE EIGENE ZU ERSTELLEN, ABER WENN SIE ES IRGENDWO VERÖFFENTLICHEN, BITTE KREDITIEREN SIE MICH!***

Ob Sie Fehler beheben, Funktionen hinzufügen oder die Dokumentation verbessern - Beiträge sind willkommen!

1. Forken Sie das Repository
2. Erstellen Sie Ihren Feature-Branch (`git checkout -b feature/ErstaunlichesFunktion`)
3. Committen Sie Ihre Änderungen (`git commit -m 'Füge eine ErstaunlichesFunktion hinzu'`)
4. Pushen Sie zum Branch (`git push origin feature/ErstaunlichesFunktion`)
5. Öffnen Sie eine Pull Request

---

## 📝 Lizenz

Dieses Projekt ist unter der [LICENSE](LICENSE) Datei im Repository lizenziert.

---

<div align="center">
  <p>Mit ❤️ erstellt von <a href="https://aster1630.carrd.co">Aster1630</a></p>
  <p>⭐ Geben Sie diesem Repository einen Stern, wenn Sie es hilfreich fanden!</p>
</div>
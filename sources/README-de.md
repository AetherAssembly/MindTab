# MindTab

<div align="center">
  <img src="../icons/mindtab128.svg" alt="MindTab Logo" width="128" height="128">

  **MindTab** ist eine kostenlose, quelloffene Browsererweiterung, die einen Feed-Bereiniger, einen Schadwerbeblocker, einen Schreibassistenten im Grammarly-Stil und passives Lernen mit Karteikarten kombiniert — alles in einem leichtgewichtigen Paket.

  <br>

  <a href="../README.md"><img src="https://img.shields.io/badge/lang-en-blue?style=for-the-badge&logo=googletranslate&logoColor=white" alt="English"></a>
  <a href="README-es.md"><img src="https://img.shields.io/badge/lang-es-red?style=for-the-badge&logo=googletranslate&logoColor=white" alt="Español"></a>
  <a href="README-fr.md"><img src="https://img.shields.io/badge/lang-fr-white?style=for-the-badge&logo=googletranslate&logoColor=black" alt="Français"></a>
  <a href="#deutsch"><img src="https://img.shields.io/badge/lang-de-black?style=for-the-badge&logo=googletranslate&logoColor=white" alt="Deutsch"></a>
  <a href="README-pt.md"><img src="https://img.shields.io/badge/lang-pt--br-green?style=for-the-badge&logo=googletranslate&logoColor=white" alt="Português"></a>
</div>

---

## 🚀 Funktionen

### 🧹 Feed-Bereiniger
Entfernt YouTube Shorts, Instagram Reels und Facebook Reels aus deinem Feed mithilfe eines MutationObservers — funktioniert auch bei dynamisch geladenen Inhalten. Die Selektoren sind in `config/filters.json` vollständig anpassbar.

### 🛡️ Schadwerbeblocker
Scannt Links und iframes nach Betrugsmustern: gefälschte Download-Schaltflächen, "Du hast gewonnen"-Pop-ups, gefälschte Virenwarnungen und mehr. Schlüsselwort- und URL-Musterlisten befinden sich in `config/filters.json`.

### ✍️ Schreibassistent *(kostenlose Grammarly-Alternative)*
Ein schwebendes Panel, das erscheint, wenn du in einem Textfeld, einer E-Mail oder einem Social-Media-Beitrag tippst. Läuft vollständig lokal — kein Text wird ohne deine Erlaubnis irgendwohin gesendet.

**Lokale Analyse (immer aktiv):**
- Tonerkennung — Aggressiv, Passiv-Aggressiv, Förmlich, Locker, Positiv, Dringend
- Passiv-Konstruktionen erkennen
- Zählung schwacher/füllender Wörter (`"sehr"`, `"eigentlich"`, `"wirklich"`, etc.)
- Warnungen bei zu langen Sätzen (mehr als 30 Wörter)
- Füllwörter erkennen
- Wortwiederholungen erkennen
- Echtzeit-Statistiken — Wort-, Satz- und Lesbarkeitsniveau

**Mit einem Grammatik-Server (optional):**
Verbinde MindTab mit einem [LanguageTool](https://languagetool.org/)-Server für vollständige Grammatik- und Rechtschreibprüfung. LanguageTool ist kostenlos und quelloffen.

### ⚡ Karteikartenlernen
Ein dezentes Karteikarten-Overlay erscheint nach einer konfigurierbaren Inaktivitätsdauer (Standard: 15 Minuten) beim Surfen. Karten können im eingebauten Manager hinzugefügt, bearbeitet und gelöscht werden.

---

## 🛠️ Installation

### Firefox (Primär)
1. Gehe zu `about:debugging` → **Dieser Firefox** → **Temporäres Add-on laden**
2. Wähle `MindTab/manifest.json`

### Chrome / Edge
1. Gehe zu `chrome://extensions`
2. Aktiviere den **Entwicklermodus** (oben rechts)
3. Klicke auf **Entpackte Erweiterung laden** → wähle den Ordner `MindTab/`

### Safari
```bash
xcrun safari-web-extension-converter MindTab/ --project-location . --app-name MindTab
```
Öffne das generierte Xcode-Projekt, erstelle es und aktiviere die Erweiterung in den Safari-Einstellungen.

---

## ⚙️ Anpassung

Bearbeite `config/filters.json`, um CSS-Selektoren für Feeds oder Werbemuster hinzuzufügen.
Bearbeite `config/flashcards.json`, um Karteikarten-Timing anzupassen oder Standardfragen hinzuzufügen.
Bearbeite `config/toneConfig.json`, um neue Ton-Definitionen hinzuzufügen.

---

## 🤝 Mitwirken

Du kannst dies frei für deine Schule, Arbeit oder Gemeinschaft verwenden! Wenn du es irgendwo veröffentlichst, bitte kredite Aster1630.

1. Forke das Repository
2. Erstelle einen Branch (`git checkout -b feature/MeinFeature`)
3. Committe deine Änderungen
4. Pushe zum Fork und öffne einen Pull Request

---

## 📝 Lizenz

Unter der MIT-Lizenz lizenziert — siehe [LICENSE](../LICENSE) für Details.

---

<div align="center">
  <p>Mit Ethik und Einfachheit erstellt von <a href="https://aster1630.carrd.co">Aster1630</a></p>
  <p>⭐ Gib einen Stern, wenn MindTab dein Surferlebnis verbessert!</p>
</div>

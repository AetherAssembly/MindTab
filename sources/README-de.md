# MindTab

<div align="center">
  <img src="../icons/mindtab128.svg" alt="MindTab Logo" width="128" height="128">

  **MindTab** ist eine kostenlose, quelloffene Browsererweiterung, die deinen Feed bereinigt, schädliche Werbung blockiert, dir beim Schreiben hilft und dich beim Lernen unterstützt — ohne deine Daten irgendwohin zu senden.

  <br>

  <a href="../README.md"><img src="https://img.shields.io/badge/lang-en-blue?style=for-the-badge&logo=googletranslate&logoColor=white" alt="English"></a>
  <a href="README-es.md"><img src="https://img.shields.io/badge/lang-es-red?style=for-the-badge&logo=googletranslate&logoColor=white" alt="Español"></a>
  <a href="README-fr.md"><img src="https://img.shields.io/badge/lang-fr-white?style=for-the-badge&logo=googletranslate&logoColor=black" alt="Français"></a>
  <a href="README-de.md"><img src="https://img.shields.io/badge/lang-de-black?style=for-the-badge&logo=googletranslate&logoColor=white" alt="Deutsch"></a>
  <a href="README-pt.md"><img src="https://img.shields.io/badge/lang-pt--br-green?style=for-the-badge&logo=googletranslate&logoColor=white" alt="Português"></a>
</div>

---

> Dieses Dokument wurde absatzweise mithilfe von Google Translate übersetzt. Sollten Probleme auftreten, können Sie gerne einen Pull Request erstellen, um diese zu beheben.

---

## 🚀 Funktionen

### 🧹 Feed-Bereiniger

Entfernt YouTube Shorts, Instagram Reels und Facebook Reels automatisch aus deinem Feed. Verwendet von der Community gepflegte Filterlisten (von uBlock Origin und AdGuard), die alle 24 Stunden aktualisiert werden. Ein Zähler am Toolbar-Symbol zeigt, wie viele Elemente auf der aktuellen Seite entfernt wurden.

### 🛡️ Werbeblocker

Durchsucht Seiten nach betrügerischen Werbeanzeigen — gefälschte Download-Schaltflächen, "Du hast gewonnen"-Pop-ups, falsche Viruswarnungen und Phishing-Links — und versteckt sie, bevor du versehentlich darauf klicken kannst.

### ✍️ Schreibassistent

Eine leichte, kostenlose Alternative zu Grammarly. Ein kleines Panel erscheint, wenn du in einer E-Mail, einem Social-Media-Beitrag oder einem Textfeld tippst, und gibt dir sofortiges Feedback — kein Konto erforderlich, kein Text wird an einen Server gesendet.

**Was er prüft:**

- **Ton** — erkennt, ob deine Nachricht aggressiv, passiv-aggressiv, förmlich, locker, positiv oder dringend klingt
- **Passivkonstruktionen** — markiert Formulierungen wie "der Bericht wurde fertiggestellt"
- **Schwache Wörter** — erkennt Füllwörter wie "sehr", "eigentlich" und "wirklich"
- **Lange Sätze** — warnt, wenn ein Satz mehr als 30 Wörter hat
- **Wiederholte Wörter** — hebt Wörter hervor, die zu oft verwendet wurden
- **Lesbarkeitsgrad** — schätzt das Leseniveau deines Textes (Flesch-Kincaid)
- **Live-Statistiken** — Wort- und Satzanzahl während des Tippens

**Optionaler Grammatik-Server:** Für vollständige Grammatik- und Rechtschreibprüfung kannst du MindTab mit einem selbst gehosteten LanguageTool-Server in den Erweiterungseinstellungen verbinden. Vollständig optional.

### ⚡ Karteikarten

Ein kleines Karteikarten-Overlay erscheint periodisch beim Surfen, um dir passives Lernen zu ermöglichen. Enthält 30 Allgemeinwissenskarten. Füge eigene Karten über den integrierten Kartenmanager hinzu.

---

## 🛠️ Installation

### Firefox

MindTab hat Firefox als primäres Ziel. Installiere es mit einem Klick aus dem [Firefox Add-ons Store](https://addons.mozilla.org/firefox/addon/mindtab/).

### Chrome / Edge

Sobald es im Chrome Web Store verfügbar ist, suche nach **MindTab** und klicke auf Zu Chrome hinzufügen.

### Manuelle Installation (alle Browser)

- **Firefox:** `about:debugging` → Dieser Firefox → Temporäres Add-on laden → wähle `manifest.json`
- **Chrome/Edge:** `chrome://extensions` → Entwicklermodus → Entpackte Erweiterung laden → wähle den MindTab-Ordner
- **Safari:** erfordert Konvertierung über Xcode — siehe Entwicklerdokumentation

---

## ✍️ Schreibassistent

Das Panel erscheint unten rechts auf deinem Bildschirm, wenn du mit mindestens 15 Wörtern tippst.

- Klicke auf **−**, um es auf eine Titelleiste zu minimieren
- Klicke auf **✕**, um es für den Rest der Seitensitzung auszublenden
- Es öffnet sich automatisch wieder, wenn du das nächste Mal auf einer neuen Seite tippst

### Optional: Grammatik-Server

Für vollständige Grammatik- und Rechtschreibvorschläge kannst du MindTab mit einem selbst gehosteten [LanguageTool](https://languagetool.org/)-Server verbinden. Sobald du einen Server am Laufen hast, füge seine URL in **Einstellungen** im MindTab-Popup ein.

---

## ⚡ Kartenmanager

Klicke auf **Karten verwalten** im Popup, um den Editor zu öffnen. Von dort aus kannst du:

- Eigene Fragen und Antworten hinzufügen
- Karten löschen, die du nicht willst
- Alle 30 Standardkarten ansehen (diese können nicht gelöscht werden, aber du kannst Karteikarten im Popup komplett deaktivieren)

---

## ⚙️ Anpassung

Alle vier Funktionen können unabhängig voneinander im Popup ein- und ausgeschaltet werden. Wenn du nur den Schreibassistenten willst, schalte alles andere aus. Die Filterlisten werden automatisch im Hintergrund aktualisiert, aber du kannst auch auf **Jetzt aktualisieren** in den Einstellungen klicken.

Das Popup und der Kartenmanager passen sich automatisch dem Hell- oder Dunkelmodus deines Systems an.

---

## 🤝 Mitwirken

Verwende dies gerne für deine Schule, Arbeit oder Gemeinschaft. Wenn du es irgendwo veröffentlichst, bitte kredite Aster1630.

Fehlerberichte, Filter-Selektor-Updates, neue Kartendecks und Übersetzungen sind willkommen — öffne ein Issue oder einen Pull Request auf GitHub.

---

## 📝 Lizenz

Unter der [MIT-Lizenz](../LICENSE) lizenziert.

---

<div align="center">
  <p>Mit Ethik und Einfachheit erstellt von <a href="https://aetherassembly.org/about/aster">Aster1630</a></p>
  <p>⭐ Gib einen Stern, wenn MindTab dein Surferlebnis verbessert!</p>
</div>

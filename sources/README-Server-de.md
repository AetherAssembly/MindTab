# MindTab Grammatik-Server

> Dieses Dokument wurde absatzweise mithilfe von Google Translate übersetzt. Sollten Probleme auftreten, können Sie gerne einen Pull Request erstellen, um diese zu beheben.

---

Ein leichtgewichtiger Proxy, der vor einer [LanguageTool](https://languagetool.org/)-Instanz sitzt und die CORS-Header hinzufügt, die Browser-Erweiterungen benötigen. Richte die MindTab-Erweiterung auf diesen Server, um kostenlose, selbst gehostete Grammatik- und Rechtschreibprüfungen im Schreibassistenten-Panel zu erhalten.

---

## Funktionsweise

```txt
Browser-Erweiterung
    │  POST /v2/check
    ▼
MindTab-Proxy  (Node.js / Express, Port 3000)
    │  leitet Anfrage weiter
    ▼
LanguageTool   (Java, Port 8010 innerhalb von Docker)
    │  gibt matches[] zurück
    ▲
MindTab-Proxy  (fügt CORS-Header hinzu)
    ▲
Browser-Erweiterung  (zeigt Vorschläge im Panel an)
```

---

## Schnellstart (Docker - empfohlen)

Erfordert [Docker](https://docs.docker.com/get-docker/) mit dem Compose-Plugin.

```bash
cd server
docker compose up
```

Der Proxy ist unter `http://localhost:3000` erreichbar. LanguageTool startet auf einem privaten Netzwerkport und ist nicht auf deinem Host-System zugänglich.

Um im Hintergrund zu laufen:

```bash
docker compose up -d
docker compose logs -f   # Logs live verfolgen
docker compose down      # Stoppen
```

---

## Manuelle Einrichtung

**Voraussetzungen:** Node.js 18+, eine laufende LanguageTool-Instanz.

### 1. LanguageTool starten

Der einfachste Weg ohne Docker:

```bash
# Download von https://languagetool.org/download/
java -cp languagetool-server.jar org.languagetool.server.HTTPServer \
  --port 8081 --allow-origin '*'
```

Oder das Docker-Image alleine verwenden:

```bash
docker run -d -p 8081:8010 erikvl87/languagetool
```

### 2. Proxy konfigurieren

```bash
cd server
cp .env.example .env
# Bearbeite .env, wenn dein LanguageTool auf einem anderen Port läuft
npm install
npm start
```

---

## Umgebungsvariablen

| Variable | Standard | Beschreibung |
| - | - | - |
| `PORT` | `3000` | Port, auf dem der Proxy lauscht |
| `LANGUAGETOOL_URL` | `http://localhost:8081` | Adresse deiner LanguageTool-Instanz |
| `CORS_ORIGIN` | `*` | Erlaubte Anfrage-Ursprünge (`*` oder eine bestimmte URL) |

---

## API

### `GET /health`

Gibt `200` zurück, wenn der Proxy läuft.

```json
{ "ok": true, "upstream": "http://localhost:8081" }
```

Damit kannst du prüfen, ob der Server erreichbar ist, bevor du die Erweiterung konfigurierst.

### `POST /v2/check`

Leitet an LanguageTool's `/v2/check`-Endpunkt weiter. Akzeptiert `application/x-www-form-urlencoded`:

| Feld | Beispiel | Beschreibung |
| - | - | - |
| `text` | `"This are a test."` | Zu prüfender Text (max. 5000 Zeichen, von der Erweiterung gesendet) |
| `language` | `"en-US"` | BCP 47 Sprachcode |

Gibt LanguageTool's JSON-Antwort mit einem `matches`-Array zurück.

---

## Erweiterung verbinden

1. Starte den Server (mit einer der oben genannten Methoden).
2. Öffne das MindTab-Popup → klicke auf **Einstellungen**.
3. Füge `http://localhost:3000` (oder die Adresse deines Servers) in **Grammatik-Server-URL** ein.
4. Klicke auf **Speichern**.
5. Tippe 15+ Wörter in ein beliebiges Textfeld - Grammatikvorschläge erscheinen im Schreibassistenten-Panel.

---

## Einsatz auf einem Heimserver oder Raspberry Pi

Der Docker-Compose-Ansatz funktioniert auf jeder Linux-Maschine. Um ihn von anderen Geräten in deinem Netzwerk erreichbar zu machen, expose den Proxy-Port in deinem Router oder setze `PORT` auf einen einprägsamen Wert. Verwende dann die lokale IP deiner Maschine (z. B. `http://192.168.1.50:3000`) als Grammatik-Server-URL in der Erweiterung.

---

## Lizenz

[MIT](LICENSE)

# MindTab Grammar Server

<div align="center">
  <img src="icons/mindtab128.svg" alt="MindTab Logo" width="128" height="128">

  **MindTab** is a free, open-source browser extension that cleans up your feed, blocks scam ads, helps you write better, and keeps you learning — all without sending your data anywhere.

  <br>

  <a href="sources/README-Server-es.md"><img src="https://img.shields.io/badge/lang-es-red?style=for-the-badge&logo=googletranslate&logoColor=white" alt="Español"></a>
  <a href="sources/README-Server-fr.md"><img src="https://img.shields.io/badge/lang-fr-white?style=for-the-badge&logo=googletranslate&logoColor=black" alt="Français"></a>
  <a href="sources/README-Server-de.md"><img src="https://img.shields.io/badge/lang-de-black?style=for-the-badge&logo=googletranslate&logoColor=white" alt="Deutsch"></a>
  <a href="sources/README-Server-pt.md"><img src="https://img.shields.io/badge/lang-pt--br-green?style=for-the-badge&logo=googletranslate&logoColor=white" alt="Português"></a>

  <a href="#-features"><img src="https://img.shields.io/badge/Features-4A90E2?style=for-the-badge&logo=star&logoColor=white" alt="Features"></a>
  <a href="#-installation"><img src="https://img.shields.io/badge/Install-FF6B6B?style=for-the-badge&logo=googlechrome&logoColor=white" alt="Install"></a>
  <a href="#-writing-assistant"><img src="https://img.shields.io/badge/Writing_Assistant-9B59B6?style=for-the-badge&logo=pencil&logoColor=white" alt="Writing Assistant"></a>
  <a href="#-contributing"><img src="https://img.shields.io/badge/Contributing-27AE60?style=for-the-badge&logo=github&logoColor=white" alt="Contributing"></a>
  <a href="https://aetherassembly.org/wiki/mindtab/grammar-server"><img src="https://img.shields.io/badge/Wiki-9B59B6?style=for-the-badge&logo=user&logoColor=white" alt="Wiki"></a>
</div>

---

A lightweight proxy that sits in front of a [LanguageTool](https://languagetool.org/) instance and adds the CORS headers that browser extensions need. Point the MindTab extension at it to get free, self-hosted grammar and spelling checks inside the Tone Translator panel.

---

## How it works

```txt
Browser extension
    │  POST /v2/check
    ▼
MindTab proxy  (Node.js / Express, port 3000)
    │  forwards request
    ▼
LanguageTool   (Java, port 8010 inside Docker)
    │  returns matches[]
    ▲
MindTab proxy  (adds CORS headers)
    ▲
Browser extension  (renders suggestions in panel)
```

---

## Quick start (Docker — recommended)

Requires [Docker](https://docs.docker.com/get-docker/) with the Compose plugin.

```bash
git clone https://github.com/Aster1630/MindTab.git
cd path/to/MindTab/server/
docker compose up
```

The proxy will be available at `http://localhost:3000`. LanguageTool starts on a private network port and is not exposed to your host machine.

To run in the background:

```bash
docker compose up -d
docker compose logs -f   # stream logs
docker compose down      # stop
```

---

## Manual setup

**Requirements:** Node.js 18+, a running LanguageTool instance.

### 1. Run LanguageTool

The easiest way without Docker:

```bash
# Download from https://languagetool.org/download/
java -cp languagetool-server.jar org.languagetool.server.HTTPServer \
  --port 8081 --allow-origin '*'
```

Or use the Docker image on its own:

```bash
docker run -d -p 8081:8010 erikvl87/languagetool
```

### 2. Configure the proxy

```bash
cd server
cp .env.example .env
# Edit .env if your LanguageTool is on a different port
npm install
npm start
```

---

## Environment variables

| Variable | Default | Description |
| - | - | - |
| `PORT` | `3000` | Port the proxy listens on |
| `LANGUAGETOOL_URL` | `http://localhost:8081` | Address of your LanguageTool instance |
| `CORS_ORIGIN` | `*` | Allowed request origins (`*` or a specific URL) |

---

## API

### `GET /health`

Returns `200` when the proxy is running.

```json
{ "ok": true, "upstream": "http://localhost:8081" }
```

Use this to verify the server is reachable before configuring the extension.

### `POST /v2/check`

Forwards to LanguageTool's `/v2/check` endpoint. Accepts `application/x-www-form-urlencoded`:

| Field | Example | Description |
| - | - | - |
| `text` | `"This are a test."` | Text to check (max 5000 chars sent by the extension) |
| `language` | `"en-US"` | BCP 47 language code |

Returns LanguageTool's JSON response with a `matches` array.

---

## Connect the extension

1. Start the server (either method above).
2. Open the MindTab popup → click **Settings**.
3. Paste `http://localhost:3000` (or your server's address) into **Grammar Server URL**.
4. Click **Save**.
5. Type 15+ words in any text field — grammar suggestions will appear in the Tone Translator panel.

---

## Deploying on a home server or Raspberry Pi

The Docker Compose approach works on any Linux machine. To make it reachable from other devices on your network, expose the proxy port in your router or set `PORT` to something memorable. Then use your machine's local IP (e.g. `http://192.168.1.50:3000`) as the Grammar Server URL in the extension.

---

## 🤝 Contributing

Feel free to remix this for your school, workplace, or community. If you publish it anywhere, please include a credit to [AetherAssembly](https://aetherassembly.org/about). It's not legally required by the MIT license, but it's appreciated.

---

## 📝 License

Licensed under the [MIT License](LICENSE).

---

<div align="center">
  <p>Built with ethics and simplicity by <a href="https://aetherassembly.org/about">AetherAssembly</a></p>
  <p>⭐ Star this repo if MindTab makes your browsing better!</p>
</div>

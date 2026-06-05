# Serveur de Grammaire MindTab

> Ce document a été traduit paragraphe par paragraphe à l'aide de Google Translate. En cas de problème, n'hésitez pas à soumettre une Pull Request pour apporter les corrections nécessaires.

---

Un proxy léger qui s'intercale devant une instance [LanguageTool](https://languagetool.org/) et ajoute les en-têtes CORS dont les extensions de navigateur ont besoin. Pointez l'extension MindTab vers ce serveur pour bénéficier de vérifications grammaticales et orthographiques gratuites et auto-hébergées dans le panneau Assistant d'Écriture.

---

## Fonctionnement

```txt
Extension de navigateur
    │  POST /v2/check
    ▼
Proxy MindTab  (Node.js / Express, port 3000)
    │  transmet la requête
    ▼
LanguageTool   (Java, port 8010 dans Docker)
    │  retourne matches[]
    ▲
Proxy MindTab  (ajoute les en-têtes CORS)
    ▲
Extension de navigateur  (affiche les suggestions dans le panneau)
```

---

## Démarrage rapide (Docker - recommandé)

Nécessite [Docker](https://docs.docker.com/get-docker/) avec le plugin Compose.

```bash
cd server
docker compose up
```

Le proxy sera disponible à `http://localhost:3000`. LanguageTool démarre sur un port réseau privé et n'est pas exposé sur votre machine hôte.

Pour exécuter en arrière-plan :

```bash
docker compose up -d
docker compose logs -f   # suivre les journaux en direct
docker compose down      # arrêter
```

---

## Configuration manuelle

**Prérequis :** Node.js 18+, une instance LanguageTool en cours d'exécution.

### 1. Lancer LanguageTool

La méthode la plus simple sans Docker :

```bash
# Téléchargement depuis https://languagetool.org/download/
java -cp languagetool-server.jar org.languagetool.server.HTTPServer \
  --port 8081 --allow-origin '*'
```

Ou utiliser l'image Docker seule :

```bash
docker run -d -p 8081:8010 erikvl87/languagetool
```

### 2. Configurer le proxy

```bash
cd server
cp .env.example .env
# Modifiez .env si votre LanguageTool est sur un port différent
npm install
npm start
```

---

## Variables d'environnement

| Variable | Défaut | Description |
| - | - | - |
| `PORT` | `3000` | Port d'écoute du proxy |
| `LANGUAGETOOL_URL` | `http://localhost:8081` | Adresse de votre instance LanguageTool |
| `CORS_ORIGIN` | `*` | Origines de requêtes autorisées (`*` ou une URL spécifique) |

---

## API

### `GET /health`

Retourne `200` quand le proxy est en cours d'exécution.

```json
{ "ok": true, "upstream": "http://localhost:8081" }
```

Utilisez ceci pour vérifier que le serveur est joignable avant de configurer l'extension.

### `POST /v2/check`

Transmet au point de terminaison `/v2/check` de LanguageTool. Accepte `application/x-www-form-urlencoded` :

| Champ | Exemple | Description |
| - | - | - |
| `text` | `"This are a test."` | Texte à vérifier (max 5000 caractères envoyés par l'extension) |
| `language` | `"en-US"` | Code de langue BCP 47 |

Retourne la réponse JSON de LanguageTool avec un tableau `matches`.

---

## Connecter l'extension

1. Démarrez le serveur (l'une ou l'autre méthode ci-dessus).
2. Ouvrez le popup MindTab → cliquez sur **Paramètres**.
3. Collez `http://localhost:3000` (ou l'adresse de votre serveur) dans **URL du serveur de grammaire**.
4. Cliquez sur **Enregistrer**.
5. Tapez 15+ mots dans n'importe quel champ de texte - les suggestions grammaticales apparaîtront dans le panneau Assistant d'Écriture.

---

## Déploiement sur un serveur domestique ou Raspberry Pi

L'approche Docker Compose fonctionne sur n'importe quelle machine Linux. Pour le rendre accessible depuis d'autres appareils sur votre réseau, exposez le port du proxy dans votre routeur ou définissez `PORT` sur quelque chose de mémorable. Utilisez ensuite l'IP locale de votre machine (ex. `http://192.168.1.50:3000`) comme URL du serveur de grammaire dans l'extension.

---

## Licence

[MIT](LICENSE)

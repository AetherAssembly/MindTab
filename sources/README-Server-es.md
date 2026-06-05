# Servidor de Gramática MindTab

> Este documento fue traducido párrafo a párrafo utilizando Google Translate. Si encuentra algún problema, no dude en enviar una Pull Request para corregirlo.

---

Un proxy ligero que se sitúa delante de una instancia de [LanguageTool](https://languagetool.org/) y añade las cabeceras CORS que necesitan las extensiones de navegador. Apunta la extensión MindTab hacia él para obtener comprobaciones gratuitas y autoalojadas de gramática y ortografía dentro del panel Asistente de Escritura.

---

## Cómo funciona

```txt
Extensión de navegador
    │  POST /v2/check
    ▼
Proxy MindTab  (Node.js / Express, puerto 3000)
    │  reenvía la petición
    ▼
LanguageTool   (Java, puerto 8010 dentro de Docker)
    │  devuelve matches[]
    ▲
Proxy MindTab  (añade cabeceras CORS)
    ▲
Extensión de navegador  (muestra sugerencias en el panel)
```

---

## Inicio rápido (Docker - recomendado)

Requiere [Docker](https://docs.docker.com/get-docker/) con el plugin Compose.

```bash
cd server
docker compose up
```

El proxy estará disponible en `http://localhost:3000`. LanguageTool se inicia en un puerto de red privado y no queda expuesto en tu máquina anfitriona.

Para ejecutar en segundo plano:

```bash
docker compose up -d
docker compose logs -f   # ver registros en tiempo real
docker compose down      # detener
```

---

## Configuración manual

**Requisitos:** Node.js 18+, una instancia de LanguageTool en ejecución.

### 1. Ejecutar LanguageTool

La forma más sencilla sin Docker:

```bash
# Descarga desde https://languagetool.org/download/
java -cp languagetool-server.jar org.languagetool.server.HTTPServer \
  --port 8081 --allow-origin '*'
```

O usar la imagen Docker de forma independiente:

```bash
docker run -d -p 8081:8010 erikvl87/languagetool
```

### 2. Configurar el proxy

```bash
cd server
cp .env.example .env
# Edita .env si tu LanguageTool está en un puerto diferente
npm install
npm start
```

---

## Variables de entorno

| Variable | Por defecto | Descripción |
| - | - | - |
| `PORT` | `3000` | Puerto en el que escucha el proxy |
| `LANGUAGETOOL_URL` | `http://localhost:8081` | Dirección de tu instancia de LanguageTool |
| `CORS_ORIGIN` | `*` | Orígenes de peticiones permitidos (`*` o una URL específica) |

---

## API

### `GET /health`

Devuelve `200` cuando el proxy está en ejecución.

```json
{ "ok": true, "upstream": "http://localhost:8081" }
```

Usa esto para verificar que el servidor es accesible antes de configurar la extensión.

### `POST /v2/check`

Reenvía al endpoint `/v2/check` de LanguageTool. Acepta `application/x-www-form-urlencoded`:

| Campo | Ejemplo | Descripción |
| - | - | - |
| `text` | `"This are a test."` | Texto a comprobar (máx. 5000 caracteres enviados por la extensión) |
| `language` | `"en-US"` | Código de idioma BCP 47 |

Devuelve la respuesta JSON de LanguageTool con un array `matches`.

---

## Conectar la extensión

1. Inicia el servidor (cualquiera de los métodos anteriores).
2. Abre el popup de MindTab → haz clic en **Configuración**.
3. Pega `http://localhost:3000` (o la dirección de tu servidor) en **URL del servidor de gramática**.
4. Haz clic en **Guardar**.
5. Escribe 15+ palabras en cualquier campo de texto - las sugerencias de gramática aparecerán en el panel Asistente de Escritura.

---

## Despliegue en un servidor doméstico o Raspberry Pi

El enfoque con Docker Compose funciona en cualquier máquina Linux. Para que sea accesible desde otros dispositivos de tu red, expón el puerto del proxy en tu router o establece `PORT` a algo memorable. Luego usa la IP local de tu máquina (p. ej. `http://192.168.1.50:3000`) como URL del servidor de gramática en la extensión.

---

## Licencia

[MIT](LICENSE)

# Servidor de Gramática MindTab

> Este documento foi traduzido parágrafo a parágrafo utilizando o Google Translate. Caso haja algum problema, sinta-se à vontade para abrir um Pull Request corrigindo-o.

---

Um proxy leve que fica na frente de uma instância do [LanguageTool](https://languagetool.org/) e adiciona os cabeçalhos CORS que as extensões de navegador precisam. Aponte a extensão MindTab para ele e obtenha verificações gratuitas e auto-hospedadas de gramática e ortografia dentro do painel Assistente de Escrita.

---

## Como funciona

```txt
Extensão de navegador
    │  POST /v2/check
    ▼
Proxy MindTab  (Node.js / Express, porta 3000)
    │  encaminha a requisição
    ▼
LanguageTool   (Java, porta 8010 dentro do Docker)
    │  retorna matches[]
    ▲
Proxy MindTab  (adiciona cabeçalhos CORS)
    ▲
Extensão de navegador  (exibe sugestões no painel)
```

---

## Início rápido (Docker — recomendado)

Requer [Docker](https://docs.docker.com/get-docker/) com o plugin Compose.

```bash
cd server
docker compose up
```

O proxy estará disponível em `http://localhost:3000`. O LanguageTool inicia em uma porta de rede privada e não fica exposto na sua máquina host.

Para executar em segundo plano:

```bash
docker compose up -d
docker compose logs -f   # acompanhar os logs em tempo real
docker compose down      # parar
```

---

## Configuração manual

**Requisitos:** Node.js 18+, uma instância do LanguageTool em execução.

### 1. Executar o LanguageTool

A forma mais simples sem Docker:

```bash
# Baixe em https://languagetool.org/download/
java -cp languagetool-server.jar org.languagetool.server.HTTPServer \
  --port 8081 --allow-origin '*'
```

Ou usar a imagem Docker sozinha:

```bash
docker run -d -p 8081:8010 erikvl87/languagetool
```

### 2. Configurar o proxy

```bash
cd server
cp .env.example .env
# Edite .env se o seu LanguageTool estiver em uma porta diferente
npm install
npm start
```

---

## Variáveis de ambiente

| Variável | Padrão | Descrição |
| - | - | - |
| `PORT` | `3000` | Porta em que o proxy escuta |
| `LANGUAGETOOL_URL` | `http://localhost:8081` | Endereço da sua instância do LanguageTool |
| `CORS_ORIGIN` | `*` | Origens de requisição permitidas (`*` ou uma URL específica) |

---

## API

### `GET /health`

Retorna `200` quando o proxy está em execução.

```json
{ "ok": true, "upstream": "http://localhost:8081" }
```

Use isso para verificar se o servidor está acessível antes de configurar a extensão.

### `POST /v2/check`

Encaminha para o endpoint `/v2/check` do LanguageTool. Aceita `application/x-www-form-urlencoded`:

| Campo | Exemplo | Descrição |
| - | - | - |
| `text` | `"This are a test."` | Texto a verificar (máx. 5000 caracteres enviados pela extensão) |
| `language` | `"en-US"` | Código de idioma BCP 47 |

Retorna a resposta JSON do LanguageTool com um array `matches`.

---

## Conectar a extensão

1. Inicie o servidor (qualquer um dos métodos acima).
2. Abra o popup do MindTab → clique em **Configurações**.
3. Cole `http://localhost:3000` (ou o endereço do seu servidor) em **URL do servidor de gramática**.
4. Clique em **Salvar**.
5. Digite 15+ palavras em qualquer campo de texto — as sugestões de gramática aparecerão no painel Assistente de Escrita.

---

## Implantação em servidor doméstico ou Raspberry Pi

A abordagem com Docker Compose funciona em qualquer máquina Linux. Para torná-lo acessível a outros dispositivos na sua rede, exponha a porta do proxy no seu roteador ou defina `PORT` para algo fácil de lembrar. Em seguida, use o IP local da sua máquina (ex.: `http://192.168.1.50:3000`) como URL do servidor de gramática na extensão.

---

## Licença

[MIT](LICENSE)

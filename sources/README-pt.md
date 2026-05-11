# MindTab

<div align="center">
  <img src="../icons/mindtab128.svg" alt="Logo MindTab" width="128" height="128">

  **MindTab** é uma extensão de navegador gratuita e de código aberto que combina um filtro de feed, bloqueador de anúncios maliciosos, assistente de escrita estilo Grammarly e aprendizado passivo com flashcards — tudo em um pacote leve.

  <br>

  <a href="../README.md"><img src="https://img.shields.io/badge/lang-en-blue?style=for-the-badge&logo=googletranslate&logoColor=white" alt="English"></a>
  <a href="README-es.md"><img src="https://img.shields.io/badge/lang-es-red?style=for-the-badge&logo=googletranslate&logoColor=white" alt="Español"></a>
  <a href="README-fr.md"><img src="https://img.shields.io/badge/lang-fr-white?style=for-the-badge&logo=googletranslate&logoColor=black" alt="Français"></a>
  <a href="README-de.md"><img src="https://img.shields.io/badge/lang-de-black?style=for-the-badge&logo=googletranslate&logoColor=white" alt="Deutsch"></a>
  <a href="#português"><img src="https://img.shields.io/badge/lang-pt--br-green?style=for-the-badge&logo=googletranslate&logoColor=white" alt="Português"></a>

  
</div>

---

## 🚀 Funcionalidades

### 🧹 Filtro de Feed
Remove YouTube Shorts, Instagram Reels e Facebook Reels do seu feed usando um MutationObserver, funcionando mesmo quando as páginas carregam dinamicamente. Os seletores são totalmente personalizáveis em `config/filters.json`.

### 🛡️ Bloqueador de Anúncios Maliciosos
Verifica links e iframes em busca de padrões de golpe: botões de download falsos, pop-ups de "você ganhou", alertas de vírus falsos e muito mais. As listas de palavras-chave e padrões de URL ficam em `config/filters.json`.

### ✍️ Assistente de Escrita *(alternativa gratuita ao Grammarly)*
Um painel flutuante que aparece quando você digita em qualquer campo de texto, e-mail ou publicação em redes sociais. Funciona completamente de forma local — nenhum texto é enviado a nenhum lugar sem sua permissão.

**Análise local (sempre ativa):**
- Detecção de tom — Agressivo, Passivo-Agressivo, Formal, Casual, Positivo, Urgente
- Detecção de voz passiva
- Contagem de palavras fracas/de preenchimento (`"muito"`, `"basicamente"`, `"literalmente"`, etc.)
- Avisos para frases muito longas (mais de 30 palavras)
- Detecção de palavras de preenchimento
- Detecção de palavras repetidas
- Estatísticas em tempo real — contagem de palavras, frases, nível de leitura

**Com um servidor de gramática (opcional):**
Conecte o MindTab a um servidor [LanguageTool](https://languagetool.org/) para obter sugestões completas de gramática e ortografia. O LanguageTool é gratuito e de código aberto.

### ⚡ Aprendizado com Flashcards
Uma sobreposição discreta de flashcards aparece após um período de inatividade configurável (padrão: 15 minutos) enquanto você navega. Os cartões podem ser adicionados, editados e excluídos no gerenciador integrado.

---

## 🛠️ Instalação

### Firefox (Principal)
1. Vá para `about:debugging` → **Este Firefox** → **Carregar extensão temporária**
2. Selecione `MindTab/manifest.json`

### Chrome / Edge
1. Vá para `chrome://extensions`
2. Ative o **Modo de desenvolvedor** (canto superior direito)
3. Clique em **Carregar sem compactação** → selecione a pasta `MindTab/`

### Safari
```bash
xcrun safari-web-extension-converter MindTab/ --project-location . --app-name MindTab
```
Abra o projeto Xcode gerado, compile-o e ative a extensão nas configurações do Safari.

---

## ⚙️ Personalização

Edite `config/filters.json` para adicionar seletores CSS de feed ou padrões de anúncios.
Edite `config/flashcards.json` para ajustar o tempo dos flashcards ou adicionar perguntas padrão.
Edite `config/toneConfig.json` para adicionar novas definições de tom.

---

## 🤝 Contribuindo

Sinta-se livre para usar isso na sua escola, trabalho ou comunidade! Se publicar em algum lugar, por favor dê crédito ao Aster1630.

1. Faça um fork do repositório
2. Crie uma branch (`git checkout -b feature/MinhaFuncionalidade`)
3. Faça commit das suas alterações
4. Faça push para o fork e abra um Pull Request

---

## 📝 Licença

Licenciado sob a Licença MIT — veja [LICENSE](../LICENSE) para detalhes.

---

<div align="center">
  <p>Criado com ética e simplicidade por <a href="https://aster1630.carrd.co">Aster1630</a></p>
  <p>⭐ Dê uma estrela se o MindTab melhorar sua navegação!</p>
</div>

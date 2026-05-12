# MindTab

<div align="center">
  <img src="../icons/mindtab128.svg" alt="Logo MindTab" width="128" height="128">

  **MindTab** é uma extensão de navegador gratuita e de código aberto que limpa seu feed, bloqueia anúncios maliciosos, ajuda você a escrever melhor e mantém você aprendendo — sem enviar seus dados a lugar nenhum.

  <br>

  <a href="../README.md"><img src="https://img.shields.io/badge/lang-en-blue?style=for-the-badge&logo=googletranslate&logoColor=white" alt="English"></a>
  <a href="README-es.md"><img src="https://img.shields.io/badge/lang-es-red?style=for-the-badge&logo=googletranslate&logoColor=white" alt="Español"></a>
  <a href="README-fr.md"><img src="https://img.shields.io/badge/lang-fr-white?style=for-the-badge&logo=googletranslate&logoColor=black" alt="Français"></a>
  <a href="README-de.md"><img src="https://img.shields.io/badge/lang-de-black?style=for-the-badge&logo=googletranslate&logoColor=white" alt="Deutsch"></a>
  <a href="README-pt.md"><img src="https://img.shields.io/badge/lang-pt--br-green?style=for-the-badge&logo=googletranslate&logoColor=white" alt="Português"></a>
</div>

---

> Este documento foi traduzido parágrafo a parágrafo utilizando o Google Translate. Caso haja algum problema, sinta-se à vontade para abrir um Pull Request corrigindo-o.

---

## 🚀 Funcionalidades

### 🧹 Filtro de Feed

Remove YouTube Shorts, Instagram Reels e Facebook Reels do seu feed automaticamente. Usa listas de filtros mantidas pela comunidade (do uBlock Origin e AdGuard) que se atualizam a cada 24 horas. Um contador no ícone da barra de ferramentas mostra quantos elementos foram removidos na página atual.

### 🛡️ Bloqueador de Anúncios

Verifica páginas em busca de padrões de anúncios fraudulentos — botões de download falsos, pop-ups de "você ganhou", alertas de vírus falsos e links de phishing — e os oculta antes que você possa clicar acidentalmente.

### ✍️ Assistente de Escrita

Uma alternativa leve e gratuita ao Grammarly. Um pequeno painel aparece quando você está digitando em um e-mail, publicação social ou campo de texto e fornece feedback instantâneo — sem conta necessária, sem texto enviado a nenhum servidor.

**O que ele verifica:**

- **Tom** — detecta se sua mensagem soa agressiva, passivo-agressiva, formal, casual, positiva ou urgente
- **Voz passiva** — sinaliza construções como "o relatório foi concluído"
- **Palavras fracas** — detecta palavras de preenchimento como "muito", "basicamente" e "literalmente"
- **Frases longas** — avisa quando uma frase ultrapassa 30 palavras
- **Palavras repetidas** — destaca palavras usadas muitas vezes
- **Nível de leitura** — estima o nível de leitura do seu texto (Flesch-Kincaid)
- **Estatísticas ao vivo** — contagem de palavras e frases enquanto você digita

**Servidor de gramática opcional:** Para verificação completa de gramática e ortografia, você pode conectar o MindTab a um servidor LanguageTool auto-hospedado nas configurações da extensão. Totalmente opcional.

### ⚡ Flashcards

Uma pequena sobreposição de flashcards aparece periodicamente enquanto você navega para ajudá-lo a aprender passivamente. Vem com 30 cartões de conhecimento geral. Adicione os seus próprios no gerenciador de cartões integrado.

---

## 🛠️ Instalação

### Firefox

O MindTab tem o Firefox como alvo principal. Instale-o na [loja de complementos do Firefox](https://addons.mozilla.org/firefox/addon/mindtab/) com um clique.

### Chrome / Edge

Quando estiver disponível na Chrome Web Store, pesquise **"MindTab by Aster1630"** e clique em Adicionar ao Chrome.

### Instalação manual (todos os navegadores)

- **Firefox:** `about:debugging` → Este Firefox → Carregar extensão temporária → selecione `manifest.json`
- **Chrome/Edge:** `chrome://extensions` → Modo do desenvolvedor → Carregar sem compactação → selecione a pasta MindTab
- **Safari:** requer conversão pelo Xcode — consulte a documentação de desenvolvimento

---

## ✍️ Assistente de Escrita

O painel aparece no canto inferior direito da sua tela quando você está digitando com pelo menos 15 palavras.

- Clique em **−** para minimizá-lo em uma barra de título
- Clique em **✕** para ocultá-lo pelo resto da sessão da página
- Ele reabre automaticamente na próxima vez que você começar a digitar em uma nova página

### Opcional: Servidor de gramática

Para sugestões completas de gramática e ortografia, você pode conectar o MindTab a um servidor [LanguageTool](https://languagetool.org/) auto-hospedado. Depois de ter um servidor em execução, cole sua URL em **Configurações** no popup do MindTab.

---

## ⚡ Gerenciador de Cartões

Clique em **Gerenciar Flashcards** no popup para abrir o editor. A partir daí você pode:

- Adicionar suas próprias perguntas e respostas
- Excluir cartões que não deseja
- Ver todos os 30 cartões padrão (esses não podem ser excluídos, mas você pode desativar os flashcards pelo popup)

---

## ⚙️ Personalização

Todas as quatro funcionalidades podem ser ativadas ou desativadas independentemente no popup. Se você só quer o assistente de escrita, desative todo o resto. As listas de filtros são atualizadas automaticamente em segundo plano, mas você também pode clicar em **Atualizar agora** nas Configurações.

O popup e o gerenciador de cartões se adaptam automaticamente ao modo claro ou escuro do seu sistema.

---

## 🤝 Contribuindo

Sinta-se livre para usar isto na sua escola, trabalho ou comunidade. Se publicar em algum lugar, por favor dê crédito ao Aster1630.

Relatórios de bugs, atualizações de seletores de filtros, novos baralhos de cartões e traduções são bem-vindos — abra uma issue ou pull request no GitHub.

---

## 📝 Licença

Licenciado sob a [Licença MIT](../LICENSE).

---

<div align="center">
  <p>Criado com ética e simplicidade por <a href="https://aetherassembly.org/about/aster">Aster1630</a></p>
  <p>⭐ Dê uma estrela se o MindTab melhorar sua navegação!</p>
</div>

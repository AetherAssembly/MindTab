# MindTab

<div align="center">
  <img src="icons/mindtab/mindtab128.svg" alt="Logo MindTab" width="128" height="128">
  
  **MindTab** é uma extensão de navegador unificada que melhora a produtividade através de ferramentas inteligentes de comunicação e aprendizado.

  <br>

  <!-- Traduções de Idiomas -->
  <a href="../README.md"><img src="https://img.shields.io/badge/lang-en-blue?style=for-the-badge&logo=googletranslate&logoColor=white" alt="English"></a>
  <a href="README-es.md"><img src="https://img.shields.io/badge/lang-es-red?style=for-the-badge&logo=googletranslate&logoColor=white" alt="Español"></a>
  <a href="README-fr.md"><img src="https://img.shields.io/badge/lang-fr-white?style=for-the-badge&logo=googletranslate&logoColor=black" alt="Français"></a>
  <a href="README-de.md"><img src="https://img.shields.io/badge/lang-de-black?style=for-the-badge&logo=googletranslate&logoColor=white" alt="Deutsch"></a>
  <a href="README-pt.md"><img src="https://img.shields.io/badge/lang-pt--br-green?style=for-the-badge&logo=googletranslate&logoColor=white" alt="Português"></a>

  <br><br>

  <!-- Botões de Navegação -->
  <a href="#-recursos"><img src="https://img.shields.io/badge/Recursos-4A90E2?style=for-the-badge&logo=star&logoColor=white" alt="Recursos"></a>
  <a href="#-estrutura-do-projeto"><img src="https://img.shields.io/badge/Estrutura-50C878?style=for-the-badge&logo=folder&logoColor=white" alt="Estrutura do Projeto"></a>
  <a href="#-contribuir"><img src="https://img.shields.io/badge/Contribuir-FF6B6B?style=for-the-badge&logo=github&logoColor=white" alt="Contribuir"></a>
  <a href="https://aster1630.carrd.co"><img src="https://img.shields.io/badge/Portfólio-9B59B6?style=for-the-badge&logo=user&logoColor=white" alt="Meu Carrd"></a>
  <a href="https://github.com/aster1630"><img src="https://img.shields.io/badge/GitHub-181717?style=for-the-badge&logo=github&logoColor=white" alt="Perfil GitHub"></a>
  <a href="https://discord.gg/yourinvite"><img src="https://img.shields.io/badge/Discord-5865F2?style=for-the-badge&logo=discord&logoColor=white" alt="Discord"></a>

</div>

---

## 🚀 Recursos

- **💬 Tradutor de Tom**  
  Resumos de tom integrados para e-mails e postagens para melhorar a consciência comunicativa.

- **📚 Aprendizado Flash**  
  Micro-flashcards acionados durante momentos de inatividade ou navegação para construir conhecimento passivamente.

- **🎨 Interface Orientada por SVG**  
  Interface elegante e personalizável usando ícones SVG feitos à mão para clareza e personalização.

- **🔧 Arquitetura Modular**  
  Construído com flexibilidade em mente: fácil de personalizar e estender funcionalidades.

---

## 📁 Estrutura do Projeto

```
MindTab/
├── config/
│   └── toneConfig.json          # Configuração do analisador de tom
├── content_scripts/
│   ├── toneTranslator.js        # Script principal do tradutor de tom
│   └── tabTracker.js            # Rastreamento de atividade das abas
├── flashcard/
│   ├── flashcard.js             # Lógica dos flashcards
│   └── config.json              # Configuração dos flashcards
├── icons/
│   ├── mindtab/
│   │   ├── mindtab.svg          # Logo principal SVG
│   │   ├── mindtab16.svg        # Ícone 16x16 para a barra de ferramentas
│   │   ├── mindtab32.svg        # Ícone 32x32 para extensões
│   │   ├── mindtab48.svg        # Ícone 48x48 para a página de extensões
│   │   ├── mindtab128.svg       # Ícone 128x128 para Chrome Web Store
│   │   ├── mindtabA.svg         # Variante alternativa do logo
│   │   ├── mindtabA32.svg       # Variante alternativa 32x32
│   │   ├── mindtabA48.svg       # Variante alternativa 48x48
│   │   └── mindtabA128.svg      # Variante alternativa 128x128
│   ├── flashcard.svg            # Ícone para flashcards
│   └── tone.svg                 # Ícone para analisador de tom
├── sources/
│   ├── README-es.md
│   ├── README-fr.md
│   ├── README-de.md
│   └── README-pt.md
├── utils/
│   └── toneUtils.js             # Funções utilitárias para análise de tom
├── background.js                # Script de background da extensão
├── LICENSE                      # Arquivo de licença do projeto
├── manifest.json                # Manifesto da extensão Chrome
└── README.md                    # Documentação principal do projeto
```

---

## 🛠️ Instalação

### Instalação Rápida (Chrome Web Store)
1. Visite a [Chrome Web Store](https://chromewebstore.google.com/)
2. Procure por "MindTab by Aster1630"
3. Clique em "Adicionar ao Chrome" e aproveite!
4. Sinta-se à vontade para deixar uma avaliação! ⭐

### Instalação do Desenvolvedor
1. Clone o repositório:
   ```bash
   git clone https://github.com/aster1630/mindtab.git
   ```

2. Carregue a extensão:
   - Navegue para `chrome://extensions`
   - Ative o Modo do Desenvolvedor
   - Clique em "Carregar sem compactação" e selecione o diretório `MindTab/`

3. Personalize flashcards, lógica de tom ou injete novos SVGs!

---

## 🤝 Contribuir

***EU APOIO COMPLETAMENTE VOCÊ USAR O MEU PARA FAZER O SEU, MAS SE VOCÊ POSTAR EM QUALQUER LUGAR, POR FAVOR ME CREDITE!***

Seja corrigindo bugs, adicionando recursos ou melhorando a documentação, contribuições são bem-vindas!

1. Faça um fork do repositório
2. Crie sua branch de recurso (`git checkout -b feature/RecursoIncrível`)
3. Commit suas mudanças (`git commit -m 'Adicionar algum RecursoIncrível'`)
4. Faça push para a branch (`git push origin feature/RecursoIncrível`)
5. Abra um Pull Request

---

## 📝 Licença

Este projeto está licenciado sob o arquivo [LICENSE](LICENSE) no repositório.

---

<div align="center">
  <p>Feito com ❤️ por <a href="https://aster1630.carrd.co">Aster1630</a></p>
  <p>⭐ Dê uma estrela para este repo se você achou útil!</p>
</div>
# MindTab

<div align="center">
  <img src="icons/mindtab/mindtab128.svg" alt="Logo MindTab" width="128" height="128">
  
  **MindTab** est une extension de navigateur unifiée qui améliore la productivité grâce à des outils intelligents de communication et d'apprentissage.

  <br>

  <!-- Traductions de Langues -->
  <a href="../README.md"><img src="https://img.shields.io/badge/lang-en-blue?style=for-the-badge&logo=googletranslate&logoColor=white" alt="English"></a>
  <a href="README-es.md"><img src="https://img.shields.io/badge/lang-es-red?style=for-the-badge&logo=googletranslate&logoColor=white" alt="Español"></a>
  <a href="README-fr.md"><img src="https://img.shields.io/badge/lang-fr-white?style=for-the-badge&logo=googletranslate&logoColor=black" alt="Français"></a>
  <a href="README-de.md"><img src="https://img.shields.io/badge/lang-de-black?style=for-the-badge&logo=googletranslate&logoColor=white" alt="Deutsch"></a>
  <a href="README-pt.md"><img src="https://img.shields.io/badge/lang-pt--br-green?style=for-the-badge&logo=googletranslate&logoColor=white" alt="Português"></a>

  <br><br>

  <!-- Boutons de Navigation -->
  <a href="#-fonctionnalités"><img src="https://img.shields.io/badge/Fonctionnalités-4A90E2?style=for-the-badge&logo=star&logoColor=white" alt="Fonctionnalités"></a>
  <a href="#-installation"><img src="https://img.shields.io/badge/Installation-7B68EE?style=for-the-badge&logo=download&logoColor=white" alt="Installation"></a>
  <a href="#-structure-du-projet"><img src="https://img.shields.io/badge/Structure-50C878?style=for-the-badge&logo=folder&logoColor=white" alt="Structure du Projet"></a>
  <a href="#-contribuer"><img src="https://img.shields.io/badge/Contribuer-FF6B6B?style=for-the-badge&logo=github&logoColor=white" alt="Contribuer"></a>
  <a href="https://aster1630.carrd.co"><img src="https://img.shields.io/badge/Portfolio-9B59B6?style=for-the-badge&logo=user&logoColor=white" alt="Mon Carrd"></a>
  <a href="https://github.com/aster1630"><img src="https://img.shields.io/badge/GitHub-181717?style=for-the-badge&logo=github&logoColor=white" alt="Profil GitHub"></a>
  <a href="https://discord.gg/yourinvite"><img src="https://img.shields.io/badge/Discord-5865F2?style=for-the-badge&logo=discord&logoColor=white" alt="Discord"></a>

</div>

---

## 🚀 Fonctionnalités

- **💬 Traducteur de Ton**  
  Résumés de ton intégrés pour les emails et publications pour améliorer la conscience communicative.

- **📚 Apprentissage Flash**  
  Micro-cartes mémoire déclenchées pendant les moments d'inactivité ou de navigation pour construire des connaissances passivement.

- **🎨 Interface Pilotée par SVG**  
  Interface élégante et personnalisable utilisant des icônes SVG faites à la main pour la clarté et la personnalisation.

- **🔧 Architecture Modulaire**  
  Construit avec la flexibilité à l'esprit : facile à personnaliser et étendre les fonctionnalités.

---

## 📁 Structure du Projet

```
MindTab/
├── config/
│   └── toneConfig.json          # Configuration de l'analyseur de ton
├── content_scripts/
│   ├── toneTranslator.js        # Script principal du traducteur de ton
│   └── tabTracker.js            # Suivi de l'activité des onglets
├── flashcard/
│   ├── flashcard.js             # Logique des cartes mémoire
│   └── config.json              # Configuration des flashcards
├── icons/
│   ├── mindtab/
│   │   ├── mindtab.svg          # Logo principal SVG
│   │   ├── mindtab16.svg        # Icône 16x16 pour la barre d'outils
│   │   ├── mindtab32.svg        # Icône 32x32 pour les extensions
│   │   ├── mindtab48.svg        # Icône 48x48 pour les extensions
│   │   ├── mindtab128.svg       # Icône 128x128 pour Chrome Web Store
│   │   ├── mindtabA.svg         # Variante alternative du logo
│   │   ├── mindtabA32.svg       # Variante alternative 32x32
│   │   ├── mindtabA48.svg       # Variante alternative 48x48
│   │   └── mindtabA128.svg      # Variante alternative 128x128
│   ├── flashcard.svg            # Icône pour les cartes mémoire
│   └── tone.svg                 # Icône pour l'analyseur de ton
├── sources/
│   ├── README-es.md
│   ├── README-fr.md
│   ├── README-de.md
│   └── README-pt.md
├── utils/
│   └── toneUtils.js             # Fonctions utilitaires pour l'analyse de ton
├── background.js                # Script d'arrière-plan de l'extension
├── LICENSE                      # Fichier de licence du projet
├── manifest.json                # Manifeste de l'extension Chrome
└── README.md                    # Documentation principale du projet
```

---

## 🛠️ Installation

### Installation Rapide (Chrome Web Store)
1. Visitez le [Chrome Web Store](https://chromewebstore.google.com/)
2. Recherchez "MindTab by Aster1630"
3. Cliquez sur "Ajouter à Chrome" et profitez !
4. N'hésitez pas à laisser un avis ! ⭐

### Installation Développeur
1. Clonez le dépôt :
   ```bash
   git clone https://github.com/aster1630/mindtab.git
   ```

2. Chargez l'extension :
   - Naviguez vers `chrome://extensions`
   - Activez le Mode Développeur
   - Cliquez sur "Charger l'extension non empaquetée" et sélectionnez le répertoire `MindTab/`

3. Personnalisez les cartes mémoire, la logique de ton, ou injectez de nouveaux SVG !

---

## 🤝 Contribuer

***JE SOUTIENS PLEINEMENT QUE VOUS UTILISIEZ LE MIEN POUR FAIRE LE VÔTRE, MAIS SI VOUS LE PUBLIEZ QUELQUE PART, VEUILLEZ ME CRÉDITER !***

Que vous corrigiez des bugs, ajoutiez des fonctionnalités ou amélioriez la documentation, les contributions sont les bienvenues !

1. Forkez le dépôt
2. Créez votre branche de fonctionnalité (`git checkout -b feature/FonctionnalitéIncroyable`)
3. Validez vos changements (`git commit -m 'Ajouter une FonctionnalitéIncroyable'`)
4. Poussez vers la branche (`git push origin feature/FonctionnalitéIncroyable`)
5. Ouvrez une Pull Request

---

## 📝 Licence

Ce projet est sous licence selon le fichier [LICENSE](LICENSE) dans le dépôt.

---

<div align="center">
  <p>Fait avec ❤️ par <a href="https://aster1630.carrd.co">Aster1630</a></p>
  <p>⭐ Donnez une étoile à ce dépôt si vous l'avez trouvé utile !</p>
</div>
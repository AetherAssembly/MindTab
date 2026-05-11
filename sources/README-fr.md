# MindTab

<div align="center">
  <img src="../icons/mindtab128.svg" alt="Logo MindTab" width="128" height="128">

  **MindTab** est une extension de navigateur gratuite et open-source qui combine un assainisseur de fil d'actualité, un bloqueur de publicités malveillantes, un assistant d'écriture style Grammarly et un apprentissage passif par cartes mémoire — le tout dans un seul package léger.

  <br>

  <a href="../README.md"><img src="https://img.shields.io/badge/lang-en-blue?style=for-the-badge&logo=googletranslate&logoColor=white" alt="English"></a>
  <a href="README-es.md"><img src="https://img.shields.io/badge/lang-es-red?style=for-the-badge&logo=googletranslate&logoColor=white" alt="Español"></a>
  <a href="#français"><img src="https://img.shields.io/badge/lang-fr-white?style=for-the-badge&logo=googletranslate&logoColor=black" alt="Français"></a>
  <a href="README-de.md"><img src="https://img.shields.io/badge/lang-de-black?style=for-the-badge&logo=googletranslate&logoColor=white" alt="Deutsch"></a>
  <a href="README-pt.md"><img src="https://img.shields.io/badge/lang-pt--br-green?style=for-the-badge&logo=googletranslate&logoColor=white" alt="Português"></a>
</div>

---

## 🚀 Fonctionnalités

### 🧹 Assainisseur de Fil d'Actualité
Supprime les YouTube Shorts, les Instagram Reels et les Facebook Reels de votre fil en utilisant un MutationObserver, fonctionnant même lorsque les pages se chargent dynamiquement. Les sélecteurs sont entièrement personnalisables dans `config/filters.json`.

### 🛡️ Bloqueur de Publicités Malveillantes
Analyse les liens et les iframes à la recherche de schémas d'arnaque : faux boutons de téléchargement, pop-ups "vous avez gagné", fausses alertes de virus et plus encore. Les listes de mots-clés et de patterns d'URL se trouvent dans `config/filters.json`.

### ✍️ Assistant d'Écriture *(alternative gratuite à Grammarly)*
Un panneau flottant qui apparaît lorsque vous tapez dans n'importe quel champ de texte, e-mail ou publication sur les réseaux sociaux. Fonctionne entièrement en local — aucun texte n'est envoyé nulle part sans votre permission.

**Analyse locale (toujours active) :**
- Détection de ton — Agressif, Passif-Agressif, Formel, Décontracté, Positif, Urgent
- Détection de la voix passive
- Comptage des mots faibles/de remplissage (`"très"`, `"vraiment"`, `"littéralement"`, etc.)
- Avertissements pour les phrases trop longues (plus de 30 mots)
- Détection des mots de remplissage
- Détection des mots répétés
- Statistiques en temps réel — nombre de mots, de phrases, niveau de lisibilité

**Avec un serveur de grammaire (optionnel) :**
Connectez MindTab à un serveur [LanguageTool](https://languagetool.org/) pour obtenir des suggestions complètes de grammaire et d'orthographe. LanguageTool est gratuit et open-source.

### ⚡ Apprentissage par Cartes Mémoire
Une superposition de cartes mémoire non intrusive apparaît après une période d'inactivité configurable (par défaut : 15 minutes) pendant votre navigation. Les cartes peuvent être ajoutées, modifiées et supprimées depuis le gestionnaire intégré.

---

## 🛠️ Installation

### Firefox (Principal)
1. Allez dans `about:debugging` → **Ce Firefox** → **Charger un module complémentaire temporaire**
2. Sélectionnez `MindTab/manifest.json`

### Chrome / Edge
1. Allez dans `chrome://extensions`
2. Activez le **Mode développeur** (coin supérieur droit)
3. Cliquez sur **Charger l'extension non empaquetée** → sélectionnez le dossier `MindTab/`

### Safari
```bash
xcrun safari-web-extension-converter MindTab/ --project-location . --app-name MindTab
```
Ouvrez le projet Xcode généré, compilez-le et activez l'extension dans les paramètres de Safari.

---

## ⚙️ Personnalisation

Modifiez `config/filters.json` pour ajouter des sélecteurs CSS de fil d'actualité ou des patterns publicitaires.
Modifiez `config/flashcards.json` pour ajuster les durées des cartes ou ajouter des questions par défaut.
Modifiez `config/toneConfig.json` pour ajouter de nouvelles définitions de tons.

---

## 🤝 Contribuer

Vous pouvez utiliser ceci librement pour votre école, votre travail ou votre communauté ! Si vous le publiez quelque part, merci de créditer Aster1630.

1. Forkez le dépôt
2. Créez une branche (`git checkout -b feature/MaFonctionnalité`)
3. Commitez vos modifications
4. Poussez vers votre fork et ouvrez une Pull Request

---

## 📝 Licence

Sous licence MIT — consultez [LICENSE](../LICENSE) pour plus de détails.

---

<div align="center">
  <p>Créé avec éthique et simplicité par <a href="https://aster1630.carrd.co">Aster1630</a></p>
  <p>⭐ Mettez une étoile si MindTab améliore votre navigation !</p>
</div>

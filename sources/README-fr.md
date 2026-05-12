# MindTab

<div align="center">
  <img src="../icons/mindtab128.svg" alt="Logo MindTab" width="128" height="128">

  **MindTab** est une extension de navigateur gratuite et open-source qui nettoie votre fil d'actualité, bloque les publicités malveillantes, vous aide à mieux écrire et vous maintient en apprentissage — sans envoyer vos données nulle part.

  <br>

  <a href="../README.md"><img src="https://img.shields.io/badge/lang-en-blue?style=for-the-badge&logo=googletranslate&logoColor=white" alt="English"></a>
  <a href="README-es.md"><img src="https://img.shields.io/badge/lang-es-red?style=for-the-badge&logo=googletranslate&logoColor=white" alt="Español"></a>
  <a href="README-fr.md"><img src="https://img.shields.io/badge/lang-fr-white?style=for-the-badge&logo=googletranslate&logoColor=black" alt="Français"></a>
  <a href="README-de.md"><img src="https://img.shields.io/badge/lang-de-black?style=for-the-badge&logo=googletranslate&logoColor=white" alt="Deutsch"></a>
  <a href="README-pt.md"><img src="https://img.shields.io/badge/lang-pt--br-green?style=for-the-badge&logo=googletranslate&logoColor=white" alt="Português"></a>
</div>

---

> Ce document a été traduit paragraphe par paragraphe à l'aide de Google Translate. En cas de problème, n'hésitez pas à soumettre une Pull Request pour apporter les corrections nécessaires.

---

## 🚀 Fonctionnalités

### 🧹 Assainisseur de Fil d'Actualité

Supprime automatiquement les YouTube Shorts, Instagram Reels et Facebook Reels de votre fil. Utilise des listes de filtres maintenues par la communauté (uBlock Origin et AdGuard) qui se mettent à jour toutes les 24 heures. Un compteur sur l'icône de la barre d'outils indique combien d'éléments ont été supprimés sur la page actuelle.

### 🛡️ Bloqueur de Publicités

Analyse les pages à la recherche de publicités frauduleuses — faux boutons de téléchargement, pop-ups "vous avez gagné", fausses alertes de virus et liens de phishing — et les masque avant que vous puissiez cliquer dessus par accident.

### ✍️ Assistant d'Écriture

Une alternative légère et gratuite à Grammarly. Un petit panneau apparaît lorsque vous tapez dans un e-mail, une publication sociale ou un champ de texte et vous donne un retour instantané — sans compte, sans texte envoyé à un serveur.

**Ce qu'il analyse :**

- **Ton** — détecte si votre message semble agressif, passif-agressif, formel, décontracté, positif ou urgent
- **Voix passive** — signale des constructions comme "le rapport a été complété"
- **Mots faibles** — détecte les expressions comme "très", "vraiment" et "littéralement"
- **Phrases longues** — avertit quand une phrase dépasse 30 mots
- **Mots répétés** — met en évidence les mots utilisés trop souvent
- **Niveau de lecture** — estime le niveau de lecture de votre texte (Flesch-Kincaid)
- **Statistiques en direct** — nombre de mots et de phrases pendant que vous tapez

**Serveur de grammaire optionnel :** Pour une vérification complète de la grammaire et de l'orthographe, vous pouvez connecter MindTab à un serveur LanguageTool auto-hébergé dans les paramètres de l'extension. Entièrement optionnel.

### ⚡ Cartes Mémoire

Une petite superposition de cartes apparaît périodiquement pendant votre navigation pour vous aider à apprendre passivement. Comprend 30 cartes de culture générale. Ajoutez les vôtres depuis le gestionnaire de cartes intégré.

---

## 🛠️ Installation

### Firefox

MindTab cible Firefox en priorité. Installez-le depuis la [boutique des modules Firefox](https://addons.mozilla.org/firefox/addon/mindtab/) en un clic.

### Chrome / Edge

Quand il sera disponible sur le Chrome Web Store, recherchez **"MindTab by Aster1630"** et cliquez sur Ajouter à Chrome.

### Installation manuelle (tous navigateurs)

- **Firefox :** `about:debugging` → Ce Firefox → Charger un module temporaire → sélectionnez `manifest.json`
- **Chrome/Edge :** `chrome://extensions` → Mode développeur → Charger l'extension non empaquetée → sélectionnez le dossier MindTab
- **Safari :** nécessite une conversion via Xcode — voir la documentation de développement

---

## ✍️ Assistant d'Écriture

Le panneau apparaît en bas à droite de votre écran lorsque vous tapez avec au moins 15 mots.

- Cliquez sur **−** pour le réduire à une barre de titre
- Cliquez sur **✕** pour le masquer pour le reste de la session de page
- Il se rouvre automatiquement la prochaine fois que vous commencez à taper sur une nouvelle page

### Optionnel : Serveur de grammaire

Pour des suggestions complètes de grammaire et d'orthographe, vous pouvez connecter MindTab à un serveur [LanguageTool](https://languagetool.org/) auto-hébergé. Une fois que vous avez un serveur en marche, collez son URL dans **Paramètres** dans le popup MindTab.

---

## ⚡ Gestionnaire de Cartes

Cliquez sur **Gérer les Cartes** dans le popup pour ouvrir l'éditeur. Depuis là, vous pouvez :

- Ajouter vos propres questions et réponses
- Supprimer les cartes que vous ne souhaitez pas
- Voir les 30 cartes par défaut (elles ne peuvent pas être supprimées, mais vous pouvez désactiver les cartes depuis le popup)

---

## ⚙️ Personnalisation

Les quatre fonctionnalités peuvent être activées ou désactivées indépendamment depuis le popup. Si vous ne voulez que l'assistant d'écriture, désactivez tout le reste. Les listes de filtres se mettent à jour automatiquement en arrière-plan, mais vous pouvez aussi cliquer sur **Mettre à jour maintenant** dans Paramètres.

Le popup et le gestionnaire de cartes s'adaptent automatiquement au mode clair ou sombre de votre système.

---

## 🤝 Contribuer

Utilisez ceci librement pour votre école, votre travail ou votre communauté. Si vous le publiez quelque part, merci de créditer Aster1630.

Les rapports de bugs, les mises à jour de sélecteurs de filtres, les nouveaux paquets de cartes et les traductions sont les bienvenus — ouvrez une issue ou une pull request sur GitHub.

---

## 📝 Licence

Sous [licence MIT](../LICENSE).

---

<div align="center">
  <p>Créé avec éthique et simplicité par <a href="https://aetherassembly.org/about/aster">Aster1630</a></p>
  <p>⭐ Mettez une étoile si MindTab améliore votre navigation !</p>
</div>

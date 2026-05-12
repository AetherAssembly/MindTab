# MindTab

<div align="center">
  <img src="../icons/mindtab128.svg" alt="Logo de MindTab" width="128" height="128">

  **MindTab** es una extensión de navegador gratuita y de código abierto que limpia tu feed, bloquea anuncios maliciosos, te ayuda a escribir mejor y te mantiene aprendiendo — sin enviar tus datos a ningún lugar.

  <br>

  <a href="../README.md"><img src="https://img.shields.io/badge/lang-en-blue?style=for-the-badge&logo=googletranslate&logoColor=white" alt="English"></a>
  <a href="README-es.md"><img src="https://img.shields.io/badge/lang-es-red?style=for-the-badge&logo=googletranslate&logoColor=white" alt="Español"></a>
  <a href="README-fr.md"><img src="https://img.shields.io/badge/lang-fr-white?style=for-the-badge&logo=googletranslate&logoColor=black" alt="Français"></a>
  <a href="README-de.md"><img src="https://img.shields.io/badge/lang-de-black?style=for-the-badge&logo=googletranslate&logoColor=white" alt="Deutsch"></a>
  <a href="README-pt.md"><img src="https://img.shields.io/badge/lang-pt--br-green?style=for-the-badge&logo=googletranslate&logoColor=white" alt="Português"></a>
</div>

---

> Este documento fue traducido párrafo a párrafo utilizando Google Translate. Si encuentra algún problema, no dude en enviar una Pull Request para corregirlo.

---

## 🚀 Funcionalidades

### 🧹 Depurador de Contenido

Elimina YouTube Shorts, Instagram Reels y Facebook Reels de tu feed automáticamente. Usa listas de filtros mantenidas por la comunidad (de uBlock Origin y AdGuard) que se actualizan cada 24 horas para mantenerse funcional incluso cuando los sitios cambian su diseño. Un contador en el icono de la barra de herramientas muestra cuántos elementos se han eliminado en la página actual.

### 🛡️ Bloqueador de Anuncios

Analiza las páginas en busca de patrones de anuncios fraudulentos — botones de descarga falsos, ventanas emergentes de "has ganado", alertas de virus falsas y enlaces de phishing — y los oculta antes de que puedas hacer clic accidentalmente.

### ✍️ Asistente de Escritura

Una alternativa ligera y gratuita a Grammarly. Un pequeño panel aparece cuando estás escribiendo en un correo electrónico, publicación social o campo de texto y te da retroalimentación instantánea — sin cuenta, sin texto enviado a ningún servidor.

**Qué analiza:**

- **Tono** — detecta si tu mensaje suena agresivo, pasivo-agresivo, formal, casual, positivo o urgente
- **Voz pasiva** — señala construcciones como "el informe fue completado"
- **Palabras débiles** — detecta muletillas como "muy", "básicamente" y "literalmente"
- **Oraciones largas** — avisa cuando una oración supera las 30 palabras
- **Palabras repetidas** — resalta palabras que has usado demasiadas veces
- **Nivel de lectura** — estima el nivel de lectura de tu texto (Flesch-Kincaid)
- **Estadísticas en vivo** — recuento de palabras y oraciones mientras escribes

**Servidor de gramática opcional:** Si quieres verificación completa de gramática y ortografía, puedes conectar MindTab a un servidor LanguageTool autoalojado en la configuración de la extensión. Esto es completamente opcional.

### ⚡ Tarjetas de Memoria

Una pequeña superposición de tarjetas aparece periódicamente mientras navegas para ayudarte a aprender pasivamente. Incluye 30 tarjetas de conocimiento general. Añade las tuyas desde el gestor de tarjetas integrado.

---

## 🛠️ Instalación

### Firefox

MindTab tiene Firefox como objetivo principal. Instálalo desde la [tienda de complementos de Firefox](https://addons.mozilla.org/firefox/addon/mindtab/) con un clic.

### Chrome / Edge

Cuando esté disponible en Chrome Web Store, busca **"MindTab by Aster1630"** y haz clic en Añadir a Chrome.

### Instalación manual (todos los navegadores)

- **Firefox:** `about:debugging` → Este Firefox → Cargar complemento temporal → selecciona `manifest.json`
- **Chrome/Edge:** `chrome://extensions` → Modo desarrollador → Cargar descomprimido → selecciona la carpeta MindTab
- **Safari:** requiere conversión mediante Xcode — consulta la documentación de desarrollo

---

## ✍️ Asistente de Escritura

El panel aparece en la esquina inferior derecha de tu pantalla cuando escribes con al menos 15 palabras.

- Haz clic en **−** para minimizarlo a la barra de título
- Haz clic en **✕** para ocultarlo durante la sesión de página actual
- Se reabre automáticamente la próxima vez que empieces a escribir en una nueva página

### Opcional: Servidor de gramática

Para sugerencias completas de gramática y ortografía, puedes conectar MindTab a un servidor [LanguageTool](https://languagetool.org/) autoalojado. Una vez que tengas un servidor funcionando, pega su URL en **Configuración** dentro del popup de MindTab.

---

## ⚡ Gestor de Tarjetas

Haz clic en **Gestionar Tarjetas** en el popup para abrir el editor. Desde allí puedes:

- Añadir tus propias preguntas y respuestas
- Eliminar tarjetas que no quieras
- Ver las 30 tarjetas predeterminadas (no se pueden eliminar, pero puedes desactivar las tarjetas desde el popup)

---

## ⚙️ Personalización

Las cuatro funcionalidades se pueden activar o desactivar de forma independiente desde el popup. Si solo quieres el asistente de escritura, desactiva todo lo demás. Las listas de filtros se actualizan automáticamente en segundo plano, pero también puedes hacer clic en **Actualizar ahora** en Configuración.

El popup y el gestor de tarjetas se adaptan automáticamente al modo claro u oscuro de tu sistema.

---

## 🤝 Contribuir

Siéntete libre de usar esto para tu escuela, trabajo o comunidad. Si lo publicas en algún lugar, por favor da crédito a Aster1630.

Los informes de errores, actualizaciones de selectores de filtros, nuevos mazos de tarjetas y traducciones son bienvenidos — abre un issue o pull request en GitHub.

---

## 📝 Licencia

Licenciado bajo la [Licencia MIT](../LICENSE).

---

<div align="center">
  <p>Creado con ética y simplicidad por <a href="https://aetherassembly.org/about/aster">Aster1630</a></p>
  <p>⭐ ¡Dale una estrella si MindTab mejora tu navegación!</p>
</div>

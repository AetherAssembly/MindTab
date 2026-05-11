# MindTab

<div align="center">
  <img src="../icons/mindtab128.svg" alt="Logo de MindTab" width="128" height="128">

  **MindTab** es una extensión de navegador gratuita y de código abierto que combina un depurador de contenido, bloqueador de anuncios maliciosos, asistente de escritura estilo Grammarly y aprendizaje con tarjetas de memoria — todo en un solo paquete ligero.

  <br>

  <a href="../README.md"><img src="https://img.shields.io/badge/lang-en-blue?style=for-the-badge&logo=googletranslate&logoColor=white" alt="English"></a>
  <a href="#español"><img src="https://img.shields.io/badge/lang-es-red?style=for-the-badge&logo=googletranslate&logoColor=white" alt="Español"></a>
  <a href="README-fr.md"><img src="https://img.shields.io/badge/lang-fr-white?style=for-the-badge&logo=googletranslate&logoColor=black" alt="Français"></a>
  <a href="README-de.md"><img src="https://img.shields.io/badge/lang-de-black?style=for-the-badge&logo=googletranslate&logoColor=white" alt="Deutsch"></a>
  <a href="README-pt.md"><img src="https://img.shields.io/badge/lang-pt--br-green?style=for-the-badge&logo=googletranslate&logoColor=white" alt="Português"></a>
</div>

---

## 🚀 Funcionalidades

### 🧹 Depurador de Contenido
Elimina YouTube Shorts, Instagram Reels y Facebook Reels de tu feed usando un MutationObserver, funcionando incluso cuando las páginas cargan dinámicamente. Los selectores son totalmente personalizables en `config/filters.json`.

### 🛡️ Bloqueador de Anuncios Maliciosos
Escanea enlaces e iframes en busca de patrones de estafa: botones de descarga falsos, ventanas emergentes de "has ganado", alertas de virus falsas y más. Las listas de palabras clave y patrones de URL se encuentran en `config/filters.json`.

### ✍️ Asistente de Escritura *(alternativa gratuita a Grammarly)*
Un panel flotante que aparece cuando escribes en cualquier campo de texto, correo electrónico o publicación en redes sociales. Funciona completamente de forma local — ningún texto se envía a ningún lugar sin tu permiso.

**Análisis local (siempre activo):**
- Detección de tono — Agresivo, Pasivo-Agresivo, Formal, Casual, Positivo, Urgente
- Detección de voz pasiva
- Conteo de palabras de relleno/débiles (`"muy"`, `"básicamente"`, `"literalmente"`, etc.)
- Advertencias de oraciones demasiado largas (más de 30 palabras)
- Detección de palabras de relleno
- Detección de palabras repetidas
- Estadísticas en tiempo real — conteo de palabras, oraciones, nivel de lectura

**Con un servidor de gramática (opcional):**
Conecta MindTab a un servidor [LanguageTool](https://languagetool.org/) para obtener sugerencias completas de gramática y ortografía. LanguageTool es gratuito y de código abierto.

### ⚡ Aprendizaje con Tarjetas
Una superposición de tarjetas de memoria no intrusiva aparece después de un período de inactividad configurable (por defecto: 15 minutos) mientras navegas. Las tarjetas se pueden añadir, editar y eliminar desde el gestor integrado.

---

## 🛠️ Instalación

### Firefox (Principal)
1. Ve a `about:debugging` → **Este Firefox** → **Cargar complemento temporal**
2. Selecciona `MindTab/manifest.json`

### Chrome / Edge
1. Ve a `chrome://extensions`
2. Activa el **Modo de desarrollador** (esquina superior derecha)
3. Haz clic en **Cargar descomprimido** → selecciona la carpeta `MindTab/`

### Safari
```bash
xcrun safari-web-extension-converter MindTab/ --project-location . --app-name MindTab
```
Abre el proyecto de Xcode generado, compílalo y activa la extensión en la configuración de Safari.

---

## ⚙️ Personalización

Edita `config/filters.json` para añadir selectores CSS de feed o patrones de anuncios.
Edita `config/flashcards.json` para ajustar los tiempos de las tarjetas o añadir preguntas predeterminadas.
Edita `config/toneConfig.json` para añadir nuevas definiciones de tono.

---

## 🤝 Contribuir

¡Puedes usar esto libremente para tu escuela, trabajo o comunidad! Si lo publicas en algún lugar, por favor da crédito a Aster1630.

1. Haz un fork del repositorio
2. Crea una rama (`git checkout -b feature/MiFuncionalidad`)
3. Haz commit de tus cambios
4. Haz push a tu fork y abre un Pull Request

---

## 📝 Licencia

Licenciado bajo la Licencia MIT — consulta [LICENSE](../LICENSE) para más detalles.

---

<div align="center">
  <p>Creado con ética y simplicidad por <a href="https://aster1630.carrd.co">Aster1630</a></p>
  <p>⭐ ¡Dale una estrella si MindTab mejora tu navegación!</p>
</div>

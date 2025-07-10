# MindTab

<div align="center">
  <img src="icons/mindtab/mindtab128.svg" alt="Logo de MindTab" width="128" height="128">
  
  **MindTab** es una extensión de navegador unificada que mejora la productividad a través de herramientas inteligentes de comunicación y aprendizaje.

  <br>

  <!-- Traducciones de Idiomas -->
  <a href="../README.md"><img src="https://img.shields.io/badge/lang-en-blue?style=for-the-badge&logo=googletranslate&logoColor=white" alt="English"></a>
  <a href="README-es.md"><img src="https://img.shields.io/badge/lang-es-red?style=for-the-badge&logo=googletranslate&logoColor=white" alt="Español"></a>
  <a href="README-fr.md"><img src="https://img.shields.io/badge/lang-fr-white?style=for-the-badge&logo=googletranslate&logoColor=black" alt="Français"></a>
  <a href="README-de.md"><img src="https://img.shields.io/badge/lang-de-black?style=for-the-badge&logo=googletranslate&logoColor=white" alt="Deutsch"></a>
  <a href="README-pt.md"><img src="https://img.shields.io/badge/lang-pt--br-green?style=for-the-badge&logo=googletranslate&logoColor=white" alt="Português"></a>

  <br><br>

  <!-- Botones de Navegación -->
  <a href="#características"><img src="https://img.shields.io/badge/Características-4A90E2?style=for-the-badge&logo=star&logoColor=white" alt="Características"></a>
  <a href="#instalación"><img src="https://img.shields.io/badge/Instalación-7B68EE?style=for-the-badge&logo=download&logoColor=white" alt="Instalación"></a>
  <a href="#estructura-del-proyecto"><img src="https://img.shields.io/badge/Estructura-50C878?style=for-the-badge&logo=folder&logoColor=white" alt="Estructura del Proyecto"></a>
  <a href="#contribuir"><img src="https://img.shields.io/badge/Contribuir-FF6B6B?style=for-the-badge&logo=github&logoColor=white" alt="Contribuir"></a>
  <a href="https://aster1630.carrd.co"><img src="https://img.shields.io/badge/Portafolio-9B59B6?style=for-the-badge&logo=user&logoColor=white" alt="Mi Carrd"></a>
  <a href="https://github.com/aster1630"><img src="https://img.shields.io/badge/GitHub-181717?style=for-the-badge&logo=github&logoColor=white" alt="Perfil de GitHub"></a>
  <a href="https://discord.gg/yourinvite"><img src="https://img.shields.io/badge/Discord-5865F2?style=for-the-badge&logo=discord&logoColor=white" alt="Discord"></a>

</div>

---

## 🚀 Características

- **💬 Traductor de Tono**  
  Resúmenes de tono integrados para correos electrónicos y publicaciones para mejorar la conciencia comunicativa.

- **📚 Aprendizaje Flash**  
  Micro-tarjetas de estudio que aparecen durante momentos de inactividad o navegación para construir conocimiento de forma pasiva.

- **🎨 Interfaz Impulsada por SVG**  
  Interfaz elegante y personalizable usando íconos SVG hechos a mano para claridad y personalización.

- **🔧 Arquitectura Modular**  
  Construido con flexibilidad en mente: fácil de personalizar y extender la funcionalidad.

---

## 📁 Estructura del Proyecto

```
MindTab/
├── config/
│   └── toneConfig.json          # Configuración del analizador de tono
├── content_scripts/
│   ├── toneTranslator.js        # Script principal del traductor de tono
│   └── tabTracker.js            # Seguimiento de actividad de pestañas
├── flashcard/
│   ├── flashcard.js             # Lógica de las tarjetas de estudio
│   └── config.json              # Configuración de flashcards
├── icons/
│   ├── mindtab/
│   │   ├── mindtab.svg          # Logo principal SVG
│   │   ├── mindtab16.svg        # Icono 16x16 para la barra de herramientas
│   │   ├── mindtab32.svg        # Icono 32x32 para extensiones
│   │   ├── mindtab48.svg        # Icono 48x48 para la página de extensiones
│   │   ├── mindtab128.svg       # Icono 128x128 para Chrome Web Store
│   │   ├── mindtabA.svg         # Variante alternativa del logo
│   │   ├── mindtabA32.svg       # Variante alternativa 32x32
│   │   ├── mindtabA48.svg       # Variante alternativa 48x48
│   │   └── mindtabA128.svg      # Variante alternativa 128x128
│   ├── flashcard.svg            # Icono para las tarjetas de estudio
│   └── tone.svg                 # Icono para el analizador de tono
├── sources/
│   ├── README-es.md
│   ├── README-fr.md
│   ├── README-de.md
│   └── README-pt.md
├── utils/
│   └── toneUtils.js             # Funciones utilitarias para análisis de tono
├── background.js                # Script de fondo de la extensión
├── LICENSE                      # Archivo de licencia del proyecto
├── manifest.json                # Manifiesto de la extensión Chrome
└── README.md                    # Documentación principal del proyecto
```

---

## 🛠️ Instalación

### Instalación Rápida (Chrome Web Store)
1. Visita la [Chrome Web Store](https://chromewebstore.google.com/)
2. Busca "MindTab by Aster1630"
3. Haz clic en "Agregar a Chrome" y ¡disfruta!
4. ¡Siéntete libre de dejar una reseña! ⭐

### Instalación de Desarrollador
1. Clona el repositorio:
   ```bash
   git clone https://github.com/aster1630/mindtab.git
   ```

2. Carga la extensión:
   - Navega a `chrome://extensions`
   - Habilita el Modo de Desarrollador
   - Haz clic en "Cargar sin empaquetar" y selecciona el directorio `MindTab/`

3. ¡Personaliza las tarjetas de estudio, la lógica de tono, o inyecta nuevos SVG!

---

## 🤝 Contribuir

***¡APOYO COMPLETAMENTE QUE USES EL MÍO PARA HACER EL TUYO, PERO SI LO PUBLICAS EN CUALQUIER LUGAR POR FAVOR DAME CRÉDITO!***

Ya sea corrigiendo errores, agregando características o mejorando la documentación, ¡las contribuciones son bienvenidas!

1. Haz un fork del repositorio
2. Crea tu rama de características (`git checkout -b feature/CaracterísticaAsombrosa`)
3. Confirma tus cambios (`git commit -m 'Agregar alguna CaracterísticaAsombrosa'`)
4. Empuja a la rama (`git push origin feature/CaracterísticaAsombrosa`)
5. Abre una Pull Request

---

## 📝 Licencia

Este proyecto está licenciado bajo el archivo [LICENSE](LICENSE) en el repositorio.

---

<div align="center">
  <p>Hecho con ❤️ por <a href="https://aster1630.carrd.co">Aster1630</a></p>
  <p>⭐ ¡Dale una estrella a este repo si te fue útil!</p>
</div>
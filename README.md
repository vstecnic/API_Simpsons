# The Simpsons API - Character Explorer

Una aplicación web interactiva que consume la API de Los Simpsons para mostrar información sobre los personajes de la serie.

## Características

- 🍩 Visualización de más de 1,000 personajes de Los Simpsons
- 🔍 Búsqueda de personajes por nombre
- 📱 Diseño responsive (mobile, tablet, desktop)
- ✨ Efectos hover animados en las cards
- 🎨 Diseño inspirado en la estética de Los Simpsons
- ⚡ Carga paginada para mejor rendimiento
- 📊 Muestra información como ocupación, estado, edad y frases

## Tecnologías Utilizadas

- HTML5
- CSS3 (Flexbox, Grid, Animations)
- JavaScript (Vanilla JS - ES6+)
- The Simpsons API

## API

Este proyecto consume la API pública de Los Simpsons:
- **Endpoint**: https://thesimpsonsapi.com/api
- **Documentación**: https://thesimpsonsapi.com/

## Instalación y Uso

1. Clona el repositorio:
```bash
git clone https://github.com/vstecnic/API_Simpsons.git
```

2. Abre el archivo `index.html` en tu navegador

O simplemente visita la versión desplegada en GitHub Pages:
**[Ver Demo en Vivo](https://vstecnic.github.io/API_Simpsons/)**

## Funcionalidades

### Búsqueda
- Busca cualquier personaje escribiendo su nombre en el campo de búsqueda
- Presiona Enter o haz clic en el botón de búsqueda

### Navegación
- **Show All Characters**: Muestra todos los personajes disponibles
- **Load More**: Carga más personajes (20 por vez)

### Cards Interactivas
Cada card muestra:
- Imagen del personaje
- Nombre
- Estado (Vivo/Fallecido/Desconocido)
- Género y edad
- Ocupación
- Frase característica

## Diseño

El diseño está inspirado en:
- Colores icónicos de Los Simpsons (amarillo, azul cielo)
- Efectos hover con transformaciones y sombras
- Layout responsive con CSS Grid
- Animaciones suaves con CSS transitions

## Estructura del Proyecto

```
API_Simpsons/
│
├── index.html          # Estructura HTML principal
├── styles.css          # Estilos y diseño responsive
├── script.js           # Lógica de la aplicación
└── README.md           # Documentación
```

## Créditos

- **API**: [The Simpsons API](https://thesimpsonsapi.com/)
- **Desarrollado por**: vstecnic

## Licencia

Este proyecto es de código abierto y está disponible bajo la licencia MIT.

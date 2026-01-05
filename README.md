# Multi-Series API Explorer

Una aplicación web interactiva que consume múltiples APIs públicas para explorar personajes de tus series favoritas: The Simpsons, Rick and Morty, y Pokémon.

## 🌟 Características Generales

- 🎬 **Página de bienvenida** con 3 series animadas
- 🔍 Búsqueda avanzada por nombre/número
- 📱 Diseño 100% responsive (mobile, tablet, desktop)
- ✨ Efectos hover animados en todas las cards
- 🎨 Diseño temático único para cada serie
- ⚡ Carga optimizada con paginación
- 🚀 Despliegue automático en GitHub Pages

## 📺 Series Implementadas

### 🍩 The Simpsons (1,182 personajes)

**Características:**
- Búsqueda de personajes por nombre
- Paginación de 20 personajes por página
- Información detallada: ocupación, estado, edad, frases icónicas
- Imágenes de alta calidad desde CDN
- Diseño amarillo temático

**API:** [The Simpsons API](https://thesimpsonsapi.com/)

---

### 🛸 Rick and Morty (826 personajes)

**Características:**
- Búsqueda por nombre
- Filtros por:
  - **Estado**: Alive, Dead, Unknown
  - **Especies**: Human, Alien, Humanoid, Robot
- Información detallada: especie, origen, última ubicación
- Paginación automática
- Diseño verde/turquesa temático

**API:** [Rick and Morty API](https://rickandmortyapi.com/)

---

### ⚪ Pokémon (1,350+ Pokémon)

**Características:**
- Búsqueda por nombre o número de Pokédex
- Filtro por tipo (18 tipos disponibles)
- Estadísticas visuales: HP, Attack, Defense con barras
- Información física: altura y peso
- Imágenes oficiales de alta calidad
- Badges de tipos con colores auténticos
- Diseño rojo/amarillo/azul temático

**API:** [PokéAPI](https://pokeapi.co/)

---

## 🚀 Demo en Vivo

**Sitio principal:** [https://vstecnic.github.io/API_Simpsons/](https://vstecnic.github.io/API_Simpsons/)

**Páginas individuales:**
- 🍩 [The Simpsons](https://vstecnic.github.io/API_Simpsons/simpsons.html)
- 🛸 [Rick and Morty](https://vstecnic.github.io/API_Simpsons/rickandmorty.html)
- ⚪ [Pokémon](https://vstecnic.github.io/API_Simpsons/pokemon.html)

## 💻 Tecnologías Utilizadas

- **HTML5**: Estructura semántica
- **CSS3**: Flexbox, Grid, Animations, Gradients
- **JavaScript (ES6+)**: Fetch API, Async/Await, Promises
- **APIs REST**: Consumo de 3 APIs públicas diferentes

## 📦 Instalación y Uso Local

1. **Clona el repositorio:**
```bash
git clone https://github.com/vstecnic/API_Simpsons.git
cd API_Simpsons
```

2. **Abre con Live Server o similar:**
```bash
# Con VSCode Live Server
# O simplemente abre index.html en tu navegador
```

3. **Explora las diferentes series:**
   - Página principal para elegir serie
   - Cada serie tiene su propia página dedicada

## 📂 Estructura del Proyecto

```
API_Simpsons/
│
├── index.html              # Landing page principal
├── main.css                # Estilos de landing page
│
├── simpsons.html           # Página de The Simpsons
├── simpsons.css            # Estilos de The Simpsons
├── simpsons.js             # Lógica de The Simpsons API
│
├── rickandmorty.html       # Página de Rick and Morty
├── rickandmorty.css        # Estilos de Rick and Morty
├── rickandmorty.js         # Lógica de Rick and Morty API
│
├── pokemon.html            # Página de Pokémon
├── pokemon.css             # Estilos de Pokémon
├── pokemon.js              # Lógica de PokéAPI
│
└── README.md               # Documentación
```

## 🎮 Funcionalidades por Serie

### The Simpsons

**Cards muestran:**
- Imagen del personaje
- Nombre completo
- Estado (badge con color)
- Género y edad
- Ocupación
- Frase característica

**Controles:**
- Input de búsqueda
- Botón "Show All Characters"
- Botón "Load More" (20 por página)

---

### Rick and Morty

**Cards muestran:**
- Imagen del personaje (300x300px)
- Nombre
- Estado con indicador visual
- Especie (destacada en color)
- Género
- Origen
- Última ubicación conocida

**Controles:**
- Input de búsqueda
- Select de filtro por estado
- Select de filtro por especie
- Botón "Load More"

---

### Pokémon

**Cards muestran:**
- Número de Pokédex (#001-#1350)
- Imagen oficial (artwork)
- Nombre capitalizado
- Tipos con badges de colores
- Estadísticas base con barras:
  - HP (max: 255)
  - Attack (max: 190)
  - Defense (max: 230)
- Altura (metros)
- Peso (kilogramos)

**Controles:**
- Input de búsqueda (nombre o número)
- Select de filtro por tipo (18 tipos)
- Botón "Load More" (20 por página)

**Tipos de Pokémon disponibles:**
Normal, Fire, Water, Electric, Grass, Ice, Fighting, Poison, Ground, Flying, Psychic, Bug, Rock, Ghost, Dragon, Dark, Steel, Fairy

---

## 🎨 Diseño y UX

### Landing Page
- Cards interactivas con hover effects
- Gradiente de fondo morado
- Logo de cada serie
- Estadísticas (cantidad de personajes)
- Botones con animaciones

### Páginas de Series
- Header temático con colores de cada serie
- Botón "Volver al inicio" en todas las páginas
- Controles de búsqueda y filtros
- Grid responsive con ajuste automático
- Loading states con spinners
- Error handling con mensajes amigables
- Footer con enlaces a las APIs

### Responsive Design
- **Desktop**: Grid de 3-4 columnas
- **Tablet**: Grid de 2-3 columnas
- **Mobile**: Grid de 1 columna
- Todas las imágenes con lazy loading

## 🔧 APIs Utilizadas

### The Simpsons API
- **Base URL**: `https://thesimpsonsapi.com/api`
- **Endpoint**: `/characters?page={page}&limit={limit}`
- **Paginación**: Parámetros page y limit
- **Total**: 1,182 personajes

### Rick and Morty API
- **Base URL**: `https://rickandmortyapi.com/api`
- **Endpoint**: `/character?page={page}`
- **Filtros**: `?name={name}&status={status}&species={species}`
- **Total**: 826 personajes

### PokéAPI
- **Base URL**: `https://pokeapi.co/api/v2`
- **Endpoint**: `/pokemon?offset={offset}&limit={limit}`
- **Búsqueda**: `/pokemon/{id or name}`
- **Filtro**: `/type/{type}`
- **Total**: 1,350+ Pokémon

## 🚀 Performance

- **Fetch paralelo**: Múltiples requests simultáneos
- **Lazy loading**: Imágenes cargadas bajo demanda
- **Paginación**: Carga incremental de datos
- **Cache**: Map para almacenar personajes cargados
- **Optimización**: Debounce en búsquedas

## 🤝 Contribuciones

Las contribuciones son bienvenidas. Para cambios importantes:

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📝 Créditos

### APIs
- [The Simpsons API](https://thesimpsonsapi.com/) - Datos de Los Simpsons
- [Rick and Morty API](https://rickandmortyapi.com/) - Datos de Rick and Morty
- [PokéAPI](https://pokeapi.co/) - Datos de Pokémon

### Desarrollador
- **Desarrollado por**: vstecnic
- **Generado con**: Claude Code

## 📄 Licencia

Este proyecto es de código abierto y está disponible bajo la licencia MIT.

## 🌟 Roadmap Futuro

- [ ] Agregar más series (Dragon Ball, Marvel, etc.)
- [ ] Implementar favoritos con LocalStorage
- [ ] Modo oscuro/claro
- [ ] Modales para información detallada
- [ ] Comparador de personajes
- [ ] Estadísticas y gráficos
- [ ] PWA (Progressive Web App)

---

⭐ Si te gusta este proyecto, no olvides darle una estrella en GitHub!

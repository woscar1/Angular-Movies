# Data Explorer — Películas
Aplicación Angular 18 que consume dos APIs públicas (**The Movie Database** y **OpenWeatherMap**) para mostrar datos de películas populares y clima de ciudades del mundo en tablas interactivas con Angular Material.

![Angular](https://img.shields.io/badge/Angular-18-red?logo=angular)
![TypeScript](https://img.shields.io/badge/TypeScript-5.4-blue?logo=typescript)
![Angular Material](https://img.shields.io/badge/Angular%20Material-18-purple)

---

## ✨ Características

- 🎬 **Tabla de Películas**: Películas populares de TMDB con póster, título, rating y sinopsis
- 🔍 **Búsqueda con Debounce**: Filtra películas por título o por nombre
- 📄 **Paginación**: Server-side (películas) 
- 📱 **Diseño Responsive**: Se adapta a móvil, tablet y desktop
- ⚡ **Standalone Components**: Arquitectura moderna sin NgModules
- 🏗️ **Lazy Loading**: Carga diferida de la página principal
- 🔔 **Feedback Visual**: Spinners de carga y notificaciones de error con Snackbar

---

## 📋 Requisitos Previos

- **Node.js** v18 o superior ([descargar](https://nodejs.org/))
- **npm** v9 o superior (incluido con Node.js)
- **API Key de TMDB** (gratuita): [Obtener aquí](https://www.themoviedb.org/settings/api)
- **API Key de OpenWeatherMap** (gratuita): [Obtener aquí](https://openweathermap.org/api)

---

## 🚀 Instalación

### 1. Clonar el repositorio

```bash
git clone <url-del-repositorio>
cd Angular
```

### 2. Instalar dependencias

```bash
npm install
```

### 3. Ejecutar en modo desarrollo

```bash
npx ng serve
```

La aplicación estará disponible en **http://localhost:4200/**

---

## 📦 Comandos Disponibles

| Comando | Descripción |
|---------|-------------|
| `npx ng serve` | Inicia el servidor de desarrollo |
| `npx ng build` | Genera el bundle de producción en `dist/` |
| `npx ng test` | Ejecuta las pruebas unitarias |
| `npx ng lint` | Ejecuta el linter |

---

## 🗂️ Estructura del Proyecto

```
src/
├── app/
│   ├── components/             # Componentes reutilizables
│   │   ├── header/             # Barra de navegación superior
│   │   ├── movies-table/       # Tabla de películas (TMDB)
│   │   └── weather-table/      # Tabla de clima (OpenWeatherMap)
│   ├── models/                 # Interfaces TypeScript
│   │   ├── movie.model.ts      # Modelos de películas y respuesta TMDB
│   │   └── weather.model.ts    # Modelos de clima y respuesta OpenWeather
│   ├── pages/                  # Páginas de la aplicación
│   │   └── home/               # Página principal con toggle
│   ├── services/               # Servicios para consumo de APIs
│   │   ├── movie.service.ts    # Servicio de TMDB
│   │   └── weather.service.ts  # Servicio de OpenWeatherMap
│   ├── app.component.*         # Componente raíz
│   ├── app.config.ts           # Configuración de providers
│   └── app.routes.ts           # Configuración de rutas
├── environments/               # Configuración por entorno
│   ├── environment.ts          # Desarrollo
│   └── environment.prod.ts     # Producción
├── styles.scss                 # Estilos globales y tema Material
└── index.html                  # HTML principal
```

---

## 🏗️ Arquitectura

### Standalone Components
La aplicación usa **standalone components** de Angular 18, eliminando la necesidad de NgModules. Cada componente declara sus propias dependencias en su decorador `@Component`.

### Servicios
- **MovieService**: Consume la API v3 de TMDB con `HttpClient`. Soporta paginación server-side y búsqueda.
- **WeatherService**: Consume la API de OpenWeatherMap. Usa `forkJoin` para hacer peticiones paralelas a 15 ciudades con manejo de errores por ciudad.

### Tipado Fuerte
Todas las respuestas de API están tipadas con interfaces TypeScript (`Movie`, `TmdbResponse`, `WeatherData`, `OpenWeatherResponse`).

### Manejo de Errores
- Errores HTTP categorizados (401, 404, 429, 500+)
- Mensajes de error descriptivos en español
- Notificaciones visuales con `MatSnackBar`
- Estados de carga con `MatProgressSpinner`

---

## 🎨 Tecnologías Utilizadas

- **Angular 18** — Framework principal
- **Angular Material 18** — Componentes UI (tablas, paginador, formularios, snackbar, toggle)
- **TypeScript 5.4** — Tipado estático
- **SCSS** — Preprocesador CSS
- **RxJS** — Programación reactiva (debounce, forkJoin, takeUntil)

---

## 📡 APIs Consumidas

| API | Endpoints | Uso |
|-----|-----------|-----|
| [TMDB v3](https://developer.themoviedb.org/) | `/movie/popular`, `/search/movie` | Películas populares y búsqueda |

---

## 📄 Licencia

Este proyecto fue creado con fines educativos y de evaluación técnica.

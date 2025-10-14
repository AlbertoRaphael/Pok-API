# PokemonApp 🎮

Aplicación móvil React Native que consume la PokéAPI para explorar información completa de Pokémon con funcionalidades modernas de búsqueda, favoritos y navegación fluida.

## 📱 Descripción General

PokemonApp es una aplicación móvil desarrollada con **React Native 0.74+ y TypeScript** que demuestra el uso de patrones modernos de desarrollo móvil. 

### Funcionalidades Principales

- **Lista de Pokémon**: Scroll infinito con paginación automática
- **Búsqueda inteligente**: Búsqueda en tiempo real con debounce (300ms)
- **Pantalla de detalle**: Información completa con estadísticas, tipos y habilidades
- **Sistema de favoritos**: Persistencia local con AsyncStorage
- **Estados de UI**: Manejo completo de loading, error y estados vacíos
- **Navegación fluida**: Transiciones nativas entre pantallas

## 🚀 Instalación y Ejecución

### Prerrequisitos
- Node.js >= 18.0.0
- Android Studio (para Android) o Xcode (para iOS)
- React Native development environment configurado

### Pasos de Instalación

```bash
# 1. Clonar el repositorio
git clone https://github.com/AlbertoRaphael/PokemonApp.git
cd PokemonApp

# 2. Instalar dependencias
npm install

# 3. Para iOS (solo macOS)
cd ios && pod install && cd ..

# 4. Ejecutar la aplicación
npm start                # Iniciar Metro bundler
npm run android         # Ejecutar en Android
npm run ios             # Ejecutar en iOS (solo macOS)
```

### Scripts Disponibles

```bash
npm start               # Iniciar Metro bundler
npm run android         # Ejecutar en Android
npm run ios             # Ejecutar en iOS
npm run info            # Ver información del proyecto
npm run lint            # Verificar código con ESLint
npm test                # Ejecutar tests
```

## 📦 Dependencias Principales

### Framework y Lenguaje
- **React Native 0.74.5** - Framework de desarrollo móvil
- **TypeScript** - Tipado estático para JavaScript

### Gestión de Estado y Datos
- **Zustand** - Store global ligero y eficiente
- **@tanstack/react-query** - Manejo de estado del servidor y caché
- **@react-native-async-storage/async-storage** - Persistencia local

### Navegación y UI
- **@react-navigation/native** - Navegación entre pantallas
- **react-native-fast-image** - Optimización de carga de imágenes
- **react-native-safe-area-context** - Manejo de áreas seguras

### Red y API
- **Axios** - Cliente HTTP para llamadas a la PokéAPI

## ⏱️ Tiempo Total Invertido

**Tiempo estimado de desarrollo: 12-16 horas**

- **Configuración inicial y estructura**: 2 horas
- **Implementación de API y tipos**: 2 horas
- **Componentes UI y pantallas**: 4 horas
- **Sistema de favoritos y estado**: 2 horas
- **Navegación e integración**: 2 horas
- **Testing y optimización**: 2 horas
- **Documentación**: 2-4 horas

## 🛠️ Decisiones Técnicas Clave

### ¿Por qué React Query?
- **Caché automático**: Manejo inteligente de caché con invalidación
- **Estados integrados**: Loading, error y success incluidos
- **Scroll infinito**: `useInfiniteQuery` perfecto para paginación
- **Optimización**: Deduplicación de requests y background updates

### ¿Por qué Zustand?
- **Simplicidad**: API minimalista sin boilerplate
- **Performance**: Re-renders optimizados
- **TypeScript**: Soporte nativo excelente
- **Tamaño**: Muy ligero (~2KB) comparado con Redux

### ¿Por qué TypeScript?
- **Seguridad**: Prevención de errores en tiempo de compilación
- **Productividad**: IntelliSense y refactoring seguro
- **Mantenibilidad**: Código autodocumentado y escalable

### Arquitectura Elegida
- **Separación por capas**: API, Estado, UI y Navegación
- **Hooks personalizados**: Lógica reutilizable y testeable
- **Componentes modulares**: Reutilización y mantenimiento
- **Transformadores de datos**: Separación entre API y dominio

## 🏗️ Estructura del Proyecto

```
src/
├── api/              # Cliente API y endpoints
├── components/       # Componentes reutilizables
├── hooks/           # Hooks personalizados
├── navigation/      # Configuración de navegación
├── screens/         # Pantallas de la aplicación
├── store/           # Estado global (Zustand)
└── types/           # Definiciones TypeScript
```

## 🎯 Características Técnicas

- **Scroll infinito** con React Query `useInfiniteQuery`
- **Búsqueda con debounce** para optimizar requests
- **Caché inteligente** con React Query
- **Persistencia local** con AsyncStorage
- **Navegación tipada** con React Navigation
- **Optimización de imágenes** con FastImage
- **Manejo de errores** centralizado
- **Estados de UI** completos

## 📱 Cómo Ver la Aplicación

**Importante**: React Native es para móviles, no funciona en navegador web.

1. **Abrir Android Studio** → AVD Manager
2. **Iniciar emulador** Android
3. **Ejecutar**: `npm start` y luego `npm run android`
4. **Ver la app** funcionando en el emulador

## 🔗 Enlaces

- **Repositorio**: https://github.com/AlbertoRaphael/PokemonApp
- **PokéAPI**: https://pokeapi.co/
- **React Native**: https://reactnative.dev/

---

**Desarrollado por**: Alberto Raphael  
**Prueba Técnica**: React Native + TypeScript + PokéAPI  
**Fecha**: 2024
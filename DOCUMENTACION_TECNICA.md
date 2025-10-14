# 📚 Documentación Técnica - PokemonApp

## 🎯 Índice

1. [Arquitectura General](#-arquitectura-general)
2. [Estructura del Proyecto](#-estructura-del-proyecto)
3. [Capa de API](#-capa-de-api)
4. [Gestión de Estado](#-gestión-de-estado)
5. [Hooks Personalizados](#-hooks-personalizados)
6. [Componentes UI](#-componentes-ui)
7. [Navegación](#-navegación)
8. [Tipos TypeScript](#-tipos-typescript)
9. [Configuración y Setup](#-configuración-y-setup)
10. [Desarrollo y Compilación](#-desarrollo-y-compilación)
11. [Troubleshooting](#-troubleshooting)

---

## 🏗️ Arquitectura General

### Patrón de Arquitectura

La aplicación sigue una **arquitectura por capas** con separación clara de responsabilidades:

```
┌─────────────────────────────────────┐
│           UI LAYER                  │
│  (Screens, Components, Navigation)  │
├─────────────────────────────────────┤
│         BUSINESS LOGIC              │
│    (Hooks, State Management)       │
├─────────────────────────────────────┤
│          DATA LAYER                 │
│   (API Client, React Query)        │
├─────────────────────────────────────┤
│        EXTERNAL SERVICES            │
│      (PokéAPI, AsyncStorage)       │
└─────────────────────────────────────┘
```

### Flujo de Datos

```
User Interaction → Component → Hook → API Client → PokéAPI
                     ↓
                 State Update ← React Query ← API Response
                     ↓
                UI Re-render
```

---

## 📁 Estructura del Proyecto

### Organización de Carpetas

```
PokemonApp/
├── src/                          # Código fuente principal
│   ├── api/                      # Capa de comunicación con APIs
│   │   ├── apiClient.ts          # Cliente Axios centralizado
│   │   ├── pokemon.ts            # Endpoints específicos de Pokémon
│   │   ├── queryClient.ts        # Configuración React Query
│   │   ├── QueryProvider.tsx     # Provider de React Query
│   │   ├── types.ts              # Tipos de respuesta API
│   │   └── index.ts              # Exportaciones centralizadas
│   │
│   ├── components/               # Componentes reutilizables
│   │   ├── common/               # Componentes generales
│   │   │   ├── LoadingSpinner.tsx
│   │   │   ├── ErrorMessage.tsx
│   │   │   ├── EmptyState.tsx
│   │   │   └── SearchBar.tsx
│   │   ├── pokemon/              # Componentes específicos
│   │   │   ├── PokemonCard.tsx
│   │   │   ├── PokemonStats.tsx
│   │   │   ├── PokemonTypes.tsx
│   │   │   ├── PokemonImage.tsx
│   │   │   └── PokemonInfo.tsx
│   │   └── index.ts
│   │
│   ├── hooks/                    # Hooks personalizados
│   │   ├── usePokemons.ts        # Lista paginada
│   │   ├── usePokemonDetail.ts   # Detalles individuales
│   │   ├── usePokemonSearch.ts   # Búsqueda
│   │   ├── useDebounce.ts        # Utilidad debounce
│   │   └── index.ts
│   │
│   ├── navigation/               # Configuración de navegación
│   │   ├── AppNavigator.tsx      # Navegador principal
│   │   ├── navigationConfig.ts   # Configuraciones
│   │   ├── navigationUtils.ts    # Utilidades
│   │   └── index.ts
│   │
│   ├── screens/                  # Pantallas de la aplicación
│   │   ├── PokemonList/
│   │   │   ├── PokemonListScreen.tsx
│   │   │   └── index.ts
│   │   ├── PokemonDetail/
│   │   │   ├── PokemonDetailScreen.tsx
│   │   │   └── index.ts
│   │   └── index.ts
│   │
│   ├── store/                    # Gestión de estado global
│   │   ├── favoritesStore.ts     # Store de favoritos
│   │   └── index.ts
│   │
│   └── types/                    # Definiciones TypeScript
│       ├── pokemon.types.ts      # Tipos de dominio
│       ├── common.types.ts       # Tipos comunes
│       ├── navigation.types.ts   # Tipos de navegación
│       ├── transformers.ts       # Transformadores
│       └── index.ts
│
├── App.tsx                       # Componente raíz
├── index.js                      # Punto de entrada
├── package.json                  # Dependencias y scripts
├── tsconfig.json                 # Configuración TypeScript
├── metro.config.js               # Configuración Metro
└── README.md                     # Documentación principal
```

### ¿Por qué esta estructura?

- **Separación por funcionalidad**: Cada carpeta tiene una responsabilidad específica
- **Escalabilidad**: Fácil agregar nuevas funcionalidades sin afectar existentes
- **Mantenibilidad**: Código organizado y fácil de encontrar
- **Reutilización**: Componentes y hooks reutilizables
- **Testing**: Estructura que facilita testing unitario e integración

---

## 🌐 Capa de API

### apiClient.ts - Cliente HTTP Centralizado

**¿Qué hace?**
Configura una instancia centralizada de Axios para todas las comunicaciones HTTP.

**¿Por qué?**
- Configuración única para toda la app
- Manejo centralizado de errores
- Interceptores para logging y transformación
- Reintentos automáticos

**¿Cómo funciona?**

```typescript
// Configuración base
const apiClient = axios.create({
  baseURL: 'https://pokeapi.co/api/v2',
  timeout: 10000,
  headers: { 'Content-Type': 'application/json' }
});

// Interceptor de request (logging)
apiClient.interceptors.request.use(config => {
  console.log(`🚀 API Request: ${config.method?.toUpperCase()} ${config.url}`);
  return config;
});

// Interceptor de response (manejo de errores)
apiClient.interceptors.response.use(
  response => response,
  error => {
    const apiError = transformError(error);
    return Promise.reject(apiError);
  }
);
```

### pokemon.ts - Endpoints Específicos

**¿Qué hace?**
Define todas las funciones para interactuar con la PokéAPI.

**Funciones principales:**
- `getPokemonList()`: Lista paginada de Pokémon
- `getPokemonDetail()`: Detalles de un Pokémon específico
- `searchPokemon()`: Búsqueda por nombre
- `getPokemonByIds()`: Múltiples Pokémon por IDs

**Ejemplo de uso:**
```typescript
const pokemonList = await getPokemonList({ offset: 0, limit: 20 });
const pokemonDetail = await getPokemonDetail('pikachu');
```

### queryClient.ts - Configuración React Query

**¿Qué hace?**
Configura React Query para manejo de caché y estados de servidor.

**Configuraciones clave:**
- `staleTime: 5 minutos`: Tiempo antes de considerar datos obsoletos
- `gcTime: 10 minutos`: Tiempo en caché para datos no utilizados
- `retry: 3 intentos`: Reintentos automáticos en caso de error

**¿Por qué React Query?**
- Caché automático e inteligente
- Estados de loading/error incluidos
- Sincronización en background
- Optimistic updates
- Deduplicación de requests

---

## 🗃️ Gestión de Estado

### favoritesStore.ts - Store de Favoritos con Zustand

**¿Qué hace?**
Maneja el estado global de Pokémon favoritos con persistencia en AsyncStorage.

**¿Por qué Zustand?**
- API simple sin boilerplate
- Performance optimizada
- Excelente soporte TypeScript
- Fácil integración con AsyncStorage
- Tamaño pequeño (~2KB)

**Estructura del Store:**

```typescript
interface FavoritesState {
  // Estado
  favorites: Set<number>;        // IDs de favoritos
  isLoading: boolean;           // Estado de carga
  error: string | null;         // Errores

  // Acciones
  toggleFavorite: (id, name) => Promise<void>;
  addFavorite: (id, name) => Promise<void>;
  removeFavorite: (id) => Promise<void>;
  isFavorite: (id) => boolean;
  loadFavorites: () => Promise<void>;
  clearFavorites: () => Promise<void>;
}
```

**Flujo de persistencia:**
1. Usuario marca/desmarca favorito
2. Store actualiza estado local
3. Automáticamente guarda en AsyncStorage
4. Al reiniciar app, carga desde AsyncStorage

**¿Por qué Set en lugar de Array?**
- Búsquedas O(1) vs O(n)
- Evita duplicados automáticamente
- Operaciones add/delete más eficientes

---

## 🎣 Hooks Personalizados

### usePokemons.ts - Lista Paginada

**¿Qué hace?**
Hook para obtener lista paginada de Pokémon con scroll infinito.

**Características:**
- `useInfiniteQuery` para paginación
- Transformación automática de datos API → dominio
- Estados de loading, error, fetching
- Función `fetchNextPage` para scroll infinito

**¿Cómo funciona el scroll infinito?**
```typescript
const {
  data,           // Páginas de datos
  fetchNextPage,  // Función para cargar siguiente página
  hasNextPage,    // Boolean si hay más páginas
  isFetchingNextPage // Loading de siguiente página
} = useInfiniteQuery({
  queryKey: ['pokemon', 'list'],
  queryFn: ({ pageParam = 0 }) => getPokemonList({ offset: pageParam }),
  getNextPageParam: (lastPage) => lastPage.hasNextPage ? lastPage.nextOffset : undefined
});
```

### usePokemonDetail.ts - Detalles Individuales

**¿Qué hace?**
Hook para obtener detalles completos de un Pokémon específico.

**Optimizaciones:**
- Caché de 15 minutos (datos estáticos)
- Transformación automática de tipos
- Estados de loading/error específicos

### usePokemonSearch.ts - Búsqueda

**¿Qué hace?**
Hook para búsqueda de Pokémon con debounce integrado.

**Lógica de búsqueda:**
- Solo busca con mínimo 2 caracteres
- Debounce de 300ms
- Estados independientes de la lista principal
- No reintentos automáticos (evita spam)

### useDebounce.ts - Utilidad de Debounce

**¿Qué hace?**
Hook que retrasa la actualización de un valor hasta que deje de cambiar.

**¿Por qué es importante?**
- Evita llamadas excesivas a la API
- Mejora performance de búsqueda
- Reduce carga del servidor
- Mejor experiencia de usuario

**Funcionamiento:**
```typescript
const [searchQuery, setSearchQuery] = useState('');
const debouncedQuery = useDebounce(searchQuery, 300);

// Solo cuando debouncedQuery cambia se ejecuta la búsqueda
useEffect(() => {
  if (debouncedQuery.length >= 2) {
    performSearch(debouncedQuery);
  }
}, [debouncedQuery]);
```

---

## 🎨 Componentes UI

### Componentes Comunes

#### LoadingSpinner.tsx
**¿Qué hace?** Muestra indicador de carga con mensaje opcional.
**¿Cuándo usar?** Estados de carga inicial de pantallas.

#### ErrorMessage.tsx
**¿Qué hace?** Muestra errores con botón de reintentar.
**¿Cuándo usar?** Cuando fallan requests de API.

#### EmptyState.tsx
**¿Qué hace?** Muestra estados vacíos con iconos y mensajes.
**¿Cuándo usar?** Búsquedas sin resultados, listas vacías.

#### SearchBar.tsx
**¿Qué hace?** Input de búsqueda con botón limpiar e indicador de carga.
**Características:**
- Debounce integrado
- Botón X para limpiar
- Indicador de carga durante búsqueda
- Estilos consistentes

### Componentes de Pokémon

#### PokemonCard.tsx
**¿Qué hace?** Tarjeta individual para lista de Pokémon.
**Características:**
- Imagen optimizada con FastImage
- Botón de favorito
- Badges de tipos coloridos
- Touch feedback
- Layout responsive (2 columnas)

#### PokemonStats.tsx
**¿Qué hace?** Muestra estadísticas con barras de progreso.
**¿Cómo funciona?**
```typescript
const percentage = (stat.value / stat.maxValue) * 100;
const color = getStatColor(percentage); // Verde/Amarillo/Naranja/Rojo
```

#### PokemonTypes.tsx
**¿Qué hace?** Badges coloridos para tipos de Pokémon.
**¿Por qué colores específicos?** Cada tipo tiene color oficial del juego.

#### PokemonImage.tsx
**¿Qué hace?** Componente optimizado para imágenes de Pokémon.
**Características:**
- Estados de loading/error
- Fallback para imágenes rotas
- Optimización con FastImage
- Tamaño configurable

---

## 🧭 Navegación

### AppNavigator.tsx - Navegador Principal

**¿Qué hace?**
Configura la navegación principal de la aplicación usando React Navigation.

**Estructura:**
```typescript
<NavigationContainer>
  <Stack.Navigator>
    <Stack.Screen name="PokemonList" component={PokemonListScreen} />
    <Stack.Screen name="PokemonDetail" component={PokemonDetailScreen} />
  </Stack.Navigator>
</NavigationContainer>
```

**¿Por qué Stack Navigator?**
- Navegación nativa iOS/Android
- Transiciones automáticas
- Gestión de historial
- Headers configurables
- Gestos nativos

### navigationUtils.ts - Utilidades

**¿Qué hace?**
Funciones helper para navegación tipada y segura.

**Funciones principales:**
- `navigateToPokemonDetail()`: Navegar a detalle con parámetros
- `goBack()`: Regresar con validación
- `resetToHome()`: Reset del stack

**¿Por qué utilidades?**
- Navegación tipada con TypeScript
- Reutilización de lógica
- Validaciones centralizadas
- Fácil refactoring

---

## 📝 Tipos TypeScript

### pokemon.types.ts - Tipos de Dominio

**¿Qué hace?**
Define los tipos que usa la aplicación (no los de la API).

**Diferencia API vs Dominio:**
```typescript
// Tipo de API (crudo)
interface PokemonApiResponse {
  id: number;
  name: string;
  sprites: { front_default: string };
  types: Array<{ type: { name: string } }>;
}

// Tipo de Dominio (transformado)
interface Pokemon {
  id: number;
  name: string;
  imageUrl: string;
  types: PokemonType[];
  isFavorite: boolean;
}
```

### transformers.ts - Transformadores de Datos

**¿Qué hace?**
Convierte datos de la API a tipos de dominio de la aplicación.

**¿Por qué transformar?**
- API puede cambiar sin afectar la app
- Datos optimizados para UI
- Agregar campos calculados (isFavorite)
- Validación y limpieza de datos

**Ejemplo:**
```typescript
export const transformPokemonDetail = (
  apiResponse: PokemonDetailResponse,
  isFavorite: boolean = false
): PokemonDetail => {
  return {
    id: apiResponse.id,
    name: apiResponse.name,
    imageUrl: apiResponse.sprites.other?.['official-artwork']?.front_default || '',
    types: transformPokemonTypes(apiResponse.types),
    isFavorite,
    // ... más transformaciones
  };
};
```

---

## ⚙️ Configuración y Setup

### tsconfig.json - TypeScript

**Configuraciones clave:**
```json
{
  "compilerOptions": {
    "baseUrl": "./src",
    "paths": {
      "@/*": ["*"]
    },
    "strict": true
  }
}
```

**¿Por qué estas configuraciones?**
- `baseUrl + paths`: Imports absolutos (`@/components` vs `../../../components`)
- `strict: true`: Máxima seguridad de tipos
- Path mapping: Imports más limpios y refactoring fácil

### metro.config.js - Metro Bundler

**¿Qué hace?**
Configura el bundler de React Native para resolver alias de rutas.

```javascript
const config = {
  resolver: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },
};
```

### package.json - Scripts y Dependencias

**Scripts principales:**
- `npm start`: Inicia Metro bundler
- `npm run android`: Compila y ejecuta en Android
- `npm run ios`: Compila y ejecuta en iOS
- `npm run lint`: Ejecuta ESLint

---

## 🔧 Desarrollo y Compilación

### Levantar el Servicio de Desarrollo

#### 1. Preparación Inicial (Solo primera vez)

```bash
# Clonar el repositorio
git clone <repository-url>
cd PokemonApp

# Instalar dependencias
npm install

# Solo para iOS (macOS únicamente)
cd ios && pod install && cd ..
```

#### 2. Iniciar Metro Bundler

```bash
# Terminal 1: Iniciar Metro (obligatorio)
npm start
# o
npx react-native start

# Para limpiar caché si hay problemas
npm start -- --reset-cache
```

#### 3. Ejecutar en Dispositivo/Emulador

```bash
# Terminal 2: Android
npm run android
# o
npx react-native run-android

# Terminal 2: iOS (solo macOS)
npm run ios
# o
npx react-native run-ios
```

### Flujo de Desarrollo Típico

#### Desarrollo Normal (Hot Reload)
1. **Metro corriendo**: Mantener `npm start` ejecutándose
2. **Hacer cambios**: Editar archivos en `src/`
3. **Auto-reload**: Los cambios se reflejan automáticamente
4. **Fast Refresh**: Mantiene el estado de la app

#### Cuando Agregar Dependencias
```bash
# Instalar nueva dependencia
npm install nueva-dependencia

# Solo para iOS: Actualizar pods
cd ios && pod install && cd ..

# Reiniciar Metro
npm start -- --reset-cache
```

#### Cuando Cambiar Configuración Nativa
```bash
# Limpiar build de Android
cd android && ./gradlew clean && cd ..

# Limpiar build de iOS
cd ios && xcodebuild clean && cd ..

# Reinstalar y ejecutar
npm install
npm run android # o npm run ios
```

### Compilación para Producción

#### Android Release
```bash
# Generar APK de release
cd android
./gradlew assembleRelease

# APK estará en: android/app/build/outputs/apk/release/
```

#### iOS Release
```bash
# Abrir en Xcode
open ios/PokemonApp.xcworkspace

# En Xcode:
# 1. Seleccionar esquema "Release"
# 2. Product → Archive
# 3. Distribuir a App Store o Ad Hoc
```

### Actualización de Código en Desarrollo

#### Cambios en JavaScript/TypeScript
```bash
# Los cambios se reflejan automáticamente con Fast Refresh
# No necesitas hacer nada especial
```

#### Cambios en Dependencias
```bash
# Después de npm install
npm start -- --reset-cache
npm run android # o ios
```

#### Cambios en Configuración Nativa
```bash
# Limpiar todo y recompilar
npm run clean  # si tienes este script
# o manualmente:
rm -rf node_modules
npm install
cd ios && pod install && cd .. # solo iOS
npm start -- --reset-cache
npm run android
```

### Debugging y Herramientas

#### React Native Debugger
```bash
# Instalar React Native Debugger
# En el dispositivo/emulador: Cmd+D (iOS) o Cmd+M (Android)
# Seleccionar "Debug"
```

#### Flipper (Recomendado)
```bash
# Flipper se conecta automáticamente
# Permite inspeccionar:
# - Network requests
# - AsyncStorage
# - React DevTools
# - Logs
```

#### Logs en Tiempo Real
```bash
# Android logs
npx react-native log-android

# iOS logs
npx react-native log-ios
```

---

## 🚨 Troubleshooting

### Problemas Comunes y Soluciones

#### Metro no inicia o errores de caché
```bash
# Limpiar caché de Metro
npx react-native start --reset-cache

# Limpiar caché de npm
npm start -- --reset-cache

# Limpiar todo
rm -rf node_modules
npm install
```

#### Errores de dependencias nativas
```bash
# Android: Limpiar build
cd android && ./gradlew clean && cd ..

# iOS: Reinstalar pods
cd ios && rm -rf Pods && pod install && cd ..

# Reinstalar node_modules
rm -rf node_modules && npm install
```

#### App no se conecta a Metro
```bash
# Verificar que Metro esté corriendo en puerto 8081
# En Android: Shake device → Settings → Debug server host
# Poner: localhost:8081

# En iOS: Device menu → Configure Bundler
# Poner: localhost:8081
```

#### Errores de TypeScript
```bash
# Verificar configuración
npx tsc --noEmit

# Limpiar caché de TypeScript
rm -rf node_modules/.cache
npm start -- --reset-cache
```

#### Problemas de performance
```bash
# Habilitar Hermes (ya habilitado por defecto en RN 0.70+)
# Verificar en android/app/build.gradle:
# enableHermes: true

# Optimizar imágenes
# Usar react-native-fast-image (ya implementado)

# Optimizar listas
# Usar FlatList con props de optimización (ya implementado)
```

### Comandos de Limpieza Completa

```bash
# Script de limpieza total (crear como npm script)
#!/bin/bash
echo "🧹 Limpiando proyecto completo..."

# Limpiar node_modules
rm -rf node_modules
echo "✅ node_modules eliminado"

# Limpiar caché de npm
npm cache clean --force
echo "✅ Caché de npm limpiado"

# Limpiar Metro
rm -rf /tmp/metro-*
echo "✅ Caché de Metro limpiado"

# Limpiar Android
cd android && ./gradlew clean && cd ..
echo "✅ Build de Android limpiado"

# Limpiar iOS (solo macOS)
if [[ "$OSTYPE" == "darwin"* ]]; then
  cd ios && rm -rf Pods Podfile.lock && cd ..
  echo "✅ Pods de iOS limpiados"
fi

# Reinstalar
npm install
echo "✅ Dependencias reinstaladas"

# Reinstalar pods iOS
if [[ "$OSTYPE" == "darwin"* ]]; then
  cd ios && pod install && cd ..
  echo "✅ Pods de iOS reinstalados"
fi

echo "🎉 Limpieza completa terminada!"
echo "Ahora ejecuta: npm start"
```

### Monitoreo de Performance

#### Herramientas de Profiling
```bash
# Flipper Performance Monitor
# React DevTools Profiler
# Xcode Instruments (iOS)
# Android Studio Profiler
```

#### Métricas a Monitorear
- **Tiempo de carga inicial**: < 3 segundos
- **FPS durante scroll**: 60 FPS consistente
- **Uso de memoria**: < 100MB promedio
- **Tamaño de bundle**: Optimizado con Hermes

---

## 📊 Flujo de Datos Completo

### Ejemplo: Cargar Lista de Pokémon

```
1. Usuario abre app
   ↓
2. PokemonListScreen se monta
   ↓
3. usePokemons hook se ejecuta
   ↓
4. useInfiniteQuery hace request
   ↓
5. apiClient.get('/pokemon?offset=0&limit=20')
   ↓
6. PokéAPI responde con datos
   ↓
7. transformPokemonListResponse() transforma datos
   ↓
8. React Query cachea resultado
   ↓
9. Hook retorna datos transformados
   ↓
10. Component re-renderiza con datos
    ↓
11. FlatList muestra PokemonCards
    ↓
12. useFavorites sincroniza favoritos
    ↓
13. UI actualizada con favoritos
```

### Ejemplo: Marcar Favorito

```
1. Usuario toca corazón en PokemonCard
   ↓
2. handleFavoritePress() se ejecuta
   ↓
3. toggleFavorite() del store Zustand
   ↓
4. Store actualiza Set de favoritos
   ↓
5. saveFavoritesToStorage() guarda en AsyncStorage
   ↓
6. Store notifica cambio a subscribers
   ↓
7. Componentes re-renderizan
   ↓
8. UI muestra corazón rojo/gris actualizado
```

---

Esta documentación técnica proporciona una comprensión completa del funcionamiento interno de PokemonApp, desde la arquitectura general hasta los detalles de implementación y flujos de desarrollo. Cada sección explica el "qué", "por qué" y "cómo" de cada parte del sistema, facilitando el mantenimiento y la extensión del proyecto.
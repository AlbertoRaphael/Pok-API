# 🚀 Guía de Desarrollo y Deployment - PokemonApp

## 📋 Índice Rápido

1. [Setup Inicial](#-setup-inicial)
2. [Desarrollo Diario](#-desarrollo-diario)
3. [Comandos Esenciales](#-comandos-esenciales)
4. [Debugging](#-debugging)
5. [Testing](#-testing)
6. [Build y Release](#-build-y-release)
7. [Deployment](#-deployment)
8. [Mantenimiento](#-mantenimiento)

---

## 🛠️ Setup Inicial

### Prerrequisitos del Sistema

#### Windows
```bash
# Instalar Node.js (LTS)
# Descargar desde: https://nodejs.org/

# Instalar Android Studio
# Descargar desde: https://developer.android.com/studio

# Configurar variables de entorno
ANDROID_HOME=C:\Users\%USERNAME%\AppData\Local\Android\Sdk
JAVA_HOME=C:\Program Files\Android\Android Studio\jre

# Agregar al PATH
%ANDROID_HOME%\platform-tools
%ANDROID_HOME%\tools
%ANDROID_HOME%\tools\bin
```

#### macOS (para iOS)
```bash
# Instalar Xcode desde App Store
# Instalar Command Line Tools
xcode-select --install

# Instalar Homebrew
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"

# Instalar Node.js
brew install node

# Instalar CocoaPods
sudo gem install cocoapods
```

### Configuración del Proyecto

#### 1. Clonar y Setup Inicial
```bash
# Clonar repositorio
git clone <repository-url>
cd PokemonApp

# Verificar versión de Node
node --version  # Debe ser >= 18

# Instalar dependencias
npm install

# Verificar instalación
npm run lint
```

#### 2. Setup Android
```bash
# Verificar Android SDK
npx react-native doctor

# Crear AVD (Android Virtual Device)
# Abrir Android Studio → AVD Manager → Create Virtual Device
# Recomendado: Pixel 4 con API 30+

# Verificar que funciona
npx react-native run-android --list-devices
```

#### 3. Setup iOS (solo macOS)
```bash
# Instalar pods
cd ios && pod install && cd ..

# Verificar simuladores disponibles
npx react-native run-ios --list-devices

# Abrir en Xcode para verificar
open ios/PokemonApp.xcworkspace
```

---

## 💻 Desarrollo Diario

### Flujo de Trabajo Típico

#### Iniciar Desarrollo
```bash
# Terminal 1: Metro Bundler (SIEMPRE primero)
npm start

# Terminal 2: Ejecutar app
npm run android  # o npm run ios

# Terminal 3: Logs (opcional)
npx react-native log-android  # o log-ios
```

#### Durante Desarrollo
```bash
# Hot Reload automático para cambios en JS/TS
# Fast Refresh mantiene el estado de la app

# Para recargar completamente (si es necesario)
# Android: Doble R o Cmd+R
# iOS: Cmd+R

# Abrir Dev Menu
# Android: Cmd+M o shake device
# iOS: Cmd+D o shake device
```

#### Agregar Nueva Funcionalidad

1. **Crear rama de feature**
```bash
git checkout -b feature/nueva-funcionalidad
```

2. **Desarrollo incremental**
```bash
# Hacer cambios pequeños y frecuentes
# Verificar que compila
npx tsc --noEmit

# Verificar linting
npm run lint

# Commit frecuente
git add .
git commit -m "feat: agregar nueva funcionalidad"
```

3. **Testing local**
```bash
# Probar en ambas plataformas
npm run android
npm run ios

# Verificar en diferentes dispositivos/simuladores
```

### Estructura de Commits

```bash
# Tipos de commit
feat: nueva funcionalidad
fix: corrección de bug
docs: cambios en documentación
style: cambios de formato (no afectan lógica)
refactor: refactoring de código
test: agregar o modificar tests
chore: tareas de mantenimiento

# Ejemplos
git commit -m "feat: agregar búsqueda de pokémon"
git commit -m "fix: corregir error en favoritos"
git commit -m "refactor: optimizar componente PokemonCard"
```

---

## ⚡ Comandos Esenciales

### Comandos de Desarrollo

```bash
# Iniciar desarrollo
npm start                    # Metro bundler
npm run android             # Ejecutar Android
npm run ios                 # Ejecutar iOS

# Linting y formato
npm run lint                # ESLint
npm run lint:fix            # Auto-fix ESLint
npm run format              # Prettier (si está configurado)

# TypeScript
npx tsc --noEmit           # Verificar tipos sin compilar
npx tsc --watch            # Watch mode para tipos

# Limpieza
npm start -- --reset-cache # Limpiar caché Metro
rm -rf node_modules && npm install  # Reinstalar dependencias
```

### Comandos de Limpieza

```bash
# Limpieza ligera (problemas menores)
npm start -- --reset-cache

# Limpieza media (problemas de dependencias)
rm -rf node_modules
npm install
npm start -- --reset-cache

# Limpieza completa (problemas graves)
rm -rf node_modules
rm package-lock.json
npm cache clean --force
npm install
cd ios && rm -rf Pods Podfile.lock && pod install && cd ..  # solo iOS
cd android && ./gradlew clean && cd ..
npm start -- --reset-cache
```

### Comandos de Debugging

```bash
# Logs en tiempo real
npx react-native log-android
npx react-native log-ios

# Información del dispositivo
adb devices                 # Android devices
xcrun simctl list devices   # iOS simulators

# Network debugging
# Usar Flipper o React Native Debugger
```

---

## 🐛 Debugging

### Herramientas de Debug

#### 1. React Native Debugger
```bash
# Instalar
npm install -g react-native-debugger

# Usar
# En app: Dev Menu → Debug
# Abre automáticamente React Native Debugger
```

#### 2. Flipper (Recomendado)
```bash
# Descargar desde: https://fbflipper.com/
# Se conecta automáticamente

# Plugins útiles:
# - React DevTools
# - Network
# - Databases (AsyncStorage)
# - Logs
# - Layout Inspector
```

#### 3. Chrome DevTools
```bash
# En app: Dev Menu → Debug
# Abre Chrome en: chrome://inspect
```

### Debugging Específico

#### AsyncStorage
```javascript
// Ver datos en Flipper → Databases
// O usar comandos directos:
import AsyncStorage from '@react-native-async-storage/async-storage';

// Ver todos los keys
AsyncStorage.getAllKeys().then(keys => console.log(keys));

// Ver valor específico
AsyncStorage.getItem('@pokemon_favorites').then(value => console.log(value));
```

#### React Query
```javascript
// En React Query DevTools (si está habilitado)
// O logs manuales:
console.log('Query data:', data);
console.log('Query error:', error);
console.log('Query status:', status);
```

#### Zustand Store
```javascript
// Logs del store
const store = useFavoritesStore.getState();
console.log('Current favorites:', store.favorites);
console.log('Store state:', store);
```

### Debugging de Performance

#### Identificar Re-renders
```javascript
// Usar React DevTools Profiler
// O agregar logs manuales:
useEffect(() => {
  console.log('Component re-rendered:', componentName);
});
```

#### Memory Leaks
```bash
# Usar Xcode Instruments (iOS)
# Usar Android Studio Profiler (Android)
# Monitorear en Flipper
```

---

## 🧪 Testing

### Setup de Testing

```bash
# Jest ya viene configurado
# Instalar testing utilities adicionales
npm install --save-dev @testing-library/react-native
npm install --save-dev @testing-library/jest-native
```

### Ejecutar Tests

```bash
# Todos los tests
npm test

# Watch mode
npm run test:watch

# Coverage
npm run test:coverage

# Tests específicos
npm test -- PokemonCard.test.tsx
```

### Estructura de Tests

```
__tests__/
├── components/
│   ├── PokemonCard.test.tsx
│   └── SearchBar.test.tsx
├── hooks/
│   ├── usePokemons.test.tsx
│   └── useDebounce.test.tsx
├── utils/
│   └── transformers.test.tsx
└── integration/
    └── PokemonFlow.test.tsx
```

### Ejemplo de Test

```typescript
// __tests__/components/PokemonCard.test.tsx
import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import PokemonCard from '../../src/components/pokemon/PokemonCard';

const mockPokemon = {
  id: 1,
  name: 'pikachu',
  imageUrl: 'https://example.com/pikachu.png',
  types: [{ name: 'electric', color: '#F8D030' }],
  isFavorite: false,
};

describe('PokemonCard', () => {
  it('renders pokemon information correctly', () => {
    const { getByText } = render(
      <PokemonCard pokemon={mockPokemon} onPress={jest.fn()} />
    );
    
    expect(getByText('Pikachu')).toBeTruthy();
    expect(getByText('Electric')).toBeTruthy();
  });

  it('calls onPress when tapped', () => {
    const onPress = jest.fn();
    const { getByTestId } = render(
      <PokemonCard pokemon={mockPokemon} onPress={onPress} />
    );
    
    fireEvent.press(getByTestId('pokemon-card'));
    expect(onPress).toHaveBeenCalledWith(mockPokemon);
  });
});
```

---

## 📦 Build y Release

### Build de Desarrollo

```bash
# Android Debug
npm run android

# iOS Debug
npm run ios

# Con dispositivo específico
npx react-native run-android --device
npx react-native run-ios --device "iPhone 13"
```

### Build de Release

#### Android Release

```bash
# 1. Generar keystore (solo primera vez)
keytool -genkeypair -v -storetype PKCS12 -keystore my-upload-key.keystore -alias my-key-alias -keyalg RSA -keysize 2048 -validity 10000

# 2. Configurar gradle.properties
echo "MYAPP_UPLOAD_STORE_FILE=my-upload-key.keystore" >> android/gradle.properties
echo "MYAPP_UPLOAD_KEY_ALIAS=my-key-alias" >> android/gradle.properties
echo "MYAPP_UPLOAD_STORE_PASSWORD=****" >> android/gradle.properties
echo "MYAPP_UPLOAD_KEY_PASSWORD=****" >> android/gradle.properties

# 3. Build release
cd android
./gradlew assembleRelease

# APK estará en: android/app/build/outputs/apk/release/app-release.apk
```

#### iOS Release

```bash
# 1. Abrir en Xcode
open ios/PokemonApp.xcworkspace

# 2. En Xcode:
# - Seleccionar esquema "Release"
# - Product → Archive
# - Window → Organizer
# - Distribute App

# 3. O desde línea de comandos
xcodebuild -workspace ios/PokemonApp.xcworkspace -scheme PokemonApp -configuration Release -destination generic/platform=iOS -archivePath PokemonApp.xcarchive archive
```

### Optimización de Bundle

#### Android
```bash
# Habilitar Proguard (ya configurado)
# android/app/build.gradle:
# minifyEnabled true
# shrinkResources true

# Verificar tamaño
./gradlew bundleRelease
# Bundle estará en: android/app/build/outputs/bundle/release/
```

#### iOS
```bash
# Optimizaciones automáticas en Release
# Bitcode habilitado por defecto
# App Thinning automático en App Store
```

---

## 🚀 Deployment

### Preparación para Release

#### 1. Checklist Pre-Release
```bash
# ✅ Todos los tests pasan
npm test

# ✅ No errores de TypeScript
npx tsc --noEmit

# ✅ No errores de linting
npm run lint

# ✅ Build de release funciona
npm run android --variant=release
npm run ios --configuration Release

# ✅ Funciona en dispositivos reales
# ✅ Performance aceptable
# ✅ Todas las funcionalidades probadas
```

#### 2. Versionado
```bash
# Actualizar versión en package.json
npm version patch  # 1.0.0 → 1.0.1
npm version minor  # 1.0.0 → 1.1.0
npm version major  # 1.0.0 → 2.0.0

# Android: actualizar versionCode y versionName en build.gradle
# iOS: actualizar CFBundleVersion y CFBundleShortVersionString
```

### Google Play Store (Android)

#### 1. Preparación
```bash
# Generar App Bundle (recomendado)
cd android
./gradlew bundleRelease

# O generar APK
./gradlew assembleRelease
```

#### 2. Upload
```bash
# 1. Ir a Google Play Console
# 2. Crear nueva app o nueva release
# 3. Subir AAB/APK
# 4. Completar información de la store
# 5. Configurar testing interno/cerrado
# 6. Publicar
```

### App Store (iOS)

#### 1. Preparación
```bash
# 1. Configurar App Store Connect
# 2. Crear App ID en Developer Portal
# 3. Configurar provisioning profiles
```

#### 2. Archive y Upload
```bash
# En Xcode:
# 1. Product → Archive
# 2. Window → Organizer
# 3. Distribute App → App Store Connect
# 4. Upload

# O usar Transporter app
# O usar altool (deprecated)
```

### Distribución Interna

#### TestFlight (iOS)
```bash
# Después de upload a App Store Connect:
# 1. Ir a TestFlight tab
# 2. Agregar testers internos/externos
# 3. Enviar invitaciones
```

#### Firebase App Distribution
```bash
# Instalar CLI
npm install -g firebase-tools

# Login
firebase login

# Distribuir Android
firebase appdistribution:distribute android/app/build/outputs/apk/release/app-release.apk --app YOUR_APP_ID --groups testers

# Distribuir iOS
firebase appdistribution:distribute PokemonApp.ipa --app YOUR_APP_ID --groups testers
```

---

## 🔧 Mantenimiento

### Actualizaciones Regulares

#### Dependencias
```bash
# Verificar dependencias desactualizadas
npm outdated

# Actualizar dependencias menores
npm update

# Actualizar dependencias mayores (cuidado)
npm install package@latest

# Verificar vulnerabilidades
npm audit
npm audit fix
```

#### React Native
```bash
# Verificar versión actual
npx react-native --version

# Actualizar React Native (proceso complejo)
# Seguir guía oficial: https://react-native-community.github.io/upgrade-helper/
npx react-native upgrade
```

### Monitoreo de Performance

#### Métricas Clave
```bash
# Tiempo de carga inicial: < 3 segundos
# FPS durante scroll: 60 FPS
# Uso de memoria: < 100MB
# Tamaño de app: < 50MB
# Crash rate: < 1%
```

#### Herramientas de Monitoreo
```bash
# Crashlytics (Firebase)
# Sentry
# Bugsnag
# New Relic Mobile
```

### Backup y Versionado

#### Git Workflow
```bash
# Branches principales
main          # Producción
develop       # Desarrollo
feature/*     # Features
hotfix/*      # Fixes urgentes
release/*     # Preparación releases

# Tags para releases
git tag -a v1.0.0 -m "Release version 1.0.0"
git push origin v1.0.0
```

#### Backup de Configuraciones
```bash
# Keystore Android (CRÍTICO)
# Provisioning Profiles iOS
# Certificados de firma
# Variables de entorno
# Configuraciones de CI/CD
```

### Resolución de Problemas Comunes

#### App no inicia después de actualización
```bash
# 1. Limpiar caché completo
rm -rf node_modules
npm install
npm start -- --reset-cache

# 2. Limpiar builds nativos
cd android && ./gradlew clean && cd ..
cd ios && rm -rf Pods && pod install && cd ..

# 3. Verificar breaking changes en dependencias
```

#### Performance degradada
```bash
# 1. Profiling con Flipper
# 2. Verificar memory leaks
# 3. Optimizar imágenes
# 4. Revisar re-renders innecesarios
# 5. Actualizar a versiones optimizadas
```

#### Crashes en producción
```bash
# 1. Revisar crash reports
# 2. Reproducir localmente
# 3. Agregar logging adicional
# 4. Hotfix si es crítico
# 5. Release patch
```

---

## 📊 Métricas y KPIs

### Métricas de Desarrollo
- **Build time**: < 2 minutos
- **Hot reload time**: < 3 segundos
- **Test coverage**: > 80%
- **TypeScript errors**: 0
- **ESLint warnings**: 0

### Métricas de Producción
- **App size**: < 50MB
- **Cold start time**: < 3 segundos
- **Memory usage**: < 100MB
- **Crash rate**: < 1%
- **ANR rate**: < 0.5%

### Métricas de Usuario
- **Session duration**: > 2 minutos
- **Retention rate**: > 60% (día 1)
- **User rating**: > 4.0 estrellas
- **Feature adoption**: > 70%

---

Esta guía proporciona todo lo necesario para desarrollar, mantener y desplegar PokemonApp de manera profesional, desde el setup inicial hasta el deployment en las stores, incluyendo mejores prácticas y solución de problemas comunes.
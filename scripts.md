# 🛠️ Scripts Útiles - PokemonApp

## Scripts de Package.json

Agregar estos scripts al `package.json` para facilitar el desarrollo:

```json
{
  "scripts": {
    "start": "react-native start",
    "android": "react-native run-android",
    "ios": "react-native run-ios",
    "lint": "eslint .",
    "lint:fix": "eslint . --fix",
    "test": "jest",
    "test:watch": "jest --watch",
    "test:coverage": "jest --coverage",
    "type-check": "tsc --noEmit",
    "type-check:watch": "tsc --noEmit --watch",
    "clean": "npm run clean:metro && npm run clean:android && npm run clean:ios",
    "clean:metro": "npx react-native start --reset-cache",
    "clean:android": "cd android && ./gradlew clean && cd ..",
    "clean:ios": "cd ios && xcodebuild clean && cd ..",
    "clean:all": "rm -rf node_modules && npm install && npm run clean",
    "build:android": "cd android && ./gradlew assembleRelease && cd ..",
    "build:ios": "npx react-native run-ios --configuration Release",
    "bundle:android": "cd android && ./gradlew bundleRelease && cd ..",
    "logs:android": "npx react-native log-android",
    "logs:ios": "npx react-native log-ios",
    "devices:android": "adb devices",
    "devices:ios": "xcrun simctl list devices",
    "doctor": "npx react-native doctor"
  }
}
```

## Scripts de Shell

### Script de Limpieza Completa

Crear archivo `clean.sh`:

```bash
#!/bin/bash
echo "🧹 Iniciando limpieza completa de PokemonApp..."

# Función para mostrar progreso
show_progress() {
    echo "✅ $1"
}

# Limpiar node_modules
if [ -d "node_modules" ]; then
    rm -rf node_modules
    show_progress "node_modules eliminado"
fi

# Limpiar package-lock.json
if [ -f "package-lock.json" ]; then
    rm package-lock.json
    show_progress "package-lock.json eliminado"
fi

# Limpiar caché de npm
npm cache clean --force
show_progress "Caché de npm limpiado"

# Limpiar caché de Metro
rm -rf /tmp/metro-*
show_progress "Caché de Metro limpiado"

# Limpiar Android
if [ -d "android" ]; then
    cd android && ./gradlew clean && cd ..
    show_progress "Build de Android limpiado"
fi

# Limpiar iOS (solo en macOS)
if [[ "$OSTYPE" == "darwin"* ]] && [ -d "ios" ]; then
    cd ios
    if [ -d "Pods" ]; then
        rm -rf Pods
    fi
    if [ -f "Podfile.lock" ]; then
        rm Podfile.lock
    fi
    cd ..
    show_progress "Pods de iOS limpiados"
fi

# Reinstalar dependencias
npm install
show_progress "Dependencias reinstaladas"

# Reinstalar pods iOS (solo en macOS)
if [[ "$OSTYPE" == "darwin"* ]] && [ -d "ios" ]; then
    cd ios && pod install && cd ..
    show_progress "Pods de iOS reinstalados"
fi

echo "🎉 Limpieza completa terminada!"
echo "Ejecuta: npm start"
```

### Script de Setup Inicial

Crear archivo `setup.sh`:

```bash
#!/bin/bash
echo "🚀 Configurando PokemonApp por primera vez..."

# Verificar Node.js
if ! command -v node &> /dev/null; then
    echo "❌ Node.js no está instalado"
    echo "Instala Node.js desde: https://nodejs.org/"
    exit 1
fi

NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    echo "❌ Node.js versión 18+ requerida. Versión actual: $(node -v)"
    exit 1
fi

echo "✅ Node.js $(node -v) detectado"

# Verificar npm
if ! command -v npm &> /dev/null; then
    echo "❌ npm no está disponible"
    exit 1
fi

echo "✅ npm $(npm -v) detectado"

# Instalar dependencias
echo "📦 Instalando dependencias..."
npm install

# Setup iOS (solo en macOS)
if [[ "$OSTYPE" == "darwin"* ]]; then
    if command -v pod &> /dev/null; then
        echo "📱 Configurando iOS..."
        cd ios && pod install && cd ..
        echo "✅ iOS configurado"
    else
        echo "⚠️  CocoaPods no instalado. Ejecuta: sudo gem install cocoapods"
    fi
fi

# Verificar Android SDK (opcional)
if [ -n "$ANDROID_HOME" ]; then
    echo "✅ Android SDK detectado en: $ANDROID_HOME"
else
    echo "⚠️  ANDROID_HOME no configurado. Configura Android SDK para desarrollo Android"
fi

# Verificar que todo funciona
echo "🔍 Verificando configuración..."
npx react-native doctor

echo "🎉 Setup completado!"
echo "Para iniciar desarrollo:"
echo "  npm start"
echo "  npm run android  # o npm run ios"
```

### Script de Build Release

Crear archivo `build-release.sh`:

```bash
#!/bin/bash

# Función para mostrar ayuda
show_help() {
    echo "Uso: ./build-release.sh [android|ios|both]"
    echo ""
    echo "Opciones:"
    echo "  android  - Build solo para Android"
    echo "  ios      - Build solo para iOS (solo macOS)"
    echo "  both     - Build para ambas plataformas"
    echo ""
    echo "Ejemplo: ./build-release.sh android"
}

# Verificar parámetros
if [ $# -eq 0 ]; then
    show_help
    exit 1
fi

PLATFORM=$1

# Función para build Android
build_android() {
    echo "🤖 Iniciando build de Android Release..."
    
    # Verificar que existe el proyecto Android
    if [ ! -d "android" ]; then
        echo "❌ Directorio android no encontrado"
        exit 1
    fi
    
    # Limpiar build anterior
    cd android && ./gradlew clean
    
    # Build release
    ./gradlew assembleRelease
    
    if [ $? -eq 0 ]; then
        echo "✅ Build de Android completado"
        echo "📱 APK disponible en: android/app/build/outputs/apk/release/"
        
        # Mostrar información del APK
        APK_PATH="app/build/outputs/apk/release/app-release.apk"
        if [ -f "$APK_PATH" ]; then
            APK_SIZE=$(du -h "$APK_PATH" | cut -f1)
            echo "📊 Tamaño del APK: $APK_SIZE"
        fi
    else
        echo "❌ Error en build de Android"
        exit 1
    fi
    
    cd ..
}

# Función para build iOS
build_ios() {
    if [[ "$OSTYPE" != "darwin"* ]]; then
        echo "❌ Build de iOS solo disponible en macOS"
        exit 1
    fi
    
    echo "🍎 Iniciando build de iOS Release..."
    
    # Verificar que existe el proyecto iOS
    if [ ! -d "ios" ]; then
        echo "❌ Directorio ios no encontrado"
        exit 1
    fi
    
    # Verificar Xcode
    if ! command -v xcodebuild &> /dev/null; then
        echo "❌ Xcode no está instalado"
        exit 1
    fi
    
    # Build release
    npx react-native run-ios --configuration Release
    
    if [ $? -eq 0 ]; then
        echo "✅ Build de iOS completado"
        echo "📱 Para crear IPA, usar Xcode: Product → Archive"
    else
        echo "❌ Error en build de iOS"
        exit 1
    fi
}

# Ejecutar según plataforma
case $PLATFORM in
    android)
        build_android
        ;;
    ios)
        build_ios
        ;;
    both)
        build_android
        echo ""
        build_ios
        ;;
    *)
        echo "❌ Plataforma no válida: $PLATFORM"
        show_help
        exit 1
        ;;
esac

echo "🎉 Build release completado para: $PLATFORM"
```

### Script de Testing

Crear archivo `test.sh`:

```bash
#!/bin/bash

echo "🧪 Ejecutando suite completa de tests..."

# Función para mostrar resultados
show_result() {
    if [ $1 -eq 0 ]; then
        echo "✅ $2 - PASÓ"
    else
        echo "❌ $2 - FALLÓ"
        FAILED=true
    fi
}

FAILED=false

# TypeScript type checking
echo "🔍 Verificando tipos TypeScript..."
npx tsc --noEmit
show_result $? "TypeScript"

# ESLint
echo "🔍 Verificando linting..."
npm run lint
show_result $? "ESLint"

# Jest tests
echo "🔍 Ejecutando tests unitarios..."
npm test -- --watchAll=false
show_result $? "Tests Unitarios"

# Test coverage (opcional)
echo "🔍 Generando coverage report..."
npm run test:coverage -- --watchAll=false
show_result $? "Coverage Report"

# Verificar que la app compila
echo "🔍 Verificando que la app compila..."
npx react-native bundle --platform android --dev false --entry-file index.js --bundle-output /tmp/test-bundle.js
show_result $? "Bundle Android"

if [[ "$OSTYPE" == "darwin"* ]]; then
    npx react-native bundle --platform ios --dev false --entry-file index.js --bundle-output /tmp/test-bundle-ios.js
    show_result $? "Bundle iOS"
fi

# Resultado final
if [ "$FAILED" = true ]; then
    echo ""
    echo "❌ Algunos tests fallaron. Revisa los errores arriba."
    exit 1
else
    echo ""
    echo "🎉 Todos los tests pasaron correctamente!"
    exit 0
fi
```

### Script de Desarrollo Rápido

Crear archivo `dev.sh`:

```bash
#!/bin/bash

# Función para mostrar menú
show_menu() {
    echo "🚀 PokemonApp - Menú de Desarrollo"
    echo ""
    echo "1) Iniciar desarrollo (Metro + Android)"
    echo "2) Iniciar desarrollo (Metro + iOS)"
    echo "3) Solo Metro bundler"
    echo "4) Limpiar caché y reiniciar"
    echo "5) Ver logs Android"
    echo "6) Ver logs iOS"
    echo "7) Ejecutar tests"
    echo "8) Build release"
    echo "9) Salir"
    echo ""
    read -p "Selecciona una opción (1-9): " choice
}

# Función para iniciar Metro en background
start_metro() {
    echo "📦 Iniciando Metro bundler..."
    npm start &
    METRO_PID=$!
    sleep 5  # Esperar a que Metro inicie
}

# Función para limpiar al salir
cleanup() {
    if [ ! -z "$METRO_PID" ]; then
        echo "🛑 Deteniendo Metro bundler..."
        kill $METRO_PID 2>/dev/null
    fi
    exit 0
}

# Trap para limpiar al salir
trap cleanup EXIT INT TERM

# Menú principal
while true; do
    show_menu
    
    case $choice in
        1)
            start_metro
            echo "🤖 Iniciando Android..."
            npm run android
            ;;
        2)
            if [[ "$OSTYPE" == "darwin"* ]]; then
                start_metro
                echo "🍎 Iniciando iOS..."
                npm run ios
            else
                echo "❌ iOS solo disponible en macOS"
            fi
            ;;
        3)
            echo "📦 Iniciando solo Metro..."
            npm start
            ;;
        4)
            echo "🧹 Limpiando caché..."
            npm run clean:metro
            start_metro
            ;;
        5)
            echo "📱 Logs de Android (Ctrl+C para salir):"
            npm run logs:android
            ;;
        6)
            if [[ "$OSTYPE" == "darwin"* ]]; then
                echo "📱 Logs de iOS (Ctrl+C para salir):"
                npm run logs:ios
            else
                echo "❌ iOS solo disponible en macOS"
            fi
            ;;
        7)
            echo "🧪 Ejecutando tests..."
            ./test.sh
            ;;
        8)
            echo "📦 ¿Qué plataforma? (android/ios/both):"
            read platform
            ./build-release.sh $platform
            ;;
        9)
            echo "👋 ¡Hasta luego!"
            exit 0
            ;;
        *)
            echo "❌ Opción no válida"
            ;;
    esac
    
    echo ""
    read -p "Presiona Enter para continuar..."
done
```

## Hacer Scripts Ejecutables

```bash
# Hacer todos los scripts ejecutables
chmod +x clean.sh
chmod +x setup.sh
chmod +x build-release.sh
chmod +x test.sh
chmod +x dev.sh

# Ejecutar scripts
./setup.sh          # Primera vez
./dev.sh             # Desarrollo diario
./test.sh            # Antes de commit
./build-release.sh android  # Para release
./clean.sh           # Cuando hay problemas
```

## Aliases Útiles

Agregar al `.bashrc` o `.zshrc`:

```bash
# Aliases para PokemonApp
alias rn-start='npm start'
alias rn-android='npm run android'
alias rn-ios='npm run ios'
alias rn-clean='npm run clean'
alias rn-test='npm test'
alias rn-lint='npm run lint'
alias rn-doctor='npx react-native doctor'
alias rn-logs-android='npx react-native log-android'
alias rn-logs-ios='npx react-native log-ios'

# Función para desarrollo rápido
rn-dev() {
    if [ "$1" = "ios" ]; then
        npm start & npm run ios
    else
        npm start & npm run android
    fi
}
```

Estos scripts automatizan las tareas más comunes del desarrollo, desde el setup inicial hasta el build de release, facilitando el flujo de trabajo diario.
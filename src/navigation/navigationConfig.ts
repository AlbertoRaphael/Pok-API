import type { NativeStackNavigationOptions } from '@react-navigation/native-stack';

/**
 * Configuraciones de navegación reutilizables
 */

// Colores del tema
export const navigationTheme = {
  colors: {
    primary: '#3B82F6',
    background: '#FFFFFF',
    card: '#FFFFFF',
    text: '#1F2937',
    border: '#E5E7EB',
    notification: '#EF4444',
  },
};

// Opciones por defecto para todas las pantallas
export const defaultScreenOptions: NativeStackNavigationOptions = {
  headerStyle: {
    backgroundColor: navigationTheme.colors.primary,
  },
  headerTintColor: '#FFFFFF',
  headerTitleStyle: {
    fontWeight: 'bold',
    fontSize: 18,
  },
  headerBackVisible: true,
  animation: 'slide_from_right',
  gestureEnabled: true,
};

// Opciones específicas para la pantalla de lista
export const listScreenOptions: NativeStackNavigationOptions = {
  ...defaultScreenOptions,
  title: 'Pokédex',
  headerLargeTitle: false,
};

// Opciones específicas para la pantalla de detalle
export const detailScreenOptions: NativeStackNavigationOptions = {
  ...defaultScreenOptions,
  headerBackTitle: 'Lista',
  headerTitleAlign: 'center',
};

// Configuración de transiciones personalizadas
export const screenTransitions = {
  slideFromRight: {
    animation: 'slide_from_right' as const,
  },
  slideFromLeft: {
    animation: 'slide_from_left' as const,
  },
  fade: {
    animation: 'fade' as const,
  },
  none: {
    animation: 'none' as const,
  },
};
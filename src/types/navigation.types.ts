// Tipos para React Navigation

import type { NativeStackScreenProps } from '@react-navigation/native-stack';

/**
 * Definición de parámetros para cada pantalla de la aplicación
 */
export type RootStackParamList = {
  PokemonList: undefined;
  PokemonDetail: {
    pokemonId: number;
    pokemonName: string;
  };
};

/**
 * Nombres de las pantallas
 */
export type ScreenName = keyof RootStackParamList;

/**
 * Props para la pantalla de lista de Pokémon
 */
export type PokemonListScreenProps = NativeStackScreenProps<
  RootStackParamList,
  'PokemonList'
>;

/**
 * Props para la pantalla de detalle de Pokémon
 */
export type PokemonDetailScreenProps = NativeStackScreenProps<
  RootStackParamList,
  'PokemonDetail'
>;

/**
 * Tipo genérico para props de pantalla
 */
export type ScreenProps<T extends ScreenName> = NativeStackScreenProps<
  RootStackParamList,
  T
>;

/**
 * Tipo para el objeto de navegación
 */
export type NavigationProp = PokemonListScreenProps['navigation'];

/**
 * Tipo para el objeto de ruta
 */
export type RouteProp<T extends ScreenName> = ScreenProps<T>['route'];

/**
 * Opciones de navegación personalizadas
 */
export interface CustomNavigationOptions {
  title?: string;
  headerShown?: boolean;
  headerBackTitle?: string;
  headerTintColor?: string;
  headerStyle?: {
    backgroundColor?: string;
  };
  headerTitleStyle?: {
    color?: string;
    fontSize?: number;
    fontWeight?: string;
  };
}

/**
 * Configuración de transiciones de pantalla
 */
export interface ScreenTransition {
  gestureEnabled?: boolean;
  animationTypeForReplace?: 'push' | 'pop';
  animation?: 'slide_from_right' | 'slide_from_left' | 'fade' | 'none';
}

/**
 * Parámetros para navegación programática
 */
export interface NavigateParams<T extends ScreenName> {
  screen: T;
  params?: RootStackParamList[T];
  merge?: boolean;
}

/**
 * Acciones de navegación disponibles
 */
export type NavigationAction = 
  | 'navigate'
  | 'push'
  | 'replace'
  | 'goBack'
  | 'popToTop'
  | 'reset';

/**
 * Estado de navegación
 */
export interface NavigationState {
  currentScreen: ScreenName;
  previousScreen?: ScreenName;
  canGoBack: boolean;
  routeParams?: any;
}

/**
 * Listener de eventos de navegación
 */
export type NavigationEventListener = (
  event: 'focus' | 'blur' | 'beforeRemove'
) => void;

/**
 * Configuración del stack navigator
 */
export interface StackNavigatorConfig {
  initialRouteName: ScreenName;
  screenOptions: CustomNavigationOptions;
  defaultScreenOptions?: CustomNavigationOptions;
}

/**
 * Utilidades para navegación tipada
 */
export interface NavigationUtils {
  navigateToPokemonDetail: (pokemonId: number, pokemonName: string) => void;
  navigateBack: () => void;
  resetToHome: () => void;
}
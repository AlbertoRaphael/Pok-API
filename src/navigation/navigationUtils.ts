import type { NavigationProp, RootStackParamList } from '@/types';

/**
 * Utilidades para navegación tipada
 * Proporciona funciones helper para navegar entre pantallas de forma segura
 */

/**
 * Navega a la pantalla de detalle de un Pokémon
 */
export const navigateToPokemonDetail = (
  navigation: NavigationProp,
  pokemonId: number,
  pokemonName: string
) => {
  navigation.navigate('PokemonDetail', {
    pokemonId,
    pokemonName,
  });
};

/**
 * Navega de vuelta a la lista de Pokémon
 */
export const navigateToHome = (navigation: NavigationProp) => {
  navigation.navigate('PokemonList');
};

/**
 * Navega hacia atrás en el stack
 */
export const goBack = (navigation: NavigationProp) => {
  if (navigation.canGoBack()) {
    navigation.goBack();
  }
};

/**
 * Resetea el stack a la pantalla inicial
 */
export const resetToHome = (navigation: NavigationProp) => {
  navigation.reset({
    index: 0,
    routes: [{ name: 'PokemonList' }],
  });
};

/**
 * Reemplaza la pantalla actual con otra
 */
export const replaceTo = (
  navigation: NavigationProp,
  screenName: keyof RootStackParamList,
  params?: any
) => {
  navigation.replace(screenName as any, params);
};

/**
 * Empuja una nueva pantalla al stack
 */
export const pushTo = (
  navigation: NavigationProp,
  screenName: keyof RootStackParamList,
  params?: any
) => {
  navigation.push(screenName as any, params);
};
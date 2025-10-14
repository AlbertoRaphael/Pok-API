// Exportar el navegador principal
export { default as AppNavigator } from './AppNavigator';

// Exportar utilidades de navegación
export {
  navigateToPokemonDetail,
  navigateToHome,
  goBack,
  resetToHome,
  replaceTo,
  pushTo,
} from './navigationUtils';

// Exportar configuraciones
export {
  navigationTheme,
  defaultScreenOptions,
  listScreenOptions,
  detailScreenOptions,
  screenTransitions,
} from './navigationConfig';
// Exportaciones centralizadas de todos los tipos

// Tipos de Pokémon
export type {
  Pokemon,
  PokemonDetail,
  PokemonType,
  PokemonStat,
  PokemonAbility,
  PokemonSprites,
  PokemonListResponse,
  PokemonListParams,
  PokemonSearchParams,
  LoadingState,
  SearchState,
} from './pokemon.types';

export {
  POKEMON_TYPE_COLORS,
  STAT_DISPLAY_NAMES,
  STAT_MAX_VALUES,
  getPokemonTypeColor,
  getStatDisplayName,
  getStatMaxValue,
} from './pokemon.types';

// Tipos comunes
export type {
  AsyncState,
  Result,
  PaginationConfig,
  PaginationMeta,
  PaginatedResponse,
  CacheOptions,
  RetryConfig,
  AppEvent,
  EventPayload,
  AppConfig,
  AppTheme,
  ScreenDimensions,
  ScreenOrientation,
  Platform,
  ConnectivityState,
  DeviceInfo,
} from './common.types';

// Tipos de navegación
export type {
  RootStackParamList,
  ScreenName,
  PokemonListScreenProps,
  PokemonDetailScreenProps,
  ScreenProps,
  NavigationProp,
  RouteProp,
  CustomNavigationOptions,
  ScreenTransition,
  NavigateParams,
  NavigationAction,
  NavigationState,
  NavigationEventListener,
  StackNavigatorConfig,
  NavigationUtils,
} from './navigation.types';

// Funciones de transformación
export {
  transformPokemonListItem,
  transformPokemonListResponse,
  transformPokemonTypes,
  transformPokemonStats,
  transformPokemonAbilities,
  transformPokemonSprites,
  transformPokemonDetail,
  transformPokemonToDetail,
  updatePokemonFavoriteStatus,
  updatePokemonListFavoriteStatus,
  formatPokemonHeight,
  formatPokemonWeight,
  formatPokemonName,
} from './transformers';
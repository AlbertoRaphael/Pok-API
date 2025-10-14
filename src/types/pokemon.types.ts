// Tipos de dominio para la aplicación Pokémon
// Estos tipos representan los datos como los usa la aplicación (transformados desde la API)

/**
 * Tipo base para un Pokémon en la lista
 */
export interface Pokemon {
  id: number;
  name: string;
  imageUrl: string;
  types: PokemonType[];
  isFavorite: boolean;
}

/**
 * Tipo extendido para los detalles completos de un Pokémon
 */
export interface PokemonDetail extends Pokemon {
  height: number; // en decímetros
  weight: number; // en hectogramos
  baseExperience: number;
  stats: PokemonStat[];
  abilities: PokemonAbility[];
  sprites: PokemonSprites;
  species: {
    name: string;
    url: string;
  };
}

/**
 * Tipo de Pokémon (fuego, agua, etc.)
 */
export interface PokemonType {
  name: string;
  color: string; // Color hex para el badge del tipo
}

/**
 * Estadística de un Pokémon
 */
export interface PokemonStat {
  name: string;
  displayName: string; // Nombre amigable para mostrar en UI
  value: number;
  maxValue: number; // Para calcular porcentajes en barras de progreso
}

/**
 * Habilidad de un Pokémon
 */
export interface PokemonAbility {
  name: string;
  displayName: string;
  isHidden: boolean;
}

/**
 * Sprites/imágenes de un Pokémon
 */
export interface PokemonSprites {
  frontDefault: string | null;
  frontShiny: string | null;
  backDefault: string | null;
  backShiny: string | null;
  officialArtwork: string | null;
  homeArtwork: string | null;
}

/**
 * Respuesta de lista de Pokémon (para paginación)
 */
export interface PokemonListResponse {
  pokemon: Pokemon[];
  totalCount: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  nextOffset?: number;
  previousOffset?: number;
}

/**
 * Parámetros para obtener lista de Pokémon
 */
export interface PokemonListParams {
  offset?: number;
  limit?: number;
}

/**
 * Parámetros para búsqueda de Pokémon
 */
export interface PokemonSearchParams {
  query: string;
  limit?: number;
}

/**
 * Estado de carga para operaciones asíncronas
 */
export interface LoadingState {
  isLoading: boolean;
  error: string | null;
}

/**
 * Estado de búsqueda
 */
export interface SearchState extends LoadingState {
  query: string;
  results: Pokemon[];
  hasSearched: boolean;
}

/**
 * Colores predefinidos para tipos de Pokémon
 */
export const POKEMON_TYPE_COLORS: Record<string, string> = {
  normal: '#A8A878',
  fire: '#F08030',
  water: '#6890F0',
  electric: '#F8D030',
  grass: '#78C850',
  ice: '#98D8D8',
  fighting: '#C03028',
  poison: '#A040A0',
  ground: '#E0C068',
  flying: '#A890F0',
  psychic: '#F85888',
  bug: '#A8B820',
  rock: '#B8A038',
  ghost: '#705898',
  dragon: '#7038F8',
  dark: '#705848',
  steel: '#B8B8D0',
  fairy: '#EE99AC',
};

/**
 * Nombres amigables para estadísticas
 */
export const STAT_DISPLAY_NAMES: Record<string, string> = {
  hp: 'HP',
  attack: 'Ataque',
  defense: 'Defensa',
  'special-attack': 'At. Especial',
  'special-defense': 'Def. Especial',
  speed: 'Velocidad',
};

/**
 * Valores máximos para estadísticas (para calcular porcentajes)
 */
export const STAT_MAX_VALUES: Record<string, number> = {
  hp: 255,
  attack: 190,
  defense: 230,
  'special-attack': 194,
  'special-defense': 230,
  speed: 180,
};

/**
 * Función helper para obtener el color de un tipo
 */
export const getPokemonTypeColor = (typeName: string): string => {
  return POKEMON_TYPE_COLORS[typeName.toLowerCase()] || '#68A090';
};

/**
 * Función helper para obtener el nombre amigable de una estadística
 */
export const getStatDisplayName = (statName: string): string => {
  return STAT_DISPLAY_NAMES[statName.toLowerCase()] || statName;
};

/**
 * Función helper para obtener el valor máximo de una estadística
 */
export const getStatMaxValue = (statName: string): number => {
  return STAT_MAX_VALUES[statName.toLowerCase()] || 255;
};
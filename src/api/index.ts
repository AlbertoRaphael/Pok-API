// Exportar cliente API y utilidades
export { default as apiClient, withRetry } from './apiClient';
export type { ApiError } from './apiClient';

// Exportar React Query configuración
export { queryClient, queryKeys, queryUtils } from './queryClient';
export { default as QueryProvider } from './QueryProvider';

// Exportar funciones de la API de Pokémon
export {
  getPokemonList,
  getPokemonDetail,
  getPokemonSpecies,
  searchPokemon,
  getPokemonByIds,
  extractPokemonId,
  getPokemonImageUrl,
  isValidPokemonId,
} from './pokemon';

// Exportar tipos de la API
export type {
  PokemonListResponse,
  PokemonListItem,
  PokemonDetailResponse,
  PokemonSprites,
  PokemonTypeSlot,
  PokemonStatSlot,
  PokemonAbilitySlot,
  PokemonSearchResponse,
  PokemonSpeciesResponse,
  FlavorTextEntry,
  Genus,
  GetPokemonListParams,
  SearchPokemonParams,
} from './types';
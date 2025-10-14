import { apiClient, withRetry } from './apiClient';
import {
  PokemonListResponse,
  PokemonDetailResponse,
  PokemonSpeciesResponse,
  GetPokemonListParams,
  SearchPokemonParams,
} from './types';

// Constantes para la API
const DEFAULT_LIMIT = 20;
const MAX_POKEMON_ID = 1010; // Número aproximado de Pokémon disponibles

/**
 * Obtiene una lista paginada de Pokémon
 */
export const getPokemonList = async (
  params: GetPokemonListParams = {}
): Promise<PokemonListResponse> => {
  const { offset = 0, limit = DEFAULT_LIMIT } = params;
  
  return withRetry(async () => {
    const response = await apiClient.get<PokemonListResponse>('/pokemon', {
      params: { offset, limit },
    });
    return response.data;
  });
};

/**
 * Obtiene los detalles de un Pokémon específico por ID o nombre
 */
export const getPokemonDetail = async (
  idOrName: string | number
): Promise<PokemonDetailResponse> => {
  return withRetry(async () => {
    const response = await apiClient.get<PokemonDetailResponse>(`/pokemon/${idOrName}`);
    return response.data;
  });
};

/**
 * Obtiene información de la especie de un Pokémon
 */
export const getPokemonSpecies = async (
  idOrName: string | number
): Promise<PokemonSpeciesResponse> => {
  return withRetry(async () => {
    const response = await apiClient.get<PokemonSpeciesResponse>(`/pokemon-species/${idOrName}`);
    return response.data;
  });
};

/**
 * Busca Pokémon por nombre (implementación básica)
 * Nota: La PokéAPI no tiene endpoint de búsqueda, así que implementamos una búsqueda básica
 */
export const searchPokemon = async (
  params: SearchPokemonParams
): Promise<PokemonListResponse> => {
  const { query, limit = DEFAULT_LIMIT } = params;
  
  // Si la consulta está vacía, devolver lista normal
  if (!query.trim()) {
    return getPokemonList({ limit });
  }
  
  return withRetry(async () => {
    // Primero intentamos buscar por nombre exacto
    try {
      const exactMatch = await getPokemonDetail(query.toLowerCase());
      return {
        count: 1,
        next: null,
        previous: null,
        results: [
          {
            name: exactMatch.name,
            url: `https://pokeapi.co/api/v2/pokemon/${exactMatch.id}/`,
          },
        ],
      };
    } catch (error) {
      // Si no hay coincidencia exacta, buscar en una lista más amplia
      const fullList = await getPokemonList({ limit: 1000 });
      const filteredResults = fullList.results.filter(pokemon =>
        pokemon.name.toLowerCase().includes(query.toLowerCase())
      );
      
      return {
        count: filteredResults.length,
        next: null,
        previous: null,
        results: filteredResults.slice(0, limit),
      };
    }
  });
};

/**
 * Obtiene múltiples Pokémon por sus IDs (útil para favoritos)
 */
export const getPokemonByIds = async (
  ids: number[]
): Promise<PokemonDetailResponse[]> => {
  return withRetry(async () => {
    const promises = ids.map(id => getPokemonDetail(id));
    return Promise.all(promises);
  });
};

/**
 * Extrae el ID de un Pokémon desde su URL
 */
export const extractPokemonId = (url: string): number => {
  const matches = url.match(/\/pokemon\/(\d+)\//);
  return matches ? parseInt(matches[1], 10) : 0;
};

/**
 * Genera la URL de imagen de un Pokémon
 */
export const getPokemonImageUrl = (id: number, variant: 'default' | 'artwork' = 'default'): string => {
  if (variant === 'artwork') {
    return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`;
  }
  return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`;
};

/**
 * Valida si un ID de Pokémon es válido
 */
export const isValidPokemonId = (id: number): boolean => {
  return id > 0 && id <= MAX_POKEMON_ID;
};
// Funciones para transformar datos de la API a tipos de dominio

import type {
  PokemonDetailResponse,
  PokemonListResponse as ApiPokemonListResponse,
  PokemonListItem,
  extractPokemonId,
  getPokemonImageUrl,
} from '@/api';

import type {
  Pokemon,
  PokemonDetail,
  PokemonType,
  PokemonStat,
  PokemonAbility,
  PokemonSprites,
  PokemonListResponse,
} from './pokemon.types';

import {
  getPokemonTypeColor,
  getStatDisplayName,
  getStatMaxValue,
} from './pokemon.types';

/**
 * Transforma un item de la lista de la API a un Pokemon de dominio
 */
export const transformPokemonListItem = (
  item: PokemonListItem,
  favoriteIds: Set<number> = new Set()
): Pokemon => {
  // Extraer ID desde la URL usando la función de la API
  const id = parseInt(item.url.match(/\/pokemon\/(\d+)\//)?.[1] || '0', 10);
  
  return {
    id,
    name: item.name,
    imageUrl: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`,
    types: [], // Se llenará cuando se obtengan los detalles
    isFavorite: favoriteIds.has(id),
  };
};

/**
 * Transforma la respuesta de lista de la API a PokemonListResponse de dominio
 */
export const transformPokemonListResponse = (
  apiResponse: ApiPokemonListResponse,
  favoriteIds: Set<number> = new Set()
): PokemonListResponse => {
  const pokemon = apiResponse.results.map(item => 
    transformPokemonListItem(item, favoriteIds)
  );

  // Calcular offset para paginación
  const currentOffset = apiResponse.previous 
    ? parseInt(new URL(apiResponse.previous).searchParams.get('offset') || '0') + 20
    : 0;

  return {
    pokemon,
    totalCount: apiResponse.count,
    hasNextPage: apiResponse.next !== null,
    hasPreviousPage: apiResponse.previous !== null,
    nextOffset: apiResponse.next 
      ? parseInt(new URL(apiResponse.next).searchParams.get('offset') || '0')
      : undefined,
    previousOffset: apiResponse.previous 
      ? parseInt(new URL(apiResponse.previous).searchParams.get('offset') || '0')
      : undefined,
  };
};

/**
 * Transforma los tipos de Pokémon de la API
 */
export const transformPokemonTypes = (
  apiTypes: PokemonDetailResponse['types']
): PokemonType[] => {
  return apiTypes.map(typeSlot => ({
    name: typeSlot.type.name,
    color: getPokemonTypeColor(typeSlot.type.name),
  }));
};

/**
 * Transforma las estadísticas de Pokémon de la API
 */
export const transformPokemonStats = (
  apiStats: PokemonDetailResponse['stats']
): PokemonStat[] => {
  return apiStats.map(statSlot => ({
    name: statSlot.stat.name,
    displayName: getStatDisplayName(statSlot.stat.name),
    value: statSlot.base_stat,
    maxValue: getStatMaxValue(statSlot.stat.name),
  }));
};

/**
 * Transforma las habilidades de Pokémon de la API
 */
export const transformPokemonAbilities = (
  apiAbilities: PokemonDetailResponse['abilities']
): PokemonAbility[] => {
  return apiAbilities.map(abilitySlot => ({
    name: abilitySlot.ability.name,
    displayName: abilitySlot.ability.name
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' '),
    isHidden: abilitySlot.is_hidden,
  }));
};

/**
 * Transforma los sprites de Pokémon de la API
 */
export const transformPokemonSprites = (
  apiSprites: PokemonDetailResponse['sprites']
): PokemonSprites => {
  return {
    frontDefault: apiSprites.front_default,
    frontShiny: apiSprites.front_shiny,
    backDefault: apiSprites.back_default,
    backShiny: apiSprites.back_shiny,
    officialArtwork: apiSprites.other?.['official-artwork']?.front_default || null,
    homeArtwork: apiSprites.other?.home?.front_default || null,
  };
};

/**
 * Transforma la respuesta completa de detalle de Pokémon de la API
 */
export const transformPokemonDetail = (
  apiResponse: PokemonDetailResponse,
  isFavorite: boolean = false
): PokemonDetail => {
  const types = transformPokemonTypes(apiResponse.types);
  const stats = transformPokemonStats(apiResponse.stats);
  const abilities = transformPokemonAbilities(apiResponse.abilities);
  const sprites = transformPokemonSprites(apiResponse.sprites);

  return {
    id: apiResponse.id,
    name: apiResponse.name,
    imageUrl: sprites.officialArtwork || sprites.frontDefault || '',
    types,
    isFavorite,
    height: apiResponse.height,
    weight: apiResponse.weight,
    baseExperience: apiResponse.base_experience,
    stats,
    abilities,
    sprites,
    species: apiResponse.species,
  };
};

/**
 * Transforma un Pokemon básico a PokemonDetail (cuando ya tenemos los datos)
 */
export const transformPokemonToDetail = (
  pokemon: Pokemon,
  apiResponse: PokemonDetailResponse
): PokemonDetail => {
  return transformPokemonDetail(apiResponse, pokemon.isFavorite);
};

/**
 * Actualiza el estado de favorito de un Pokemon
 */
export const updatePokemonFavoriteStatus = <T extends Pokemon>(
  pokemon: T,
  isFavorite: boolean
): T => {
  return {
    ...pokemon,
    isFavorite,
  };
};

/**
 * Actualiza el estado de favorito de una lista de Pokemon
 */
export const updatePokemonListFavoriteStatus = <T extends Pokemon>(
  pokemonList: T[],
  favoriteIds: Set<number>
): T[] => {
  return pokemonList.map(pokemon => ({
    ...pokemon,
    isFavorite: favoriteIds.has(pokemon.id),
  }));
};

/**
 * Convierte altura de decímetros a metros con formato amigable
 */
export const formatPokemonHeight = (heightInDecimeters: number): string => {
  const meters = heightInDecimeters / 10;
  return `${meters.toFixed(1)} m`;
};

/**
 * Convierte peso de hectogramos a kilogramos con formato amigable
 */
export const formatPokemonWeight = (weightInHectograms: number): string => {
  const kilograms = weightInHectograms / 10;
  return `${kilograms.toFixed(1)} kg`;
};

/**
 * Formatea el nombre de un Pokémon para mostrar (capitaliza primera letra)
 */
export const formatPokemonName = (name: string): string => {
  return name.charAt(0).toUpperCase() + name.slice(1);
};
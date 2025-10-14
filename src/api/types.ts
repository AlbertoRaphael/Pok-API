// Tipos de respuesta de la PokéAPI

export interface PokemonListResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: PokemonListItem[];
}

export interface PokemonListItem {
  name: string;
  url: string;
}

export interface PokemonDetailResponse {
  id: number;
  name: string;
  height: number;
  weight: number;
  base_experience: number;
  sprites: PokemonSprites;
  types: PokemonTypeSlot[];
  stats: PokemonStatSlot[];
  abilities: PokemonAbilitySlot[];
  species: {
    name: string;
    url: string;
  };
}

export interface PokemonSprites {
  front_default: string | null;
  front_shiny: string | null;
  back_default: string | null;
  back_shiny: string | null;
  other: {
    'official-artwork': {
      front_default: string | null;
      front_shiny: string | null;
    };
    home: {
      front_default: string | null;
      front_shiny: string | null;
    };
  };
}

export interface PokemonTypeSlot {
  slot: number;
  type: {
    name: string;
    url: string;
  };
}

export interface PokemonStatSlot {
  base_stat: number;
  effort: number;
  stat: {
    name: string;
    url: string;
  };
}

export interface PokemonAbilitySlot {
  is_hidden: boolean;
  slot: number;
  ability: {
    name: string;
    url: string;
  };
}

// Tipos para búsqueda
export interface PokemonSearchResponse extends PokemonListResponse {}

// Tipos para especies (información adicional)
export interface PokemonSpeciesResponse {
  id: number;
  name: string;
  color: {
    name: string;
    url: string;
  };
  flavor_text_entries: FlavorTextEntry[];
  genera: Genus[];
  habitat: {
    name: string;
    url: string;
  } | null;
}

export interface FlavorTextEntry {
  flavor_text: string;
  language: {
    name: string;
    url: string;
  };
  version: {
    name: string;
    url: string;
  };
}

export interface Genus {
  genus: string;
  language: {
    name: string;
    url: string;
  };
}

// Parámetros para las llamadas a la API
export interface GetPokemonListParams {
  offset?: number;
  limit?: number;
}

export interface SearchPokemonParams {
  query: string;
  limit?: number;
}